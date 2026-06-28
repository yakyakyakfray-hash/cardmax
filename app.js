/* app.js — CardMax
 * Auth gate + per-user Cloud Firestore sync, with an automatic LOCAL MODE
 * fallback (localStorage) when Firebase config hasn't been filled in yet.
 * Rendering and the green/net math are preserved verbatim from the prototype. */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  initializeFirestore, persistentLocalCache, persistentSingleTabManager,
  doc, onSnapshot, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const CARDS = window.CARDS;
const cfg = window.FIREBASE_CONFIG || {};
// If the config still has placeholder values, fall back to device-only storage.
const LOCAL_MODE = !cfg.apiKey || /YOUR_|PASTE|xxxx/i.test(cfg.apiKey);

const LS_KEY = "ccRewardMax_v1";   // same key as the prototype (data carries over)

let state = loadLocal();           // { [benefitId]: dollars }
let uid = null, db = null, auth = null, unsub = null, writeTimer = null;

/* ---------------- local persistence (fallback + offline mirror) -------------- */
function loadLocal(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }catch(e){ return {}; } }
function saveLocal(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }

/* ---------------- helpers (unchanged math) ---------------------------------- */
function cap(id){ return Math.max(0, Number(state[id] || 0)); }
const money = n => (n<0?"-$":"$") + Math.abs(Math.round(n)).toLocaleString();
function find(id){ for(const c of CARDS) for(const it of c.items) if(it[0]===id) return it; }

/* ---------------- write path ------------------------------------------------ */
function setBenefit(id, value){
  state[id] = value;
  saveLocal();          // optimistic + offline mirror
  scheduleCloudWrite();
  render();
}
function scheduleCloudWrite(){
  if(LOCAL_MODE || !uid || !db) return;
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    setDoc(doc(db, "users", uid),
      { captured: state, updatedAt: serverTimestamp() },
      { merge: true }
    ).catch(err => console.warn("[CardMax] cloud write failed (will retry on next change):", err.message));
  }, 600);              // debounce rapid typing
}

/* ---------------- render (preserved from prototype) ------------------------- */
function render(){
  let oFee=0,oCap=0,oMax=0;
  const host=document.getElementById("cards");host.innerHTML="";
  CARDS.forEach(card=>{
    let cMax=0,cCap=0;
    card.items.forEach(it=>{cMax+=it[2];cCap+=Math.min(cap(it[0]),it[2])});
    oFee+=card.fee;oCap+=cCap;oMax+=cMax;
    const net=cCap-card.fee;const green=net>=0;
    const pct=Math.min(100,Math.round(cCap/card.fee*100));
    const box=document.createElement("div");box.className="cardbox";
    box.innerHTML=`<div class="chead" style="background:${card.color}">
        <h2>${card.name}</h2>
        <span class="fee">Fee ${money(card.fee)} · ${money(cCap)} captured</span>
        <span class="net" style="color:${green?'#caffd9':'#ffd9d4'}">${green?'✓ ':''}Net ${money(net)}</span>
      </div>
      <div class="cbar"><span style="width:${pct}%"></span></div>`;
    card.items.forEach(it=>{
      const [id,name,val,freq,catg,how]=it;
      const c=cap(id);const done=val>0&&c>=val;
      const exp=freq.indexOf("ENDS")>-1;
      const row=document.createElement("div");row.className="row"+(done?" done":"");
      row.innerHTML=`
        <input type="checkbox" class="cb" ${done?"checked":""} ${val?"":"disabled"} data-full="${id}">
        <div class="main">
          <div class="name">${name}</div>
          <div class="meta"><span class="chip ${exp?'exp':''}">${freq}</span><span class="chip">${catg}</span></div>
          <button class="toggle" data-how="${id}">How to use ▾</button>
          <div class="how" id="how-${id}">${how}</div>
        </div>
        <div class="val">
          <div class="amt">${val?money(val):'<span style="color:var(--muted);font-weight:500">perk</span>'}</div>
          ${val?`<div class="inp">$<input type="number" min="0" max="${val}" value="${c||''}" placeholder="0" data-inp="${id}"></div>
          <div class="rem">${money(Math.max(val-c,0))} left</div>`:''}
        </div>`;
      box.appendChild(row);
    });
    host.appendChild(box);
  });
  // overview
  document.getElementById("oFee").textContent=money(oFee);
  document.getElementById("oCap").textContent=money(oCap);
  const onet=oCap-oFee;
  const oNetEl=document.getElementById("oNet");oNetEl.textContent=money(onet);
  oNetEl.style.color=onet>=0?"var(--green)":"var(--red)";
  document.getElementById("oMax").textContent=money(oMax);
  const opct=Math.min(100,Math.round(oCap/oFee*100));
  const bw=document.getElementById("oBarWrap");bw.className="bar"+(onet>=0?" green":"");
  document.getElementById("oBar").style.width=opct+"%";
  document.getElementById("oPct").innerHTML=`<b>${opct}%</b> of total fees recovered · ${money(Math.max(oFee-oCap,0))} of value still on the table`;
  document.getElementById("foot").innerHTML="Figures reflect published 2025–2026 terms (Venture X $395; Sapphire Reserve $795, refreshed 2025; Amex Platinum $895, refresh applies at renewal on/after Jan 2 2026). 'Perk' items have variable value and aren't counted in totals. Recurring credits don't roll over. Verify amounts in each issuer's app. Not financial advice.";
  bind();
}
function bind(){
  document.querySelectorAll("[data-how]").forEach(b=>b.onclick=()=>{
    document.getElementById("how-"+b.dataset.how).classList.toggle("show");});
  document.querySelectorAll("[data-full]").forEach(cb=>cb.onchange=()=>{
    const id=cb.dataset.full;const it=find(id);
    setBenefit(id, cb.checked?it[2]:0);});
  document.querySelectorAll("[data-inp]").forEach(inp=>inp.onchange=()=>{
    const id=inp.dataset.inp;const it=find(id);
    let v=Math.max(0,Math.min(Number(inp.value||0),it[2]));
    setBenefit(id, v);});
}
window.resetAll=function(){ if(confirm("Clear all logged progress?")){ state={}; saveLocal(); scheduleCloudWrite(); render(); } };

