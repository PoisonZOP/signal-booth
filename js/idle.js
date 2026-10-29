(function(){
  const p = location.pathname;
  if(p === "/" || p.endsWith("index.html") || p.endsWith("admin.html")) return;

  const isResult = p.endsWith("result.html");
  const isBuild  = p.endsWith("build.html");
  const TIMEOUT  = isResult ? 60000 : isBuild ? 90000 : 45000;

  let t;
  function reset(){
    clearTimeout(t);
    t = setTimeout(() => {
      if(SIGNAL.state && SIGNAL.state.clearSession) SIGNAL.state.clearSession();
      location.href = "index.html";
    }, TIMEOUT);
  }
  ["pointerdown","keydown","touchstart","mousemove"].forEach(ev =>
    document.addEventListener(ev, reset, { passive: true })
  );
  reset();
})();