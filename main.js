import './style.css';
import { calculateAstrology, calculateHumanDesign } from 'natalengine';
import { calculateBaziChart } from '@openfate/bazi-engine';

const cities = {
  kaohsiung:{label:'高雄',lat:22.6273,lon:120.3014,tz:8},
  taipei:{label:'台北',lat:25.0330,lon:121.5654,tz:8},
  taichung:{label:'台中',lat:24.1477,lon:120.6736,tz:8},
  tainan:{label:'台南',lat:22.9999,lon:120.2269,tz:8},
  chiayi:{label:'嘉義',lat:23.4801,lon:120.4491,tz:8},
  yunlin:{label:'雲林',lat:23.7092,lon:120.4313,tz:8},
  hsinchu:{label:'新竹',lat:24.8138,lon:120.9675,tz:8},
  keelung:{label:'基隆',lat:25.1276,lon:121.7392,tz:8},
  hualien:{label:'花蓮',lat:23.9911,lon:121.6112,tz:8},
  taitung:{label:'台東',lat:22.7554,lon:121.1500,tz:8},
  hongkong:{label:'香港',lat:22.3193,lon:114.1694,tz:8},
  singapore:{label:'新加坡',lat:1.3521,lon:103.8198,tz:8},
  tokyo:{label:'東京',lat:35.6762,lon:139.6503,tz:9},
  seoul:{label:'首爾',lat:37.5665,lon:126.9780,tz:9}
};

const lifeProfiles = {
  1:{name:'開創者',keys:['獨立','行動','領導'],text:'你的人生主題，是相信自己的方向並主動開路。',crystal:'太陽石'},
  2:{name:'共感者',keys:['感受','合作','關係'],text:'你很會感受人與氛圍，課題是溫柔待人也保有界線。',crystal:'月光石'},
  3:{name:'表達者',keys:['創意','表達','魅力'],text:'你的能量在創作、分享與被看見時最容易流動。',crystal:'黃水晶'},
  4:{name:'建構者',keys:['穩定','秩序','執行'],text:'你的力量來自長期累積，把想法變成可持續的系統。',crystal:'煙水晶'},
  5:{name:'自由者',keys:['自由','變化','體驗'],text:'你透過體驗世界認識自己，自由與彈性是重要主題。',crystal:'海藍寶'},
  6:{name:'療癒者',keys:['愛','責任','美感'],text:'你自然會照顧別人，也要記得把自己放回愛的範圍裡。',crystal:'粉晶'},
  7:{name:'探索者',keys:['洞察','思考','內在'],text:'你不滿足於表面答案，深度與研究是你的重要天賦。',crystal:'紫水晶'},
  8:{name:'成就者',keys:['事業','資源','成果'],text:'你的人生常與成果、金錢和影響力的學習有關。',crystal:'虎眼石'},
  9:{name:'理想者',keys:['共感','完成','療癒'],text:'你容易感受到更大的故事，也需要學習適時完成與放下。',crystal:'拉長石'},
  11:{name:'直覺啟發者',keys:['直覺','靈感','啟發'],text:'11 常被視為大師數，課題是把高度敏銳的靈感真正落地。',crystal:'紫水晶'},
  22:{name:'築夢實踐者',keys:['願景','建構','影響'],text:'22 常被視為築夢型大師數，適合把大願景拆成可執行的步驟。',crystal:'煙水晶'},
  33:{name:'慈愛導師',keys:['慈愛','療癒','影響'],text:'33 常被視為服務與療癒型大師數，界線與自我照顧同樣重要。',crystal:'粉晶'}
};

const yearText = {
  1:'新開始與主動的一年。適合開局、做選擇與建立新方向。',
  2:'關係與醞釀的一年。合作、耐心與情緒整理更重要。',
  3:'表達與曝光的一年。適合創作、社群、學習與被看見。',
  4:'建立基礎的一年。制度、習慣、財務秩序與長期累積是重點。',
  5:'變化與突破的一年。新的環境或方向可能帶來成長。',
  6:'關係與責任的一年。家庭、感情、承諾與生活品質容易成為焦點。',
  7:'內在與學習的一年。適合沉澱、研究、進修與重新理解自己。',
  8:'成果與資源的一年。事業、收入、權責與商業議題較容易被放大。',
  9:'完成與釋放的一年。適合收尾、整理，為下一個循環留空間。'
};

const signZh = {
  Aries:'牡羊座', Taurus:'金牛座', Gemini:'雙子座', Cancer:'巨蟹座',
  Leo:'獅子座', Virgo:'處女座', Libra:'天秤座', Scorpio:'天蠍座',
  Sagittarius:'射手座', Capricorn:'摩羯座', Aquarius:'水瓶座', Pisces:'雙魚座'
};

