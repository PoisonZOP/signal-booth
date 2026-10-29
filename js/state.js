window.SIGNAL = window.SIGNAL || {};
(function(){
  const K_SESSION  = "signal.session";
  const K_SETTINGS = "signal.settings";

  const defaults = { phraseCount: 4, tier: "mixed", decoys: false, sound: false, mode: "classic" };

  function get(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

  SIGNAL.state = {
    getSettings(){ return Object.assign({}, defaults, get(K_SETTINGS) || {}); },
    setSettings(patch){ set(K_SETTINGS, Object.assign({}, this.getSettings(), patch)); },

    // Using sessionStorage so it works on file:// without a server
    getSession(){ 
      try { return JSON.parse(sessionStorage.getItem(K_SESSION)); } catch(e){ return null; } 
    },
    setSession(s){ 
      try { sessionStorage.setItem(K_SESSION, JSON.stringify(s)); } catch(e){} 
    },
    clearSession(){ 
      try { sessionStorage.removeItem(K_SESSION); } catch(e){} 
    },

    getResults(){ return []; },
    pushResult(r){},
    clearResults(){}
  };
})();