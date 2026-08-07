
let KEY="";
async function api(path){const r=await fetch(path,{headers:{"X-Admin-Key":KEY}});if(!r.ok)throw new Error(await r.text());return r.json()}
function avg(rows,key){if(!rows.length)return 0;return Math.round(rows.reduce((s,r)=>s+(r.scores?.[key]||0),0)/rows.length)}
function esc(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function load(){
 const rows=await api("/api/admin");
 document.querySelector("#login").classList.add("hidden");document.querySelector("#dash").classList.remove("hidden");
 document.querySelector("#kpis").innerHTML=[
 ["填寫人數",rows.length],["平均相容度",Math.round(rows.reduce((s,r)=>s+(r.compatibility||0),0)/(rows.length||1))],["平均主動",avg(rows,"initiative")],["平均 PM 風險",avg(rows,"mental")]
 ].map(([a,b])=>`<div class="kpi"><span class="muted">${a}</span><b>${b}</b></div>`).join("");
 document.querySelector("#tbody").innerHTML=rows.map((r,idx)=>`<tr><td>${new Date(r.created_at).toLocaleString("zh-TW")}</td><td><b>${esc(r.nickname)}</b></td><td><span class="tag">${esc(r.personality_type)}</span></td><td>${r.compatibility}</td><td>${r.scores.chat}</td><td>${r.scores.initiative}</td><td>${r.scores.collab}</td><td>${r.scores.emotion}</td><td>${r.scores.security}</td><td><b>${r.scores.mental}</b></td><td><button class="answer-btn" onclick='showAnswers(${JSON.stringify(JSON.stringify(r)).replace(/'/g,"&#39;")})'>看答案</button></td></tr>`).join("")||`<tr><td colspan="11" class="muted">還沒有資料。</td></tr>`;
}
function showAnswers(serialized){
 const r=JSON.parse(serialized);const a=r.answers||[];
 document.querySelector("#modalBody").innerHTML=`<p><b>${esc(r.nickname)}</b>｜${esc(r.personality_type)}｜相容度 ${r.compatibility}</p>`+QUIZ_QUESTIONS.map((q,i)=>`<div class="ans"><b>${i+1}. ${q.t}</b><span>${esc(q.o[a[i]]?.[0]??"未作答")}</span></div>`).join("");
 document.querySelector("#modal").classList.add("open");
}
function closeModal(){document.querySelector("#modal").classList.remove("open")}
document.querySelector("#loginBtn").onclick=async()=>{KEY=document.querySelector("#key").value;try{await load()}catch(e){alert("密碼不對，或後端環境變數尚未設定好。")}};
document.querySelector("#refresh").onclick=load;
