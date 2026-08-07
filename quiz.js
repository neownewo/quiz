
const dims={chat:"聊天／腦迴路匹配",initiative:"主動推進",collab:"生活協作",emotion:"情緒成熟",attention:"細節與投入",security:"安全感穩定",progress:"關係推進意願",mental:"需要伴侶當 PM 的風險"};
const sectionTitles=["一、約會與推進","二、聊天與注意力","三、生活協作","四、安全感與情緒","五、長期相處"];
const sectionAt=[0,4,8,12,16];
function render(){let h="";QUIZ_QUESTIONS.forEach((q,i)=>{let si=sectionAt.indexOf(i);if(si>=0)h+=`<div class="section">${sectionTitles[si]}</div>`;h+=`<div class="card"><div class="q">${i+1}. ${q.t}</div>`;q.o.forEach((o,j)=>h+=`<label class="opt"><input type="radio" name="q${i}" value="${j}"><span>${o[0]}</span></label>`);h+="</div>"});document.querySelector("#quiz").innerHTML=h}
function calc(){
 const totals={},counts={};Object.keys(dims).forEach(k=>totals[k]=counts[k]=0);const answers=[];
 for(let i=0;i<QUIZ_QUESTIONS.length;i++){const p=document.querySelector(`input[name=q${i}]:checked`);if(!p){alert(`第 ${i+1} 題還沒填喔 ♡`);return null}answers.push(+p.value);const obj=QUIZ_QUESTIONS[i].o[+p.value][1];Object.entries(obj).forEach(([k,v])=>{totals[k]+=v;counts[k]++})}
 const pct={};Object.keys(dims).forEach(k=>pct[k]=counts[k]?Math.round(totals[k]/(counts[k]*5)*100):0);
 const compatibility=Math.round(pct.chat*.20+pct.initiative*.16+pct.collab*.20+pct.emotion*.16+pct.attention*.10+pct.security*.10+pct.progress*.08);
 let type,desc;
 if(pct.collab>=75&&pct.initiative>=70&&pct.emotion>=70){type="共同解題型";desc="你不只會配合，而是會一起想、一起做。關係裡通常能提供很好的協作感。"}
 else if(pct.chat>=75&&pct.progress<55){type="慢熱聊天型";desc="你很能建立精神上的熟悉感，但把關係從線上推到現實，速度通常比較慢。"}
 else if(pct.initiative<50&&pct.collab<55){type="被動配合型";desc="你通常很好配合，但也容易把決策與安排交給另一半。對方若本身很能幹，可能會默默變成 PM。"}
 else if(pct.security<55){type="需要安全感型";desc="你很在意自己在對方心中的位置。若常靠試探、比較或自嘲確認感情，伴侶可能會有壓力。"}
 else{type="穩定陪伴型";desc="你傾向慢慢建立關係，重視舒服、持續與低壓的相處方式。"}
 return {answers,pct,compatibility,type,desc};
}
async function submit(){
 const r=calc();if(!r)return;
 const nickname=document.querySelector("#nickname").value.trim()||"匿名";
 const note=document.querySelector("#note").value.trim();
 const payload={nickname,note,...r};
 const btn=document.querySelector("#submitBtn");btn.disabled=true;btn.textContent="送出中…";
 try{
   const res=await fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   if(!res.ok) throw new Error("submit failed");
 }catch(e){
   alert("結果可以顯示，但資料沒有成功儲存。請稍後再試。");
 }
 btn.disabled=false;btn.textContent="看結果 ♡";
 const el=document.querySelector("#result");el.style.display="block";
 const publicKeys=["chat","initiative","collab","emotion","attention","security","progress"];
 el.innerHTML=`<h2>${nickname}：${r.type} ♡</h2><div class="typebox">${r.desc}<br><b>互動相容度參考：${r.compatibility}/100</b></div><div class="scores">${publicKeys.map(k=>`<div class="score"><b>${dims[k]}：${r.pct[k]}</b><div class="bar"><i style="width:${r.pct[k]}%"></i></div></div>`).join("")}</div><p class="muted">這是互動風格小測驗，不是心理診斷。真正合不合仍以實際相處與是否願意調整為準。</p>`;
 el.scrollIntoView({behavior:"smooth"});
}
render();document.querySelector("#submitBtn").addEventListener("click",submit);
