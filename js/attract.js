(function(){
  const wm = document.getElementById("wordmark");
  let taps = 0, t;

  wm.addEventListener("click", (e) => {
    taps++;
    clearTimeout(t);
    t = setTimeout(() => { taps = 0; }, 800);
    if(taps >= 3){
      e.preventDefault();
      taps = 0;
      location.href = "admin.html";
    }
  });

  const cta = document.querySelector(".attract-main .btn-primary");
  if(cta) setTimeout(() => cta.classList.add("pulse"), 15000);
})();