const hdZh = {
  Generator:'生產者',
  'Manifesting Generator':'顯示生產者',
  Manifestor:'顯示者',
  Projector:'投射者',
  Reflector:'反映者',
  'Emotional Authority':'情緒型權威',
  'Sacral Authority':'薦骨型權威',
  'Splenic Authority':'脾臟型權威',
  'Ego Authority':'意志力權威',
  'Self-Projected Authority':'自我投射權威',
  'Mental Authority':'環境／心智權威',
  'Lunar Authority':'月亮權威',
  'Single Definition':'一分人',
  'Split Definition':'二分人',
  'Triple Split':'三分人',
  'Quadruple Split':'四分人'
};

const elementZh = {wood:'木',fire:'火',earth:'土',metal:'金',water:'水'};
const elementCrystal = {
  wood:['綠東陵','成長與開展'],
  fire:['石榴石','行動與熱情'],
  earth:['黃水晶','穩定與價值感'],
  metal:['白水晶','清晰與整理'],
  water:['海藍寶','流動與表達']
};

const sumDigits = v => String(v).replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0);
function reduceLife(n){ while(n>9 && ![11,22,33].includes(n)) n=sumDigits(n); return n; }
function lifePath(date){ return reduceLife(sumDigits(date)); }
function personalYear(date, year=2026){
  const [,m,d]=date.split('-').map(Number);
  let n=sumDigits(m)+sumDigits(d)+sumDigits(year);
  while(n>9)n=sumDigits(n);
  return n;
}
function decimalHour(time){ const [h,m]=time.split(':').map(Number); return h + m/60; }
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function zhSign(obj){return signZh[obj?.sign?.name] || obj?.sign?.name || '—';}
function degree(obj){return obj?.degree ?? '—';}
function pickCity(){
  const key=document.querySelector('#city').value;
  if(key==='custom'){
    return {
      label:document.querySelector('#placeName').value || '自訂出生地',
      lat:Number(document.querySelector('#lat').value),
      lon:Number(document.querySelector('#lon').value),
      tz:Number(document.querySelector('#tz').value)
    };
  }
  return cities[key];
}
function baziPillar(p){ if(!p)return '—'; return `${p.stem||''}${p.branch||''}` || p.ganZhi || '—'; }
function typeName(hd){return hdZh[hd?.type?.name] || hd?.type?.name || '—';}
function authorityName(hd){return hdZh[hd?.authority?.name] || hd?.authority?.name || hdZh[hd?.type?.authority] || hd?.type?.authority || '—';}
function definitionName(hd){return hdZh[hd?.definition] || hd?.definition || '—';}