/* ---------------- view switching -------------------------------------------- */
const $ = id => document.getElementById(id);
function showApp(user){
  $("login").classList.add("app-hidden");
  $("app").classList.remove("app-hidden");
  if(user){
    $("userbox").style.display="";
    $("uName").textContent = user.displayName || user.email || "Signed in";
    if(user.photoURL){ $("uAvatar").src = user.photoURL; $("uAvatar").style.display=""; }
    else { $("uAvatar").style.display="none"; }
  } else {
    $("userbox").style.display="none";   // local mode: no account chrome
  }
}
function showLogin(msg, isErr){
  $("app").classList.add("app-hidden");
  $("login").classList.remove("app-hidden");
  const m=$("loginMsg"); m.textContent=msg||""; m.className="loginMsg"+(isErr?" err":"");
}

/* ---------------- boot ------------------------------------------------------ */
if(LOCAL_MODE){
  // No Firebase yet → device-only mode. Show the app immediately.
  showApp(null);
  $("modeBanner").hidden=false;
  $("modeBanner").textContent="Local mode — progress is saved on this device only. Add your Firebase config in firebase-config.js to enable Google sign-in and cloud sync.";
  render();
} else {
  const app = initializeApp(cfg);
  auth = getAuth(app);
  // Persistent cache → data + app shell work offline; sync resumes when online.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentSingleTabManager() })
  });

  const provider = new GoogleAuthProvider();
  // Installed PWAs / mobile Safari often can't open a usable popup, and a
  // cross-domain redirect trips "missing initial state". We keep authDomain on
  // our own hosting domain (same-origin) and fall back from popup to redirect.
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;

  $("loginBtn").onclick = async () => {
    $("loginBtn").disabled = true;
    showLogin("Opening Google sign-in…", false);
    if (isStandalone) {                       // home-screen app → redirect is reliable
      try { await signInWithRedirect(auth, provider); }
      catch (err) { showLogin(err.message || "Sign-in failed.", true); $("loginBtn").disabled = false; }
      return;
    }
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      const code = (err && (err.code + " " + err.message)) || "";
      if (/popup|cancelled-popup|operation-not-supported|web-storage|missing initial/i.test(code)) {
        try { await signInWithRedirect(auth, provider); return; } catch (e2) { err = e2; }
      }
      showLogin(err.message || "Sign-in failed.", true);
    } finally {
      $("loginBtn").disabled = false;
    }
  };
  $("signoutBtn").onclick = () => signOut(auth);

  // Complete a redirect-based sign-in (and surface any error) on page load.
  getRedirectResult(auth).catch(err => {
    if (err && err.code !== "auth/no-auth-event") showLogin(err.message || "Sign-in failed.", true);
  });

  onAuthStateChanged(auth, user => {
    if(user){
      uid = user.uid;
      showApp(user);
      subscribe(uid);
    } else {
      uid = null;
      if(unsub){ unsub(); unsub = null; }
      showLogin("", false);
    }
  });
}

function subscribe(theUid){
  if(unsub) unsub();
  const ref = doc(db, "users", theUid);
  unsub = onSnapshot(ref, snap => {
    const captured = (snap.data() && snap.data().captured) || {};
    // Don't yank a field the user is actively editing; apply otherwise.
    const editing = document.activeElement && document.activeElement.tagName === "INPUT";
    if(!editing){
      state = { ...captured };
      saveLocal();
      render();
    }
  }, err => console.warn("[CardMax] snapshot error:", err.message));
}

/* ---------------- PWA: register service worker ------------------------------ */
if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
