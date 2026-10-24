(() => {
"use strict";
const WA = "201029389947", LIMIT_KEY = "etds_order_day_v1";
const items = [
["VOLT UC",60,37,5,15,"⚡"],["VOLT UC",120,75,5,15,"⚡"],["VOLT UC",180,112,5,15,"⚡"],["VOLT UC",240,150,5,15,"⚡"],
["FAZZER UC",300,190,15,25,"🔥"],["FAZZER UC",360,230,15,25,"🔥"],
["DRAGON",420,275,25,35,"🐉"],["DRAGON",480,310,25,35,"🐉"],["DRAGON",540,350,25,35,"🐉"],["DRAGON",600,400,25,35,"🐉"],["DRAGON",660,440,25,35,"🐉"]
].map((a,i)=>({id:i,group:a[0],uc:a[1],price:a[2],min:a[3],max:a[4],icon:a[5]}));
const $=id=>document.getElementById(id); let chosen=null, code="", message="", timer;
const groups=[{name:"VOLT UC",desc:"وصول متوقع من 5 إلى 15 دقيقة",time:"5–15 دقيقة",accent:"#f5bd4d"},{name:"FAZZER UC",desc:"وصول متوقع من 15 إلى 25 دقيقة",time:"15–25 دقيقة",accent:"#ff7954"},{name:"DRAGON",desc:"وصول متوقع من 25 إلى 35 دقيقة",time:"25–35 دقيقة",accent:"#ff354b"}];
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){ $("packages").innerHTML=groups.map(g=>`<section class="group"><div class="group-head"><div><h3>${g.name}</h3><p>${g.desc}</p></div><span class="time">⏱ ${g.time}</span></div><div class="grid">${items.filter(x=>x.group===g.name).map(x=>`<article class="card" style="--accent:${g.accent}"><span class="tag">${x.icon} ${x.group}</span><div class="amount">${x.uc}<span> UC</span></div><div class="price">${x.price} <small>جنيه</small></div><div class="eta">⏱ ${x.min}–${x.max} دقيقة</div><button class="choose" data-id="${x.id}">اختيار الباقة ←</button></article>`).join("")}</div></section>`).join("");}
function open(id){$(id).hidden=false;document.body.style.overflow="hidden";}
function close(id){$(id).hidden=true;if(!document.querySelector(".backdrop:not([hidden])"))document.body.style.overflow="";}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(timer);timer=setTimeout(()=>$("toast").classList.remove("show"),2600);}
function today(){let d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}
function used(){try{return localStorage.getItem(LIMIT_KEY)===today()}catch(e){return false}}
function dateText(d){return new Intl.DateTimeFormat("ar-EG",{year:"numeric",month:"2-digit",day:"2-digit"}).format(d)}
function timeText(d){return new Intl.DateTimeFormat("ar-EG",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(d)}
$("packages").addEventListener("click",e=>{let b=e.target.closest("[data-id]");if(!b)return;if(used()){toast("تم استخدام حد الطلب اليومي على هذا المتصفح. تواصل مع المتجر للمساعدة.");return}chosen=items.find(x=>x.id===Number(b.dataset.id));$("agree").checked=false;$("continue").disabled=true;open("guide")});
$("agree").addEventListener("change",()=> $("continue").disabled=!$("agree").checked);
$("continue").addEventListener("click",()=>{if(!chosen)return;close("guide");$("selected").innerHTML=`<strong>${chosen.uc} UC</strong><span>${chosen.price} جنيه</span>`;$("player").value="";$("error").textContent="";open("order")});
$("create").addEventListener("click",()=>{
 const pid=$("player").value.trim();if(!/^[0-9]{5,24}$/.test(pid)){$("error").textContent="اكتب Player ID صحيحًا من 5 إلى 24 رقمًا.";return}
 if(used()){$("error").textContent="الحد اليومي طلب واحد. تواصل مع المتجر على واتساب.";return}
 const d=new Date(),stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`,rand=Math.random().toString(36).slice(2,7).toUpperCase();
 code=`ETDS-${stamp}-${chosen.uc}-${rand}`;
 message=`السلام عليكم، أريد تأكيد طلب من EL TORKI DRAGON STORE.\nكود الطلب: ${code}\nالباقة: ${chosen.group}\nالكمية: ${chosen.uc} UC\nالسعر: ${chosen.price} جنيه\nPlayer ID: ${pid}\nتاريخ الطلب: ${dateText(d)}\nوقت الطلب: ${timeText(d)}\nوقت الوصول المتوقع: من ${chosen.min} إلى ${chosen.max} دقيقة\nأرجو تأكيد الطلب وطريقة الدفع قبل إتمامه.`;
 $("code").textContent=code;
 $("summary").innerHTML=`<div>📦 الباقة: <b>${esc(chosen.group)} — ${chosen.uc} UC</b></div><div>💵 السعر: <b>${chosen.price} جنيه</b></div><div>🕒 التاريخ: ${esc(dateText(d))} — ${esc(timeText(d))}</div><div>⏱ الوصول المتوقع: ${chosen.min}–${chosen.max} دقيقة</div><div>📱 واتساب المتجر: <b dir="ltr">01029389947</b></div>`;
 $("send").href=`https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
 try{localStorage.setItem(LIMIT_KEY,today())}catch(e){}
 close("order");open("result");
});
$("copy").addEventListener("click",async()=>{let text=code+"\n\n"+message;try{await navigator.clipboard.writeText(text);toast("تم نسخ الكود والتفاصيل.")}catch(e){let t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();let ok=document.execCommand("copy");t.remove();toast(ok?"تم نسخ الكود والتفاصيل.":"اضغط مطولًا على الكود لنسخه يدويًا.")}});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>close(b.closest(".backdrop").id)));
document.querySelectorAll(".backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)close(b.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".backdrop:not([hidden])").forEach(b=>close(b.id))});
$("year").textContent=new Date().getFullYear();render();
})();