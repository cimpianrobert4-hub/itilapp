(function(){
"use strict";
// ---------- helpers ----------
const $=s=>document.querySelector(s);
const app=$("#app");
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dayNum=(t)=>{const d=t?new Date(t):new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/864e5);};
const dayKey=(n)=>new Date(n*864e5).toISOString().slice(0,10);
const LETTERS="ABCD";
const INT=[0,1,2,4,7,15];
const ICON={
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
 exam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
 car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6 17v2M18 17v2M3 13l2-6a2 2 0 0 1 2-1.4h10A2 2 0 0 1 19 7l2 6v4H3z"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/></svg>',
 redo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
 cards:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
 seq:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>',
 match:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6l10 12M7 18L17 6"/></svg>',
 sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6v6H4zM14 14h6v6h-6z"/><path d="M14 7h6M4 17h6"/></svg>',
 flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 11 11c0-4 1-9 1-9z"/></svg>',
 book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
 flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>'
};

// ---------- course config ----------
const C=window.COURSE;
const NQ=C.n, PASS=C.pass, MOCKMIN=C.mins;
const OTHER=C.id==="itil"?{id:"prince2",name:"PRINCE2 7",key:"prince2-7-sprint-v1"}:{id:"itil",name:"ITIL V5",key:"itilv5-sprint-v1"};
const NATIVE=!!(window.Android&&window.Android.save);
const PAPERS=(window.OFFICIAL||[]).map(p=>Object.assign({},p,{official:1})).concat(window.PAPERS||[]), MNEMONICS=window.MNEMONICS||[], TRAPS=window.TRAPS||[], TF=window.TF||[], KEYFACTS=window.KEYFACTS||[], PRODUCTS=window.PRODUCTS||[], WEBCARDS=window.WEBCARDS||[];
const TYPES={std:"Standard",neg:"Negative (NOT)",list:"List (pick two)",miss:"Missing word"};
function qType(s){ s=String(s||""); if(/missing word/i.test(s))return "miss"; if(/\n\s*1[.)]\s/.test(s))return "list"; if(/\b(NOT|EXCEPT|LEAST)\b/.test(s))return "neg"; return "std"; }
// verified additions from official web sources are appended to their lessons
(window.BOOKCARDS||[]).forEach(w=>{ MODULES.forEach(m=>m.lessons.forEach(l=>{ if(l.id===w.l&&w.card){ const c=Object.assign({},w.card); c.src=w.src||"Official Book"; c.book=1; l.cards.push(c);} })); });
WEBCARDS.forEach(w=>{ if(w.guide)return; MODULES.forEach(m=>m.lessons.forEach(l=>{ if(l.id===w.l&&w.card){ const c=Object.assign({},w.card); c.src=w.src||""; c.web=1; l.cards.push(c);} })); });

// ---------- content index ----------
const MODS={}; const LESS={};
MODULES.forEach(m=>{MODS[m.id]=m;m.lessons.forEach(l=>{LESS[l.id]={l,m};});});
// official learner workbook notes, attached to their cards
(window.FIGS||[]).forEach(f=>{ const L=LESS[f.l]; if(!L||!f.src)return; const c=L.l.cards.find(x=>x.h===f.h); if(c)(c.imgs=c.imgs||[]).push({src:f.src,cap:f.cap||""}); });
(window.NOTES||[]).forEach(e=>{ const L=LESS[e.l]; if(!L||!e.n||!e.n.length)return; const c=L.l.cards.find(x=>x.h===e.h); if(c)c.nt=(c.nt||[]).concat(e.n); });
const Q={}; const QL=[]; const PL=[];
function addQ(r,extra){ const id="q"+hash(r.q+"|"+r.o[0]); if(Q[id])return Q[id];
 const opts=r.o.map((t,i)=>({t,ok:i===0,why:i===0?"":((r.x&&r.x[i-1])||"")}));
 const o=Object.assign({id,m:r.m,l:r.l,q:r.q,opts,e:r.e,g:!!r.g,w:!!r.w,of:!!r.of,img:r.img||"",ty:r.ty||qType(r.q)},extra||{}); Q[id]=o; return o; }
const PKEY={}; PAPERS.forEach(p=>(p.qs||[]).forEach(r=>{ if(r&&r.o)PKEY["q"+hash(r.q+"|"+r.o[0])]=1; }));
QB.forEach(r=>{ if(!MODS[r.m]||!r.o||r.o.length<2)return; const id="q"+hash(r.q+"|"+r.o[0]); if(Q[id])return; if(r.of&&PKEY[id])return; QL.push(addQ(r)); });
PAPERS.forEach(p=>{ p.ids=(p.qs||[]).filter(r=>MODS[r.m]&&r.o&&r.o.length===4).map(r=>{ const o=addQ(r,{p:p.id,pos:null,syl:r.syl||"",of:p.official?1:0}); /* official option order is shuffled (seeded): the PDF key is heavily skewed to A */ if(o.p===p.id&&PL.indexOf(o)<0)PL.push(o); return o.id; }); });
const byMod=m=>QL.filter(q=>q.m===m);
ORDERS.forEach(o=>{o.id="o"+hash(o.t);}); MATCHES.forEach(o=>{o.id="x"+hash(o.t);}); SORTS.forEach(o=>{o.id="s"+hash(o.t);});
// management products (PRINCE2): name -> purpose match drills in groups of 5
(function(){ const P=PRODUCTS.filter(p=>p.n&&p.p&&p.p.length<=170&&MODS[p.m]); for(let i=0;i+3<=P.length;i+=5){ const g=P.slice(i,i+5); if(g.length<3)break; MATCHES.push({id:"x"+hash("prod"+i),m:g[0].m,t:"Management products: purposes ("+(i/5+1)+")",pairs:g.map(p=>[p.n,p.p])}); } })();
const TRAPL=TRAPS.filter(t=>MODS[t.m]&&t.items&&t.items.length).map(t=>({id:"k"+hash(t.t),m:t.m,t:t.t,buckets:[t.a,t.b],items:t.items.map(it=>[it[0],it[1]==="a"?t.a:t.b]),tip:t.tip||"",trap:1}));
const MNL=MNEMONICS.filter(x=>MODS[x.m]&&x.items&&x.items.length>1).map(x=>({id:"n"+hash(x.t),m:x.m,t:x.t,items:x.items,mn:x.mn||"",tip:x.tip||""}));
const TFL=TF.filter(x=>MODS[x.m]&&x.s).map(x=>({id:"t"+hash(x.s),m:x.m,s:x.s,a:!!x.a,e:x.e||""}));
const FLASH=[]; MODULES.forEach(m=>m.lessons.forEach(l=>l.cards.forEach(c=>(c.d||[]).forEach(([t,d])=>{const id="f"+hash(t+d);if(!FLASH.find(f=>f.id===id))FLASH.push({id,t,d,m:m.id,l:l.id});}))));
const BLUEPRINT=C.blueprint;
const LEVELS=C.levels;
const lvlXp=n=>400*n*(n+1)/2; // xp needed to reach level n+1 (0-based n)
const levelOf=xp=>{let n=0;while(n<LEVELS.length-1&&xp>=lvlXp(n+1))n++;return n;};

// ---------- state ----------
const KEY=C.key;
const fresh=()=>({v:1,updatedAt:0,xp:0,daily:{},streak:{count:0,last:0},items:{},lessons:{},cardsRead:{},mocks:[],drives:[],speed:[],badges:{},best:{combo:0,mock:0,speed:0},tot:{a:0,c:0},plan:{},settings:{goal:500,sound:true,vib:true,exam:C.exam,theme:"",extra:false}});
// storage: native app storage (SharedPreferences through the Android bridge) mirrored in localStorage
function rawGet(k){ let v=null; try{ if(NATIVE)v=window.Android.load(k); }catch(e){} if(v==null||v===""){ try{ const w=localStorage.getItem(k); if(w!=null)v=w; }catch(e){} } return v; }
function rawSet(k,v){ let ok=false; try{ if(NATIVE)ok=!!window.Android.save(k,v); }catch(e){} try{ localStorage.setItem(k,v); ok=true; }catch(e){} return ok; }
function parseState(raw){ if(!raw)return null; try{ const o=JSON.parse(raw); if(o&&typeof o==="object"&&o.items)return o; }catch(e){} return null; }
function normState(o){ const f=fresh(); const s=Object.assign(f,o); s.settings=Object.assign(fresh().settings,o.settings||{}); s.best=Object.assign(fresh().best,o.best||{}); s.tot=Object.assign(fresh().tot,o.tot||{}); ["mocks","drives","speed"].forEach(k=>{ if(!Array.isArray(s[k]))s[k]=[]; }); return s; }
function loadState(){ let a=null,b=null; try{ if(NATIVE)a=parseState(window.Android.load(KEY)); }catch(e){} try{ b=parseState(localStorage.getItem(KEY)); }catch(e){}
 const o=(a&&b)?(((a.updatedAt||0)>=(b.updatedAt||0))?a:b):(a||b); return o?normState(o):fresh(); }
let S=loadState();
function persistLocal(){ rawSet(KEY,JSON.stringify(S)); }
let saveT=null;
function save(){ S.updatedAt=Date.now(); clearTimeout(saveT); saveT=setTimeout(flush,250); }
function flush(){ clearTimeout(saveT); saveT=null; persistLocal(); try{ pushStatus(); }catch(e){} }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden"){ if(saveT)flush(); if(typeof saveLive==="function")saveLive(); } });

// ---------- learning model ----------
const today=()=>dayNum();
function item(id){return S.items[id];}
function grade(id,ok,unsure){const it=S.items[id]||{b:0,d:0,c:0,w:0,f:today()}; if(ok){it.c++; if(unsure){it.b=1; it.u=(it.u||0)+1;} else it.b=Math.min(5,it.b+1);}else{it.w++;it.b=0;} it.d=today()+INT[it.b]; it.l=Date.now(); S.items[id]=it; if(id[0]==="q"){S.tot.a++; if(ok)S.tot.c++;} }
function pItem(it){ if(!it)return .25; const acc=(it.c+1)/(it.c+it.w+2); const bf=[.35,.55,.7,.82,.9,.95][it.b]; return clamp(acc*.55+bf*.45,.25,.97); }
function modStats(m){const qs=byMod(m); let seen=0,mast=0,p=0,c=0,w=0; qs.forEach(q=>{const it=S.items[q.id]; if(it){seen++; c+=it.c; w+=it.w; if(it.b>=3)mast++;} p+=pItem(it);}); return {n:qs.length,seen,mast,p:qs.length?p/qs.length:0,acc:(c+w)?c/(c+w):null,pct:qs.length?Math.round(100*qs.reduce((s,q)=>s+Math.min(4,(S.items[q.id]||{b:0}).b)/4,0)/qs.length):0};}
function predicted(){let s=0;Object.keys(BLUEPRINT).forEach(m=>{s+=BLUEPRINT[m]*modStats(m).p;});return s;}
function dueIds(){const t=today();return QL.concat(PL).filter(q=>{const it=S.items[q.id];return it&&it.d<=t;}).sort((a,b)=>(S.items[a.id].b-S.items[b.id].b)||(S.items[a.id].d-S.items[b.id].d)).map(q=>q.id);}
function newIds(modFilter){const order=MODULES.map(m=>m.id);const read=id=>MODS[id].lessons.some(l=>S.lessons[l.id]);
 let pool=QL.filter(q=>!S.items[q.id]&&(!modFilter||q.m===modFilter));
 pool=shuffle(pool).sort((a,b)=>((read(b.m)?1:0)-(read(a.m)?1:0))||(order.indexOf(a.m)-order.indexOf(b.m))||((a.g?1:0)-(b.g?1:0)));
 return pool.map(q=>q.id);}
function mistakeIds(){return QL.concat(PL).filter(q=>{const it=S.items[q.id];return it&&it.w>0&&it.b<3;}).sort((a,b)=>(S.items[b.id].w-S.items[b.id].c)-(S.items[a.id].w-S.items[a.id].c)).map(q=>q.id);}

// ---------- XP, streak, badges ----------
function addXp(n,silent){ if(n<=0)return; const before=levelOf(S.xp); S.xp+=n; const k=dayKey(today()); S.daily[k]=(S.daily[k]||0)+n;
 const t=today(); if(S.daily[k]>=100&&S.streak.last!==t){ S.streak.count=(S.streak.last===t-1)?S.streak.count+1:1; S.streak.last=t; toast("Streak: "+S.streak.count+" day"+(S.streak.count>1?"s":"")+" 🔥"); sfx("streak"); haptic("heavy"); }
 const after=levelOf(S.xp); if(after>before){ setTimeout(()=>{confetti();toast("Level up! You are now "+LEVELS[after]);fxBig("level");},400); }
 if(!silent)floatXp(n); checkBadges(); }
function streakNow(){const t=today();return (S.streak.last===t||S.streak.last===t-1)?S.streak.count:0;}
const BADGES=[
 {id:"first",t:"First answer",i:"✓",f:()=>S.tot.a>=1},
 {id:"c100",t:"100 correct",i:"💯",f:()=>S.tot.c>=100},
 {id:"c500",t:"500 correct",i:"🏅",f:()=>S.tot.c>=500},
 {id:"c1000",t:"1000 correct",i:"🏆",f:()=>S.tot.c>=1000},
 {id:"combo10",t:"Combo x10",i:"⚡",f:()=>S.best.combo>=10},
 {id:"combo25",t:"Combo x25",i:"🌩",f:()=>S.best.combo>=25},
 {id:"s3",t:"3-day streak",i:"🔥",f:()=>S.streak.count>=3},
 {id:"s7",t:"7-day streak",i:"🔥",f:()=>S.streak.count>=7},
 {id:"s14",t:"14-day streak",i:"🔥",f:()=>S.streak.count>=14},
 {id:"s21",t:"21-day streak",i:"🔥",f:()=>S.streak.count>=21},
 {id:"lessons",t:"All lessons read",i:"📘",f:()=>Object.keys(LESS).every(k=>S.lessons[k])},
 {id:"mockpass",t:"First mock passed",i:"🎓",f:()=>S.mocks.some(m=>m.score>=PASS)},
 {id:C.hiBadge,t:"Mock "+C.hi+"+ / "+NQ,i:"🎯",f:()=>S.mocks.some(m=>m.score>=C.hi)},
 {id:"mock3",t:"3 mocks passed in a row",i:"👑",f:()=>{const a=S.mocks.slice(-3);return a.length===3&&a.every(m=>m.score>=PASS);}},
 {id:"paper",t:"Passed an exam simulation",i:"📝",f:()=>S.mocks.some(m=>m.paper&&m.score>=PASS)},
 {id:"papers",t:"Passed every simulation",i:"🧠",f:()=>PAPERS.length>0&&PAPERS.every(p=>S.mocks.some(m=>m.paper===p.id&&m.score>=PASS))},
 {id:"speed20",t:"Speed round: 20+",i:"⏱",f:()=>(S.best.speed||0)>=20},
 {id:"traps",t:"Every exam trap solved",i:"🪤",f:()=>TRAPL.length>0&&TRAPL.every(t=>(S.items[t.id]||{c:0}).c>0)},
 {id:"drive",t:"Driving test passed",i:"🚗",f:()=>S.drives.some(d=>d.pass)},
 {id:"drive0",t:"Driving test, 0 mistakes",i:"🏁",f:()=>S.drives.some(d=>d.pass&&d.wrong===0)},
 {id:"orders",t:"Every sequence perfect",i:"🧩",f:()=>ORDERS.every(o=>(S.items[o.id]||{c:0}).c>0)},
 {id:"seen",t:"Seen every question",i:"👀",f:()=>QL.every(q=>S.items[q.id])},
 {id:"ready",t:"Predicted "+C.ready+"+ / "+NQ,i:"🚀",f:()=>predicted()>=C.ready}
].concat(MODULES.map(m=>({id:"mod_"+m.id,t:"Mastered: "+m.short,i:"★",f:()=>modStats(m.id).pct>=80})));
function checkBadges(){BADGES.forEach(b=>{if(!S.badges[b.id]&&b.f()){S.badges[b.id]=Date.now();setTimeout(()=>{toast("Badge unlocked: "+b.t);confetti();sfx("badge");haptic("heavy");},700);}});}

// ---------- fx ----------
// ---------- sound and haptics ----------
let actx=null;
const SFX={ // WebAudio fallback: [freq, start, dur, type, gain]
 tap:[[1800,0,.03,"sine",.08]], ok:[[660,0,.09,"triangle",.14],[990,.08,.14,"triangle",.14]], no:[[200,0,.2,"sawtooth",.1],[150,0,.2,"square",.05]],
 combo:[[880,0,.06,"sine",.12],[1175,.06,.06,"sine",.12],[1480,.12,.12,"sine",.13]], level:[[523,0,.12,"triangle",.14],[659,.12,.12,"triangle",.14],[784,.24,.12,"triangle",.14],[1046,.36,.3,"triangle",.15]],
 win:[[523,0,.15,"triangle",.13],[659,.15,.15,"triangle",.13],[784,.3,.15,"triangle",.13],[1046,.45,.45,"triangle",.14]], fail:[[392,0,.2,"triangle",.12],[349,.2,.2,"triangle",.12],[294,.4,.45,"triangle",.12]],
 tick:[[1200,0,.05,"square",.05]], warn:[[1000,0,.08,"square",.08],[1000,.14,.08,"square",.08]], flip:[[500,0,.1,"sine",.05]], badge:[[1319,0,.07,"sine",.12],[1760,.07,.07,"sine",.12],[2217,.14,.18,"sine",.13]],
 streak:[[440,0,.35,"triangle",.1],[880,.12,.2,"sine",.08]], swipe:[[700,0,.06,"sine",.04]] };
