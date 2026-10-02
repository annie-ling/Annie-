
import './style.css';
import { PREMIUM_API } from './premium-config.js';

const $ = s => document.querySelector(s);
const esc = (v='') => String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

const profiles = {
  1:{name:'開創型',keys:['直接','自主','行動'],need:'被尊重、被信任，也需要保有自己的決定空間。',trigger:'被控制、被否定，或每件事都要被追問。',conflict:'情緒上來時容易先捍衛立場，語氣可能比心意更強。'},
  2:{name:'共感型',keys:['細膩','關係','陪伴'],need:'穩定回應、溫柔確認，以及「你有把我放在心上」的感覺。',trigger:'冷處理、忽冷忽熱、敷衍回應。',conflict:'容易先忍耐，累積久了才一次把委屈說出來。'},
  3:{name:'表達型',keys:['分享','有趣','浪漫'],need:'分享感、肯定與有趣的互動，希望愛情裡可以做自己。',trigger:'長期沒有回應、過度嚴肅或一直被潑冷水。',conflict:'可能用玩笑帶過真正的情緒，讓對方沒發現你其實受傷了。'},
  4:{name:'穩定型',keys:['承諾','可靠','踏實'],need:'穩定、承諾與可預期的行動，比漂亮話更相信「你有做到」。',trigger:'反覆改變、失約、說到卻做不到。',conflict:'會抓住事情本身與規則，容易讓對方覺得缺少情緒理解。'},
  5:{name:'自由型',keys:['變化','體驗','空間'],need:'新鮮感、自由與一起體驗生活，不喜歡關係變成束縛。',trigger:'過度查勤、限制交友、每天都一模一樣。',conflict:'壓力大時會想先離開現場，需要空間整理自己。'},
  6:{name:'照顧型',keys:['責任','珍惜','家庭'],need:'被珍惜、被需要與穩定陪伴，也很在意關係中的責任感。',trigger:'把付出視為理所當然，或重要時刻缺席。',conflict:'容易一邊照顧一邊期待對方懂，沒被理解時會特別失落。'},
  7:{name:'深度型',keys:['理解','信任','獨處'],need:'深度理解、信任與適量獨處，不喜歡被逼著立刻表態。',trigger:'逼問、侵犯隱私、情緒還沒整理好就要求答案。',conflict:'容易先沉默思考，對方可能誤會成冷淡或逃避。'},
  8:{name:'成長型',keys:['尊重','成果','共同前進'],need:'尊重、可靠與共同成長，希望兩個人能一起把生活變得更好。',trigger:'不負責任、反覆失信，或把所有壓力丟給你。',conflict:'容易快速進入解決問題模式，忘了對方可能先需要被理解。'},
  9:{name:'理想型',keys:['包容','深情','意義'],need:'真誠、情感深度與價值觀共鳴，也希望彼此能理解對方的世界。',trigger:'冷漠、缺乏同理，或一再消耗你的善意。',conflict:'容易把失望放在心裡很久，直到某個瞬間突然想全部放下。'},
  11:{name:'直覺型',keys:['敏感','靈感','共鳴'],need:'被理解你的敏銳與直覺，也需要真誠、有精神共鳴的互動。',trigger:'忽視感受、言行不一，或把你的敏感當成麻煩。',conflict:'容易先感受到不對勁，卻不一定能立刻說清楚原因。'},
  22:{name:'築夢型',keys:['未來','建構','責任'],need:'一起規劃未來、一起把生活變好的夥伴感。',trigger:'沒有方向、承諾空泛，或長期只有一個人在撐。',conflict:'遇到問題會想處理整個系統，容易讓對方感到壓力。'},
  33:{name:'療癒型',keys:['溫柔','付出','陪伴'],need:'被珍惜、被理解，也需要有人提醒你不用永遠當照顧者。',trigger:'把你的付出當成理所當然，或只在需要時靠近。',conflict:'容易先承接對方情緒，最後才發現自己的需要被放到很後面。'}
};