document.querySelector('#app').innerHTML = `
<div class="stars"></div>
<header class="hero">
  <nav><div class="brand">玄學人格研究所</div><a href="#birth">開始探索 ✦</a></nav>
  <div class="hero-copy">
    <span class="eyebrow">MYSTIC PROFILE LAB · V3</span>
    <h1>五種系統，<br><em>拼出更完整的你。</em></h1>
    <p>生命靈數 × 西洋占星 × 人類圖 × 八字五行 × 水晶象徵。輸入出生資料，生成你的個人能量說明書。</p>
    <a class="primary" href="#birth">生成我的玄學人格</a>
  </div>
</header>

<section class="system-strip">
  <div><b>01</b><strong>生命靈數</strong><small>核心人生主題</small></div>
  <div><b>02</b><strong>星座命盤</strong><small>太陽・月亮・上升</small></div>
  <div><b>03</b><strong>人類圖</strong><small>類型・權威・角色</small></div>
  <div><b>04</b><strong>八字五行</strong><small>四柱・日主・五行</small></div>
  <div><b>05</b><strong>水晶探索</strong><small>象徵性提醒</small></div>
</section>

<main>
<section id="birth" class="section">
  <div class="section-title">
    <span class="eyebrow">YOUR BIRTH CODE</span>
    <h2>輸入你的出生資料</h2>
    <p>資料只在瀏覽器內計算，不需要輸入姓名或帳號。</p>
  </div>

  <form id="birthForm" class="form-card">
    <label>出生日期<input id="date" type="date" required></label>
    <label>出生時間<input id="time" type="time" required></label>
    <label>生理性別 <small>八字大運排法使用</small>
      <select id="gender"><option value="female">女</option><option value="male">男</option></select>
    </label>
    <label>出生城市
      <select id="city">
        ${Object.entries(cities).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
        <option value="custom">其他／自訂</option>
      </select>
    </label>
    <div id="customFields" class="custom hidden">
      <label>出生地名稱<input id="placeName" placeholder="例：London"></label>
      <label>緯度<input id="lat" type="number" step="0.0001" placeholder="51.5074"></label>
      <label>經度<input id="lon" type="number" step="0.0001" placeholder="-0.1278"></label>
      <label>UTC 時差<input id="tz" type="number" step="0.5" placeholder="0"></label>
    </div>
    <button class="primary submit" type="submit">開始排盤 ✦</button>
    <div id="status" class="status"></div>
    <p class="fineprint">玄學、占星、人類圖、八字與水晶屬文化／自我探索系統，不具有科學診斷或預測保證。請勿用於醫療、心理、法律、投資等高風險決策。</p>
  </form>
</section>

<section id="results" class="section hidden">
  <div class="share-card">
    <span class="eyebrow">MY MYSTIC PROFILE</span>
    <div class="num" id="cardNumber"></div>
    <h2 id="cardTitle"></h2>
    <p id="cardSub"></p>
    <div class="chips" id="cardChips"></div>
    <div class="sig">玄學人格研究所 · 個人能量說明書</div>
  </div>

  <div class="cards">
    <article class="panel feature">
      <span class="eyebrow">01 · LIFE PATH</span>
      <h3 id="lifeTitle"></h3><p id="lifeText"></p>
      <div class="mini-grid">
        <div><small>2026 個人流年</small><strong id="pyNum"></strong><p id="pyText"></p></div>
        <div><small>關鍵字</small><strong id="lifeKeys"></strong></div>
      </div>
    </article>

    <article class="panel">
      <span class="eyebrow">02 · WESTERN ASTROLOGY</span>
      <h3>你的星盤三巨頭</h3>
      <div class="trio">
        <div><small>太陽</small><strong id="sun"></strong><span id="sunDeg"></span></div>
        <div><small>月亮</small><strong id="moon"></strong><span id="moonDeg"></span></div>
        <div><small>上升</small><strong id="rising"></strong><span id="risingDeg"></span></div>
      </div>
      <p id="astroText"></p>
      <div class="barline"><span>主導元素</span><b id="dominantElement"></b></div>
    </article>

    <article class="panel">
      <span class="eyebrow">03 · HUMAN DESIGN</span>
      <h3 id="hdType"></h3>
      <div class="facts">
        <div><small>內在權威</small><strong id="hdAuthority"></strong></div>
        <div><small>人生角色</small><strong id="hdProfile"></strong></div>
        <div><small>定義</small><strong id="hdDefinition"></strong></div>
        <div><small>策略</small><strong id="hdStrategy"></strong></div>
      </div>
      <p id="hdText"></p>
    </article>

    <article class="panel">
      <span class="eyebrow">04 · BAZI / 八字</span>
      <h3>你的四柱與日主</h3>
      <div class="pillars">
        <div><small>年柱</small><strong id="yearP"></strong></div>
        <div><small>月柱</small><strong id="monthP"></strong></div>
        <div><small>日柱</small><strong id="dayP"></strong></div>
        <div><small>時柱</small><strong id="hourP"></strong></div>
      </div>
      <div class="facts">
        <div><small>日主</small><strong id="dayMaster"></strong></div>
        <div><small>日主五行</small><strong id="dmElement"></strong></div>
      </div>
      <p id="baziText"></p>
    </article>

    <article class="panel crystal">
      <span class="eyebrow">05 · CRYSTAL SYMBOLISM</span>
      <h3 id="crystal"></h3>
      <p id="crystalText"></p>
      <div class="note">水晶推薦是文化與象徵性探索，不代表能治療疾病、改命或保證招財。</div>
    </article>

    <article class="panel synthesis">
      <span class="eyebrow">YOUR SYNTHESIS</span>
      <h3>你的五術交叉摘要</h3>
      <p id="synthesis"></p>
    </article>
  </div>
</section>

<section class="section">
  <div class="paywall">
    <span class="eyebrow">FULL ENERGY BOOK</span>
    <h2>把結果變成一份<br>真正屬於你的能量說明書。</h2>
    <p>這裡可以接你的付費完整版：感情模式、天賦事業、金錢課題、年度能量、五行補強與個人提醒。</p>
    <a href="#" onclick="alert('請把這個按鈕改成你的 LINE、Beacons 或付款頁連結');return false;" class="outline">解鎖完整解析</a>
  </div>
</section>
</main>
<footer>© 2026 玄學人格研究所 · Self-exploration only</footer>
`;

document.querySelector('#city').addEventListener('change', e=>{
  document.querySelector('#customFields').classList.toggle('hidden',e.target.value!=='custom');
});

