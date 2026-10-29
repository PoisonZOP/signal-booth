(function(){
  const QS = SIGNAL.DATA.DECODE;
  const elQ = document.getElementById("qBits");
  const elOpts = document.getElementById("options");
  const elExp = document.getElementById("explain");
  const dots = document.getElementById("dots");
  let i = 0, attempts = 0;

  function render(){
    const q = QS[i];
    attempts = 0;
    elQ.textContent = q.bits;
    elExp.textContent = "";
    elOpts.innerHTML = "";
    q.options.forEach(v => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-option";
      b.textContent = v;
      b.addEventListener("click", () => answer(v, b));
      elOpts.appendChild(b);
    });
    dots.innerHTML = "";
    QS.forEach((_, k) => {
      const d = document.createElement("span");
      d.className = "dot" + (k <= i ? " on" : "");
      dots.appendChild(d);
    });
  }

  function answer(v, btn){
    const q = QS[i];
    if(v === q.answer){
      btn.classList.add("ok");
      elExp.textContent = "Correct — " + q.explain;
      elOpts.querySelectorAll("button").forEach(b => b.disabled = true);
      setTimeout(next, 750);
    } else {
      btn.classList.add("bad");
      attempts++;
      if(attempts >= 2){
        elExp.textContent = "Answer: " + q.answer + " — " + q.explain;
        elOpts.querySelectorAll("button").forEach(b => {
          if(Number(b.textContent) === q.answer) b.classList.add("ok");
          b.disabled = true;
        });
        setTimeout(next, 1400);
      } else {
        elExp.textContent = "Not quite. Try again.";
      }
    }
  }

  function next(){
    i++;
    if(i >= QS.length){ location.href = "build.html"; }
    else render();
  }

  document.getElementById("skip").addEventListener("click", () => location.href = "build.html");
  render();
})();