(function(){
  const values = [8,4,2,1];
  const bits = [0,1,0,1];
  const host = document.getElementById("bits");
  const calc = document.getElementById("calc");

  function render(){
    host.innerHTML = "";
    values.forEach((v,i) => {
      const k = document.createElement("button");
      k.type = "button";
      k.className = "keycap" + (bits[i] ? " on" : "");
      k.setAttribute("role","switch");
      k.setAttribute("aria-checked", bits[i] ? "true" : "false");
      k.setAttribute("aria-label", `Place value ${v}, currently ${bits[i]}`);
      k.innerHTML = `<span class="pv">${v}</span><span class="bit">${bits[i]}</span>`;
      k.addEventListener("click", () => { bits[i] = bits[i] ? 0 : 1; render(); });
      host.appendChild(k);
    });
    const parts = values.map((v,i) => `${bits[i]}×${v}`).join(" + ");
    const total = values.reduce((s,v,i) => s + v * bits[i], 0);
    calc.textContent = `${parts} = ${total}`;
  }
  render();
})();