document.querySelector('#birthForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const status=document.querySelector('#status');
  status.textContent='正在計算你的能量地圖…';
  const date=document.querySelector('#date').value;
  const time=document.querySelector('#time').value;
  const gender=document.querySelector('#gender').value;
  const place=pickCity();

  if(!date||!time||!Number.isFinite(place.lat)||!Number.isFinite(place.lon)||!Number.isFinite(place.tz)){
    status.textContent='請確認出生日期、時間、經緯度與 UTC 時差。';
    return;
  }

  try{
    const hour=decimalHour(time);
    const [year,month,day]=date.split('-').map(Number);
    const [h,m]=time.split(':').map(Number);
    const lp=lifePath(date), life=lifeProfiles[lp], py=personalYear(date,2026);

    const astro=calculateAstrology(date,hour,place.tz,place.lat,place.lon);
    const hd=calculateHumanDesign(date,hour,place.tz);
    const bazi=calculateBaziChart({
      year,month,day,hour:h,minute:m,gender,
      longitude:place.lon,timezone:place.tz,
      enableTrueSolarTime:true,
      dayBoundaryMode:'MIDNIGHT_00',
      calendarType:'solar'
    });

    const sun=zhSign(astro.sun), moon=zhSign(astro.moon), rising=zhSign(astro.rising);
    const dom=astro?.balance?.dominantElement || '—';
    const dmEl=bazi?.dayMaster?.element || '';
    const dmZh=elementZh[dmEl] || dmEl || '—';

    cardNumber.textContent=lp;
    cardTitle.textContent=`${life.name} · ${sun}`;
    cardSub.textContent=`月亮 ${moon}｜上升 ${rising}｜${typeName(hd)}｜日主 ${bazi?.dayMaster?.stem||''}${dmZh}`;
    cardChips.innerHTML=[...life.keys,typeName(hd),`${dmZh}能量`].map(x=>`<span>${esc(x)}</span>`).join('');

    lifeTitle.textContent=`生命靈數 ${lp}｜${life.name}`;
    lifeText.textContent=life.text;
    pyNum.textContent=py;
    pyText.textContent=yearText[py];
    lifeKeys.textContent=life.keys.join('・');

    document.querySelector('#sun').textContent=sun;
    document.querySelector('#moon').textContent=moon;
    document.querySelector('#rising').textContent=rising;
    sunDeg.textContent=degree(astro.sun);
    moonDeg.textContent=degree(astro.moon);
    risingDeg.textContent=degree(astro.rising);
    dominantElement.textContent=dom;
    astroText.textContent=`太陽描述核心自我認同，月亮常用來觀察情緒與安全感，上升則反映你進入世界時的外在風格。你的組合是 ${sun} × ${moon} × ${rising}。`;

    hdType.textContent=typeName(hd);
    hdAuthority.textContent=authorityName(hd);
    hdProfile.textContent=hd?.profile?.numbers || '—';
    hdDefinition.textContent=definitionName(hd);
    hdStrategy.textContent=hd?.type?.strategy || '—';
    hdText.textContent=`在人類圖系統裡，你的類型是 ${typeName(hd)}，內在權威為 ${authorityName(hd)}。可把「策略＋權威」當成一套自我觀察與決策練習，而不是絕對規則。`;

    yearP.textContent=baziPillar(bazi?.pillars?.year);
    monthP.textContent=baziPillar(bazi?.pillars?.month);
    dayP.textContent=baziPillar(bazi?.pillars?.day);
    hourP.textContent=baziPillar(bazi?.pillars?.hour);
    dayMaster.textContent=`${bazi?.dayMaster?.stem||''}${bazi?.dayMaster?.pinyin ? ` (${bazi.dayMaster.pinyin})` : ''}`;
    dmElement.textContent=dmZh;
    baziText.textContent=`八字以節氣與干支建立四柱。這份排盤啟用真太陽時修正；你的日主五行為「${dmZh}」。不同命理流派在日界、用神與解讀方式上可能存在差異。`;

    const cFromBazi=elementCrystal[dmEl];
    const crystalName=cFromBazi?.[0] || life.crystal;
    const crystalTheme=cFromBazi?.[1] || '自我覺察';
    crystal.textContent=`推薦探索：${crystalName}`;
    crystalText.textContent=`依你的日主五行與生命靈數，這版推薦以「${crystalTheme}」作為象徵性主題。你可以把 ${crystalName} 當作日常提醒物，而不是具有保證效果的能量工具。`;

    synthesis.textContent=`你的生命靈數是 ${lp} 號 ${life.name}；星盤三巨頭為 ${sun}、${moon}、${rising}；人類圖為 ${typeName(hd)}／${authorityName(hd)}／${hd?.profile?.numbers||'—'}；八字日主五行為 ${dmZh}。把五套系統放在一起時，最值得觀察的不是「哪一個標籤最像你」，而是哪些主題反覆出現：你的行動方式、情緒需求、決策習慣、關係界線，以及你想如何把天賦落到生活裡。`;

    results.classList.remove('hidden');
    results.scrollIntoView({behavior:'smooth'});
    status.textContent=`完成｜出生地：${place.label}`;
  }catch(err){
    console.error(err);
    status.textContent='排盤時發生錯誤。請確認資料格式；若部署後仍出現此訊息，可查看瀏覽器 Console 取得錯誤內容。';
  }
});
