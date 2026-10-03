/* =====================================================================
   1) THRESHOLDS (°C, % RH, km/h, mm/h). Tweak numbers here.
   ===================================================================== */
const T={
 gustWeight:0.75, // effective wind = max(sustained, gust * this). 15 sustained + 35 gusts => ~26
 rainScale:1,     // multiplier to turn Open-Meteo "precipitation" into mm/h (use 4 if it reports per 15 min)
 rainLight:0.5, rainMod:2, rainHeavy:7.5,
 windBreeze:20, windStrong:30, windSevere:45,
 hot:30, veryHot:35, cold:5, cool:15,
 dryRH:30, dryMildRH:35, mildHumidRH:65, humidRH:70, veryHumidRH:80, soupRH:90, hotHumidRH:60,
 good:{t:[15,25], rh:[35,65], wind:20},
 utopia:{t:[18,25], rh:[40,55], wind:15}
};
const inR=(v,[a,b])=>v>=a&&v<=b;

/* Gradients per condition family (reused by rules) */
const P={rain:['#96B9FB','#2A5EAC'], wind:['#FB96C8','#F6A055'], heat:['#ffb35c','#FF6A88'],
 humid:['#a9c4ff','#4f74d0'], cold:['#9fd8ff','#7b7cf0'], dry:['#ffd28a','#e8907a'], good:['#FFABE7','#6E23CF'], fog:['#c3cfdc','#7f8fa8']};

/* =====================================================================
   2) RULES. Checked top to bottom, FIRST match wins (order = priority).
   w = {t, rh, dew, wind, gust, eff, rain, uv, day}
   id    : must have a same-named array in LINES
   cond  : which metric appears next to temperature (key of CONDS in engine.js)
   g     : card gradient
   fog    : true if the rule's lines already talk about fog (else humidity rules get a FOG_NOTES add-on)
   The top-right icon is NOT set here: it shows the actual weather (see SKY_GROUPS in engine.js).
   ===================================================================== */
const RULES=[
 {id:'storm',    cond:'wind',     g:P.rain,  test:w=>w.rain>=T.rainMod&&w.eff>=T.windStrong},
 {id:'gale',     cond:'wind',     g:P.wind,  test:w=>w.eff>=T.windSevere},
 {id:'windrain', cond:'wind',     g:P.rain,  test:w=>w.rain>=T.rainLight&&w.eff>=T.windBreeze},
 {id:'rainheavy',cond:'rain',     g:P.rain,  test:w=>w.rain>=T.rainHeavy},
 {id:'rain',     cond:'rain',     g:P.rain,  test:w=>w.rain>=T.rainMod},
 {id:'wind',     cond:'wind',     g:P.wind,  test:w=>w.eff>=T.windStrong},
 {id:'heat',     cond:'humidity', g:P.heat,  test:w=>w.t>T.veryHot&&w.rh<T.hotHumidRH},
 {id:'hothumid', cond:'humidity', g:P.heat,  test:w=>(w.t>T.veryHot&&w.rh>=T.hotHumidRH)||(w.t>=T.hot&&w.rh>=T.humidRH)},
 /* Cold/cool + damp or fog: moisture/frizz/shape, never framed as heat. Warm + fog stays on the humid rules with a fog add-on. */
 {id:'foggydamp',cond:'humidity', g:P.fog,   fogNative:true, test:w=>w.fog&&w.t<T.cool&&w.rh>=T.veryHumidRH},
 {id:'damp',     cond:'humidity', g:P.humid, test:w=>w.t<T.cool&&w.rh>=T.veryHumidRH},
 {id:'fog',      cond:'humidity', g:P.fog,   fogNative:true, test:w=>w.fog&&(w.t<T.cool||w.rh<T.humidRH)},
 {id:'soup',     cond:'humidity', g:P.humid, test:w=>w.rh>T.soupRH},
 {id:'veryhumid',cond:'humidity', g:P.humid, test:w=>w.rh>=T.veryHumidRH},
 {id:'static',   cond:'humidity', g:P.cold,  test:w=>(w.t<T.cool&&w.rh<T.dryRH)||(w.t<T.cold&&w.rh<T.dryMildRH)},
 {id:'dry',      cond:'humidity', g:P.dry,   test:w=>w.rh<T.dryRH},
 {id:'humid',    cond:'humidity', g:P.humid, test:w=>w.rh>=T.humidRH},
 {id:'lightrain',cond:'rain',     g:P.rain,  test:w=>w.rain>=T.rainLight},
 {id:'breeze',   cond:'wind',     g:P.wind,  test:w=>w.eff>=T.windBreeze},
 {id:'mild',     cond:'humidity', g:P.good, test:w=>w.rh>=T.mildHumidRH||w.rh<T.dryMildRH},
 {id:'utopia',   cond:'humidity', g:P.good,  test:w=>inR(w.t,T.utopia.t)&&inR(w.rh,T.utopia.rh)&&w.eff<T.utopia.wind&&w.rain<0.05},
 {id:'good',     cond:'humidity', g:P.good,  test:w=>inR(w.t,T.good.t)&&inR(w.rh,T.good.rh)&&w.eff<T.good.wind},
 {id:'ok',       cond:'humidity', g:P.good,  test:()=>true}
];