const sumDigits = v => String(v).replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0);
function reduceLife(n){ while(n>9 && ![11,22,33].includes(n)) n=sumDigits(n); return n; }
function lifePath(date){ return reduceLife(sumDigits(date)); }
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));

function relationMetrics(a,b){
  const diff=Math.abs(a-b);
  const shared=(profiles[a]?.keys||[]).filter(x=>(profiles[b]?.keys||[]).includes(x)).length;
  const base=78 - Math.min(diff,9)*2 + shared*4;
  return {
    emotion:clamp(base + ((a+b)%7)-3,58,96),
    talk:clamp(base + ((a*b)%9)-4,55,95),
    long:clamp(base + ((a+b)%5)+1,57,96),
    growth:clamp(72 + (diff%6)*3,61,96)
  };
}
function relationType(m){
  const avg=Math.round((m.emotion+m.talk+m.long+m.growth)/4);
  if(avg>=88)return ['默契共振型','你們很容易理解彼此的節奏；真正重要的是不要把「懂」當成不用說。'];
  if(avg>=80)return ['穩定成長型','你們有不錯的互補性，關係會在一次次把需求說清楚後越來越穩。'];
  if(avg>=71)return ['互補磨合型','你們不是沒有默契，而是愛的語言不同；學會翻譯彼此，比追求完全一樣更重要。'];
  return ['需要翻譯型','你們的需求差異比較明顯，但差異不等於不適合；關鍵在於能不能把各自的在意說成對方聽得懂的方式。'];
}
function pairText(a,b){
  const A=profiles[a],B=profiles[b];
  const same=a===b;
  return {
    stuck:same
      ? `你們很像，所以舒服的地方很舒服，但卡住時也容易一起進入同一種反應。當兩個人都在等待對方先改變，問題就會反覆出現。`
      : `你比較在意「${A.need.split('。')[0]}」，對方則更需要「${B.need.split('。')[0]}」。真正的卡點通常不是誰比較愛，而是你們用自己的方式給愛，卻剛好不是對方最容易收到的方式。`,
    attraction:`你們會被彼此吸引，往往來自差異與熟悉感同時存在。你身上的「${A.keys[0]}」會讓對方感受到不一樣的能量，而對方的「${B.keys[0]}」也可能補上你平常比較少使用的一面。`,
    long:`長期相處時，建議把「愛的感覺」變成可被看見的行動。你需要的是${A.need}；對方需要的是${B.need}。兩個需求都被放進日常，關係才不會只靠猜。`,
    lesson:`這段關係最重要的成長，不是把彼此改成一樣，而是練習在不同節奏裡仍能保有尊重。當衝突發生時，先處理安全感，再處理事情本身，通常會比急著分對錯更有效。`,
    advice:[
      `把需求講成具體行動：不要只說「你都不懂我」，改成「我希望你在___時，可以___」。`,
      `衝突時先辨認彼此是在需要靠近，還是需要一點空間；不要用同一種方式處理所有情緒。`,
      `固定保留一個沒有要解決問題的相處時間，只聊天、分享或做你們都喜歡的事。`
    ]
  };
}

