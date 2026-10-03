/* =====================================================================
   3b) ICONS & SECOND CONDITION. Temperature is always shown first; the
   second condition comes from the winning rule's `cond` (so RULES order
   decides it). Put your PNGs in the images/ folder using these names.
     images/icon-<family>.png  28x28 top-right icon, chosen by the winning rule
     (families: rain rain-wind wind heat humidity cold dry good)
     images/location.png         beside the city name
     images/cond-<name>.png      before the 2nd condition (see CONDS)
     images/background.jpg       page background
   Missing files fall back to a grey placeholder circle.
   ===================================================================== */
const IMG="images/", SIZE={state:28, small:12};
const CONDS={
 humidity:{icon:'cond-humidity', show:w=>Math.round(w.rh)+"%"},
 wind:    {icon:'cond-wind',     show:w=>Math.round(w.eff)+" km/h"},
 rain:    {icon:'cond-rain',     show:w=>(w.rain>0&&w.rain<0.1?"<0.1":w.rain.toFixed(1))+" mm"},
 uv:      {icon:'cond-uv',       show:w=>"UV "+Math.round(w.uv)}
};
const SKY_GROUPS=[ // [Open-Meteo weather codes, day icon, night icon (optional)] -> images/weather-<name>.png
 [[0,1],'sunny','clear-night'],
 [[2],'partly-cloudy-day','partly-cloudy-night'],
 [[3],'cloudy'],
 [[45,48],'fog'],
 [[51,53,55,56,57],'drizzle'],
 [[61,63,65,66,67,80,81,82],'rain'],
 [[71,73,75,77,85,86],'snow'],
 [[95,96,99],'thunderstorm']
];
const skyIcon=(code,day)=>{const g=SKY_GROUPS.find(x=>x[0].includes(code));return g?(!day&&g[2]?g[2]:g[1]):"cloudy";};
const PH="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='13.5' cy='13.5' r='11' fill='%23fff' fill-opacity='.35'/%3E%3C/svg%3E";
const icon=(n,px)=>`<img src="${IMG}${n}.png" width="${px}" height="${px}" alt="" onerror="this.onerror=null;this.src=PH">`;

/* =====================================================================
   4) ENGINE — usually no need to edit below this line
   ===================================================================== */
const $=id=>document.getElementById(id);
let W=null, lastLine="", ruleId="", city="";

function classify(w,force){return force?RULES.find(r=>r.id===force):RULES.find(r=>r.test(w));}
function fill(s,w){return s.replace(/\{(\w+)\}/g,(_,k)=>({city:city||"your town",t:Math.round(w.t),rh:Math.round(w.rh),wind:Math.round(w.eff),uv:Math.round(w.uv)})[k]);}
function pick(rule,w){
  const bank=LINES[rule.id]||["(no lines for this state yet)"];
  let s,n=0; do{s=fill(bank[Math.floor(Math.random()*bank.length)],w)}while(s===lastLine&&bank.length>1&&++n<10);
  if(w.fog&&rule.cond==="humidity"&&!rule.fogNative)s+=" "+FOG_NOTES[Math.floor(Math.random()*FOG_NOTES.length)]; // fog as secondary modifier
  return s;
}

function render(){
  if(!W)return;
  const force=$("force").value, rule=classify(W,force); ruleId=rule.id;
  lastLine=pick(rule,W);
  $("card").style.background=`linear-gradient(160deg,${rule.g[0]},${rule.g[1]})`;
  $("ic").innerHTML=icon("weather-"+skyIcon(W.code,W.day),SIZE.state); // actual weather, independent of the hair state
  $("city").textContent=city||"Your spot";
  $("city").insertAdjacentHTML("beforeend",icon("location",SIZE.small));
  const c=CONDS[rule.cond]||CONDS.humidity;
  $("meta").innerHTML=`${Math.round(W.t)}°C | ${icon(c.icon,SIZE.small)} ${c.show(W)}`;
  $("line").textContent=lastLine;
  $("dbg").textContent=JSON.stringify({state:rule.id,...W},null,1);
}
async function load(lat,lon,name){
  try{
    const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,wind_speed_10m,wind_gusts_10m,uv_index,is_day,weather_code&timezone=auto`;
    const c=(await (await fetch(u)).json()).current;
    W={t:c.temperature_2m,rh:c.relative_humidity_2m,dew:c.dew_point_2m,rain:(c.precipitation||0)*T.rainScale,wind:c.wind_speed_10m,gust:c.wind_gusts_10m,uv:c.uv_index??0,day:!!c.is_day,code:c.weather_code,fog:[45,48].includes(c.weather_code)};
    W.eff=Math.max(W.wind,W.gust*T.gustWeight); // effective wind: gusts escalate sustained wind
    city=name||await reverse(lat,lon);
    render();
  }catch(e){$("line").textContent="Couldn't reach the weather. Check your connection and retry.";}
}
async function reverse(lat,lon){
  try{const r=await (await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)).json();return r.city||r.locality||"";}catch{return "";}
}
async function search(q){
  try{const r=(await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`)).json()).results;
    if(!r)return $("line").textContent="Couldn't find that city. Try another spelling.";
    load(r[0].latitude,r[0].longitude,r[0].name);
  }catch{$("line").textContent="Search failed. Try again.";}
}
function locate(){
  if(!navigator.geolocation){$("line").textContent="No location access. Search a city below.";return;}
  navigator.geolocation.getCurrentPosition(p=>load(p.coords.latitude,p.coords.longitude),
    ()=>{$("line").textContent="Location blocked. Search a city below.";$("city").textContent="";});
}
/* drag the widget anywhere; position is remembered between visits */
const card=$("card"), POS="hw_pos"; let d=null;
try{const p=JSON.parse(localStorage.getItem(POS));if(p){card.style.left=Math.min(p.x,innerWidth-190)+"px";card.style.top=Math.min(p.y,innerHeight-100)+"px";}}catch{}
card.onpointerdown=e=>{const r=card.getBoundingClientRect();d={x:e.clientX-r.left,y:e.clientY-r.top};card.setPointerCapture(e.pointerId);card.classList.add("drag");};
card.onpointermove=e=>{if(!d)return;
  card.style.left=Math.min(Math.max(0,e.clientX-d.x),innerWidth-card.offsetWidth)+"px";
  card.style.top=Math.min(Math.max(0,e.clientY-d.y),innerHeight-card.offsetHeight)+"px";};
card.onpointerup=card.onpointercancel=()=>{if(!d)return;d=null;card.classList.remove("drag");
  try{localStorage.setItem(POS,JSON.stringify({x:card.offsetLeft,y:card.offsetTop}));}catch{}};
$("more").onclick=render;
$("search").onsubmit=e=>{e.preventDefault();if($("q").value.trim())search($("q").value.trim());};
$("force").innerHTML='<option value="">Auto (real weather)</option>'+RULES.map(r=>`<option value="${r.id}">Force: ${r.id}</option>`).join("");
$("force").onchange=render;
locate();