function audioUnlock(){ try{ if(!actx)actx=new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==="suspended")actx.resume(); }catch(e){} }
document.addEventListener("pointerdown",audioUnlock,{passive:true}); document.addEventListener("touchstart",audioUnlock,{passive:true});
function sfx(kind){ if(!S.settings.sound)return; const vol=(S.settings.vol==null?2:S.settings.vol)/3; if(vol<=0)return;
 try{ if(NATIVE&&window.Android.play&&window.Android.play(kind,vol))return; }catch(e){}
 try{ audioUnlock(); const t=actx.currentTime; (SFX[kind]||SFX.tap).forEach(([f,d,len,type,g])=>{const o=actx.createOscillator(),gn=actx.createGain();o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(.0001,t+d);gn.gain.exponentialRampToValueAtTime(g*vol*1.5,t+d+.01);gn.gain.exponentialRampToValueAtTime(.0001,t+d+len);o.connect(gn);gn.connect(actx.destination);o.start(t+d);o.stop(t+d+len+.02);}); }catch(e){} }
function haptic(kind){ if(!S.settings.vib)return; try{ if(NATIVE&&window.Android.haptic){window.Android.haptic(kind);return;} const p=kind==="tick"?8:kind==="heavy"?45:kind==="double"?[30,40,30]:18; navigator.vibrate&&navigator.vibrate(p);}catch(e){} }
function buzz(p){ if(!S.settings.vib)return; try{ if(NATIVE&&window.Android.vibrate){window.Android.vibrate(JSON.stringify(p));return;} navigator.vibrate&&navigator.vibrate(p);}catch(e){} }
function fxOk(){ sfx("ok"); haptic("click"); }
function fxNo(){ sfx("no"); haptic("double"); }
function fxBig(kind){ sfx(kind||"level"); buzz([40,60,40,60,120]); }
function floatXp(n){const d=document.createElement("div");d.className="xpfloat";d.textContent="+"+n+" XP";document.body.appendChild(d);setTimeout(()=>d.remove(),1000);}
function toast(msg){const d=document.createElement("div");d.className="toast";d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2600);}
function confetti(){ if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return; const c=$("#fx"); const x=c.getContext("2d"); const W=c.width=innerWidth,H=c.height=innerHeight; const cols=["#f0532d","#ffc63f","#33d6a0","#7aa5ff","#e0457b","#6d5efc"];
 const P=Array.from({length:130},()=>({x:W/2+(Math.random()-.5)*60,y:H*.35,vx:(Math.random()-.5)*9,vy:-Math.random()*9-3,r:Math.random()*6+3,c:cols[Math.floor(Math.random()*cols.length)],a:Math.random()*6}));
 let f=0; (function tick(){x.clearRect(0,0,W,H);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.28;p.a+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6);x.restore();});f++; if(f<90)requestAnimationFrame(tick);else x.clearRect(0,0,W,H);})(); }

