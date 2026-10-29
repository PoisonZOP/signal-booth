(function(){
  const S = SIGNAL.state;
  const cfg = S.getSettings();
  const $ = (id) => document.getElementById(id);

  $("phraseCount").value = cfg.phraseCount;
  $("tier").value        = cfg.tier;
  $("mode").value        = cfg.mode;
  $("decoys").checked    = !!cfg.decoys;
  $("sound").checked     = !!cfg.sound;

  $("phraseCount").addEventListener("change", e => {
    const n = Math.max(4, Math.min(5, Number(e.target.value) || 4));
    e.target.value = n;
    S.setSettings({ phraseCount: n });
  });
  $("tier").addEventListener("change",   e => S.setSettings({ tier: e.target.value }));
  $("mode").addEventListener("change",   e => S.setSettings({ mode: e.target.value }));
  $("decoys").addEventListener("change", e => S.setSettings({ decoys: e.target.checked }));
  $("sound").addEventListener("change",  e => S.setSettings({ sound: e.target.checked }));

  $("reset").addEventListener("click", () => {
    S.clearSession();
    location.href = "index.html";
  });

  $("export").addEventListener("click", () => {
    const rows = [["timestamp","mode","score","total_phrases","hints","misses","elapsed_s"]];
    S.getResults().forEach(r =>
      rows.push([
        new Date(r.at).toISOString(),
        r.mode || "classic",
        r.score || 0, r.totalPhrases || 4,
        r.hints || 0, r.misses || 0, r.elapsed || 0
      ])
    );
    const csv = rows.map(r =>
      r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signal-results.csv";
    a.click();
  });

  $("clear").addEventListener("click", () => {
    if(confirm("Clear all local results on this device?")){
      S.clearResults();
      alert("Cleared.");
    }
  });
})();