document.querySelector('#app').innerHTML = `
<div class="top"><div class="brand">10の小基地♡</div><a href="#test">感情測驗</a></div>
<main class="wrap">
  <section class="hero">
    <span class="eyebrow">LOVE COMPATIBILITY</span>
    <h1>你們不是不合，<br>可能只是愛人的方式不同。</h1>
    <p>輸入兩個人的生日，先看看彼此在感情裡真正需要什麼、容易卡在哪裡，以及你們習慣的相處模式 ♡</p>
    <div class="hero-note">免費版可直接測試・完整解析 NT$149</div>
  </section>

  <section id="test" class="card form-card">
    <label>你的暱稱 <small>選填</small></label>
    <input id="nameA" placeholder="例：伊玲">
    <label>你的生日</label>
    <input id="dateA" type="date">
    <label>對方暱稱 <small>選填</small></label>
    <input id="nameB" placeholder="例：對方">
    <label>對方生日</label>
    <input id="dateB" type="date">
    <button class="primary" id="testBtn">看看我們的感情模式 💗</button>
    <div class="status" id="status"></div>
    <p class="fineprint">此測驗以生命靈數作為娛樂與自我探索用途，不代表關係好壞，也不是心理或伴侶諮商評估。</p>
  </section>

  <section id="results" class="results hidden">
    <div class="share-card">
      <span class="eyebrow">OUR LOVE PROFILE</span>
      <div class="score"><span id="score">--</span><small>%</small></div>
      <h2 id="type"></h2>
      <p id="summary"></p>
      <div class="chips" id="chips"></div>
      <button class="secondary" id="shareBtn">分享我們的戀愛關係卡 💌</button>
    </div>

    <div class="metrics">
      <div class="metric"><small>情感理解</small><strong id="emotion"></strong></div>
      <div class="metric"><small>溝通契合</small><strong id="talk"></strong></div>
      <div class="metric"><small>長期相處</small><strong id="long"></strong></div>
      <div class="metric"><small>成長互補</small><strong id="growth"></strong></div>
    </div>

    <div class="pair">
      <article class="panel"><span class="eyebrow">01 · YOUR LOVE NEED</span><h3 id="needATitle"></h3><p id="needA"></p></article>
      <article class="panel"><span class="eyebrow">02 · PARTNER LOVE NEED</span><h3 id="needBTitle"></h3><p id="needB"></p></article>
    </div>
    <article class="panel feature"><span class="eyebrow">03 · STUCK POINT</span><h3>你們最容易卡住的地方</h3><p id="stuck"></p></article>

    <div id="paidGate" class="gate">
      <div class="lock">🔒</div>
      <span class="premium-badge">LOVE DEEP READING</span>
      <h2>免費解析先看到這裡 ♡</h2>
      <p>但真正容易讓一段關係反覆卡住的，往往不只是「合不合」，而是彼此怎麼理解愛、需要什麼，以及遇到衝突時會怎麼反應。</p>

      <div class="lock-list">
        <span>🔒 你們吵架時真正發生了什麼</span>
        <span>🔒 彼此最容易踩到的感情地雷</span>
        <span>🔒 為什麼會被彼此吸引</span>
        <span>🔒 長期相處模式與關係課題</span>
        <span>🔒 彼此真正需要的安全感</span>
        <span>🔒 給你們的 3 個專屬相處方法</span>
      </div>

      <div class="price-box">
        <div class="price-row"><span>雙人完整感情解析</span><strong>NT$149</strong></div>
        <div class="price-caption">一次解鎖・不用重新測驗</div>
      </div>

      <a class="line-pay" id="linePay" href="https://lin.ee/yCtrP2r" target="_blank" rel="noopener">前往 LINE 解鎖完整解析</a>
      <p class="unlock-note">加入官方 LINE 後輸入「完整解析」♡<br>就會收到付款與解鎖方式。</p>
      <div class="funnel-note"><b>付款後不用重新測驗</b><br>取得專屬解鎖碼後，直接回到這個頁面輸入即可。</div>

      <div class="code-unlock">
        <label for="unlockCode">已付款？輸入專屬解鎖碼</label>
        <div class="code-row">
          <input id="unlockCode" autocomplete="off" placeholder="輸入解鎖碼">
          <button class="unlock-btn" id="unlockBtn">解鎖</button>
        </div>
        <p id="unlockStatus" class="unlock-status">付款完成後，請輸入你在 LINE 收到的專屬解鎖碼。</p>
      </div>
    </div>

    <div id="paidContent" class="hidden">
      <div class="paid-head"><span class="eyebrow">FULL LOVE READING</span><h2>你們的完整感情解析 ♡</h2></div>
      <article class="panel"><span class="eyebrow">04 · CONFLICT</span><h3>吵架時的你們</h3><p id="conflict"></p></article>
      <article class="panel"><span class="eyebrow">05 · TRIGGER</span><h3>彼此的感情地雷</h3><p id="trigger"></p></article>
      <article class="panel"><span class="eyebrow">06 · ATTRACTION</span><h3>為什麼會被彼此吸引</h3><p id="attraction"></p></article>
      <article class="panel"><span class="eyebrow">07 · LONG TERM</span><h3>長期相處模式</h3><p id="longTerm"></p></article>
      <article class="panel feature"><span class="eyebrow">08 · LESSON</span><h3>這段關係的成長課題</h3><p id="lesson"></p></article>
      <article class="panel feature"><span class="eyebrow">09 · ADVICE</span><h3>讓關係更舒服的 3 個方法</h3><div class="advice" id="advice"></div></article>
    </div>
  </section>

  <div class="footer">10の小基地♡ · 感情契合度測驗</div>
</main>`;

