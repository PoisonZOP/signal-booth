(function(){
  const D = SIGNAL.DATA;
  const S = SIGNAL.state;
  const cfg = S.getSettings();
  const $ = (s) => document.querySelector(s);

  const MODE  = cfg.mode === "draw" ? "draw" : "classic";
  const TOTAL_PHRASES = Math.max(4, Math.min(5, Number(cfg.phraseCount) || 4));
  const TOTAL_TIME = 45;

  const elPhrase     = $("#phrase");
  const elSlots      = $("#slots");
  const elTray       = $("#tray");
  const elDraw       = $("#drawArea");
  const elTarget     = $("#targetCodes");
  const elMiniKey    = $("#miniKey");
  const elHints      = $("#hints");
  const elMisses     = $("#misses");
  const elProgFill   = $("#progressFill");
  const elProgNow    = $("#progressNow");
  const elProgTotal  = $("#progressTotal");
  const elFeedback   = $("#feedback");
  const elToast      = $("#toast");
  const elTimerBadge = $("#timerBadge");
  const elTimer      = $("#phraseTimer");
  const btnCheck     = $("#check");
  const btnHint      = $("#hintBtn");

  let queue = [], qi = 0;
  let hints = 0, misses = 0, completed = 0;
  let cur = null, attempt = 0, locked = false, finished = false;
  let timeLeft = TOTAL_TIME, timerId = null;
  const startTime = Date.now();

  function shuffle(a){
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Forces the 4th phrase to be Tier 3 (Long) */
  function buildQueue(){
    const tier  = cfg.tier;
    const count = TOTAL_PHRASES;

    let targetTiers = [];
    if(tier === "mixed"){
      // Pattern: Short, Medium, Short, LONG, Medium
      if(count === 4) targetTiers = [1, 2, 1, 3];
      else if(count === 5) targetTiers = [1, 2, 1, 3, 2];
      else targetTiers = [1, 2, 3, 1, 2].slice(0, count);
    } else {
      targetTiers = Array(count).fill(Number(tier));
    }

    const byTier = {};
    D.PHRASES.forEach(p => {
      (byTier[p.tier] = byTier[p.tier] || []).push(p);
    });
    Object.keys(byTier).forEach(t => shuffle(byTier[t]));

    const out = [];
    for(let i = 0; i < count; i++){
      const targetT = targetTiers[i];
      let pool = byTier[targetT];
      if(!pool || pool.length === 0) pool = D.PHRASES;
      out.push(pool.splice(0, 1)[0]);
    }
    return out;
  }

  function buildDrawPool(codes){
    const pool = codes.slice();
    const used = new Set(codes);
    let guard = 0;
    while(pool.length < codes.length + 3 && guard < 100){
      const c = D.randomCode();
      if(!used.has(c)){ pool.push(c); used.add(c); }
      guard++;
    }
    return shuffle(pool);
  }

  function renderTimer(){
    if(!elTimer || !elTimerBadge) return;
    elTimer.textContent = "0:" + String(Math.max(0, timeLeft)).padStart(2, "0");
    elTimerBadge.classList.toggle("warn",   timeLeft <= 15 && timeLeft > 5);
    elTimerBadge.classList.toggle("danger", timeLeft <= 5);
  }

  function startTimer(){
    renderTimer();
    timerId = setInterval(() => {
      if(finished) return;
      timeLeft--;
      renderTimer();
      if(timeLeft <= 0){
        clearInterval(timerId); timerId = null;
        elFeedback.textContent = "Time's up!";
        setTimeout(finish, 400);
      }
    }, 1000);
  }

  function loadPhrase(){
    if(finished) return;
    if(qi >= queue.length){ queue = buildQueue(); qi = 0; }
    const p = queue[qi++];
    const codes = D.encode(p.text);

    if(MODE === "draw"){
      const drawPool = buildDrawPool(codes);
      cur = {
        text: p.text, codes,
        slots: new Array(codes.length).fill(null),
        drawPool, revealed: drawPool.map(() => null)
      };
    } else {
      const tiles = codes.map((c, i) => ({ id: "t" + i, code: c }));
      if(cfg.decoys && p.tier >= 2){
        const used = new Set(codes);
        let c, guard = 0;
        do { c = D.randomCode(); guard++; } while(used.has(c) && guard < 50);
        tiles.push({ id: "d0", code: c });
      }
      shuffle(tiles);
      cur = { text: p.text, codes, tiles, slots: new Array(codes.length).fill(null) };
    }
    attempt = 0;
    elFeedback.textContent = "";
    render();
  }

  function getSlotCode(i){
    const v = cur.slots[i];
    if(v == null) return null;
    if(MODE === "classic"){
      const t = cur.tiles.find(x => x.id === v);
      return t ? t.code : null;
    }
    return v;
  }

  function renderProgress(){
    const pct = Math.min(100, (completed / TOTAL_PHRASES) * 100);
    elProgFill.style.width = pct + "%";
    elProgNow.textContent = completed;
    elProgTotal.textContent = TOTAL_PHRASES;
  }

  function render(){
    elPhrase.textContent = cur.text;

    if(MODE === "draw"){
      elTarget.hidden = false;
      elTarget.innerHTML = 'Draw these codes: ' + cur.codes.map(c => `<code>${c}</code>`).join(" ");
    } else {
      elTarget.hidden = true;
    }

    elSlots.innerHTML = "";
    cur.slots.forEach((v, i) => {
      const wrap = document.createElement("div");
      wrap.className = "slot-wrap";
      const label = document.createElement("span");
      label.className = "slot-label";
      label.textContent = cur.text[i] === " " ? "␣" : cur.text[i];
      wrap.appendChild(label);

      const b = document.createElement("button");
      b.type = "button";
      b.className = "slot" + (cur.codes[i] === "00000" ? " slot-space" : "");
      const code = getSlotCode(i);
      if(code){ b.classList.add("filled"); b.textContent = code; }
      b.addEventListener("click", () => { if(!locked && MODE === "classic") removeAt(i); });
      wrap.appendChild(b);
      elSlots.appendChild(wrap);
    });

    if(MODE === "classic"){
      elTray.hidden = false; elDraw.hidden = true;
      elTray.innerHTML = "";
      cur.tiles.filter(t => !cur.slots.includes(t.id)).forEach(t => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "tile"; b.textContent = t.code;
        b.addEventListener("click", () => { if(!locked) placeTile(t.id); });
        elTray.appendChild(b);
      });
    } else {
      elTray.hidden = true; elDraw.hidden = false;
      elDraw.innerHTML = "";
      cur.drawPool.forEach((code, i) => {
        const card = document.createElement("button");
        card.type = "button"; card.className = "draw-card";
        const st = cur.revealed[i];
        if(st === null){ card.textContent = "?"; }
        else if(st === "ok"){ card.classList.add("ok"); card.textContent = code; card.disabled = true; }
        else { card.classList.add("bad"); card.textContent = code; card.disabled = true; }
        card.addEventListener("click", () => drawCard(i));
        elDraw.appendChild(card);
      });
    }

    if(completed >= 2){
      elMiniKey.innerHTML = ""; elMiniKey.style.opacity = "0";
    } else {
      elMiniKey.style.opacity = "1";
      const letters = [...new Set(cur.text.replace(/ /g, "").toUpperCase().split(""))];
      elMiniKey.innerHTML = letters.map(L =>
        `<span class="mini-key-item"><b>${L}</b> = <code>${D.CODE[L]}</code></span>`
      ).join("");
    }

    elHints.textContent = hints;
    elMisses.textContent = misses;
    btnCheck.disabled = locked || MODE === "draw";
    btnHint.disabled  = locked;
    renderProgress();
  }

  function placeTile(id){
    const i = cur.slots.indexOf(null);
    if(i === -1){ toast("All positions are full."); return; }
    cur.slots = cur.slots.map(v => v === id ? null : v);
    cur.slots[i] = id;
    render();
  }

  function removeAt(i){
    if(cur.slots[i] == null) return;
    cur.slots[i] = null;
    render();
  }

  function drawCard(i){
    if(locked || finished) return;
    if(cur.revealed[i] !== null) return;
    const code = cur.drawPool[i];
    const nextSlot = cur.slots.findIndex(v => v == null);
    if(nextSlot === -1) return;
    const needed = cur.codes[nextSlot];
    if(code === needed){
      cur.revealed[i] = "ok";
      cur.slots[nextSlot] = code;
      render();
      if(cur.slots.every(v => v != null)) correct();
    } else {
      cur.revealed[i] = "bad";
      misses++;
      elFeedback.innerHTML = `That is <b class="mono" style="color:var(--red)">${code}</b> — you need <b class="mono" style="color:var(--lime)">${needed}</b>.`;
      render();
    }
  }

  function check(){
    if(MODE === "draw" || locked || finished) return;
    if(cur.slots.includes(null)){ toast("Fill every position first."); return; }
    const ok = cur.slots.every((tid, i) => getSlotCode(i) === cur.codes[i]);
    ok ? correct() : wrong();
  }

  function correct(){
    if(finished) return;
    locked = true;
    completed++;

    // +15 Seconds Reward
    timeLeft += 15;
    renderTimer();
    if(elTimerBadge){
      elTimerBadge.classList.add("bonus");
      setTimeout(() => elTimerBadge.classList.remove("bonus"), 800);
    }

    elSlots.querySelectorAll(".slot").forEach(s => s.classList.add("ok"));
    elFeedback.textContent = "Correct! +15 seconds";
    confetti();
    renderProgress();

    if(completed >= TOTAL_PHRASES){
      setTimeout(finish, 800);
      return;
    }
    setTimeout(() => {
      if(finished) return;
      locked = false;
      loadPhrase();
    }, 650);
  }

  function wrong(){
    if(finished) return;
    attempt++;
    elSlots.classList.remove("shake");
    void elSlots.offsetWidth;
    elSlots.classList.add("shake");
    if(attempt >= 2){
      elFeedback.textContent = "I'll help with one.";
      useHint(true);
    } else {
      const idx = cur.slots.findIndex((v, i) => {
        const code = getSlotCode(i);
        return !code || code !== cur.codes[i];
      });
      if(idx !== -1){
        elFeedback.innerHTML = `Not quite. <b>${cur.text[idx]}</b> is <b class="mono" style="color:var(--lime)">${cur.codes[idx]}</b>.`;
      }
    }
  }

  function useHint(auto){
    if(locked || finished) return;
    if(MODE === "draw"){
      const idx = cur.slots.findIndex(v => v == null);
      if(idx === -1) return;
      cur.slots[idx] = cur.codes[idx];
      hints++;
      render();
      if(cur.slots.every(v => v != null)) correct();
      return;
    }
    let idx = -1;
    for(let i = 0; i < cur.codes.length; i++){
      const code = getSlotCode(i);
      if(code !== cur.codes[i]){ idx = i; break; }
    }
    if(idx === -1) return;
    if(!auto){
      const target = cur.codes[idx];
      elFeedback.innerHTML = `Slot ${idx + 1} needs <b class="mono" style="color:var(--lime)">${target}</b> — that is <b>${cur.text[idx]}</b>.`;
      elTray.querySelectorAll(".tile").forEach(t => {
        if(t.textContent === target){
          t.style.borderColor = "var(--lime)";
          t.style.boxShadow = "0 0 24px rgba(200,255,61,0.4)";
        }
      });
      hints++;
      elHints.textContent = hints;
      return;
    }
    const tile = cur.tiles.find(t => t.code === cur.codes[idx]);
    if(!tile) return;
    cur.slots = cur.slots.map(v => v === tile.id ? null : v);
    cur.slots[idx] = tile.id;
    hints++;
    render();
  }

  function finish(){
    if(finished) return;
    finished = true;
    if(timerId) clearInterval(timerId);
    locked = true;
    const elapsed  = Math.floor((Date.now() - startTime) / 1000);
    const timedOut = timeLeft <= 0;
    const payload = {
      score: completed,
      hints, misses,
      mode: MODE,
      totalPhrases: TOTAL_PHRASES,
      elapsed,
      timedOut,
      at: Date.now()
    };
    S.setSession(payload);
    location.href = "result.html";
  }

  function toast(msg){
    elToast.textContent = msg;
    elToast.classList.add("show");
    clearTimeout(elToast._t);
    elToast._t = setTimeout(() => elToast.classList.remove("show"), 2200);
  }

  function confetti(){
    if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = document.getElementById("confetti");
    for(let i = 0; i < 24; i++){
      const d = document.createElement("i");
      d.className = "confetti-bit";
      d.textContent = Math.random() < 0.5 ? "0" : "1";
      d.style.left = (50 + (Math.random() * 40 - 20)) + "%";
      d.style.setProperty("--x", (Math.random() * 220 - 110) + "px");
      d.style.setProperty("--d", (400 + Math.random() * 300) + "ms");
      d.style.animationDelay = (Math.random() * 80) + "ms";
      host.appendChild(d);
      setTimeout(() => d.remove(), 1000);
    }
  }

  btnCheck.addEventListener("click", check);
  btnHint.addEventListener("click", () => { if(!locked) useHint(false); });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){ e.preventDefault(); check(); }
    if(e.key === "Backspace"){
      e.preventDefault();
      if(MODE === "classic"){
        for(let i = cur.slots.length - 1; i >= 0; i--){
          if(cur.slots[i]){ removeAt(i); break; }
        }
      }
    }
  });

  btnCheck.hidden = MODE === "draw";
  queue = buildQueue();
  loadPhrase();
  startTimer();
})();