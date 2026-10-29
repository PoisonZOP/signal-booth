(function(){
  const S = SIGNAL.state;
  const s = S.getSession();
  const fmt = (n) => Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");

  if(!s){
    document.getElementById("score").textContent = "0 / 4";
    document.getElementById("time").textContent  = "0:00";
    document.getElementById("hints").textContent = "0";
  } else {
    if(s.timedOut){
      document.getElementById("resultEyebrow").textContent = "Time's up";
    }
    document.getElementById("score").textContent = `${s.score || 0} / ${s.totalPhrases || 4}`;
    document.getElementById("time").textContent  = fmt(s.elapsed || 0);
    document.getElementById("hints").textContent = s.hints || 0;
  }

  document.getElementById("again").addEventListener("click", () => {
    S.clearSession();
    location.href = "build.html";
  });

  document.getElementById("staffReset").addEventListener("click", () => {
    S.clearSession();
    location.href = "index.html";
  });
})();