let lastResult=null;

function apiConfigured(){
  return !!(PREMIUM_API?.url && PREMIUM_API?.anonKey && !String(PREMIUM_API.url).includes('YOUR_'));
}
async function rpc(name, body={}){
  const res=await fetch(`${PREMIUM_API.url}/rest/v1/rpc/${name}`,{
    method:'POST',
    headers:{
      apikey:PREMIUM_API.anonKey,
      Authorization:`Bearer ${PREMIUM_API.anonKey}`,
      'Content-Type':'application/json'
    },
    body:JSON.stringify(body)
  });
  let data=null;
  const txt=await res.text();
  try{data=txt?JSON.parse(txt):null}catch{data=txt}
  if(!res.ok) throw new Error(data?.message || data?.details || `HTTP ${res.status}`);
  return data;
}
function getDeviceToken(){
  let token=localStorage.getItem('mysticRelationshipDeviceToken');
  if(!token){
    token=(crypto?.randomUUID?.() || `rel-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem('mysticRelationshipDeviceToken',token);
  }
  return token;
}
async function track(eventName){
  if(!apiConfigured()) return;
  try{ await rpc('record_relationship_event',{p_event:eventName,p_device_token:getDeviceToken()}); }
  catch(e){ console.warn('relationship event log failed',e); }
}
function setUnlocked(on){
  $('#paidGate').classList.toggle('hidden',on);
  $('#paidContent').classList.toggle('hidden',!on);
  if(on) localStorage.setItem('mysticRelationship149Active','1');
}
async function restoreAccess(){
  if(localStorage.getItem('mysticRelationship149Active')==='1') setUnlocked(true);
  if(!apiConfigured()) return;
  try{
    const r=await rpc('check_relationship_license',{p_device_token:getDeviceToken()});
    const ok=r===true || r?.ok===true || r?.active===true;
    if(ok) setUnlocked(true);
  }catch(e){ console.warn('restore failed',e); }
}

$('#testBtn').addEventListener('click',async()=>{
  const da=$('#dateA').value, db=$('#dateB').value;
  if(!da||!db){ $('#status').textContent='請先輸入兩個人的生日 ♡'; return; }
  const na=$('#nameA').value.trim()||'你';
  const nb=$('#nameB').value.trim()||'對方';
  const a=lifePath(da), b=lifePath(db);
  const A=profiles[a]||profiles[9], B=profiles[b]||profiles[9];
  const m=relationMetrics(a,b);
  const avg=Math.round((m.emotion+m.talk+m.long+m.growth)/4);
  const [type,summary]=relationType(m);
  const pair=pairText(a,b);

  $('#score').textContent=avg;
  $('#type').textContent=type;
  $('#summary').textContent=summary;
  $('#chips').innerHTML=[...new Set([A.keys[0],B.keys[0],'需要被理解'])].map(x=>`<span>${esc(x)}</span>`).join('');
  $('#emotion').textContent=m.emotion+'%';
  $('#talk').textContent=m.talk+'%';
  $('#long').textContent=m.long+'%';
  $('#growth').textContent=m.growth+'%';
  $('#needATitle').textContent=`${na}真正需要的愛`;
  $('#needA').textContent=A.need;
  $('#needBTitle').textContent=`${nb}真正需要的愛`;
  $('#needB').textContent=B.need;
  $('#stuck').textContent=pair.stuck;
  $('#conflict').textContent=`${na}：${A.conflict}\n\n${nb}：${B.conflict}\n\n你們真正需要處理的不是「誰比較有道理」，而是先讓彼此從防禦狀態回到能溝通的狀態。`;
  $('#trigger').textContent=`${na}比較容易被觸發：${A.trigger}\n\n${nb}比較容易被觸發：${B.trigger}`;
  $('#attraction').textContent=pair.attraction;
  $('#longTerm').textContent=pair.long;
  $('#lesson').textContent=pair.lesson;
  $('#advice').innerHTML=pair.advice.map((x,i)=>`<div><b>${i+1}.</b> ${esc(x)}</div>`).join('');

  lastResult={na,nb,score:avg,type,summary,m};
  $('#results').classList.remove('hidden');
  $('#status').textContent='';
  await track('result_view');
  setTimeout(()=>$('#results').scrollIntoView({behavior:'smooth'}),80);
});

$('#linePay').addEventListener('click',()=>track('pay_click'));

$('#unlockBtn').addEventListener('click',async()=>{
  const code=$('#unlockCode').value.trim().toUpperCase();
  const msg=$('#unlockStatus');
  if(!code){msg.textContent='請先輸入你在 LINE 收到的專屬解鎖碼。';return;}
  if(!apiConfigured()){msg.textContent='授權系統尚未完成設定，請聯絡管理員。';return;}
  $('#unlockBtn').disabled=true;
  $('#unlockBtn').textContent='驗證中…';
  msg.classList.remove('success');
  msg.textContent='正在驗證你的專屬代碼…';
  try{
    const r=await rpc('activate_relationship_code',{p_code:code,p_device_token:getDeviceToken()});
    const ok=r?.success===true || r?.ok===true;
    if(ok){
      msg.textContent='✓ 解鎖成功！完整解析已開啟。';
      msg.classList.add('success');
      $('#unlockCode').value='';
      setUnlocked(true);
      await track('paid_unlock');
      setTimeout(()=>$('#paidContent').scrollIntoView({behavior:'smooth'}),80);
    }else{
      const messages={invalid:'解鎖碼不存在，請確認是否輸入正確。',expired:'此解鎖碼已過期，請透過 LINE 聯絡。',used:'此解鎖碼已達使用次數上限。',inactive:'此解鎖碼目前已停用。'};
      msg.textContent=r?.message||messages[r?.reason]||'無法啟用此代碼，請透過 LINE 聯絡。';
    }
  }catch(e){
    msg.textContent=`驗證失敗：${e?.message||'未知錯誤'}`;
  }finally{
    $('#unlockBtn').disabled=false;
    $('#unlockBtn').textContent='解鎖';
  }
});

$('#shareBtn').addEventListener('click',async()=>{
  if(!lastResult)return;
  const x=lastResult;
  const text=`💗 ${x.na} × ${x.nb}｜${x.type}\n整體契合度 ${x.score}%\n情感理解 ${x.m.emotion}%・溝通契合 ${x.m.talk}%・長期相處 ${x.m.long}%・成長互補 ${x.m.growth}%\n\n${x.summary}\n— 10の小基地♡`;
  try{
    if(navigator.share) await navigator.share({title:'我們的戀愛關係卡',text});
    else{await navigator.clipboard.writeText(text);alert('戀愛關係卡文字已複製 💌');}
  }catch(e){}
});

restoreAccess();