// ---------- routing ----------
let view={name:"home"}; let sess=null; let timerI=null;
function go(name,params){ clearInterval(timerI); view=Object.assign({name},params||{}); render(); window.scrollTo(0,0); }
function rerender(){render();}
const nav=$("#nav");
nav.addEventListener("click",e=>{const b=e.target.closest("button[data-tab]");if(!b)return; sfx("tap"); haptic("tick"); if(sess&&sess.live&&!confirmLeave())return; sess=null; go(b.dataset.tab);});
function confirmLeave(){ return true; }
function setNav(){const hide=["quiz","mock","drive","lesson","order","sort","match","flash","speed"]; nav.hidden=hide.indexOf(view.name)>=0; nav.querySelectorAll("button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===view.name?"page":"false"));}
function top(title,opts){opts=opts||{};return '<div class="top">'+(opts.back?'<button class="iconbtn" data-act="'+(opts.backAct||"back")+'" aria-label="Back">'+(opts.closeIcon?ICON.close:ICON.back)+'</button>':'')+'<h1>'+esc(title)+'</h1>'+(opts.right||"")+'</div>';}

const VIEWS={home:vHome,learn:vLearn,module:vModule,lesson:vLesson,practice:vPractice,stats:vStats,settings:vSettings,quiz:vQuiz,quizEnd:vQuizEnd,mock:vMock,mockEnd:vMockEnd,drive:vDrive,driveEnd:vDriveEnd,order:vOrder,match:vMatch,sort:vSort,flash:vFlash,drillEnd:vDrillEnd,pickDrill:vPickDrill,
 papers:vPapers,paperIntro:vPaperIntro,guide:vGuide,plan:vPlan,aids:vAids,glossary:vGlossary,qrg:vQrg,products:vProducts,speed:vSpeed,speedEnd:vSpeedEnd};
function render(){ setNav(); let h=""; try{ h=(VIEWS[view.name]||vHome)(); }catch(err){ console.error(err); view={name:"home"}; sess=null; h=vHome(); }
 app.innerHTML='<div class="wrap">'+h+'</div>'; afterRender(); }
function afterRender(){ clearInterval(timerI); const live=view.name==="mock"||view.name==="drive"||view.name==="speed"; if(live){ tickTimer(); timerI=setInterval(tickTimer,view.name==="speed"?250:1000);} keepAwake(view.name==="mock"||view.name==="drive"); }

// ---------- HOME ----------
function examDays(){ try{ return dayNum(new Date(S.settings.exam+"T12:00:00").getTime())-today(); }catch(e){ return 0; } }
function ringSvg(v,max,col){const r=36,c=2*Math.PI*r,p=clamp(v/max,0,1);return '<svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="'+r+'" fill="none" style="stroke:var(--surface2)" stroke-width="9"/><circle cx="42" cy="42" r="'+r+'" fill="none" style="stroke:'+col+'" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+(c*p)+' '+c+'" transform="rotate(-90 42 42)"/><text x="42" y="40" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" style="fill:var(--ink)">'+Math.round(p*100)+'%</text><text x="42" y="56" text-anchor="middle" font-size="10" style="fill:var(--muted)">daily goal</text></svg>';}
function vHome(){
 const lv=levelOf(S.xp), cur=lvlXp(lv), nxt=lv<LEVELS.length-1?lvlXp(lv+1):cur+1, pr=clamp((S.xp-cur)/(nxt-cur),0,1);
 const k=dayKey(today()), tx=S.daily[k]||0, days=examDays(), pred=predicted(), due=dueIds().length, mis=mistakeIds().length;
 const seen=QL.filter(q=>S.items[q.id]).length;
 const predR=Math.round(pred*10)/10; const col=pred>=C.ok?"var(--good)":pred>=C.border?"var(--gold)":"var(--bad)"; const live=loadLive();
 let heat=""; for(let i=13;i>=0;i--){const x=S.daily[dayKey(today()-i)]||0; const a=x?clamp(.25+x/S.settings.goal*.75,.25,1):0; heat+='<i title="'+dayKey(today()-i)+': '+x+' XP" style="'+(a?'background:color-mix(in srgb,var(--accent) '+Math.round(a*100)+'%,var(--surface2))':'')+'"></i>';}
 const mods=MODULES.map(m=>{const s=modStats(m.id);return '<button class="modrow" data-act="openModule" data-id="'+m.id+'"><span class="dot" style="background:'+m.color+'">'+m.n+'</span><span style="min-width:0"><b style="font-size:15px">'+esc(m.short)+'</b><div class="bar" style="margin-top:6px"><i style="width:'+s.pct+'%;background:'+m.color+'"></i></div></span><span class="num small">'+s.pct+'%</span></button>';}).join("");
 return top(C.title,{right:'<button class="iconbtn" data-act="settings" aria-label="Settings">'+ICON.gear+'</button>'})+
 '<div class="stack">'+courseSwitch()+(live?liveBanner(live):'')+
 '<section class="hero"><div class="row" style="justify-content:space-between;align-items:flex-end"><div><div class="label" style="color:inherit;opacity:.7">Exam · '+esc(fmtDate(S.settings.exam))+(C.examTime?' · '+esc(C.examTime):'')+'</div><div class="k">'+(days>0?days+' days':days===0?'Today!':'Done')+'</div><div class="sub">'+NQ+' questions · '+MOCKMIN+' min · pass '+PASS+'/'+NQ+'</div></div><div style="text-align:right"><div class="chip" style="background:var(--accent);color:var(--accent-ink)">'+ICON.flame.replace('<svg','<svg width="16" height="16"')+' '+streakNow()+' day streak</div></div></div>'+
 '<div class="grid3"><div class="stat"><b>'+S.xp+'</b><span>XP total</span></div><div class="stat"><b>Lv '+(lv+1)+'</b><span>'+esc(LEVELS[lv])+'</span></div><div class="stat"><b>'+seen+'/'+QL.length+'</b><span>questions seen</span></div></div>'+
 '<div><div class="row" style="justify-content:space-between;font-size:12px;opacity:.8"><span>Level '+(lv+1)+' → '+(lv+2<=LEVELS.length?esc(LEVELS[Math.min(lv+1,LEVELS.length-1)]):"max")+'</span><span class="num">'+(S.xp-cur)+' / '+(nxt-cur)+'</span></div><div class="bar" style="background:color-mix(in srgb,var(--bg) 20%,transparent);margin-top:6px"><i style="width:'+(pr*100)+'%;background:var(--gold)"></i></div></div></section>'+
 planCard()+
 '<section class="card row" style="gap:14px">'+ringSvg(tx,S.settings.goal,"var(--accent)")+'<div class="stack" style="gap:6px;flex:1;min-width:0"><b>'+tx+' / '+S.settings.goal+' XP today</b><div class="heat">'+heat+'</div><span class="small muted">Last 14 days. 100 XP keeps the streak alive.</span></div></section>'+
 '<button class="btn" data-act="smart" style="min-height:62px;font-size:19px">'+ICON.bolt.replace('<svg','<svg width="22" height="22"')+' Start smart session</button>'+
 '<div class="small muted" style="margin-top:-4px;text-align:center">'+(due?due+' due for review · ':'')+'mistakes come back until you get them right</div>'+
 '<section class="card readiness"><div class="row" style="justify-content:space-between"><span class="label">Exam readiness</span><span class="chip" style="color:'+col+'">'+(pred>=C.ok?"On track":pred>=C.border?"Borderline":"Not yet")+'</span></div>'+
 '<div class="row" style="align-items:baseline;gap:6px"><span class="num" style="font-size:34px;font-weight:700;color:'+col+'">'+predR+'</span><span class="muted">/ '+NQ+' predicted score</span></div>'+
 '<div class="scale"><span class="pin" style="left:'+(pred/NQ*100)+'%"></span><span class="pass" style="left:'+(PASS/NQ*100)+'%">pass '+PASS+'</span></div><div class="small muted" style="margin-top:14px">'+simLine()+'Unseen questions count as a 25% guess. Aim for '+C.aim+'+ in simulations so you have margin on the day.</div></section>'+
 '<div class="tiles">'+
 tile("papers","exam","Exam simulations",(PAPERS.length?PAPERS.length+" full papers · ":"")+"real exam rules","#2b63d6")+
 tile("mistakes","redo","Mistakes ("+mis+")","Drill what you got wrong","#d8303f")+
 tile("weak","target","Weak spots","Your 3 weakest lessons","#e0457b")+
 tile("speed","timer","Speed round","60 s true or false sprint","#f0532d")+
 tile("traps","split","Exam traps","Concepts people mix up","#7b3fe4")+
 tile("drive","car","Driving-School mode","26 Q · 30 min · out at 5 wrong","#0b9a72")+
 '</div>'+otherCourseCard()+
 '<section class="card"><div class="row" style="justify-content:space-between;margin-bottom:4px"><span class="label">Modules</span><button class="chip" data-act="tab" data-id="learn" style="border:0">Open Learn</button></div>'+mods+'</section>'+
 '</div>';
}
function tile(act,ic,t,s,c){return '<button class="tile" data-act="'+act+'"><span class="ic" style="background:'+c+'">'+ICON[ic]+'</span><b>'+esc(t)+'</b><span>'+esc(s)+'</span></button>';}
function fmtDate(s){try{return new Date(s+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});}catch(e){return s;}}

// ---------- LEARN ----------
function vLearn(){
 return top("Learn")+'<div class="stack"><p class="muted" style="margin:0">The official course, slide by slide. Each lesson ends with a short check, because answering is how you remember.</p>'+
 '<div class="tiles">'+tile("guide","compass","Exam guide","Format, question styles, tactics","#2b63d6")+tile("plan","list","Study plan","Day by day until the exam","#0b9a72")+tile("glossary","book","Glossary A-Z","Every official definition","#c98a00")+tile("aids","bulb","Memory aids","A hook for every list","#7b3fe4")+((window.QRG||[]).length?tile("qrg","sheet","Quick reference","Official revision guide","#d8303f"):"")+(PRODUCTS.length?tile("products","cards","Management products","Purpose, author, timing","#0e8fb8"):"")+'</div>'+
 MODULES.map(m=>{const done=m.lessons.filter(l=>S.lessons[l.id]).length;const s=modStats(m.id);return '<button class="card" data-act="openModule" data-id="'+m.id+'" style="text-align:left;display:grid;gap:10px;border-left:6px solid '+m.color+'"><div class="row" style="justify-content:space-between"><span class="label" style="color:'+m.color+'">Module '+m.n+' · '+esc(m.syl)+'</span><span class="chip">'+done+'/'+m.lessons.length+' lessons</span></div><h2 style="font-size:19px">'+esc(m.title)+'</h2><div class="row"><div class="bar" style="flex:1"><i style="width:'+s.pct+'%;background:'+m.color+'"></i></div><span class="num small">'+s.pct+'% mastered</span></div></button>';}).join("")+'</div>';
}
function vModule(){const m=MODS[view.id]; const s=modStats(m.id);
 return top("Module "+m.n,{back:true,backAct:"tab",right:""}).replace('data-act="tab"','data-act="tab" data-id="learn"')+
 '<div class="stack" style="--mc:'+m.color+'"><div class="card" style="border-top:6px solid '+m.color+'"><h2 style="font-size:22px">'+esc(m.title)+'</h2><div class="small muted" style="margin-top:4px">'+esc(m.syl)+' · '+s.n+' questions · '+s.pct+'% mastered</div>'+
 '<div class="label" style="margin-top:14px">By the end you will be able to</div><ul style="margin:6px 0 0;padding-left:20px;display:grid;gap:4px">'+m.goals.map(g=>'<li>'+esc(g)+'</li>').join("")+'</ul></div>'+
 '<div class="card">'+m.lessons.map((l,i)=>{const on=!!S.lessons[l.id];const qn=QL.filter(q=>q.l===l.id).length;return '<button class="lesson-item" data-act="openLesson" data-id="'+l.id+'"><span class="check '+(on?"on":"")+'">'+(on?"✓":"")+'</span><span style="min-width:0"><b>'+esc(l.t)+'</b><div class="small muted">'+l.cards.length+' slides · '+qn+' questions</div></span><span class="muted">›</span></button>';}).join("")+'</div>'+
 '<button class="btn" data-act="quizModule" data-id="'+m.id+'">Quiz this module (15)</button>'+
 '<button class="btn ghost" data-act="flashModule" data-id="'+m.id+'">Flashcards for this module</button></div>';
}
function figHtml(src,cap){ return '<figure class="slide" data-act="zoom" data-src="'+esc(src)+'"><img src="'+esc(src)+'" alt="'+esc(cap||"Course figure")+'" loading="lazy"><figcaption>'+(cap?esc(cap)+' · ':'')+'tap to zoom</figcaption></figure>'; }
function renderCard(c,mc){let h='<article class="lcard" style="--mc:'+mc+'"><h2>'+esc(c.h)+'</h2>'+(c.imgs||[]).map(x=>figHtml(x.src,x.cap)).join("");
 (c.d||[]).forEach(([t,d])=>{h+='<div class="def"><b style="color:'+mc+'">'+esc(t)+'</b><span>'+esc(d)+'</span></div>';});
 (c.p||[]).forEach(p=>{h+='<p>'+esc(p)+'</p>';});
 if(c.li)h+='<ul>'+c.li.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>';
 if(c.steps)h+='<ol class="steps">'+c.steps.map(x=>'<li><span>'+esc(x)+'</span></li>').join("")+'</ol>';
 if(c.tb){const wide=c.tb.head.length>=4;h+='<div class="tbl'+(wide?" wide":"")+'"><table><thead><tr>'+c.tb.head.map(x=>'<th>'+esc(x)+'</th>').join("")+'</tr></thead><tbody>'+c.tb.rows.map(r=>'<tr>'+r.map(x=>'<td'+((x==="E"||x==="S")?' class="'+x+'"':"")+'>'+esc(x)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>';}
 if(c.q)h+=c.q.split("\n\n").map(t=>{const m=t.match(/^(\w+):\s*([\s\S]*)$/);return m?'<div class="bubble"><b>'+esc(m[1])+'</b><span>'+esc(m[2])+'</span></div>':'<div class="bubble"><span>'+esc(t)+'</span></div>';}).join("");
 if(c.n)h+='<div class="note">'+esc(c.n)+'</div>';
 if(c.fig)h+='<div class="fig">'+esc(c.fig)+'</div>';
 if(c.nt&&c.nt.length)h+='<details class="wbnotes"'+(S.settings.notesOpen?' open':'')+'><summary>Official notes · '+c.nt.length+' paragraph'+(c.nt.length>1?'s':'')+'</summary>'+c.nt.map(x=>'<p>'+esc(x)+'</p>').join("")+'</details>';
 if(c.book)h+='<div class="websrc">Added from: '+esc(c.src)+'</div>';
 if(c.web)h+='<div class="websrc">Added from an official web source'+(c.src?': '+esc(c.src.replace(/^https?:\/\//,"").split("/")[0]):'')+'</div>';
 return h+'</article>';}
function vLesson(){const {l,m}=LESS[view.id]; const i=view.i||0; const c=l.cards[i]; const last=i===l.cards.length-1;
 S.cardsRead[l.id+":"+i]=1;
 return top(l.t,{back:true,backAct:"openModule"}).replace('data-act="openModule"','data-act="openModule" data-id="'+m.id+'"')+
 '<div class="stack"><div class="row" style="justify-content:space-between"><span class="label" style="color:'+m.color+'">Module '+m.n+' · slide '+(i+1)+' of '+l.cards.length+'</span><div class="dots" style="--mc:'+m.color+'">'+l.cards.map((_,j)=>'<i class="'+(j<=i?"on":"")+'"></i>').join("")+'</div></div>'+
 renderCard(c,m.color)+
 '<div class="sticky-actions"><div class="row">'+(i>0?'<button class="btn ghost" data-act="lessonNav" data-d="-1" style="flex:1">Back</button>':'')+
 (last?'<button class="btn" data-act="lessonCheck" style="flex:2">Check yourself</button>':'<button class="btn" data-act="lessonNav" data-d="1" style="flex:2">Next slide</button>')+'</div></div></div>';
}

// ---------- PRACTICE ----------
function vPractice(){
 const mf=view.mf||"";
 return top("Practice")+'<div class="stack">'+
 '<div class="card stack" style="gap:8px"><span class="label">Focus</span><div class="seg">'+'<button data-act="mf" data-id="" aria-pressed="'+(!mf)+'">All modules</button>'+MODULES.map(m=>'<button data-act="mf" data-id="'+m.id+'" aria-pressed="'+(mf===m.id)+'">'+esc(m.n+" "+m.short)+'</button>').join("")+'</div></div>'+
 '<div class="tiles">'+
 tile("smart","bolt","Smart session","Due reviews + new questions","#f0532d")+
 tile("quick","bolt","Quick quiz","10 random questions","#e0457b")+
 tile("papers","exam","Exam simulations",(PAPERS.length?PAPERS.length+" fixed papers · ":"")+"real rules","#2b63d6")+
 tile("mock","exam",C.short+" Mock exam",NQ+" Q · "+MOCKMIN+" min · random blueprint","#3d4fb8")+
 tile("drive","car","Driving-School mode","26 Q · 30 min · 3 options · instant","#0b9a72")+
 tile("mistakes","redo","Mistakes","Wrong answers until mastered","#d8303f")+
 tile("weak","target","Weak spots","Your 3 weakest lessons","#c2185b")+
 tile("speed","timer","Speed round","60 s true or false sprint","#f57c00")+
 tile("traps","split","Exam traps","Concepts people mix up","#7b3fe4")+
 tile("aids","bulb","Memory aids","Hooks, then test the order","#8e44ad")+
 tile("flash","cards","Flashcards","Term ↔ official definition","#c98a00")+
 tile("drills","seq","Sequences","Put workflows and models in order","#5b3fd4")+
 tile("sorts","sort","Sort it","Drop each item in the right group","#0e8fb8")+
 tile("matches","match","Match it","Pair terms, purposes, outputs","#1f9d8b")+
 (C.gen?tile("gen","seq","Practice lists","Enabling vs supporting practices","#4a5a78"):"")+
 '</div><p class="small muted" style="margin:0">Driving-School mode copies the Romanian DRPCIV test: you see right or wrong straight away, you can push a question to the end with "Answer later", and the test stops as soon as you reach 5 mistakes.</p></div>';
}
function listFor(k){return k==="order"?ORDERS:k==="match"?MATCHES:k==="trap"?TRAPL:k==="mnem"?MNL:SORTS;}
function vPickDrill(){const kind=view.kind; const mf=view.mf||""; const L=listFor(kind);
 const list=L.filter(x=>!mf||x.m===mf);
 const title=kind==="order"?"Sequences":kind==="match"?"Match it":kind==="trap"?"Exam traps":"Sort it";
 return top(title,{back:true,backAct:"tab"}).replace('data-act="tab"','data-act="tab" data-id="practice"')+'<div class="stack">'+
 '<button class="btn" data-act="drillRandom" data-kind="'+kind+'">Play a random one</button>'+
 (kind==="trap"?'<p class="small muted" style="margin:0">Each trap is a pair of concepts that exam questions like to swap. Sort every statement to the side it belongs to. The key difference is shown at the end.</p>':'')+
 list.map(x=>{const it=S.items[x.id];const st=it?(it.b>=2?"✓ solid":it.c?"done":"retry"):"new";const m=MODS[x.m];return '<button class="card row" data-act="drill" data-kind="'+kind+'" data-id="'+x.id+'" style="text-align:left;justify-content:space-between"><span style="min-width:0"><span class="label" style="color:'+m.color+'">'+esc(m.short)+'</span><div><b>'+esc(x.t)+'</b></div></span><span class="chip">'+st+'</span></button>';}).join("")+'</div>';}

// ---------- QUIZ (instant feedback) ----------
function startQuiz(ids,title,opts){ opts=opts||{}; if(!ids.length){toast("Nothing to practise here yet. Try a quick quiz.");return;}
 sess={kind:"quiz",title,queue:ids.slice(),i:0,log:[],combo:0,xp:0,ok:0,no:0,answered:false,choice:null,order:null,rq:{},lesson:opts.lesson||null,live:true,unsure:false,lucky:0};
 prepQ(); go("quiz"); }
function prepQ(){const q=Q[sess.queue[sess.i]]; sess.order=q.ty==="list"?fixedOrder(q):shuffle(q.opts.map((_,i)=>i)); sess.answered=false; sess.choice=null; sess.unsure=false;}
function vQuiz(){const q=Q[sess.queue[sess.i]]; const m=MODS[q.m]; const n=sess.queue.length; const pct=(sess.i)/n*100;
 let h=top(sess.title,{back:true,backAct:"quit",closeIcon:true,right:'<span class="chip combo">'+(sess.combo>1?"x"+sess.combo+" combo":"")+'</span>'})+
 '<div class="stack"><div class="qhead"><span class="num small">'+(sess.i+1)+'/'+n+'</span><div class="bar"><i style="width:'+pct+'%"></i></div><span class="chip" style="color:var(--good)">'+sess.ok+'</span><span class="chip" style="color:var(--bad)">'+sess.no+'</span></div>'+
 '<div class="qcard stack" id="qc"><span class="label" style="color:'+m.color+'">Module '+m.n+' · '+esc(LESS[q.l]?LESS[q.l].l.t:m.short)+(q.of?' · <span class="ofb">Official</span>':'')+(sess.rq[q.id]?' · <span style="color:var(--bad)">retry</span>':'')+'</span><div class="qtext">'+esc(q.q)+'</div></div>'+(!sess.answered?'<div class="row" style="justify-content:flex-end;margin:-4px 0"><button class="chip unsure" data-act="unsure" aria-pressed="'+sess.unsure+'">'+(sess.unsure?"🤔 Not sure: marked":"🤔 Not sure?")+'</button></div>':'')+'<div class="opts">';
 sess.order.forEach((oi,k)=>{const o=q.opts[oi]; let cls="opt"; let why="";
  if(sess.answered){ if(o.ok)cls+=" ok"; else if(oi===sess.choice){cls+=" no"; why=o.why;} else cls+=" dim"; }
  h+='<button class="'+cls+'" data-act="pick" data-oi="'+oi+'" '+(sess.answered?'disabled':'')+'><span class="lt">'+LETTERS[k]+'</span><span>'+esc(o.t)+'</span>'+(why?'<span class="why">Why not: '+esc(why)+'</span>':'')+'</button>';});
 h+='</div>';
 if(sess.answered){const ok=q.opts[sess.choice].ok; h+='<div class="fb '+(ok?"ok":"no")+'"><h3>'+(ok?(sess.unsure?"Correct, but a guess":pickPraise()):"Not quite. The answer is "+LETTERS[sess.order.indexOf(0)]+".")+'</h3>'+(ok&&sess.unsure?'<div class="small">Lucky guesses are not knowledge yet, so this one comes back tomorrow.</div>':'')+'<div class="official"><b>Why:</b> '+esc(q.e)+'</div>'+(q.img?'<details class="qfig" open><summary>The figure from the course</summary>'+figHtml(q.img,"")+'</details>':'')+(!ok?'<div class="small muted">This question will come back in a few turns.</div>':'')+'</div>'+
  '<div class="sticky-actions"><button class="btn" data-act="nextQ">'+(sess.i+1>=sess.queue.length?"See results":"Next question")+'</button></div>';}
 return h+'</div>';}
const PRAISE=["Correct!","Nailed it.","Spot on!","Exactly right.","That's it!","Yes!","Clean answer."];
function pickPraise(){return PRAISE[Math.floor(Math.random()*PRAISE.length)];}
function answerQuiz(oi){ if(sess.answered)return; const q=Q[sess.queue[sess.i]]; const ok=q.opts[oi].ok; sess.answered=true; sess.choice=oi;
 grade(q.id,ok,ok&&sess.unsure); sess.log.push({id:q.id,ok,choice:oi,u:sess.unsure});
 if(ok){sess.ok++;sess.combo++;S.best.combo=Math.max(S.best.combo,sess.combo); if(sess.unsure)sess.lucky++; const x=sess.unsure?6:10+Math.min(10,(sess.combo-1)*2); sess.xp+=x; addXp(x); if(sess.combo>=3&&sess.combo%3===0)sfx("combo"); else sfx("ok"); haptic("click");}
 else{sess.no++;sess.combo=0; sess.xp+=2; addXp(2,true); fxNo();
  const times=sess.rq[q.id]||0; if(times<3){sess.rq[q.id]=times+1; const pos=Math.min(sess.queue.length,sess.i+4); sess.queue.splice(pos,0,q.id);} }
 save(); render(); if(!ok){const c=$("#qc"); if(c)c.classList.add("shake");}
 setTimeout(()=>{const f=document.querySelector(".fb");if(f)f.scrollIntoView({behavior:"smooth",block:"nearest"});},60); }
function nextQ(){ sess.i++; if(sess.i>=sess.queue.length){ if(sess.lesson&&!S.lessons[sess.lesson]){S.lessons[sess.lesson]=Date.now(); addXp(15,true); toast("Lesson complete +15 XP"); sfx("badge");} sess.live=false; save(); go("quizEnd"); return;} prepQ(); render(); }
function vQuizEnd(){const n=sess.ok+sess.no; const acc=n?Math.round(sess.ok/n*100):0; const great=acc>=80; if(!sess.fx){sess.fx=1; if(great){setTimeout(()=>{confetti();fxBig("win");},200);} else sfx("badge");}
 const wrong=[...new Set(sess.log.filter(x=>!x.ok).map(x=>x.id))];
 return top("Session done",{back:true,backAct:"home",closeIcon:true})+'<div class="stack">'+
 '<div class="card" style="text-align:center;display:grid;gap:6px"><div class="num" style="font-size:44px;font-weight:700;color:'+(great?"var(--good)":acc>=65?"var(--gold)":"var(--bad)")+'">'+acc+'%</div><div>'+sess.ok+' right · '+sess.no+' wrong'+(sess.lucky?' · '+sess.lucky+' guessed':'')+' · <b style="color:var(--gold)">+'+sess.xp+' XP</b></div><div class="small muted">'+(great?"Strong session. These move up in your review boxes.":acc>=65?"Pass level. Review the misses below.":"Below pass level. The misses are now in your Mistakes deck.")+'</div></div>'+
 (wrong.length?'<div class="card stack"><span class="label">Review what you missed</span>'+wrong.map(id=>reviewBlock(Q[id],null)).join("")+'</div>':'')+
 '<button class="btn" data-act="'+(sess.lesson?"nextLesson":"smart")+'">'+(sess.lesson?"Next lesson":"Another smart session")+'</button><button class="btn ghost" data-act="home">Back to Today</button></div>';}
function reviewBlock(q,choice){ if(!q)return ""; const c=q.opts.find(o=>o.ok); const mine=choice!=null?q.opts[choice]:null;
 return '<div style="display:grid;gap:6px;padding:12px 0;border-bottom:1px solid var(--line)">'+(q.of?'<span class="ofb" style="justify-self:start">Official'+(q.syl?' · syllabus '+esc(q.syl):'')+'</span>':'')+'<b style="white-space:pre-line">'+esc(q.q)+'</b>'+(mine&&!mine.ok?'<div style="color:var(--bad)">✗ You: '+esc(mine.t)+(mine.why?'<div class="small muted">'+esc(mine.why)+'</div>':'')+'</div>':'')+'<div style="color:var(--good)">✓ '+esc(c.t)+'</div><div class="official small">'+esc(q.e)+'</div>'+(q.img?'<details class="qfig"><summary>The figure from the course</summary>'+figHtml(q.img,"")+'</details>':'')+'</div>';}

// ---------- MOCK EXAM ----------
function pickBlueprint(){let ids=[];Object.keys(BLUEPRINT).forEach(m=>{const pool=byMod(m); const hand=shuffle(pool.filter(q=>!q.g)), gen=shuffle(pool.filter(q=>q.g)); const take=hand.slice(0,BLUEPRINT[m]); if(gen.length&&take.length>1&&Math.random()<.5)take[take.length-1]=gen[0]; ids=ids.concat(take.map(q=>q.id));}); return shuffle(ids);}
function startMock(pid,extra){ const P=pid?PAPERS.find(p=>p.id===pid):null; const ids=P?P.ids.slice():pickBlueprint(); const mins=Math.round(MOCKMIN*(extra?1.25:1));
 sess={kind:"mock",paper:P?P.id:null,title:P?P.t:"Mock exam",ids,ans:{},flags:{},i:0,start:Date.now(),end:Date.now()+mins*60000,mins,order:{},tq:{},qt0:Date.now(),live:true,extra:!!extra};
 ids.forEach(id=>sess.order[id]=P?fixedOrder(Q[id]):(Q[id].ty==="list"?fixedOrder(Q[id]):shuffle(Q[id].opts.map((_,i)=>i)))); saveLive(); go("mock"); }
function fixedOrder(q){ const idx=q.opts.map((_,i)=>i); if(typeof q.pos==="number"&&q.opts.length===4){ const o=[1,2,3]; o.splice(q.pos,0,0); return o; } if(q.ty==="list") return idx.sort((a,b)=>q.opts[a].t.localeCompare(q.opts[b].t,"en",{numeric:true}));
 let h=parseInt(hash(q.id+"#"),36)||7; for(let i=idx.length-1;i>0;i--){ h=(Math.imul(h,1103515245)+12345)>>>0; const j=h%(i+1); const t=idx[i]; idx[i]=idx[j]; idx[j]=t; } return idx; }
function trackTime(){ if(!sess||sess.kind!=="mock")return; const id=sess.ids[sess.i]; const now=Date.now(); sess.tq[id]=(sess.tq[id]||0)+Math.max(0,now-(sess.qt0||now)); sess.qt0=now; }
function tickTimer(){ const el=$("#timer"); if(!sess||!el)return; const left=Math.max(0,sess.end-Date.now());
 if(sess.kind==="speed"){ el.textContent=Math.ceil(left/1000)+"s"; el.classList.toggle("warn",left<10000); if(left<=0){clearInterval(timerI); endSpeed();} return; }
 const mm=Math.floor(left/60000),ss=Math.floor(left%60000/1000); el.textContent=String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0"); el.classList.toggle("warn",left<5*60000); if(left<5*60000&&!sess.warned){sess.warned=1;sfx("warn");haptic("heavy");toast("5 minutes left");}
 if(left<=0){clearInterval(timerI); if(sess.kind==="mock")finishMock(true); else finishDrive("time");} }
function vMock(){const id=sess.ids[sess.i]; const q=Q[id]; const answered=Object.keys(sess.ans).length; const N=sess.ids.length;
 let h=top(sess.title||"Mock exam",{back:true,backAct:"quitMock",closeIcon:true,right:'<span class="timer" id="timer">'+(sess.mins||MOCKMIN)+':00</span>'})+'<div class="stack">'+
 '<div class="qhead"><span class="num small">Q '+(sess.i+1)+'/'+N+'</span><div class="bar"><i style="width:'+(answered/N*100)+'%;background:var(--info)"></i></div><span class="num small">'+answered+' answered</span></div>'+
 '<div class="qcard stack"><div class="row" style="justify-content:space-between"><span class="label">Question '+(sess.i+1)+'</span><button class="chip" data-act="flag" style="border:0;'+(sess.flags[id]?'background:var(--gold-bg);color:var(--gold)':'')+'">'+ICON.flag.replace('<svg','<svg width="14" height="14"')+(sess.flags[id]?" Flagged":" Flag")+'</button></div><div class="qtext">'+esc(q.q)+'</div></div><div class="opts">'+
 sess.order[id].map((oi,k)=>'<button class="opt'+(sess.ans[id]===oi?" sel":"")+'" data-act="mpick" data-oi="'+oi+'"><span class="lt">'+LETTERS[k]+'</span><span>'+esc(q.opts[oi].t)+'</span></button>').join("")+'</div>'+
 '<div class="row"><button class="btn ghost" data-act="mnav" data-d="-1" '+(sess.i===0?"disabled":"")+' style="flex:1">Previous</button><button class="btn" data-act="mnav" data-d="1" style="flex:1">'+(sess.i===N-1?"Review":"Next")+'</button></div>'+
 '<div class="card stack"><div class="row" style="justify-content:space-between"><span class="label">All questions</span><span class="small muted">blue = answered · gold ring = flagged</span></div><div class="qgrid">'+sess.ids.map((x,j)=>'<button data-act="mjump" data-i="'+j+'" class="'+(sess.ans[x]!=null?"a ":"")+(sess.flags[x]?"f ":"")+(j===sess.i?"cur":"")+'">'+(j+1)+'</button>').join("")+'</div>'+
 '<button class="btn" data-act="submitMock" style="background:var(--ink);color:var(--bg)">Submit exam</button></div>';
 if(sess.confirm)h+='<div class="sheet"><div class="card stack"><h3>Submit now?</h3><p class="muted" style="margin:0">'+(N-answered)+' unanswered'+(Object.keys(sess.flags).length?" · "+Object.keys(sess.flags).length+" flagged":"")+'. Unanswered questions count as wrong.</p><button class="btn" data-act="confirmSubmit">Submit and see my score</button><button class="btn ghost" data-act="cancelSubmit">Keep going</button></div></div>';
 if(sess.quit)h+='<div class="sheet"><div class="card stack"><h3>Leave the exam?</h3><p class="muted" style="margin:0">Pause keeps your answers and the clock keeps running, like the real exam. Leaving discards this attempt.</p><button class="btn" data-act="pauseMock">Pause and resume later</button><button class="btn" data-act="reallyQuit" style="background:var(--bad);color:#fff">Discard this attempt</button><button class="btn ghost" data-act="cancelQuit">Stay</button></div></div>';
 return h+'</div>';}
function finishMock(timeout){ trackTime(); let score=0; const mod={}; const ans=[]; const ty={}; const ar={};
 sess.ids.forEach(id=>{const q=Q[id]; const ch=sess.ans[id]; const ok=ch!=null&&q.opts[ch].ok; if(ok)score++; mod[q.m]=mod[q.m]||[0,0]; mod[q.m][1]++; if(ok)mod[q.m][0]++; const t=q.ty||"std"; ty[t]=ty[t]||[0,0]; ty[t][1]++; if(ok)ty[t][0]++; const ai=areaOf(q); if(ai>=0){ ar[ai]=ar[ai]||[0,0]; ar[ai][1]++; if(ok)ar[ai][0]++; } grade(id,ok); ans.push([id,ch==null?-1:ch,ok?1:0,Math.round((sess.tq[id]||0)/1000),sess.flags[id]?1:0]);});
 const rec={t:Date.now(),score,n:sess.ids.length,pass:score>=PASS,mins:Math.round((Date.now()-sess.start)/60000),limit:sess.mins||MOCKMIN,mod,ty,ar,ans,timeout:!!timeout,paper:sess.paper||null,extra:!!sess.extra}; clearLive();
 S.mocks.push(rec); S.best.mock=Math.max(S.best.mock,score); sess.live=false; sess.result=rec;
 addXp(50+score*5,true); save(); setTimeout(()=>{ if(rec.pass){confetti();fxBig("win");} else {sfx("fail");haptic("heavy");} },250); go("mockEnd"); }
function vMockEnd(){const r=sess.result; const filt=view.f||"wrong"; const N=r.n||NQ; const P=r.paper?PAPERS.find(p=>p.id===r.paper):null;
 const prow=(lab,c,t,dot)=>{const p=t?c/t:0; return '<div class="row" style="padding:6px 0">'+(dot||'')+'<span style="flex:1;min-width:0">'+esc(lab)+'</span><span class="num">'+c+'/'+t+'</span><div class="bar" style="width:70px"><i style="width:'+p*100+'%;background:'+(p>=PASS/NQ?"var(--good)":"var(--bad)")+'"></i></div></div>';};
 const modRows=Object.keys(BLUEPRINT).map(m=>{const v=r.mod[m]; if(!v||!v[1]||!MODS[m])return ""; return prow(MODS[m].short,v[0],v[1],'<span class="dot" style="background:'+MODS[m].color+';width:26px;height:26px;font-size:12px">'+MODS[m].n+'</span>');}).join("");
 const areaRows=(C.areas||[]).map((a,i)=>{let c=0,t=0; if(r.ar){ const v=r.ar[i]; if(v){c=v[0];t=v[1];} } else (a.m||[]).forEach(m=>{const v=r.mod[m]; if(v){c+=v[0];t+=v[1];}}); return t?prow(a.n+(a.w?" ("+a.w+"%)":""),c,t):"";}).join("");
 const tyRows=Object.keys(TYPES).map(k=>{const v=(r.ty||{})[k]; return v&&v[1]?prow(TYPES[k],v[0],v[1]):"";}).join("");
 const timed=r.ans.some(a=>a[3]); const tot=r.ans.reduce((x,a)=>x+(a[3]||0),0); const avg=Math.round(tot/N); const pace=Math.round(MOCKMIN*60/NQ);
 const slow=r.ans.filter(a=>a[3]).slice().sort((x,y)=>y[3]-x[3]).slice(0,3);
 const fl=r.ans.filter(a=>a[4]); const flOk=fl.filter(a=>a[2]).length;
 const fmtS=x=>x>=60?Math.floor(x/60)+"m "+(x%60)+"s":x+"s";
 const tips=[]; const pct=r.score/N;
 if(!r.pass){ let worst=null,wp=2; (C.areas||[]).forEach((a,i)=>{let c=0,t=0; if(r.ar){const v=r.ar[i]; if(v){c=v[0];t=v[1];}} else (a.m||[]).forEach(m=>{const v=r.mod[m]; if(v){c+=v[0];t+=v[1];}}); if(t>=2&&c/t<wp){wp=c/t;worst=a;}}); if(worst)tips.push("Below the pass mark. Your weakest area was "+worst.n+" ("+Math.round(wp*100)+"%). Start there with Weak spots."); }
 if(timed&&avg>pace*0.95)tips.push("Your pace ("+avg+" s per question) is at the limit of the real exam ("+pace+" s). Do a speed round daily and move on faster from hard questions.");
 const tn=(r.ty||{}).neg; if(tn&&tn[1]>=2&&tn[0]/tn[1]<.6)tips.push("Negative questions cost you marks. Underline NOT or EXCEPT, then look for the one option that is false.");
 const tl=(r.ty||{}).list; if(tl&&tl[1]>=2&&tl[0]/tl[1]<.6)tips.push("List questions: judge each numbered statement as true or false first, then pick the pair. Never pick a pair that contains a statement you know is false.");
 if(r.pass&&r.score<C.aim)tips.push("A pass, but with little margin. Aim for "+C.aim+"+ before exam day.");
 if(r.score>=C.aim)tips.push("Exam-ready score. Keep it there with reviews and one simulation every few days.");
 let list=r.ans.filter(a=>Q[a[0]]&&(filt==="all"||(filt==="flag"?a[4]:!a[2])));
 return top((P?P.t:"Mock")+" result",{back:true,backAct:"home",closeIcon:true})+'<div class="stack">'+
 '<div class="card" style="text-align:center;display:grid;gap:6px;border-top:6px solid '+(r.pass?"var(--good)":"var(--bad)")+'"><span class="label">'+(r.timeout?"Time is up · ":"")+r.mins+' of '+(r.limit||MOCKMIN)+' min'+(r.extra?" (extra time)":"")+'</span><div class="num" style="font-size:52px;font-weight:700;color:'+(r.pass?"var(--good)":"var(--bad)")+'">'+r.score+'/'+N+'</div><h2 style="color:'+(r.pass?"var(--good)":"var(--bad)")+'">'+(r.pass?"PASS":"FAIL")+'</h2><div class="small muted">'+Math.round(pct*100)+'% · pass mark '+C.pct+'% ('+PASS+'/'+NQ+')</div></div>'+
 (tips.length?'<div class="card stack"><span class="label">What to do next</span>'+tips.map(t=>'<div class="tipline">'+esc(t)+'</div>').join("")+'</div>':'')+
 (areaRows?'<div class="card"><span class="label">By syllabus area</span>'+areaRows+'</div>':'')+
 (tyRows?'<div class="card"><span class="label">By question type</span>'+tyRows+'</div>':'')+
 (timed?'<div class="card stack"><span class="label">Time</span><div class="row" style="gap:16px;flex-wrap:wrap"><div><b class="num" style="font-size:22px">'+fmtS(avg)+'</b><div class="small muted">average per question</div></div><div><b class="num" style="font-size:22px">'+fmtS(pace)+'</b><div class="small muted">real exam pace</div></div><div><b class="num" style="font-size:22px">'+fl.length+'</b><div class="small muted">flagged ('+flOk+' right)</div></div></div>'+
  (slow.length?'<div class="small muted">Slowest questions: '+slow.map(a=>'Q'+(r.ans.indexOf(a)+1)+' '+fmtS(a[3])+(a[2]?' ✓':' ✗')).join(" · ")+'</div>':'')+'</div>':'')+
 '<div class="card"><span class="label">By module</span>'+modRows+'</div>'+
 '<div class="card stack"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><span class="label">Answers</span><div class="seg"><button data-act="mf2" data-id="wrong" aria-pressed="'+(filt==="wrong")+'">Wrong</button><button data-act="mf2" data-id="flag" aria-pressed="'+(filt==="flag")+'">Flagged</button><button data-act="mf2" data-id="all" aria-pressed="'+(filt==="all")+'">All '+N+'</button></div></div>'+
 (list.length?list.map(a=>'<div class="small muted" style="margin-top:8px">Question '+(r.ans.indexOf(a)+1)+(a[3]?' · '+fmtS(a[3]):'')+'</div>'+reviewBlock(Q[a[0]],a[1]<0?null:a[1])+(a[1]<0?'<div class="small" style="color:var(--bad)">Not answered</div>':'')).join(""):'<p class="muted">Nothing to show here.</p>')+'</div>'+
 '<button class="btn" data-act="mistakes">Drill my mistakes</button><button class="btn ghost" data-act="papers">Another simulation</button></div>';}

// ---------- DRIVING-SCHOOL MODE (DRPCIV style) ----------
function startDrive(){ const all=shuffle(QL.filter(q=>!q.g)); const per={}; const ids=[]; // spread across modules
 const mods=Object.keys(BLUEPRINT); let k=0; while(ids.length<26&&k<2000){const m=mods[k%mods.length]; const q=all.find(x=>x.m===m&&ids.indexOf(x.id)<0); if(q)ids.push(q.id); k++;}
 sess={kind:"drive",queue:shuffle(ids),ok:0,no:0,i:0,start:Date.now(),end:Date.now()+30*60000,opts:{},choice:null,shown:false,live:true,done:[]};
 sess.queue.forEach(id=>{const q=Q[id]; const wrong=shuffle(q.opts.map((_,i)=>i).filter(i=>!q.opts[i].ok)).slice(0,2); sess.opts[id]=shuffle([0].concat(wrong));});
 go("drive"); }
function vDrive(){const id=sess.queue[sess.i]; const q=Q[id]; const remaining=sess.queue.length-sess.i;
 let h=top("Driving-School mode",{back:true,backAct:"quitDrive",closeIcon:true,right:'<span class="timer" id="timer">30:00</span>'})+'<div class="stack">'+
 '<div class="dpanel"><div><b>26</b><span>Total</span></div><div><b>'+remaining+'</b><span>Left</span></div><div class="g"><b>'+sess.ok+'</b><span>Right</span></div><div class="r"><b>'+sess.no+'</b><span>Wrong</span></div></div>'+
 '<div class="qcard stack"><span class="label">'+esc(MODS[q.m].short)+'</span><div class="qtext">'+esc(q.q)+'</div></div><div class="opts">';
 sess.opts[id].forEach((oi,k)=>{let cls="opt"; if(sess.shown){ if(q.opts[oi].ok)cls+=" ok"; else if(oi===sess.choice)cls+=" no"; else cls+=" dim"; } else if(oi===sess.choice)cls+=" sel";
  h+='<button class="'+cls+'" data-act="dpick" data-oi="'+oi+'" '+(sess.shown?"disabled":"")+'><span class="lt">'+LETTERS[k]+'</span><span>'+esc(q.opts[oi].t)+'</span>'+(sess.shown&&oi===sess.choice&&!q.opts[oi].ok&&q.opts[oi].why?'<span class="why">'+esc(q.opts[oi].why)+'</span>':'')+'</button>';});
 h+='</div>';
 if(!sess.shown) h+='<div class="sticky-actions"><div class="row"><button class="btn ghost" data-act="dlater" style="flex:1" '+(remaining<=1?"disabled":"")+'>Answer later</button><button class="btn" data-act="dsubmit" style="flex:1" '+(sess.choice==null?"disabled":"")+'>Submit answer</button></div></div>';
 else { const ok=q.opts[sess.choice].ok; h+='<div class="fb '+(ok?"ok":"no")+'"><h3>'+(ok?"Correct":"Wrong · "+sess.no+" of 5")+'</h3><div class="official small">'+esc(q.e)+'</div></div><div class="sticky-actions"><button class="btn" data-act="dnext">Next question</button></div>'; }
 return h+'</div>';}
function finishDrive(reason){ const pass=reason==="pass"; const rec={t:Date.now(),correct:sess.ok,wrong:sess.no,pass,reason,mins:Math.round((Date.now()-sess.start)/60000)}; S.drives.push(rec); sess.live=false; sess.result=rec; addXp(pass?40:10,true); save(); setTimeout(()=>{ if(pass){confetti();fxBig("win");} else {sfx("fail");haptic("heavy");} },250); go("driveEnd"); }
function vDriveEnd(){const r=sess.result;
 return top("Driving-School result",{back:true,backAct:"home",closeIcon:true})+'<div class="stack"><div class="card" style="text-align:center;display:grid;gap:8px;border-top:6px solid '+(r.pass?"var(--good)":"var(--bad)")+'"><h2 style="font-size:34px;color:'+(r.pass?"var(--good)":"var(--bad)")+'">'+(r.pass?"PASSED":"FAILED")+'</h2><div class="num" style="font-size:22px">'+r.correct+' right · '+r.wrong+' wrong</div><div class="small muted">'+(r.reason==="pass"?"You reached 22 correct answers.":r.reason==="fail"?"5 wrong answers end the test.":"Time ran out.")+' '+r.mins+' min.</div></div>'+
 (sess.done.filter(d=>!d.ok).length?'<div class="card stack"><span class="label">Your mistakes</span>'+sess.done.filter(d=>!d.ok).map(d=>reviewBlock(Q[d.id],d.choice)).join("")+'</div>':'')+
 '<button class="btn" data-act="drive">Try again</button><button class="btn ghost" data-act="home">Back to Today</button></div>';}

// ---------- DRILLS ----------
function startDrill(kind,id){ const src=kind; const d=listFor(kind).find(x=>x.id===id); if(!d)return;
 if(kind==="mnem")kind="order"; if(kind==="trap")kind="sort";
 if(kind==="order") sess={kind,src,d,left:shuffle(d.items.map((t,i)=>({t,i}))),next:0,miss:0,flash:null,live:true};
 if(kind==="sort"){ let items=d.items.slice(); if(d.sample)items=shuffle(items).slice(0,d.sample); sess={kind,src,d,items:shuffle(items),i:0,miss:0,ok:0,last:null,live:true}; }
 if(kind==="match") sess={kind,src,d,lefts:shuffle(d.pairs.map((p,i)=>({t:p[0],i}))),rights:shuffle(d.pairs.map((p,i)=>({t:p[1],i}))),sel:null,doneL:{},miss:0,bad:null,live:true};
 go(kind); }
function vOrder(){const d=sess.d; const m=MODS[d.m]; const placed=d.items.slice(0,sess.next);
 return top(sess.src==="mnem"?"Memory aid test":"Put in order",{back:true,backAct:"pickBack",closeIcon:true,right:'<span class="chip" style="color:var(--bad)">'+sess.miss+' miss</span>'})+'<div class="stack">'+
 '<div class="card"><span class="label" style="color:'+m.color+'">'+esc(m.short)+'</span><h2 style="font-size:19px;margin-top:4px">'+esc(d.t)+'</h2>'+(d.mn?'<div class="mnhook small">'+esc(d.mn)+'</div>':'')+'<div class="small muted" style="margin-top:4px">Tap the items in the correct order, starting with the first.</div></div>'+
 (placed.length?'<div class="seq">'+placed.map((t,i)=>'<div class="seqitem done"><span class="seqnum">'+(i+1)+'</span>'+esc(t)+'</div>').join("")+'</div>':'')+
 '<div class="seq">'+sess.left.filter(x=>x.i>=sess.next).map(x=>'<button class="seqitem'+(sess.flash===x.i?" no shake":"")+'" data-act="opick" data-i="'+x.i+'">'+esc(x.t)+'</button>').join("")+'</div></div>';}
function vSort(){const d=sess.d; const m=MODS[d.m]; const it=sess.items[sess.i];
 let h=top(d.trap?"Exam trap":"Sort it",{back:true,backAct:"pickBack",closeIcon:true,right:'<span class="num small">'+(sess.i+1)+'/'+sess.items.length+'</span>'})+'<div class="stack"><div class="card"><span class="label" style="color:'+m.color+'">'+esc(m.short)+'</span><h2 style="font-size:19px;margin-top:4px">'+esc(d.t)+'</h2></div>'+
 '<div class="flash" style="min-height:140px"><div class="t" style="font-size:22px">'+esc(it[0])+'</div></div><div class="buckets">';
 d.buckets.forEach(b=>{let cls="btn ghost"; let st=""; if(sess.last){ if(b===it[1])st="background:var(--good-bg);border-color:var(--good);color:var(--good)"; else if(b===sess.last.pick&&!sess.last.ok)st="background:var(--bad-bg);border-color:var(--bad);color:var(--bad)"; }
  h+='<button class="'+cls+'" style="'+st+'" data-act="spick" data-b="'+esc(b)+'" '+(sess.last?"disabled":"")+'>'+esc(b)+'</button>';});
 h+='</div>'; if(sess.last&&!sess.last.ok)h+='<div class="sticky-actions"><button class="btn" data-act="snext">Next</button></div>';
 return h+'</div>';}
function vMatch(){const d=sess.d; const m=MODS[d.m];
 let h=top("Match it",{back:true,backAct:"pickBack",closeIcon:true,right:'<span class="chip" style="color:var(--bad)">'+sess.miss+' miss</span>'})+'<div class="stack"><div class="card"><span class="label" style="color:'+m.color+'">'+esc(m.short)+'</span><h2 style="font-size:19px;margin-top:4px">'+esc(d.t)+'</h2><div class="small muted" style="margin-top:4px">Tap a term, then tap its match.</div></div>';
 h+='<div class="seg">'+sess.lefts.map(x=>{const done=sess.doneL[x.i];return '<button data-act="xl" data-i="'+x.i+'" aria-pressed="'+(sess.sel===x.i)+'" '+(done?'disabled style="background:var(--good-bg);border-color:var(--good);color:var(--good)"':'')+'>'+esc(x.t)+'</button>';}).join("")+'</div>';
 h+='<div class="seq">'+sess.rights.map(x=>{const done=sess.doneL[x.i];return '<button class="seqitem'+(done?" done":"")+(sess.bad===x.i?" no shake":"")+'" data-act="xr" data-i="'+x.i+'" '+(done?"disabled":"")+'>'+(done?'<span class="seqnum">✓ '+esc(d.pairs[x.i][0])+':</span> ':'')+esc(x.t)+'</button>';}).join("")+'</div>';
 return h+'</div>';}
function endDrill(perfect,score){ const id=sess.d.id; grade(id,perfect); const x=perfect?20:Math.max(5,score); addXp(x,true); save(); sess.res={perfect,x}; sess.live=false; if(perfect){confetti();fxBig("win");} else sfx("badge"); go("drillEnd"); }
function vDrillEnd(){const r=sess.res; const d=sess.d;
 let body='';
 if(sess.kind==="order")body='<div class="card stack"><span class="label">Correct order</span><ol class="steps">'+d.items.map(t=>'<li><span>'+esc(t)+'</span></li>').join("")+'</ol></div>';
 if(sess.kind==="match")body='<div class="card stack"><span class="label">All pairs</span>'+d.pairs.map(p=>'<div><b>'+esc(p[0])+'</b><div class="small muted">'+esc(p[1])+'</div></div>').join("")+'</div>';
 if(sess.kind==="sort")body='<div class="card"><span class="label">Score</span><div class="num" style="font-size:28px">'+sess.ok+'/'+sess.items.length+'</div></div>'+(d.trap?'<div class="card stack"><span class="label">Key difference</span><div class="note" style="font-weight:400">'+esc(d.tip)+'</div>'+d.buckets.map(bk=>'<div><b>'+esc(bk)+'</b><ul style="margin:4px 0 0;padding-left:20px">'+d.items.filter(it=>it[1]===bk).map(it=>'<li>'+esc(it[0])+'</li>').join("")+'</ul></div>').join("")+'</div>':'');
 if(sess.src==="mnem")body+='<div class="card stack"><span class="label">Memory hook</span><div class="mnhook">'+esc(d.mn)+'</div>'+(d.tip?'<div class="small muted">'+esc(d.tip)+'</div>':'')+'</div>';
 return top(r.perfect?"Perfect!":"Done",{back:true,backAct:"pickBack",closeIcon:true})+'<div class="stack"><div class="card" style="text-align:center"><h2 style="color:'+(r.perfect?"var(--good)":"var(--gold)")+'">'+(r.perfect?"No mistakes":"Mistakes: "+(sess.miss||0))+'</h2><div style="color:var(--gold);font-weight:700">+'+r.x+' XP</div></div>'+body+
 '<button class="btn" data-act="drill" data-kind="'+(sess.src||sess.kind)+'" data-id="'+d.id+'">Play again</button><button class="btn ghost" data-act="drillRandom" data-kind="'+(sess.src||sess.kind)+'">Another one</button></div>';}

// ---------- FLASHCARDS ----------
function startFlash(mod){ const t=today(); let deck=FLASH.filter(f=>!mod||f.m===mod); const due=deck.filter(f=>S.items[f.id]&&S.items[f.id].d<=t), nw=deck.filter(f=>!S.items[f.id]), rest=deck.filter(f=>S.items[f.id]&&S.items[f.id].d>t);
 deck=shuffle(due).concat(shuffle(nw)).concat(shuffle(rest)).slice(0,20); sess={kind:"flash",deck,i:0,flip:false,known:0,live:true,mod}; go("flash"); }
function vFlash(){ if(sess.i>=sess.deck.length){ return top("Flashcards",{back:true,backAct:"home",closeIcon:true})+'<div class="stack"><div class="card" style="text-align:center"><h2>Deck done</h2><p class="muted">'+sess.known+' of '+sess.deck.length+' known. Cards you missed come back sooner.</p></div><button class="btn" data-act="flash">New deck</button></div>'; }
 const f=sess.deck[sess.i]; const m=MODS[f.m];
 return top("Flashcards",{back:true,backAct:"home",closeIcon:true,right:'<span class="num small">'+(sess.i+1)+'/'+sess.deck.length+'</span>'})+'<div class="stack">'+
 '<button class="flash" data-act="flip" style="border-top:6px solid '+m.color+'">'+(sess.flip?'<div style="display:grid;gap:10px"><span class="label" style="color:'+m.color+'">'+esc(f.t)+'</span><div class="d">'+esc(f.d)+'</div></div>':'<div style="display:grid;gap:10px"><span class="label">'+esc(m.short)+'</span><div class="t">'+esc(f.t)+'</div><span class="small muted">Say the definition out loud, then tap to check</span></div>')+'</button>'+
 (sess.flip?'<div class="row"><button class="btn" data-act="fknow" data-k="0" style="flex:1;background:var(--bad);color:#fff">Again</button><button class="btn" data-act="fknow" data-k="1" style="flex:1;background:var(--good);color:#fff">Got it</button></div>':'<button class="btn soft" data-act="flip">Show definition</button>')+'</div>';}

// ---------- STATS ----------
function vStats(){ const pred=predicted(); const acc=S.tot.a?Math.round(S.tot.c/S.tot.a*100):0;
 const mocks=S.mocks.slice(-12); const W=320,H=120;
 const chart=mocks.length?('<svg viewBox="0 0 '+W+' '+(H+24)+'" width="100%" role="img" aria-label="Mock scores"><line x1="24" x2="'+W+'" y1="'+(H-PASS/NQ*H)+'" y2="'+(H-PASS/NQ*H)+'" style="stroke:var(--good)" stroke-dasharray="4 4"/><text x="0" y="'+(H-PASS/NQ*H+4)+'" font-size="10" style="fill:var(--muted)">'+PASS+'</text><text x="0" y="10" font-size="10" style="fill:var(--muted)">'+NQ+'</text><text x="0" y="'+H+'" font-size="10" style="fill:var(--muted)">0</text>'+
  mocks.map((r,i)=>{const bw=(W-30)/12; const x=26+i*bw; const h=r.score/(r.n||NQ)*H; return '<rect x="'+(x+3)+'" y="'+(H-h)+'" width="'+(bw-6)+'" height="'+h+'" rx="3" style="fill:'+(r.score>=PASS?"var(--good)":"var(--bad)")+'"/><text x="'+(x+bw/2)+'" y="'+(H-h-4)+'" text-anchor="middle" font-size="10" font-family="JetBrains Mono,monospace" style="fill:var(--ink)">'+r.score+'</text>';}).join("")+'<text x="26" y="'+(H+16)+'" font-size="10" style="fill:var(--muted)">last '+mocks.length+' mocks and simulations</text></svg>'):'<p class="muted" style="margin:0">No mock exams yet. Take one when you have read a few modules.</p>';
 const weak=MODULES.map(m=>({m,s:modStats(m.id)})).filter(x=>x.s.seen>0).sort((a,b)=>a.s.p-b.s.p).slice(0,3);
 return top("Progress")+'<div class="stack">'+
 '<div class="tiles"><div class="card"><span class="label">Predicted</span><div class="num" style="font-size:28px;font-weight:700">'+(Math.round(pred*10)/10)+'<span class="small muted">/'+NQ+'</span></div></div><div class="card"><span class="label">Accuracy</span><div class="num" style="font-size:28px;font-weight:700">'+acc+'%</div><span class="small muted">'+S.tot.c+' of '+S.tot.a+' answers</span></div><div class="card"><span class="label">Best mock</span><div class="num" style="font-size:28px;font-weight:700">'+(S.mocks.length?S.best.mock+'/'+NQ:'–')+'</div><span class="small muted">'+S.mocks.length+' taken</span></div><div class="card"><span class="label">Driving tests</span><div class="num" style="font-size:28px;font-weight:700">'+S.drives.filter(d=>d.pass).length+'/'+S.drives.length+'</div><span class="small muted">passed</span></div><div class="card"><span class="label">Speed round</span><div class="num" style="font-size:28px;font-weight:700">'+(S.best.speed||0)+'</div><span class="small muted">best · '+S.speed.length+' runs</span></div><div class="card"><span class="label">Lucky guesses</span><div class="num" style="font-size:28px;font-weight:700">'+Object.values(S.items).reduce((x,it)=>x+(it.u||0),0)+'</div><span class="small muted">marked "not sure"</span></div></div>'+
 '<div class="card stack"><span class="label">Mock exam scores</span>'+chart+'</div>'+
 (weak.length?'<div class="card stack"><span class="label">Weakest modules right now</span>'+weak.map(x=>'<button class="modrow" data-act="quizModule" data-id="'+x.m.id+'"><span class="dot" style="background:'+x.m.color+'">'+x.m.n+'</span><span><b>'+esc(x.m.short)+'</b><div class="small muted">'+Math.round(x.s.p*100)+'% expected · tap to drill</div></span><span class="muted">›</span></button>').join("")+'</div>':'')+
 '<div class="card"><span class="label">Mastery by module</span>'+MODULES.map(m=>{const s=modStats(m.id);return '<div class="modrow" style="cursor:default"><span class="dot" style="background:'+m.color+'">'+m.n+'</span><span style="min-width:0"><b style="font-size:15px">'+esc(m.short)+'</b><div class="small muted">'+s.seen+'/'+s.n+' seen · '+s.mast+' mastered'+(s.acc!=null?' · '+Math.round(s.acc*100)+'% right':'')+'</div><div class="bar" style="margin-top:4px"><i style="width:'+s.pct+'%;background:'+m.color+'"></i></div></span><span class="num small">'+s.pct+'%</span></div>';}).join("")+'</div>'+
 '<div class="card stack"><span class="label">Badges · '+Object.keys(S.badges).length+'/'+BADGES.length+'</span><div class="badges">'+BADGES.map(b=>'<div class="badge'+(S.badges[b.id]?" on":"")+'"><span class="m">'+(S.badges[b.id]?b.i:"·")+'</span>'+esc(b.t)+'</div>').join("")+'</div></div>'+
 '</div>';}

// ---------- SETTINGS ----------
const REM_TIMES=["07:30","08:30","10:00","12:30","15:00","18:00","20:30","22:00"];
function getRem(){ let r=null; try{ r=JSON.parse(rawGet("es-rem")||"null"); }catch(e){} r=r||{}; if(!Array.isArray(r.times))r.times=["08:30","13:00","20:30"].filter(t=>REM_TIMES.indexOf(t)>=0).concat(["12:30"]).slice(0,3); r.on=!!r.on; return r; }
function setRem(r){ rawSet("es-rem",JSON.stringify(r)); try{ if(NATIVE&&window.Android.setReminders)window.Android.setReminders(JSON.stringify({on:r.on,times:r.times.slice().sort()})); }catch(e){} }
function vSettings(){ const rem=getRem(); const th=rawGet("es-theme")||""; const bk=view.bk||""; let ver=""; try{ if(NATIVE)ver=JSON.parse(window.Android.info()).version; }catch(e){}
 return top("Settings",{back:true,backAct:"home"})+'<div class="stack">'+
 '<div class="card stack"><span class="label">Course</span>'+courseSwitch(true)+'<span class="small muted">Each course keeps its own progress, XP, streak and exam date. Switching never loses anything.</span></div>'+
 '<div class="card stack"><span class="label">Daily goal</span><div class="seg">'+[250,500,800,1200].map(g=>'<button data-act="goal" data-id="'+g+'" aria-pressed="'+(S.settings.goal===g)+'">'+g+' XP</button>').join("")+'</div><span class="small muted">500 XP is roughly 40 to 60 minutes of questions.</span></div>'+
 '<div class="card stack"><span class="label">'+esc(C.name)+' exam date</span><input type="date" id="examDate" value="'+esc(S.settings.exam)+'" style="font:inherit;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--ink)"></div>'+
 '<div class="card stack"><span class="label">Exam simulations</span><div class="seg"><button data-act="toggleExtra" aria-pressed="'+!!S.settings.extra+'">25% extra time '+(S.settings.extra?"on":"off")+'</button></div><span class="small muted">Candidates who sit the exam in a language that is not their native or working language can get 25% extra time ('+Math.round(MOCKMIN*1.25)+' min instead of '+MOCKMIN+'). Request it when you book, then practise with the time you will really have.</span></div>'+
 '<div class="card stack"><span class="label">Appearance</span><div class="seg">'+[["","Auto"],["light","Light"],["dark","Dark"]].map(x=>'<button data-act="theme" data-id="'+x[0]+'" aria-pressed="'+(th===x[0])+'">'+x[1]+'</button>').join("")+'</div><div class="seg"><button data-act="tog" data-id="notesOpen" aria-pressed="'+!!S.settings.notesOpen+'">Official notes '+(S.settings.notesOpen?"always open":"folded")+'</button></div><span class="small muted">The workbook notes under each slide explain it in more depth. Fold them to read faster, open them for the full official explanation.</span></div>'+
 '<div class="card stack"><span class="label">Sound and haptics</span><div class="seg"><button data-act="tog" data-id="sound" aria-pressed="'+S.settings.sound+'">Sounds '+(S.settings.sound?"on":"off")+'</button><button data-act="tog" data-id="vib" aria-pressed="'+S.settings.vib+'">Vibration '+(S.settings.vib?"on":"off")+'</button></div>'+(S.settings.sound?'<div class="seg">'+[[1,"Quiet"],[2,"Normal"],[3,"Loud"]].map(x=>'<button data-act="vol" data-id="'+x[0]+'" aria-pressed="'+((S.settings.vol==null?2:S.settings.vol)===x[0])+'">'+x[1]+'</button>').join("")+'<button data-act="sndTest">Test</button></div>':'')+'<span class="small muted">Sounds use the media volume of your phone. If you hear nothing, turn the media volume up with the volume keys while the app is open.</span></div>'+
 '<div class="card stack"><span class="label">Daily study reminders</span>'+(NATIVE?
  '<div class="seg"><button data-act="remToggle" aria-pressed="'+rem.on+'">Reminders '+(rem.on?"on":"off")+'</button>'+(rem.on?'<button data-act="remTest">Send one now</button>':'')+'</div>'+
  '<span class="small muted">A short fact from your courses arrives as a notification, with days left and reviews due. The nearer exam gets more of them. Tap one to open the app. Choose up to 4 times:</span>'+
  '<div class="seg">'+REM_TIMES.map(t=>'<button data-act="remTime" data-id="'+t+'" aria-pressed="'+(rem.times.indexOf(t)>=0)+'">'+t+'</button>').join("")+'</div>'
  :'<span class="small muted">Reminders work in the Android app.</span>')+'</div>'+
 '<div class="card stack"><span class="label">Backup and restore</span><span class="small muted">Progress is saved on this phone automatically'+(NATIVE?', in the app storage, which Android also includes in your Google backup':'')+'. A backup code holds both courses. Save one now and then.</span>'+
 '<button class="btn ghost" data-act="mkBackup">Create backup code</button>'+
 (bk?'<textarea id="codeBox" readonly>'+esc(bk)+'</textarea><div class="row"><button class="btn soft sm" data-act="copyBackup" style="flex:1">Copy</button>'+(NATIVE?'<button class="btn soft sm" data-act="shareBackup" style="flex:1">Share</button><button class="btn soft sm" data-act="saveBackup" style="flex:1">Save file</button>':'')+'</div>':'')+
 '<span class="label" style="margin-top:8px">Restore</span><span class="small muted">Paste a code from this app or from the old web apps (Settings → Show backup code → Copy code). Progress is merged, so nothing you already have here is lost.</span>'+
 '<textarea id="importBox" placeholder="Paste a backup code here"></textarea>'+
 '<div class="row">'+(NATIVE?'<button class="btn soft sm" data-act="pasteBackup" style="flex:1">Paste</button>':'')+'<button class="btn soft sm" data-act="openBackup" style="flex:1">Open file</button></div><input type="file" id="bkFile" accept=".txt,text/plain" hidden>'+
 '<button class="btn" data-act="doImport">Restore from code</button></div>'+
 '<div class="card stack"><span class="label">Start over</span>'+(view.reset?'<p style="margin:0">This deletes all XP, streaks and answers for '+esc(C.name)+'. Sure?</p><button class="btn" data-act="doReset" style="background:var(--bad);color:#fff">Yes, delete my '+esc(C.name)+' progress</button><button class="btn ghost" data-act="settings">Cancel</button>':'<button class="btn ghost" data-act="askReset">Reset '+esc(C.name)+' progress</button>')+'</div>'+
 '<p class="small muted" style="margin:0">'+esc(C.copy)+' Exam simulations, traps, memory aids and speed-round statements are original practice material written from the course, not real exam questions.'+(ver?' App version '+esc(ver)+'.':'')+'</p></div>';}

// ---------- actions ----------
const QUIET={pick:1,dpick:1,dsubmit:1,opick:1,spick:1,xl:1,xr:1,fknow:1,flip:1,tf:1,mpick:1,course:1};
document.addEventListener("click",e=>{const b=e.target.closest("[data-act]"); if(!b||b.disabled)return; const a=b.dataset.act, id=b.dataset.id; if(!QUIET[a]){ sfx(b.classList.contains("btn")?"swipe":"tap"); haptic("tick"); }
 switch(a){
 case "tab": sess=null; go(id||"home"); break;
 case "home": sess=null; go("home"); break;
 case "back": go("home"); break;
 case "settings": go("settings"); break;
 case "openModule": go("module",{id}); break;
 case "openLesson": go("lesson",{id,i:0}); break;
 case "lessonNav": view.i=(view.i||0)+Number(b.dataset.d); render(); window.scrollTo(0,0); save(); break;
 case "lessonCheck": { const lid=view.id; let ids=shuffle(QL.filter(q=>q.l===lid&&!q.g)).slice(0,5).map(q=>q.id); if(!ids.length)ids=shuffle(QL.filter(q=>q.l===lid)).slice(0,5).map(q=>q.id); if(!ids.length){S.lessons[lid]=Date.now();addXp(15,true);save();go("module",{id:LESS[lid].m.id});break;} startQuiz(ids,"Check: "+LESS[lid].l.t,{lesson:lid}); break; }
 case "nextLesson": { const lid=sess.lesson; const m=LESS[lid].m; const idx=m.lessons.findIndex(l=>l.id===lid); const nx=m.lessons[idx+1]; sess=null; if(nx)go("lesson",{id:nx.id,i:0}); else { const mi=MODULES.indexOf(m); const nm=MODULES[mi+1]; if(nm)go("module",{id:nm.id}); else go("learn"); } break; }
 case "smart": { const mf=view.name==="practice"?view.mf:""; const due=dueIds().filter(x=>!mf||Q[x].m===mf); const nw=newIds(mf); let ids=due.slice(0,8); ids=ids.concat(nw.slice(0,15-ids.length)); if(ids.length<15)ids=ids.concat(due.slice(8,8+15-ids.length)); startQuiz(shuffle(ids),"Smart session"); break; }
 case "quick": { const mf=view.name==="practice"?view.mf:""; startQuiz(shuffle(QL.filter(q=>!mf||q.m===mf)).slice(0,10).map(q=>q.id),"Quick quiz"); break; }
 case "mistakes": startQuiz(mistakeIds().slice(0,15),"Mistakes"); break;
 case "quizModule": startQuiz(shuffle(newIds(id).slice(0,8).concat(dueIds().filter(x=>Q[x].m===id))).concat(shuffle(byMod(id).map(q=>q.id))).filter((v,i,a)=>a.indexOf(v)===i).slice(0,15),"Module "+MODS[id].n+" quiz"); break;
 case "gen": startQuiz(shuffle(QL.filter(q=>q.g)).slice(0,12).map(q=>q.id),"Practice lists"); break;
 case "pick": answerQuiz(Number(b.dataset.oi)); break;
 case "nextQ": nextQ(); break;
 case "quit": sess=null; go("home"); break;
 case "mock": startMock(null,!!S.settings.extra); break;
 case "mpick": { const qid=sess.ids[sess.i]; sess.ans[qid]=Number(b.dataset.oi); sfx("tick"); haptic("tick"); saveLive(); render(); break; }
 case "mnav": { const d=Number(b.dataset.d); const last=sess.ids.length-1; if(d>0&&sess.i===last){sess.confirm=true;render();break;} trackTime(); sess.i=clamp(sess.i+d,0,last); saveLive(); render(); window.scrollTo(0,0); break; }
 case "mjump": trackTime(); sess.i=Number(b.dataset.i); saveLive(); render(); window.scrollTo(0,0); break;
 case "flag": { const qid=sess.ids[sess.i]; if(sess.flags[qid])delete sess.flags[qid]; else sess.flags[qid]=1; saveLive(); render(); break; }
 case "submitMock": sess.confirm=true; render(); break;
 case "cancelSubmit": sess.confirm=false; render(); break;
 case "confirmSubmit": sess.confirm=false; finishMock(false); break;
 case "quitMock": sess.quit=true; render(); break;
 case "cancelQuit": sess.quit=false; render(); break;
 case "reallyQuit": clearLive(); sess=null; go("home"); break;
 case "pauseMock": trackTime(); saveLive(); sess=null; toast("Paused. Resume it from Today."); go("home"); break;
 case "mf2": view.f=id; render(); break;
 case "drive": startDrive(); break;
 case "dpick": sess.choice=Number(b.dataset.oi); render(); break;
 case "dlater": { const x=sess.queue.splice(sess.i,1)[0]; sess.queue.push(x); sess.choice=null; render(); break; }
 case "dsubmit": { const qid=sess.queue[sess.i]; const q=Q[qid]; const ok=q.opts[sess.choice].ok; sess.shown=true; grade(qid,ok); sess.done.push({id:qid,ok,choice:sess.choice}); if(ok){sess.ok++;addXp(8);fxOk();}else{sess.no++;fxNo();} save(); render(); break; }
 case "dnext": { if(sess.no>=5){finishDrive("fail");break;} if(sess.ok>=22){finishDrive("pass");break;} sess.i++; sess.shown=false; sess.choice=null; if(sess.i>=sess.queue.length){finishDrive(sess.ok>=22?"pass":"fail");break;} render(); window.scrollTo(0,0); break; }
 case "quitDrive": sess=null; go("home"); break;
 case "drills": go("pickDrill",{kind:"order",mf:view.mf||""}); break;
 case "sorts": go("pickDrill",{kind:"sort",mf:view.mf||""}); break;
 case "matches": go("pickDrill",{kind:"match",mf:view.mf||""}); break;
 case "drill": startDrill(b.dataset.kind,id); break;
 case "drillRandom": { const k=b.dataset.kind; const L=listFor(k); if(!L.length){toast("Nothing here yet");break;} const pref=L.filter(x=>!S.items[x.id]||S.items[x.id].d<=today()); const pool=pref.length?pref:L; startDrill(k,pool[Math.floor(Math.random()*pool.length)].id); break; }
 case "pickBack": { const k=sess?(sess.src||sess.kind):"order"; sess=null; if(k==="mnem")go("aids"); else go("pickDrill",{kind:k}); break; }
 case "opick": { const i=Number(b.dataset.i); if(i===sess.next){sess.next++;sess.flash=null;sfx("tick");haptic("tick"); if(sess.next>=sess.d.items.length){endDrill(sess.miss===0,20-sess.miss*4);break;}} else {sess.miss++;sess.flash=i;fxNo();} render(); break; }
 case "spick": { const it=sess.items[sess.i]; const ok=b.dataset.b===it[1]; sess.last={ok,pick:b.dataset.b}; if(ok){sess.ok++;fxOk();addXp(3,true);render();setTimeout(()=>{if(sess&&sess.kind==="sort"&&sess.last&&sess.last.ok){sortNext();}},550);} else {sess.miss++;fxNo();render();} break; }
 case "snext": sortNext(); break;
 case "xl": sess.sel=Number(b.dataset.i); sess.bad=null; render(); break;
 case "xr": { if(sess.sel==null){toast("Tap a term first");break;} const i=Number(b.dataset.i); if(i===sess.sel){sess.doneL[i]=1;sess.sel=null;sess.bad=null;fxOk(); if(Object.keys(sess.doneL).length===sess.d.pairs.length){endDrill(sess.miss===0,20-sess.miss*3);break;}} else {sess.miss++;sess.bad=i;fxNo();} render(); break; }
 case "flash": startFlash(""); break;
 case "flashModule": startFlash(id); break;
 case "flip": sess.flip=!sess.flip; sfx("flip"); haptic("tick"); render(); break;
 case "fknow": { const f=sess.deck[sess.i]; const ok=b.dataset.k==="1"; grade(f.id,ok); if(ok){sess.known++;addXp(4,true);fxOk();} else fxNo(); save(); sess.i++; sess.flip=false; render(); break; }
 case "mf": view.mf=id; render(); break;
 case "goal": S.settings.goal=Number(id); save(); render(); break;
 case "tog": S.settings[id]=!S.settings[id]; save(); render(); if(id==="sound"&&S.settings.sound)sfx("ok"); if(id==="vib"&&S.settings.vib)haptic("heavy"); break;
 case "vol": S.settings.vol=Number(id); save(); render(); sfx("ok"); break;
 case "sndTest": { const seq=["tap","ok","no","combo","level"]; seq.forEach((k,i)=>setTimeout(()=>sfx(k),i*500)); haptic("click"); break; }
 default: if(!featureAction(a,b,id))console.warn("no action",a); break;
 case "askReset": view.reset=true; render(); break;
 case "doReset": S=fresh(); clearLive(); flush(); toast("Progress reset"); go("home"); break;
 }
});
function sortNext(){ sess.i++; sess.last=null; if(sess.i>=sess.items.length){ endDrill(sess.miss===0,sess.ok); return;} render(); }
document.addEventListener("change",e=>{ if(e.target.id==="examDate"&&e.target.value){S.settings.exam=e.target.value;save();toast("Exam date saved");} if(e.target.id==="bkFile")readBackupFile(e.target); });
document.addEventListener("input",e=>{ if(e.target.id==="glossQ")filterGlossary(e.target.value); });

// ======================= FEATURES (one app, two courses) =======================
Object.assign(ICON,{
 target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
 timer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
 split:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M6 8l-3 4 3 4M18 8l3 4-3 4"/></svg>',
 bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg>',
 compass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
 list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h10M10 12h10M10 18h10"/><path d="M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/></svg>',
 sheet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>'
});
const OTHER_EXAM=OTHER.id==="prince2"?"2026-12-20":"2026-11-18";
const QRG=(window.QRG||[]).filter(c=>c&&c.h);
const LIVEKEY=KEY+"-live";

// ---------- small helpers ----------
function daysTo(ex){ try{ return dayNum(new Date(ex+"T12:00:00").getTime())-today(); }catch(e){ return 999; } }
function otherStatus(){ try{ return JSON.parse(rawGet("es-status-"+OTHER.id)||"null"); }catch(e){ return null; } }
function dleft(d){ return d>1?d+" days":d===1?"tomorrow":d===0?"today":"done"; }
function fmtSec(x){ x=Math.round(x); return x>=60?Math.floor(x/60)+" min"+(x%60?" "+(x%60)+" s":""):x+" s"; }
function backTo(id){ return top; }
function sub(title,parent){ return top(title,{back:true,backAct:"tab"}).replace('data-act="tab"','data-act="tab" data-id="'+parent+'"'); }
let awake=false;
function keepAwake(on){ on=!!on; if(on===awake)return; awake=on; try{ if(NATIVE&&window.Android.keepAwake)window.Android.keepAwake(on); }catch(e){} }
function copyText(t){ try{ if(NATIVE&&window.Android.copy){ toast(window.Android.copy(t)?"Copied":"Could not copy"); return; } }catch(e){}
 try{ navigator.clipboard.writeText(t).then(()=>toast("Copied"),()=>toast("Select the code and copy it manually")); }catch(e){ toast("Select the code and copy it manually"); } }

// ---------- course switch ----------
function courseSwitch(){ const os=otherStatus();
 const list=[{id:C.id,name:C.name,d:examDays()},{id:OTHER.id,name:OTHER.name,d:daysTo(os&&os.exam||OTHER_EXAM)}].sort((a,b)=>a.id==="itil"?-1:1);
 return '<div class="cswitch" role="tablist">'+list.map(x=>'<button role="tab" data-act="course" data-id="'+x.id+'" aria-selected="'+(x.id===C.id)+'" class="cs-'+x.id+'"><b>'+esc(x.name)+'</b><span>exam '+dleft(x.d)+'</span></button>').join("")+'</div>'; }
function shareToday(){ const d1=examDays(); const os=otherStatus(); const d2=daysTo(os&&os.exam||OTHER_EXAM); if(d1<0&&d2<0)return null; if(d1<0)return {me:0,other:100}; if(d2<0)return {me:100,other:0};
 const w1=1/Math.max(1,d1), w2=1/Math.max(1,d2); const me=Math.round(w1/(w1+w2)*20)*5; return {me,other:100-me}; }
function otherCourseCard(){ const os=otherStatus(); const d=daysTo(os&&os.exam||OTHER_EXAM); const sh=shareToday();
 return '<button class="card ocard" data-act="course" data-id="'+OTHER.id+'"><div class="row" style="justify-content:space-between"><span class="label">Also studying</span><span class="chip">Switch ›</span></div><div class="row" style="justify-content:space-between;align-items:baseline"><b style="font-size:18px">'+esc(OTHER.name)+'</b><span class="num small">exam '+dleft(d)+'</span></div>'+
 (os?'<div class="small muted">Predicted '+os.pred+'/'+os.n+' · '+os.due+' due'+(os.streak?' · '+os.streak+' day streak':'')+'</div>':'<div class="small muted">Not opened in this app yet. Tap to start.</div>')+
 (sh&&sh.other&&sh.me?'<div class="small" style="margin-top:4px">Split today: <b>'+sh.me+'% '+esc(C.short)+'</b> · '+sh.other+'% '+esc(OTHER.name)+'</div>':'')+'</button>'; }
function switchCourse(id){ if(id===C.id){ if(view.name!=="home")go("home"); return; } if(sess&&sess.kind==="mock"&&sess.live){ trackTime(); saveLive(); } flush(); rawSet("es-course",id); location.reload(); }

// ---------- live exam (pause and resume) ----------
function saveLive(){ if(!sess||sess.kind!=="mock"||!sess.live)return; try{ const o={}; ["kind","paper","title","ids","ans","flags","i","start","end","mins","order","tq","extra"].forEach(k=>o[k]=sess[k]); rawSet(LIVEKEY,JSON.stringify(o)); }catch(e){} }
function clearLive(){ rawSet(LIVEKEY,""); }
function loadLive(){ try{ const o=JSON.parse(rawGet(LIVEKEY)||"null"); if(!o||o.kind!=="mock"||!Array.isArray(o.ids)||!o.ids.length||!o.ids.every(id=>Q[id]))return null; return o; }catch(e){ return null; } }
function liveBanner(L){ const left=L.end-Date.now(); const ans=Object.keys(L.ans||{}).length;
 return '<section class="card live"><div class="row" style="justify-content:space-between"><span class="label">Exam in progress</span><span class="chip">'+ans+'/'+L.ids.length+' answered</span></div><b style="font-size:18px">'+esc(L.title||"Mock exam")+'</b><div class="small muted">'+(left>0?Math.ceil(left/60000)+' min left on the clock':'Time is up. Open it to see your score.')+'</div><div class="row"><button class="btn sm" data-act="resumeMock" style="flex:2">'+(left>0?"Resume":"See result")+'</button><button class="btn ghost sm" data-act="discardLive" style="flex:1">Discard</button></div></section>'; }
function simLine(){ const m=S.mocks.slice(-3); if(!m.length)return ""; return 'Last '+(m.length>1?m.length+' mocks: ':'mock: ')+m.map(r=>r.score).join(", ")+' / '+NQ+'. '; }
function areaOf(q){ const A=C.areas||[]; if(q.syl){ const g=String(q.syl).match(/\d+(?:\.\d+)+/g); const d=g?g[g.length-1].split(".")[0]:null; if(d){ const i=A.findIndex(a=>(a.s||[]).indexOf(d)>=0); if(i>=0)return i; } } const j=A.findIndex(a=>(a.m||[]).indexOf(q.m)>=0); return j; }

// ---------- status for the other course and for reminders ----------
function pushStatus(){ const st={exam:S.settings.exam,due:dueIds().length,pred:Math.round(predicted()*10)/10,n:NQ,pass:PASS,streak:streakNow(),xp:S.xp,t:Date.now()};
 rawSet("es-status-"+C.id,JSON.stringify(st)); try{ if(NATIVE&&window.Android.setStatus)window.Android.setStatus(C.id,JSON.stringify({exam:st.exam,due:st.due})); }catch(e){} }
function pushFacts(force){ if(!NATIVE||!window.Android.setFacts)return; const facts=KEYFACTS.map(f=>f.f).concat(FLASH.filter(f=>f.d.length<=220).map(f=>f.t+": "+f.d)); if(!facts.length)return;
 const sig=facts.length+":"+hash(facts.join("|")); if(!force&&rawGet("es-facts-sig-"+C.id)===sig)return;
 try{ window.Android.setFacts(C.id,JSON.stringify({title:C.name,facts:shuffle(facts)})); rawSet("es-facts-sig-"+C.id,sig); }catch(e){} }

// ---------- study plan ----------
function newToday(){ const t=today(); let n=0; for(const id in S.items){ const it=S.items[id]; if(id[0]==="q"&&it.f===t)n++; } return n; }
function lessonsToday(){ const t=today(); return Object.keys(S.lessons).filter(k=>dayNum(S.lessons[k])===t).length; }
function speedToday(){ const t=today(); return S.speed.some(r=>dayNum(r.t)===t); }
function trapsToday(){ const t=today(); return TRAPL.filter(x=>{const it=S.items[x.id]; return it&&it.l&&dayNum(it.l)===t;}).length; }
function simToday(){ const t=today(); return S.mocks.some(m=>dayNum(m.t)===t); }
function daysSinceSim(){ if(!S.mocks.length)return 999; return today()-dayNum(S.mocks[S.mocks.length-1].t); }
function nextLesson(){ for(const m of MODULES)for(const l of m.lessons)if(!S.lessons[l.id])return {l,m}; return null; }
function planPhase(d){
 if(d<0)return {k:"done",t:"Exam done",s:"Switch to the other course, or keep this one fresh with reviews."};
 if(d===0)return {k:"day",t:"Exam day",s:"No new material. A 10-minute warm-up with reviews, then go and pass."};
 if(d===1)return {k:"eve",t:"Day before",s:"Light review only: mistakes, memory aids and the exam guide. Sleep well."};
 if(d<=7)return {k:"week",t:"Exam week",s:"A full simulation every second day. Mistakes, traps and a speed round daily."};
 if(d<=21)return {k:"cons",t:"Consolidate",s:"Finish the new material, take a simulation every few days, attack weak spots."};
 return {k:"build",t:"Build",s:"Read the lessons and see every question at least once."}; }
function planTasks(){ const d=examDays(); const ph=planPhase(d); const due=dueIds().length; const unseen=QL.filter(q=>!S.items[q.id]).length; const unread=Object.keys(LESS).filter(k=>!S.lessons[k]).length; const mis=mistakeIds().length; const T=[];
 T.push({t:due?"Review "+due+" due question"+(due>1?"s":""):"Reviews done for now",done:due===0,act:"reviews"});
 if(ph.k!=="eve"&&ph.k!=="day"&&ph.k!=="done"){
  if(unread>0){ const per=Math.max(1,Math.ceil(unread/Math.max(1,d>12?d-7:d-2))); const dn=lessonsToday(); const nl=nextLesson(); T.push({t:"Read "+per+" lesson"+(per>1?"s":"")+(nl?" · next: "+nl.l.t:""),done:dn>=per,prog:Math.min(dn,per)+"/"+per,act:"nextUnread"}); }
  if(unseen>0){ const per=clamp(Math.ceil(unseen/Math.max(1,d-(d>10?7:1))),10,90); const dn=newToday(); T.push({t:"Learn "+per+" new questions",done:dn>=per,prog:Math.min(dn,per)+"/"+per,act:"learnNew"}); }
 }
 if(PAPERS.length&&(ph.k==="week"||ph.k==="cons")){ const gap=ph.k==="week"?2:4; const ds=daysSinceSim(); T.push({t:simToday()?"Simulation done today":ds>=gap?"Take a full exam simulation":"Next simulation in "+(gap-ds)+" day"+(gap-ds>1?"s":""),done:simToday()||ds<gap,act:"papers"}); }
 if(mis&&(ph.k==="week"||ph.k==="eve"||ph.k==="cons"))T.push({t:"Clear your mistakes ("+mis+")",done:false,act:"mistakes"});
 if(TRAPL.length&&d<=21&&d>=1){ const n=trapsToday(); T.push({t:"Solve 2 exam traps",done:n>=2,prog:Math.min(2,n)+"/2",act:"traps"}); }
 if(ph.k!=="day")T.push({t:"One speed round",done:speedToday(),act:"speed"});
 if(ph.k==="week"||ph.k==="eve"||ph.k==="day")T.push({t:"Read the exam guide",done:S.plan&&S.plan.guide===today(),act:"guide"});
 if(ph.k==="eve")T.push({t:"Go through the memory aids",done:S.plan&&S.plan.aids===today(),act:"aids"});
 return {ph,d,tasks:T}; }
function planCard(){ const P=planTasks(); const open=P.tasks.filter(t=>!t.done).length; const sh=shareToday();
 return '<section class="card plan"><div class="row" style="justify-content:space-between"><span class="label">Today · '+esc(P.ph.t)+'</span><button class="chip" data-act="plan" style="border:0">Full plan ›</button></div>'+
 P.tasks.slice(0,6).map(t=>'<button class="ptask'+(t.done?" done":"")+'" data-act="'+t.act+'"><span class="pchk">'+(t.done?ICON.check:"")+'</span><span class="pt">'+esc(t.t)+'</span>'+(t.prog&&!t.done?'<span class="num small muted">'+t.prog+'</span>':'')+'</button>').join("")+
 '<div class="small muted">'+(open?open+' to go':'All done. Extra practice still counts.')+(sh&&sh.other&&sh.me?' · aim for '+sh.me+'% of today on '+esc(C.short):'')+'</div></section>'; }
function milestones(){ const ex=new Date(S.settings.exam+"T12:00:00"); const d=examDays(); const M=[]; const off=PAPERS.filter(p=>p.official), gen=PAPERS.filter(p=>!p.official);
 const seq=[[12,gen[0]],[9,gen[1]],[6,off[0]],[4,gen[2]],[2,off[1]]].filter(x=>x[1]);
 seq.forEach(([k,p])=>{ const when=new Date(ex.getTime()-k*864e5); const done=S.mocks.some(m=>m.paper===p.id); if(k<=Math.max(d,0)||done)M.push({k,p,when,done}); });
 return M; }
function vPlan(){ const P=planTasks(); const os=otherStatus(); const d2=daysTo(os&&os.exam||OTHER_EXAM); const sh=shareToday(); const M=milestones();
 return top("Study plan",{back:true,backAct:"home"})+'<div class="stack">'+
 '<section class="hero" style="gap:8px"><span class="label" style="color:inherit;opacity:.7">'+esc(C.name)+' · exam '+esc(fmtDate(S.settings.exam))+(C.examTime?' at '+esc(C.examTime):'')+'</span><div class="k" style="font-size:36px">'+esc(P.ph.t)+'</div><div class="sub">'+esc(P.ph.s)+'</div></section>'+
 '<div class="card stack"><span class="label">Today</span>'+P.tasks.map(t=>'<button class="ptask'+(t.done?" done":"")+'" data-act="'+t.act+'"><span class="pchk">'+(t.done?ICON.check:"")+'</span><span class="pt">'+esc(t.t)+'</span>'+(t.prog&&!t.done?'<span class="num small muted">'+t.prog+'</span>':'')+'</button>').join("")+'</div>'+
 (M.length?'<div class="card stack"><span class="label">Simulation schedule</span>'+M.map(x=>'<div class="row" style="justify-content:space-between"><span>'+esc(x.p.t)+'</span><span class="chip" style="'+(x.done?'color:var(--good)':'')+'">'+(x.done?"done":x.when.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}))+'</span></div>').join("")+'<span class="small muted">Official sample papers come last: they are the closest thing to the real exam, so they work as your final check.</span></div>':'')+
 '<div class="card stack"><span class="label">Both exams</span><div class="row" style="justify-content:space-between"><b>'+esc(C.name)+'</b><span class="num small">'+dleft(examDays())+'</span></div><div class="row" style="justify-content:space-between"><b>'+esc(OTHER.name)+'</b><span class="num small">'+dleft(d2)+'</span></div>'+
 (sh?'<div class="small">Suggested split today: <b>'+sh.me+'% '+esc(C.short)+'</b>, '+sh.other+'% '+esc(OTHER.name)+'. The nearer exam gets more time; after it, everything goes to the other one.</div>':'')+'</div>'+
 '<div class="card stack"><span class="label">How the plan works</span><div class="tipline">Build (more than 3 weeks out): lessons first, every question seen once.</div><div class="tipline">Consolidate (3 weeks to 8 days): finish new material, a simulation every 4 days, weak spots and traps.</div><div class="tipline">Exam week: a simulation every second day, clear mistakes daily, speed rounds.</div><div class="tipline">Day before: no new material. Memory aids, guide, sleep.</div></div></div>'; }

// ---------- exam simulations ----------
function paperStats(pid){ const a=S.mocks.filter(m=>m.paper===pid); return {n:a.length,best:a.reduce((x,m)=>Math.max(x,m.score),-1),last:a.length?a[a.length-1]:null}; }
function paperCard(p){ const st=paperStats(p.id); return '<button class="card paper" data-act="paperIntro" data-id="'+p.id+'"><div class="row" style="justify-content:space-between;gap:8px"><b style="font-size:18px">'+esc(p.t)+'</b>'+(st.n?'<span class="chip" style="color:'+(st.best>=PASS?"var(--good)":"var(--bad)")+'">best '+st.best+'/'+p.ids.length+'</span>':'<span class="chip">not taken</span>')+'</div><div class="small muted">'+p.ids.length+' questions · '+MOCKMIN+' min'+(st.n?' · '+st.n+' attempt'+(st.n>1?'s':'')+' · last '+fmtDate(dayKey(dayNum(st.last.t))):'')+'</div></button>'; }
function vPapers(){ const off=PAPERS.filter(p=>p.official), gen=PAPERS.filter(p=>!p.official);
 return top("Exam simulations",{back:true,backAct:"home"})+'<div class="stack">'+
 '<p class="muted" style="margin:0">Full papers under real exam rules: '+NQ+' questions, one clock, flags, no feedback until you submit, then a breakdown by syllabus area, question type and time.</p>'+
 (off.length?'<span class="label">Official sample papers (PeopleCert)</span>'+off.map(paperCard).join("")+'<p class="small muted" style="margin:0">From your official learner kit, with the official rationale for every option. Options are shuffled, so you cannot lean on answer patterns. The closest thing to the real exam: keep them for the last week.</p>':'')+
 (gen.length?'<span class="label">Practice simulations</span>'+gen.map(paperCard).join("")+'<p class="small muted" style="margin:0">Original questions written from the course in the official styles and proportions. Not real exam questions.</p>':'')+
 '<span class="label">Endless</span><button class="card paper" data-act="paperIntro" data-id=""><div class="row" style="justify-content:space-between"><b style="font-size:18px">Random mock</b><span class="chip">new every time</span></div><div class="small muted">'+NQ+' questions drawn from the whole bank by the exam blueprint</div></button>'+
 '<div class="card stack"><span class="label">How to get the most out of them</span><div class="tipline">Sit each one like the real thing: one go, no notes, phone on do not disturb.</div><div class="tipline">Afterwards read every explanation for the questions you missed or flagged. That is where the learning happens.</div><div class="tipline">Your wrong answers go into your reviews, so they come back until you know them.</div></div></div>'; }
function vPaperIntro(){ const pid=view.id||""; const P=pid?PAPERS.find(p=>p.id===pid):null; const ex=!!S.settings.extra; const mins=Math.round(MOCKMIN*(ex?1.25:1)); const N=P?P.ids.length:NQ;
 return top(P?P.t:"Random mock",{back:true,backAct:"papers"})+'<div class="stack">'+
 '<div class="card stack"><span class="label">Exam rules</span><ul class="rules"><li><b>'+N+' questions</b>, one correct answer each</li><li><b>'+mins+' minutes</b>'+(ex?' (with 25% extra time)':'')+' on one clock</li><li>Pass mark <b>'+PASS+'/'+NQ+' ('+C.pct+'%)</b></li><li>Closed book: no notes, no course material</li><li>No negative marking: answer every question</li><li>Flag questions and come back before you submit</li><li>Results only after you submit</li></ul></div>'+
 '<div class="card stack"><span class="label">Question styles</span><div class="tipline"><b>Standard:</b> a question or an unfinished sentence. Pick the best answer.</div><div class="tipline"><b>Negative:</b> NOT or EXCEPT in capitals. Pick the one that is false.</div><div class="tipline"><b>List:</b> four numbered statements. Pick the pair that is correct.</div><div class="tipline"><b>Missing word:</b> a sentence with a gap. Pick the term that fits.</div></div>'+
 '<div class="seg"><button data-act="toggleExtra" aria-pressed="'+ex+'">25% extra time '+(ex?"on":"off")+'</button></div>'+
 '<button class="btn" data-act="startPaper" data-id="'+esc(pid)+'" style="min-height:60px">'+ICON.play.replace('<svg','<svg width="20" height="20"')+' Start the clock</button>'+
 '<p class="small muted" style="margin:0">The screen stays on during the exam. If you must stop, tap ✕ and choose Pause: the clock keeps running, like on exam day.</p></div>'; }

// ---------- exam guide ----------
function vGuide(){ const pace=MOCKMIN*60/NQ; const sec=(t,body)=>'<div class="card stack"><h2 style="font-size:19px">'+t+'</h2>'+body+'</div>'; const li=a=>'<ul class="rules">'+a.map(x=>'<li>'+x+'</li>').join("")+'</ul>';
 if(!S.plan)S.plan={}; if(S.plan.guide!==today()){ S.plan.guide=today(); save(); }
 return sub("Exam guide","learn")+'<div class="stack">'+
 sec("The format",li(["<b>"+NQ+" multiple-choice questions</b>, one correct answer each, every question worth one mark","<b>"+MOCKMIN+" minutes</b>, or "+Math.round(MOCKMIN*1.25)+" with the 25% allowance for candidates not taking it in their native or working language (ask for it when you book)","Pass mark <b>"+PASS+"/"+NQ+" ("+C.pct+"%)</b>","Closed book, no negative marking: never leave a question blank","Questions test recall of definitions and lists, and understanding: applying a concept to a short situation"]))+
 (C.examTime?sec("Your exam","<p style='margin:0'><b>"+esc(fmtDate(S.settings.exam))+" at "+esc(C.examTime)+"</b>. Plan the evening before: everything ready, alarm set, no new material.</p>"):"")+
 sec("Pace",'<p style="margin:0">You have about <b>'+fmtSec(pace)+' per question</b>. First pass: answer everything you know at once and flag the rest. Second pass: the flagged ones. Being stuck for 4 minutes on one question costs you two easy ones later.</p>')+
 sec("The four question styles",'<div class="tipline"><b>Standard.</b> Read the stem to the end and predict the answer before you look at the options. Then find the option that matches your prediction.</div><div class="tipline"><b>Negative (NOT, EXCEPT).</b> Three options are true. Mark each one true or false in your head and pick the false one. They are rare, so slow down when you see capitals.</div><div class="tipline"><b>List (pick two).</b> Judge the four numbered statements one by one. Cross out every pair that contains a statement you know is false. Usually only one pair survives.</div><div class="tipline"><b>Missing word.</b> Read the whole sentence with each option in the gap. The official definition is the key: the right term makes the sentence say exactly what the course says.</div>')+
 sec("Elimination",li(["Two options that mean the same thing usually cannot both be right, so the answer is often elsewhere","Absolute words (always, never, only, all) are often a sign of a wrong option","An option can be true in general and still not answer the question: check it answers what was asked","Prefer the option that uses the official term precisely over one that sounds sensible in everyday language"]))+
 sec("Traps in "+esc(C.name),li((C.tips||[]).map(esc)))+
 sec("The last week",li(["A full simulation every second day, under exam conditions","Clear the Mistakes deck daily and solve the Exam traps","A speed round each day keeps definitions fast","Stop new material the day before: memory aids, this guide, sleep"]))+
 sec("On the day",li(["Online exam: test camera, microphone and connection beforehand, clear the desk, ID ready, start early","Read every word, especially NOT, EXCEPT, FIRST, MOST, BEST","Change an answer only for a clear reason, never for a feeling","Use the time left on flagged questions, then submit"]))+
 (WEBCARDS.filter(w=>w.guide).length?'<span class="label" style="margin-top:6px">From official sources</span>'+WEBCARDS.filter(w=>w.guide).map(w=>renderCard(Object.assign({},w.card,{web:1,src:w.src||""}),"var(--accent)")).join(""):'')+
 '</div>'; }

// ---------- memory aids, glossary, quick reference, products ----------
function vAids(){ if(!S.plan)S.plan={}; if(S.plan.aids!==today()){ S.plan.aids=today(); save(); }
 return sub("Memory aids","learn")+'<div class="stack"><p class="muted" style="margin:0">A hook for every list you must know by heart. Read the hook, say the list out loud, then test yourself by putting the items in order.</p>'+
 (MNL.length?MNL.map(x=>{const m=MODS[x.m]; const it=S.items[x.id]; return '<article class="card stack" style="border-left:6px solid '+m.color+'"><span class="label" style="color:'+m.color+'">'+esc(m.short)+'</span><h2 style="font-size:19px">'+esc(x.t)+'</h2>'+(x.mn?'<div class="mnhook">'+esc(x.mn)+'</div>':'')+'<ol class="mnlist">'+x.items.map(i=>'<li>'+esc(i)+'</li>').join("")+'</ol>'+(x.tip?'<div class="small muted">'+esc(x.tip)+'</div>':'')+'<button class="btn soft sm" data-act="mnem" data-id="'+x.id+'">'+(it&&it.c?"Test again":"Test me")+'</button></article>';}).join(""):'<p class="muted">No memory aids yet.</p>')+'</div>'; }
function glossRows(q){ q=(q||"").trim().toLowerCase(); const list=FLASH.slice().sort((a,b)=>a.t.localeCompare(b.t,"en",{sensitivity:"base"})).filter(f=>!q||f.t.toLowerCase().indexOf(q)>=0||f.d.toLowerCase().indexOf(q)>=0);
 return list.length?list.slice(0,500).map(f=>{const m=MODS[f.m]; return '<div class="gl"><b>'+esc(f.t)+'</b> <span class="gtag" style="color:'+m.color+'">'+esc(m.short)+'</span><div>'+esc(f.d)+'</div></div>';}).join(""):'<p class="muted">No match.</p>'; }
function vGlossary(){ return sub("Glossary A-Z","learn")+'<div class="stack"><input id="glossQ" type="search" class="search" placeholder="Search '+FLASH.length+' official terms" autocomplete="off"><div class="card" id="glossList">'+glossRows("")+'</div></div>'; }
function filterGlossary(v){ const el=$("#glossList"); if(el)el.innerHTML=glossRows(v); }
function vQrg(){ const by={}; QRG.forEach(c=>{ (by[c.m]=by[c.m]||[]).push(c); }); const order=MODULES.map(m=>m.id).concat(Object.keys(by).filter(k=>!MODS[k]));
 return sub("Quick reference","learn")+'<div class="stack"><p class="muted" style="margin:0">The official Quick Reference Guide as revision cards, module by module. Ideal for the last days.</p>'+
 order.filter(k=>by[k]).map(k=>{const m=MODS[k]||{short:"General",color:"var(--muted)",n:""}; return '<span class="label" style="color:'+m.color+';margin-top:6px">'+esc((m.n?"Module "+m.n+" · ":"")+m.short)+'</span>'+by[k].map(c=>renderCard(c,m.color)).join("");}).join("")+'</div>'; }
function vProducts(){ return sub("Management products","learn")+'<div class="stack"><p class="muted" style="margin:0">Every management product in the course: why it exists, who produces it and when. Then drill the purposes.</p><button class="btn" data-act="prodMatch">Match the purposes</button>'+
 PRODUCTS.map(p=>{const m=MODS[p.m]||MODULES[0]; return '<div class="card stack" style="gap:6px;border-left:6px solid '+m.color+'"><b style="font-size:17px">'+esc(p.n)+'</b>'+(p.p?'<div>'+esc(p.p)+'</div>':'')+(p.w?'<div class="small"><b>Who:</b> '+esc(p.w)+'</div>':'')+(p.when?'<div class="small"><b>When:</b> '+esc(p.when)+'</div>':'')+'</div>';}).join("")+'</div>'; }

// ---------- weak spots ----------
function weakIds(){ const L={}; QL.forEach(q=>{ const it=S.items[q.id]; if(!it)return; const x=L[q.l]||(L[q.l]={s:0,n:0}); x.s+=pItem(it); x.n++; });
 const ranked=Object.keys(L).filter(k=>L[k].n>=2&&LESS[k]).map(k=>({k,v:L[k].s/L[k].n})).sort((a,b)=>a.v-b.v).slice(0,3); if(!ranked.length)return {ids:[],ls:[]};
 let ids=[]; ranked.forEach(r=>{ const qs=QL.filter(q=>q.l===r.k); ids=ids.concat(shuffle(qs.filter(q=>{const it=S.items[q.id];return it&&it.w>0;})).slice(0,3),shuffle(qs.filter(q=>!S.items[q.id])).slice(0,2),shuffle(qs).slice(0,3)); });
 ids=[...new Set(ids.map(q=>q.id))].slice(0,15); return {ids,ls:ranked.map(r=>LESS[r.k].l.t)}; }

// ---------- speed round (true or false, 60 seconds) ----------
function speedPool(){ const defs=FLASH.filter(f=>f.d.length<=160&&f.t.length<=70); const gen=[];
 defs.forEach(f=>{ gen.push({id:"t"+hash("T|"+f.id),m:f.m,s:f.t+": "+f.d,a:true,e:"True: this is the official definition of "+f.t+"."});
  const pool=defs.filter(g=>g.m===f.m&&g.t.toLowerCase()!==f.t.toLowerCase()&&g.d!==f.d); if(pool.length){ const g=pool[parseInt(hash(f.id),36)%pool.length]; gen.push({id:"t"+hash("F|"+f.id+"|"+g.id),m:f.m,s:f.t+": "+g.d,a:false,e:"False: that is the definition of "+g.t+". "+f.t+": "+f.d}); } });
 return TFL.concat(gen); }
function startSpeed(){ const all=speedPool(); if(!all.length){toast("No statements yet");return;}
 const weak=all.filter(x=>{const it=S.items[x.id];return it&&it.w>0&&it.b<2;}), nw=all.filter(x=>!S.items[x.id]), rest=all.filter(x=>S.items[x.id]&&!(S.items[x.id].w>0&&S.items[x.id].b<2));
 const tfFirst=shuffle(nw.filter(x=>TFL.indexOf(x)>=0)).slice(0,25).concat(shuffle(nw.filter(x=>TFL.indexOf(x)<0)).slice(0,25));
 const list=shuffle(shuffle(weak).slice(0,15).concat(tfFirst)).concat(shuffle(rest)).slice(0,120);
 sess={kind:"speed",list,i:0,ok:0,no:0,end:Date.now()+60000,wrong:[],fb:null,lock:false,live:true}; go("speed"); }
function vSpeed(){ const it=sess.list[sess.i%sess.list.length]; const m=MODS[it.m];
 return top("Speed round",{back:true,backAct:"speedQuit",closeIcon:true,right:'<span class="timer" id="timer">60s</span>'})+'<div class="stack">'+
 '<div class="qhead"><span class="chip" style="color:var(--good)">'+sess.ok+' right</span><span class="chip" style="color:var(--bad)">'+sess.no+' wrong</span><span class="small muted" style="margin-left:auto">best '+(S.best.speed||0)+'</span></div>'+
 '<div class="flash speedcard'+(sess.fb?(sess.fb.ok?" fbok":" fbno"):"")+'"><div style="display:grid;gap:10px"><span class="label" style="color:'+m.color+'">'+esc(m.short)+'</span><div class="d" style="font-size:19px;font-weight:700">'+esc(it.s)+'</div>'+(sess.fb&&!sess.fb.ok?'<div class="small">'+esc(it.e)+'</div>':'')+'</div></div>'+
 '<div class="tfrow"><button class="btn tf no" data-act="tf" data-v="0">False</button><button class="btn tf yes" data-act="tf" data-v="1">True</button></div>'+
 '<p class="small muted" style="margin:0;text-align:center">Trust your first instinct. Wrong ones come back in later rounds.</p></div>'; }
function answerTF(v){ if(!sess||sess.kind!=="speed"||sess.lock)return; const it=sess.list[sess.i%sess.list.length]; const ok=(v==="1")===it.a; grade(it.id,ok);
 if(ok){sess.ok++;fxOk();} else {sess.no++;sess.wrong.push(it);fxNo();}
 sess.fb={ok}; sess.lock=true; render(); setTimeout(()=>{ if(!sess||sess.kind!=="speed"||!sess.live)return; sess.i++; sess.fb=null; sess.lock=false; render(); },ok?260:1600); }
function endSpeed(){ if(!sess||sess.kind!=="speed"||!sess.live)return; clearInterval(timerI); const rec={t:Date.now(),ok:sess.ok,no:sess.no}; S.speed.push(rec); if(S.speed.length>300)S.speed=S.speed.slice(-300);
 const best=S.best.speed||0; S.best.speed=Math.max(best,sess.ok); sess.live=false; sess.rec=rec; sess.newBest=sess.ok>best&&sess.ok>0; addXp(sess.ok*2,true); save(); if(sess.newBest&&sess.ok>=5){setTimeout(()=>{confetti();fxBig("win");},200);} else sfx("badge"); go("speedEnd"); }
function vSpeedEnd(){ const r=sess.rec; const n=r.ok+r.no; const acc=n?Math.round(r.ok/n*100):0;
 return top("Speed round",{back:true,backAct:"home",closeIcon:true})+'<div class="stack"><div class="card" style="text-align:center;display:grid;gap:6px"><span class="label">'+(sess.newBest?"New best!":"Score")+'</span><div class="num" style="font-size:52px;font-weight:700;color:'+(sess.newBest?"var(--good)":"var(--ink)")+'">'+r.ok+'</div><div>'+acc+'% right · '+r.no+' wrong · best '+(S.best.speed||0)+' · <b style="color:var(--gold)">+'+(r.ok*2)+' XP</b></div></div>'+
 (sess.wrong.length?'<div class="card stack"><span class="label">Fix these</span>'+sess.wrong.map(w=>'<div style="display:grid;gap:4px;padding:10px 0;border-bottom:1px solid var(--line)"><b>'+esc(w.s)+'</b><div class="small" style="color:'+(w.a?"var(--good)":"var(--bad)")+'">'+(w.a?"This was TRUE":"This was FALSE")+'</div><div class="official small">'+esc(w.e)+'</div></div>').join("")+'</div>':'')+
 '<button class="btn" data-act="speed">Go again</button><button class="btn ghost" data-act="home">Back to Today</button></div>'; }

// ---------- backup (both courses) ----------
async function gz(str){ if(!window.CompressionStream)return null; const cs=new CompressionStream("gzip"); const w=cs.writable.getWriter(); w.write(new TextEncoder().encode(str)); w.close(); const b=new Uint8Array(await new Response(cs.readable).arrayBuffer()); let s=""; for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000)); return btoa(s); }
async function gunz(b64){ const bin=atob(b64); const b=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i); const ds=new DecompressionStream("gzip"); const w=ds.writable.getWriter(); w.write(b); w.close(); return await new Response(ds.readable).text(); }
async function makeBackup(){ flush(); const o={v:2,app:"exam-sprint",t:Date.now(),courses:{}}; o.courses[C.id]=S; const other=parseState(rawGet(OTHER.key)); if(other)o.courses[OTHER.id]=other;
 const json=JSON.stringify(o); let z=null; try{ z=await gz(json); }catch(e){} return z?"ES2:"+z:"ES2J:"+btoa(unescape(encodeURIComponent(json))); }
async function readBackup(code){ code=String(code||"").replace(/\s+/g,""); let json; if(code.indexOf("ES2:")===0)json=await gunz(code.slice(4)); else if(code.indexOf("ES2J:")===0)json=decodeURIComponent(escape(atob(code.slice(5)))); else json=decodeURIComponent(escape(atob(code))); return JSON.parse(json); }
function detectCourse(o){ const ex=o.settings&&o.settings.exam; if(ex==="2026-11-20"||ex==="2026-11-18")return "itil"; if(ex==="2026-12-20")return "prince2"; const ids=Object.keys(o.items||{}); const hit=ids.filter(id=>Q[id]).length; return (ids.length&&hit>=Math.max(3,ids.length*0.2))?C.id:OTHER.id; }
function mergeStates(a,b){ a=a||fresh(); b=b||{}; const r=JSON.parse(JSON.stringify(a)); const fr=!a.updatedAt&&!a.tot.a;
 r.xp=Math.max(a.xp||0,b.xp||0);
 r.items=Object.assign({},a.items||{}); Object.keys(b.items||{}).forEach(id=>{ const x=r.items[id],y=b.items[id]; if(!x||((y.l||0)>(x.l||0)))r.items[id]=y; });
 ["lessons","cardsRead","badges"].forEach(k=>{ r[k]=Object.assign({},b[k]||{},a[k]||{}); });
 r.daily=Object.assign({},a.daily||{}); Object.keys(b.daily||{}).forEach(k=>{ r.daily[k]=Math.max(r.daily[k]||0,b.daily[k]||0); });
 ["mocks","drives","speed"].forEach(k=>{ const seen={}; r[k]=(a[k]||[]).concat(b[k]||[]).filter(m=>{ const key=m.t+"|"+(m.score!=null?m.score:m.ok); if(seen[key])return false; seen[key]=1; return true; }).sort((x,y)=>x.t-y.t); });
 const sa=a.streak||{count:0,last:0}, sb=b.streak||{count:0,last:0}; r.streak=(sb.last>sa.last||(sb.last===sa.last&&sb.count>sa.count))?sb:sa;
 const ba=a.best||{}, bb=b.best||{}; r.best={combo:Math.max(ba.combo||0,bb.combo||0),mock:Math.max(ba.mock||0,bb.mock||0),speed:Math.max(ba.speed||0,bb.speed||0)};
 const ta=a.tot||{a:0,c:0}, tb=b.tot||{a:0,c:0}; r.tot=(tb.a||0)>(ta.a||0)?tb:ta;
 if(fr&&b.settings)r.settings=Object.assign({},a.settings,b.settings,{exam:a.settings.exam,mig1:1}); r.plan=Object.assign({},b.plan||{},a.plan||{}); r.updatedAt=Date.now(); return r; }
function applyImported(cid,st){ if(!st||!st.items)return false; if(cid===C.id){ S=normState(mergeStates(S,st)); migrate(); flush(); return true; } if(cid===OTHER.id){ const cur=parseState(rawGet(OTHER.key)); rawSet(OTHER.key,JSON.stringify(cur?mergeStates(normState(cur),st):st)); return true; } return false; }
async function importCode(code){ const o=await readBackup(code); let n=0; if(o&&o.v===2&&o.courses){ Object.keys(o.courses).forEach(cid=>{ if(applyImported(cid,o.courses[cid]))n++; }); } else if(o&&o.items){ if(applyImported(detectCourse(o),o))n++; } if(!n)throw new Error("empty"); return n; }
function readBackupFile(input){ const f=input.files&&input.files[0]; if(!f)return; const rd=new FileReader(); rd.onload=()=>{ const box=$("#importBox"); if(box)box.value=String(rd.result||"").trim(); toast("File loaded. Tap Restore."); }; rd.readAsText(f); }

// ---------- theme, migration, boot ----------
function applyTheme(){ const t=rawGet("es-theme")||""; let dark; if(t==="dark")dark=true; else if(t==="light")dark=false; else { try{ dark=(NATIVE&&window.Android.isNight)?!!window.Android.isNight():!!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches); }catch(e){ dark=false; } }
 const de=document.documentElement; de.setAttribute("data-theme",dark?"dark":"light"); de.setAttribute("data-course",C.id);
 try{ const bg=getComputedStyle(de).getPropertyValue("--bg").trim()||(dark?"#0d1020":"#f3f4fa"); const m=document.querySelector('meta[name="theme-color"]'); if(m)m.setAttribute("content",bg); if(NATIVE&&window.Android.setBars)window.Android.setBars(bg,!dark); }catch(e){} }
function migrate(){ if(!S.plan)S.plan={}; if(C.id==="itil"&&!S.settings.mig1){ if(S.settings.exam==="2026-11-20")S.settings.exam="2026-11-18"; S.settings.mig1=1; } }
function openZoom(src){ closeZoom(); sfx("swipe"); const d=document.createElement("div"); d.className="zoomov"; d.id="zoomov"; d.innerHTML='<button class="iconbtn zx" aria-label="Close">'+ICON.close+'</button><img src="'+esc(src)+'" alt="Course figure"><p class="zhint">Tap the image to zoom in or out</p>';
 d.addEventListener("click",e=>{ e.stopPropagation(); if(e.target.closest(".zx")){ closeZoom(); return; } if(e.target.tagName==="IMG"){ d.classList.toggle("big"); } }); document.body.appendChild(d); }
function closeZoom(){ const z=document.getElementById("zoomov"); if(z){ z.remove(); return true; } return false; }
function featureAction(a,b,id){ switch(a){
 case "zoom": openZoom(b.dataset.src); return true;
 case "course": switchCourse(id); return true;
 case "papers": sess=null; go("papers"); return true;
 case "paperIntro": go("paperIntro",{id:id||""}); return true;
 case "startPaper": { const L=loadLive(); if(L)clearLive(); startMock(id||null,!!S.settings.extra); return true; }
 case "toggleExtra": S.settings.extra=!S.settings.extra; save(); render(); return true;
 case "resumeMock": { const L=loadLive(); if(!L){toast("Nothing to resume");render();return true;} sess=Object.assign(L,{live:true,qt0:Date.now(),confirm:false,quit:false}); if(!sess.tq)sess.tq={}; if(Date.now()>=sess.end)finishMock(true); else go("mock"); return true; }
 case "discardLive": clearLive(); render(); return true;
 case "weak": { const w=weakIds(); if(w.ids.length<5){toast("Answer a few more questions first, then Weak spots knows where you struggle.");return true;} startQuiz(shuffle(w.ids),"Weak spots"); toast("Focus: "+w.ls.join(" · ")); return true; }
 case "speed": startSpeed(); return true;
 case "tf": answerTF(b.dataset.v); return true;
 case "speedQuit": endSpeed(); return true;
 case "traps": go("pickDrill",{kind:"trap",mf:""}); return true;
 case "aids": go("aids"); return true;
 case "mnem": startDrill("mnem",id); return true;
 case "guide": go("guide"); return true;
 case "plan": go("plan"); return true;
 case "glossary": go("glossary"); return true;
 case "qrg": go("qrg"); return true;
 case "products": go("products"); return true;
 case "prodMatch": { const L=MATCHES.filter(x=>x.t.indexOf("Management products")===0); if(!L.length){toast("Nothing to match yet");return true;} startDrill("match",L[Math.floor(Math.random()*L.length)].id); return true; }
 case "reviews": { const d=dueIds(); if(!d.length){toast("No reviews due right now");return true;} startQuiz(d.slice(0,20),"Reviews"); return true; }
 case "learnNew": { const n=newIds(""); if(!n.length){toast("You have seen every question. Try a simulation.");return true;} startQuiz(n.slice(0,15),"New questions"); return true; }
 case "nextUnread": { const nl=nextLesson(); if(nl)go("lesson",{id:nl.l.id,i:0}); else toast("All lessons read. Well done."); return true; }
 case "unsure": if(sess&&sess.kind==="quiz"&&!sess.answered){ sess.unsure=!sess.unsure; render(); } return true;
 case "theme": rawSet("es-theme",id||""); applyTheme(); render(); return true;
 case "remToggle": { const r=getRem(); if(r.on){ r.on=false; setRem(r); toast("Reminders off"); render(); } else if(NATIVE&&window.Android.askNotify){ pushFacts(true); window.Android.askNotify(); } else toast("Reminders work in the Android app"); return true; }
 case "remTime": { const r=getRem(); const i=r.times.indexOf(id); if(i>=0){ if(r.times.length>1)r.times.splice(i,1); else toast("Keep at least one time"); } else { if(r.times.length>=4){toast("Up to 4 times");return true;} r.times.push(id); } setRem(r); render(); return true; }
 case "remTest": pushFacts(true); try{ window.Android.testNotify(); toast("Sent. Check your notifications."); }catch(e){} return true;
 case "mkBackup": makeBackup().then(code=>{ view.bk=code; render(); setTimeout(()=>{const t=$("#codeBox"); if(t)t.scrollIntoView({block:"center"});},50); }).catch(()=>toast("Could not create the backup")); return true;
 case "copyBackup": copyText(view.bk||""); return true;
 case "shareBackup": try{ window.Android.share(view.bk||"","Exam Sprint backup "+dayKey(today())); }catch(e){} return true;
 case "saveBackup": { let p=""; try{ p=window.Android.saveFile("exam-sprint-backup-"+dayKey(today())+".txt",view.bk||""); }catch(e){} toast(p?"Saved to "+p:"Could not save the file"); return true; }
 case "pasteBackup": { let t=""; try{ t=window.Android.paste(); }catch(e){} const box=$("#importBox"); if(box)box.value=t||""; toast(t?"Pasted. Tap Restore.":"The clipboard is empty"); return true; }
 case "openBackup": { const f=$("#bkFile"); if(f)f.click(); return true; }
 case "doImport": { const v=(($("#importBox")||{}).value||"").trim(); if(!v){toast("Paste a code first");return true;} importCode(v).then(n=>{ toast("Restored "+n+" course"+(n>1?"s":"")+", merged with what you had"); setTimeout(()=>location.reload(),1200); }).catch(()=>toast("That code is not valid. Copy the whole code and try again.")); return true; }
 } return false; }

window.onAndroidBack=function(){ try{
 if(closeZoom())return true;
 const v=view.name;
 if(sess&&(sess.confirm||sess.quit)){ sess.confirm=false; sess.quit=false; render(); return true; }
 if(view.reset){ view.reset=false; render(); return true; }
 if(v==="home")return false;
 if(v==="mock"){ sess.quit=true; render(); return true; }
 if(v==="speed"){ endSpeed(); return true; }
 if(v==="lesson"){ const L=LESS[view.id]; go("module",{id:L?L.m.id:MODULES[0].id}); return true; }
 if(v==="module"){ go("learn"); return true; }
 if(v==="quiz"&&sess&&sess.lesson){ const L=LESS[sess.lesson]; sess=null; go("module",{id:L.m.id}); return true; }
 if(["order","sort","match","drillEnd"].indexOf(v)>=0){ const k=sess?(sess.src||sess.kind):"order"; sess=null; if(k==="mnem")go("aids"); else go("pickDrill",{kind:k}); return true; }
 const parent={pickDrill:"practice",paperIntro:"papers",guide:"learn",aids:"learn",glossary:"learn",qrg:"learn",products:"learn"}[v];
 if(["quiz","quizEnd","mockEnd","drive","driveEnd","flash","speedEnd"].indexOf(v)>=0)sess=null;
 go(parent||"home"); return true;
 }catch(e){ sess=null; go("home"); return true; } };
window.onAndroidPause=function(){ if(saveT)flush(); saveLive(); };
let lastDay=today();
window.onAndroidResume=function(){ applyTheme(); if(today()!==lastDay){ lastDay=today(); if(!sess||!sess.live)render(); } };
window.onAndroidTheme=function(){ applyTheme(); };
window.onAndroidNotify=function(ok){ const r=getRem(); r.on=!!ok; setRem(r); toast(ok?"Reminders on":"Notifications are blocked. Allow them for Exam Sprint in Android settings."); if(view.name==="settings")render(); };
try{ if(window.matchMedia)matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{ if(!rawGet("es-theme"))applyTheme(); }); }catch(e){}
function boot(){ migrate(); applyTheme(); rawSet("es-course",C.id); render(); checkBadges(); setTimeout(()=>{ try{ pushStatus(); pushFacts(false); const r=getRem(); if(r.on)setRem(r); }catch(e){} },400); }


boot();
})();
