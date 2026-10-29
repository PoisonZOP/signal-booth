(function(){
  const c = document.getElementById("rain");
  if(!c) return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const isAttract = document.body.classList.contains("page-attract");

  const ctx = c.getContext("2d");
  const FONT = 16;
  let cols = 0, drops = [], alive = true;

  function resize(){
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    cols  = Math.ceil(c.width / FONT);
    drops = new Array(cols).fill(0).map(() => Math.random() * -100);
  }
  resize();
  window.addEventListener("resize", resize);

  function draw(){
    if(!alive) return;
    ctx.fillStyle = "rgba(7,8,10,0.10)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = FONT + "px monospace";
    for(let i = 0; i < cols; i++){
      const ch = Math.random() < 0.5 ? "0" : "1";
      const y  = drops[i] * FONT;
      ctx.fillStyle = Math.random() < 0.06
        ? "rgba(200,255,61,0.5)"
        : "rgba(92,225,255,0.35)";
      ctx.fillText(ch, i * FONT, y);
      if(y > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }
  }
  const id = setInterval(draw, 83);

  /* Attract fades after 15s. Game pages keep it running for the whole session. */
  if(isAttract){
    setTimeout(() => { alive = false; clearInterval(id); c.style.opacity = "0"; }, 15000);
  }
})();