window.SIGNAL = window.SIGNAL || {};
SIGNAL.DATA = (function(){
  const CODE = {
    A:"00001", B:"00010", C:"00011", D:"00100", E:"00101",
    F:"00110", G:"00111", H:"01000", I:"01001", J:"01010",
    K:"01011", L:"01100", M:"01101", N:"01110", O:"01111",
    P:"10000", Q:"10001", R:"10010", S:"10011", T:"10100",
    U:"10101", V:"10110", W:"10111", X:"11000", Y:"11001", Z:"11010",
    " ":"00000"
  };

  // 3 tiers, 38 terms — plenty of variety per session and across sessions
  const PHRASES = [
    /* Tier 1 — short IS terms (2–3 letters) */
    { text:"AI",   tier:1 }, { text:"IT",   tier:1 }, { text:"PC",   tier:1 },
    { text:"USB",  tier:1 }, { text:"RAM",  tier:1 }, { text:"CPU",  tier:1 },
    { text:"LAN",  tier:1 }, { text:"API",  tier:1 }, { text:"SQL",  tier:1 },
    { text:"DNS",  tier:1 }, { text:"VPN",  tier:1 }, { text:"OS",   tier:1 },
    { text:"IP",   tier:1 }, { text:"UI",   tier:1 },

    /* Tier 2 — medium IS terms (4–5 letters) */
    { text:"DATA",  tier:2 }, { text:"BYTE",  tier:2 }, { text:"CODE",  tier:2 },
    { text:"CLOUD", tier:2 }, { text:"LOGIN", tier:2 }, { text:"EMAIL", tier:2 },
    { text:"CACHE", tier:2 }, { text:"PIXEL", tier:2 }, { text:"ROBOT", tier:2 },
    { text:"CHIP",  tier:2 }, { text:"FILE",  tier:2 }, { text:"HOST",  tier:2 },
    { text:"PORT",  tier:2 }, { text:"CYBER", tier:2 },

    /* Tier 3 — long IS terms (6–7 letters) */
    { text:"SERVER",  tier:3 }, { text:"SYSTEM",  tier:3 }, { text:"MOBILE", tier:3 },
    { text:"SECURE",  tier:3 }, { text:"MEMORY",  tier:3 }, { text:"NETWORK", tier:3 },
    { text:"BROWSER", tier:3 }, { text:"CONSOLE", tier:3 }, { text:"STORAGE", tier:3 },
    { text:"DISPLAY", tier:3 }
  ];

  const DECODE = [
    { bits:"0101", answer:5,  options:[3,5,9,12],  explain:"1×4 + 1×1 = 5" },
    { bits:"1010", answer:10, options:[5,8,10,12], explain:"1×8 + 1×2 = 10" },
    { bits:"0110", answer:6,  options:[4,6,9,14],  explain:"1×4 + 1×2 = 6" }
  ];

  function encode(text){
    return text.toUpperCase().split("").map(ch => CODE[ch] || CODE[" "]);
  }

  function randomCode(){
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return CODE[letters[Math.floor(Math.random() * letters.length)]];
  }

  return {
    CODE, PHRASES, DECODE, encode, randomCode,
    ASCII_A: "01000001",
    CLASSROOM_NOTE: "5-bit classroom code — not standard ASCII"
  };
})();