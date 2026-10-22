const videos = [
 {id:1,title:"O mapa mais insano do GTA RP? 🚗",channel:"PlayZone",initial:"P",category:"Vídeos",views:128000,date:"há 2 horas",duration:"12:48",icon:"🎮",word:"GAME ON",colors:["#5a3b09","#17140a"],avatar:"#f5d000",hot:true},
 {id:2,title:"As músicas que dominaram a semana",channel:"Som na Caixa",initial:"S",category:"Vídeos",views:86400,date:"há 5 horas",duration:"18:22",icon:"♫",word:"SOUND UP",colors:["#511f3e","#190e19"],avatar:"#ed77b9",hot:true},
 {id:3,title:"Montei um setup gastando pouco!",channel:"TechLab",initial:"T",category:"Vídeos",views:57200,date:"ontem",duration:"09:31",icon:"⌘",word:"SETUP PRO",colors:["#143e46","#0c171b"],avatar:"#5ed5e3",hot:false},
 {id:4,title:"Tente não rir com esses momentos 😂",channel:"Clips do Dia",initial:"C",category:"Vídeos",views:241000,date:"há 1 dia",duration:"08:07",icon:"😂",word:"SEM RIR",colors:["#6b310c","#211207"],avatar:"#ff9d4a",hot:true},
 {id:5,title:"Explorando lugares incríveis pelo Brasil",channel:"Mundo Aberto",initial:"M",category:"Vídeos",views:31900,date:"há 2 dias",duration:"15:16",icon:"🌅",word:"VAI ALÉM",colors:["#24543e","#101b15"],avatar:"#71d6a2",hot:false},
 {id:6,title:"Os melhores jogos grátis para PC",channel:"PlayZone",initial:"P",category:"Vídeos",views:74500,date:"há 3 dias",duration:"11:05",icon:"🕹️",word:"FREE TO PLAY",colors:["#26205e","#100f20"],avatar:"#a99bff",hot:false},
 {id:7,title:"Como deixar seu PC mais rápido",channel:"TechLab",initial:"T",category:"Vídeos",views:98700,date:"há 4 dias",duration:"07:42",icon:"⚡",word:"TURBO MODE",colors:["#50450b","#17150a"],avatar:"#5ed5e3",hot:true},
 {id:8,title:"Acústico para ouvir no fim do dia",channel:"Som na Caixa",initial:"S",category:"Vídeos",views:41200,date:"há 5 dias",duration:"21:34",icon:"🎧",word:"VIBE BOA",colors:["#16414b","#0c171c"],avatar:"#ed77b9",hot:false},
 {id:9,title:"Expectativa vs. realidade: vida adulta",channel:"Clips do Dia",initial:"C",category:"Vídeos",views:163000,date:"há 1 semana",duration:"06:19",icon:"😅",word:"É SOBRE ISSO",colors:["#5b2042","#1c1018"],avatar:"#ff9d4a",hot:true}
];
let activeFilter="Todos", searchTerm="", saved=new Set(), currentVideo=null;
const $=id=>document.getElementById(id);
const fmt=n=>n>=1000000?(n/1000000).toFixed(1).replace(".",",")+" mi":n>=1000?Math.round(n/1000)+" mil":String(n);
function visibleVideos(){
 let list=videos.filter(v=>(activeFilter==="Todos"||activeFilter==="Em alta"?(activeFilter!=="Em alta"||v.hot):v.category===activeFilter)&&(`${v.title} ${v.channel} ${v.category}`).toLowerCase().includes(searchTerm.toLowerCase()));
 const sort=$("sortSelect").value;
 if(sort==="views")list.sort((a,b)=>b.views-a.views);
 if(sort==="newest")list.sort((a,b)=>a.id-b.id);
 return list;
}
function render(){
 const list=visibleVideos();$("videoGrid").innerHTML="";
 list.forEach(v=>{
  const card=document.createElement("article");card.className="video-card";card.tabIndex=0;
  card.innerHTML=`<div class="thumbnail"><div class="thumb-art" style="background:radial-gradient(circle at 50% 45%,${v.colors[0]},${v.colors[1]} 75%)"><span class="thumb-icon">${v.icon}</span><span class="thumb-word">${v.word}</span></div>${v.hot?'<span class="thumb-label">EM ALTA</span>':''}<span class="thumb-duration">${v.duration}</span></div><div class="video-details"><div class="channel-avatar" style="background:${v.avatar}">${v.initial}</div><div class="video-text"><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.channel)}</p><p>${fmt(v.views)} visualizações · ${v.date}</p></div><button class="more-btn" aria-label="Mais opções">⋮</button></div>`;
  card.addEventListener("click",e=>{if(!e.target.closest(".more-btn"))openPlayer(v)});
  card.addEventListener("keydown",e=>{if(e.key==="Enter")openPlayer(v)});
  card.querySelector(".more-btn").addEventListener("click",e=>{e.stopPropagation();saved.has(v.id)?saved.delete(v.id):saved.add(v.id);showToast(saved.has(v.id)?"Adicionado a Assistir depois":"Removido de Assistir depois")});
  $("videoGrid").appendChild(card);
 });
 $("emptyState").classList.toggle("hidden",list.length>0);$("videoGrid").classList.toggle("hidden",list.length===0);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function setFilter(f){
 activeFilter=f;
 document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("selected",b.dataset.filter===f));
 document.querySelectorAll(".side-link[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));
 render();
}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));
$("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=$("searchInput").value.trim();render()});
$("searchInput").addEventListener("input",()=>{searchTerm=$("searchInput").value.trim();render()});
$("sortSelect").addEventListener("change",render);
$("exploreBtn").addEventListener("click",()=>$("videoGrid").scrollIntoView({behavior:"smooth",block:"start"}));
$("resetSearch").addEventListener("click",()=>{$("searchInput").value="";searchTerm="";setFilter("Todos")});
$("laterBtn").addEventListener("click",()=>{const list=videos.filter(v=>saved.has(v.id));if(!list.length){showToast("Use ⋮ em um vídeo para salvar para depois");return}activeFilter="Todos";$("searchInput").value="";searchTerm="";$("videoGrid").innerHTML="";list.forEach(v=>{const c=document.createElement("article");c.className="video-card";c.innerHTML=`<div class="thumbnail" style="background:linear-gradient(135deg,${v.colors[0]},${v.colors[1]});display:grid;place-items:center;font-size:42px">${v.icon}<span class="thumb-duration">${v.duration}</span></div><div class="video-details"><div class="channel-avatar" style="background:${v.avatar}">${v.initial}</div><div class="video-text"><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.channel)} · ${fmt(v.views)} visualizações</p></div></div>`;c.addEventListener("click",()=>openPlayer(v));$("videoGrid").appendChild(c)});$("emptyState").classList.add("hidden");$("videoGrid").classList.toggle("hidden",!list.length);$("videoGrid").scrollIntoView({behavior:"smooth"})});
function openPlayer(v){currentVideo=v;$("playerTitle").textContent=v.title;$("playerCategory").textContent=v.category;$("playerMeta").textContent=`${fmt(v.views)} visualizações · ${v.channel}`;$("playerScreen").style.background=`radial-gradient(circle at center,${v.colors[0]},${v.colors[1]} 70%)`;$("playerScreen").querySelector(".big-play").textContent=v.icon;$("playerScreen").querySelector("p").textContent="Prévia demonstrativa — conecte um serviço de vídeo para reproduzir conteúdo";$("saveVideo").textContent=saved.has(v.id)?"✓ Salvo para assistir depois":"◷ Assistir depois";$("playerModal").classList.remove("hidden")}
$("saveVideo").addEventListener("click",()=>{if(!currentVideo)return;saved.has(currentVideo.id)?saved.delete(currentVideo.id):saved.add(currentVideo.id);$("saveVideo").textContent=saved.has(currentVideo.id)?"✓ Salvo para assistir depois":"◷ Assistir depois";showToast(saved.has(currentVideo.id)?"Salvo para assistir depois":"Removido dos salvos")});
$("uploadOpen").addEventListener("click",()=>{$("uploadModal").classList.remove("hidden");$("formSuccess").classList.add("hidden")});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).classList.add("hidden")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal").forEach(m=>m.classList.add("hidden"))});
$("videoFile").addEventListener("change",()=>{const f=$("videoFile").files[0];$("uploadNote").textContent=f?`Arquivo selecionado: ${f.name}. Ele não será enviado para um servidor.`:"Protótipo: o vídeo não será enviado para um servidor."});
$("uploadForm").addEventListener("submit",e=>{e.preventDefault();const title=$("videoTitle").value.trim();if(!title)return;const cat="Vídeos";const id=Math.max(...videos.map(v=>v.id))+1;videos.unshift({id,title,channel:"Seu canal",initial:"T",category:cat,views:0,date:"agora",duration:"--:--",icon:"▶",word:"NOVO VÍDEO",colors:["#4b4006","#15130a"],avatar:"#f5d000",hot:false});$("uploadForm").reset();$("uploadSuccess").classList.remove("hidden");$("uploadNote").textContent="Protótipo: o vídeo não será enviado para um servidor.";setTimeout(()=>{$("uploadModal").classList.add("hidden");$("uploadSuccess").classList.add("hidden");setFilter("Todos");window.scrollTo({top:0,behavior:"smooth"});showToast("Prévia criada nesta sessão")},900)});
$("profileBtn").addEventListener("click",()=>showToast("Perfil de demonstração — login ainda não configurado"));
function showToast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>$("toast").classList.add("hidden"),2600)}
render();
