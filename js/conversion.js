(function(){
  let modal = null;

  function build(){
    const D = SIGNAL.DATA;
    modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.id = "convModal";
    modal.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="convTitle">
        <div class="modal-head">
          <h2 id="convTitle" class="mono">A–Z Codes</h2>
          <button class="modal-close" type="button" aria-label="Close">×</button>
        </div>
        <p class="fineprint">5-bit classroom code — not standard ASCII</p>
        <div class="conv-grid"></div>
        <p class="fineprint" style="margin-top:16px">ASCII: A = 01000001 (8 bits). Space = 00000.</p>
      </div>
    `;
    document.body.appendChild(modal);

    const grid = modal.querySelector(".conv-grid");
    Object.keys(D.CODE).filter(k => k !== " ").sort().forEach(L => {
      const cell = document.createElement("div");
      cell.className = "conv-cell";
      cell.innerHTML = `<b>${L}</b><code>${D.CODE[L]}</code>`;
      grid.appendChild(cell);
    });

    modal.querySelector(".modal-close").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if(e.target === modal) close(); });
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && modal.classList.contains("show")) close();
    });
  }

  function open(){ modal.classList.add("show"); }
  function close(){ modal.classList.remove("show"); }

  function wire(){
    const btn = document.getElementById("tableBtn");
    if(btn) btn.addEventListener("click", open);
  }

  function init(){ build(); wire(); }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();