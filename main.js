import './style.css';
import { calculateAstrology, calculateHumanDesign } from 'natalengine';
import { calculateBaziChart } from '@openfate/bazi-engine';
import { PREMIUM_API } from './premium-config.js';

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
  1:{name:'開創者',keys:['獨立','行動','領導'],text:'你的人生主題，是相信自己的方向並主動開路。',deep:'當你願意先行動、再修正，你的影響力會比等待完美時機更快被看見。你需要練習的是「相信自己」而不是「凡事只能靠自己」。',crystal:'太陽石'},
  2:{name:'共感者',keys:['感受','合作','關係'],text:'你很會感受人與氛圍，課題是溫柔待人也保有界線。',deep:'你很容易先感受到別人的需要，因此真正的成長不是變得不敏感，而是能分辨「這是我的感受，還是別人的情緒」。',crystal:'月光石'},
  3:{name:'表達者',keys:['創意','表達','魅力'],text:'你的能量在創作、分享與被看見時最容易流動。',deep:'你有把抽象感受變成文字、畫面、故事或氣氛的能力。持續輸出比偶爾爆發靈感更能讓天賦累積成價值。',crystal:'黃水晶'},
  4:{name:'建構者',keys:['穩定','秩序','執行'],text:'你的力量來自長期累積，把想法變成可持續的系統。',deep:'你真正擅長的不是做得最快，而是把事情做得穩、做得久。當你願意保留一些彈性，穩定會變成你的底氣，而不是限制。',crystal:'煙水晶'},
  5:{name:'自由者',keys:['自由','變化','體驗'],text:'你透過體驗世界認識自己，自由與彈性是重要主題。',deep:'你需要新鮮感與選擇權，但自由不等於一直換方向。當你能在變化裡保留一條主線，人生會更有累積感。',crystal:'海藍寶'},
  6:{name:'療癒者',keys:['愛','責任','美感'],text:'你自然會照顧別人，也要記得把自己放回愛的範圍裡。',deep:'你容易把愛表現在照顧、承擔與替別人多想一步。真正重要的課題，是不再用過度付出證明自己的價值。',crystal:'粉晶'},
  7:{name:'探索者',keys:['洞察','思考','內在'],text:'你不滿足於表面答案，深度與研究是你的重要天賦。',deep:'你需要理解事情背後的原因，也需要獨處整理。別讓思考變成延遲行動，有些答案只有真正走出去才會出現。',crystal:'紫水晶'},
  8:{name:'成就者',keys:['事業','資源','成果'],text:'你的人生常與成果、金錢和影響力的學習有關。',deep:'你對成果與資源有敏銳度。當你不再把自我價值綁在成敗上，反而更能做出成熟、長期且有影響力的選擇。',crystal:'虎眼石'},
  9:{name:'理想者',keys:['共感','完成','療癒'],text:'你容易感受到更大的故事，也需要學習適時完成與放下。',deep:'你很容易對人、故事與情緒產生深度連結。你的課題不是變得冷淡，而是知道什麼時候該留、什麼時候該結束。',crystal:'拉長石'},
  11:{name:'直覺啟發者',keys:['直覺','靈感','啟發'],text:'11 常被視為大師數，課題是把高度敏銳的靈感真正落地。',deep:'你可能常先感受到答案，再慢慢找到理由。當靈感有了具體行動、界線與節奏，它才真正會成為影響力。',crystal:'紫水晶'},
  22:{name:'築夢實踐者',keys:['願景','建構','影響'],text:'22 常被視為築夢型大師數，適合把大願景拆成可執行的步驟。',deep:'你容易看見更大的可能性，但也可能因此對自己要求過高。真正的力量是把大願景拆成今天做得到的一小步。',crystal:'煙水晶'},
  33:{name:'慈愛導師',keys:['慈愛','療癒','影響'],text:'33 常被視為服務與療癒型大師數，界線與自我照顧同樣重要。',deep:'你容易自然承擔陪伴與照顧的位置。當你不再把拯救別人當成責任，你的愛反而會更穩定、更長久。',crystal:'粉晶'}
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

const signElement = {
  Aries:'火', Leo:'火', Sagittarius:'火',
  Taurus:'土', Virgo:'土', Capricorn:'土',
  Gemini:'風', Libra:'風', Aquarius:'風',
  Cancer:'水', Scorpio:'水', Pisces:'水'
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

const strategyZh = {
  'Wait to Respond':'等待回應',
  'To Respond':'等待回應',
  'Respond':'等待回應',
  'Wait for the Invitation':'等待邀請',
  'Wait for Invitation':'等待邀請',
  'Inform':'先告知再行動',
  'Inform Before Acting':'先告知再行動',
  'Wait a Lunar Cycle':'等待一個月亮週期',
  'Wait for a Lunar Cycle':'等待一個月亮週期'
};

const stemZhByPinyin = {
  jia:'甲', yi:'乙', bing:'丙', ding:'丁', wu:'戊',
  ji:'己', geng:'庚', xin:'辛', ren:'壬', gui:'癸'
};
const stemElement = {
  '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土',
  '己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
};

const elementZh = {wood:'木',fire:'火',earth:'土',metal:'金',water:'水',
                   Wood:'木',Fire:'火',Earth:'土',Metal:'金',Water:'水',
                   Air:'風',air:'風'};
const elementCrystal = {
  wood:['綠東陵','成長與開展'],
  fire:['石榴石','行動與熱情'],
  earth:['黃水晶','穩定與價值感'],
  metal:['白水晶','清晰與整理'],
  water:['海藍寶','流動與表達'],
  木:['綠東陵','成長與開展'],
  火:['石榴石','行動與熱情'],
  土:['黃水晶','穩定與價值感'],
  金:['白水晶','清晰與整理'],
  水:['海藍寶','流動與表達']
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

function baziPillar(p){
  if(!p)return '—';
  if(p.stem || p.branch) return `${p.stem||''}${p.branch||''}`;
  if(p.ganZhi) return p.ganZhi;
  return '—';
}

function typeName(hd){return hdZh[hd?.type?.name] || hd?.type?.name || '—';}
function authorityName(hd){return hdZh[hd?.authority?.name] || hd?.authority?.name || hdZh[hd?.type?.authority] || hd?.type?.authority || '—';}
function definitionName(hd){return hdZh[hd?.definition] || hd?.definition || '—';}
function strategyName(hd){
  const raw = hd?.type?.strategy || hd?.strategy || '—';
  return strategyZh[raw] || raw;
}

function getDayMaster(bazi){
  const rawStem = bazi?.dayMaster?.stem || '';
  const pinyin = String(bazi?.dayMaster?.pinyin || '').toLowerCase();
  const stem = rawStem || stemZhByPinyin[pinyin] || '';
  const rawEl = bazi?.dayMaster?.element || '';
  const element = elementZh[rawEl] || stemElement[stem] || rawEl || '—';
  return {stem: stem || '—', element};
}

function normalizeElementValue(v){
  if(v == null) return '';
  if(typeof v === 'string') return elementZh[v] || elementZh[v.toLowerCase?.()] || v;
  if(typeof v === 'object'){
    const candidate = v.name ?? v.element ?? v.type ?? v.key ?? v.label ?? v.value;
    if(candidate != null) return normalizeElementValue(candidate);
  }
  return '';
}

function dominantElementText(astro){
  const direct = normalizeElementValue(astro?.balance?.dominantElement);
  if(direct && direct !== '[object Object]') return direct;

  const els = astro?.balance?.elements;
  if(els && typeof els === 'object'){
    const pairs = Object.entries(els).map(([k,v])=>{
      const score = typeof v === 'number' ? v :
        (typeof v === 'object' ? Number(v.score ?? v.value ?? v.count ?? 0) : 0);
      return [k, score];
    }).filter(([,v])=>Number.isFinite(v));
    if(pairs.length){
      pairs.sort((a,b)=>b[1]-a[1]);
      const z = normalizeElementValue(pairs[0][0]);
      if(z) return z;
    }
  }

  // Last-resort fallback using the Big Three signs only.
  const names=[astro?.sun?.sign?.name,astro?.moon?.sign?.name,astro?.rising?.sign?.name].filter(Boolean);
  const counts={火:0,土:0,風:0,水:0};
  names.forEach(n=>{const e=signElement[n]; if(e) counts[e]++;});
  const best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  return best?.[1] ? `${best[0]}（三巨頭）` : '—';
}

function astroDeepText(sun,moon,rising,dom){
  return `你的太陽是${sun}、月亮是${moon}、上升是${rising}。可以把太陽理解成你想成為誰，月亮是你在安全狀態下真正需要什麼，上升則像你進入世界時的第一層外在風格。主導元素顯示為「${dom}」，適合拿來觀察你習慣用什麼方式回應生活。`;
}

function hdDeepText(type,authority,profile,strategy){
  return `你的人類圖類型是${type}，內在權威是${authority}，人生角色為${profile}，策略是「${strategy}」。在這套系統裡，比起照著頭腦硬做決定，更適合先觀察自己的身體回應與真正的決策節奏。`;
}

function baziDeepText(dm){
  const themes={木:'成長、延伸、方向感',火:'行動、表達、熱度',土:'承載、穩定、現實感',金:'界線、判斷、整理',水:'流動、感受、適應'};
  return `你的日主是${dm.stem}${dm.element}。在五行象徵中，「${dm.element}」常與${themes[dm.element]||'特定性格主題'}連結。這不代表單看日主就能決定整張命盤，仍需要搭配四柱、旺衰、節氣與不同流派的判讀。`;
}


function deepProfileBundle({life,sun,moon,rising,hdType,authority,dm,py2027}){
  const moneyByLife={
    1:['個人品牌／主理人收入','專案型服務','領導與顧問型收入'],2:['陪伴服務／客戶經營','合作分潤','社群與關係型收入'],3:['內容創作／自媒體','設計與美感商品','課程／表達型收入'],4:['流程與營運服務','長期型專業服務','系統化數位商品'],5:['行銷／業務／流量變現','跨領域接案','彈性型數位收入'],6:['美感與生活服務','教育／陪伴／療癒型內容','個人品牌與信任型銷售'],7:['研究／知識產品','顧問／分析','深度內容與專業訂閱'],8:['商業經營／管理','高客單顧問與成交','資源整合型收入'],9:['內容／教育／公益影響力','創意與文化工作','跨國或社群型收入'],11:['創意內容／啟發型品牌','教學與社群','概念型數位商品'],22:['品牌／平台／系統建構','團隊與專案管理','可規模化商品'],33:['教育／陪伴服務','療癒與美感品牌','社群信任型收入']};
  const loveNeed={牡羊座:'直接與有行動力的回應',金牛座:'穩定、可預期與身體感的安心',雙子座:'交流、好奇與精神上的互動',巨蟹座:'情緒被接住與家的安全感',獅子座:'被珍惜、肯定與真心看見',處女座:'細節、可靠與實際照顧',天秤座:'尊重、平衡與有品質的陪伴',天蠍座:'深度、忠誠與真實',射手座:'自由、成長與共同探索',摩羯座:'承諾、責任與長期可靠',水瓶座:'理解差異、空間與思想共鳴',雙魚座:'共感、浪漫與溫柔連結'};
  const workByElement={木:'成長、教育、企劃與培育',火:'曝光、內容、行銷與行動型工作',土:'營運、管理、服務與長期累積',金:'策略、審美、整理、判斷與專業化',水:'溝通、流量、跨域、研究與彈性工作'};
  const challengeByLife={1:'容易把獨立變成凡事自己扛；課題是合作而不失去主導權。',2:'容易過度讀空氣、害怕關係失衡；課題是把自己的需要說清楚。',3:'靈感很多但容易分散；課題是持續輸出，不靠情緒決定是否行動。',4:'容易因求穩而卡在熟悉環境；課題是建立秩序後仍保留變動空間。',5:'容易因追求自由而頻繁換方向；課題是讓變化服務於一條長期主線。',6:'容易把責任、照顧與愛綁在一起；課題是不以過度付出證明價值。',7:'容易想得比做得多；課題是允許不確定，讓實際經驗補完答案。',8:'容易把成果等同自我價值；課題是學會掌握資源，而不是被成敗掌握。',9:'容易捨不得結束人事物；課題是完成、放下，讓新的循環進來。',11:'敏銳度高也容易過載；課題是把直覺落到具體節奏與界線。',22:'願景很大、標準也高；課題是拆小、持續，而不是一次做到完美。',33:'容易成為別人的情緒支柱；課題是陪伴但不拯救。'};
  const y={1:'開新局：主動選擇比等待答案重要。',2:'關係與合作：放慢速度，辨認真正值得長期同行的人。',3:'曝光與表達：作品、社群、學習成果更值得被推出去。',4:'打地基：財務、流程、健康作息與工作制度要穩。',5:'轉換與突破：機會變多，但避免因焦躁做出高風險決定。',6:'承諾與關係：感情、家庭與責任重新排序。',7:'沉澱與專精：適合進修、研究與重新校準方向。',8:'成果與金錢：談價格、權責、收入結構時更要清楚界線。',9:'收尾與釋放：結束不再適合的模式，替下一輪留空間。'}[py2027];
  return {
    identity:`你不是單一標籤型的人。${sun}讓你在核心認同上有自己的方向，${moon}顯示你真正需要的安全感是「${loveNeed[moon]||'被理解與被尊重'}」，${rising}則是別人最先感受到的外在氣質。生命靈數的「${life.name}」主題，會讓你反覆學習如何把天賦變成可持續的生活方式。`,
    love:`感情裡，你真正需要的不是只有心動，而是${loveNeed[moon]||'穩定的理解'}。你可能會先照顧關係、觀察對方，再決定自己要不要完全打開。適合你的關係，是能尊重你的節奏、願意溝通，也不要求你用犧牲自己來證明愛。當你開始悶著不說、替對方承擔太多，通常就是界線需要重新調整的訊號。`,
    career:`你的事業適合從「你能持續提供什麼價值」出發。以日主${dm.stem}${dm.element}的象徵來看，可優先探索${workByElement[dm.element]||'能累積專業與影響力的工作'}；搭配${hdType}的決策節奏，比起只追逐熱門職業，更重要的是找到能讓你持續回應、累積作品與建立自主性的模式。`,
    money:(moneyByLife[Object.keys(lifeProfiles).find(k=>lifeProfiles[k]===life)]||['專業服務','內容商品','個人品牌']).map((x,i)=>`${i+1}. ${x}`).join('　'),
    moneyText:`你比較適合把「能力＋信任＋可重複交付」變成收入，而不是只靠工時換錢。先建立一個最能證明價值的核心服務，再延伸成內容、數位商品或合作收入，通常比同時做很多變現方式更容易累積。任何投資或財務決策仍應依實際風險、現金流與專業資訊判斷。`,
    challenge:challengeByLife[Object.keys(lifeProfiles).find(k=>lifeProfiles[k]===life)]||'人生課題通常出現在界線、選擇與自我價值之間。',
    akashic:`如果把「阿卡西」當作一種象徵性的靈魂書寫，而不是可驗證的超自然紀錄，你此刻的主題可以寫成：你不需要一直證明自己夠好，真正要學的是辨認什麼值得投入、什麼應該放下。你的敏感、責任感與直覺可以成為天賦，但前提是它們不再以耗盡自己為代價。`,
    year2027:`你的 2027 個人流年為 ${py2027}。年度主題：${y} 這不是事件預言，而是一個年度自我觀察框架。尤其在簽約、轉職、創業、感情承諾與大額金錢決策上，仍要回到真實條件，不要只依命理結果決定。`
  };
}

function monthGuideFn(date, year=2027){
  const [,m,d]=date.split('-').map(Number); const base=reduceLife(sumDigits(m)+sumDigits(d)+sumDigits(year));
  const labels={1:'啟動・主動',2:'合作・耐心',3:'曝光・表達',4:'整理・打底',5:'變動・嘗試',6:'關係・責任',7:'沉澱・學習',8:'成果・財務',9:'收尾・釋放'};
  return Array.from({length:12},(_,i)=>{let n=base+i+1;while(n>9)n=sumDigits(n);return `<div><small>${i+1}月</small><strong>${n}</strong><span>${labels[n]}</span></div>`}).join('');
}


function premiumBundle({lifeNum, life, moon, rising, hdType, authority, strategy, dm, py2027}){
  const partner={
    '牡羊座':['敢說、直接、有行動力','冷處理、拖延、話不說清楚'],
    '金牛座':['穩定、守信用、願意給安全感','忽冷忽熱、承諾反覆、生活節奏太混亂'],
    '雙子座':['好聊、有趣、願意分享','不溝通、過度控制、思想封閉'],
    '巨蟹座':['情緒有回應、重視家庭與陪伴','嘲諷情緒、逃避溝通、缺乏安全感'],
    '獅子座':['肯定你、公開珍惜你、願意一起成長','貶低、忽視、讓你長期感到不被重視'],
    '處女座':['可靠、細心、願意一起解決問題','只批評不溝通、生活失序、沒有責任感'],
    '天秤座':['尊重、溫和、願意討論彼此需求','長期搖擺、逃避決定、表面和平但不處理問題'],
    '天蠍座':['忠誠、深度、真誠而有界線','隱瞞、權力拉扯、情緒操控'],
    '射手座':['給空間、能一起探索、支持成長','限制自由、過度黏著、價值觀差距太大'],
    '摩羯座':['有承諾、做得到、願意規劃未來','只有承諾沒有行動、責任全丟給你'],
    '水瓶座':['懂你的不同、尊重空間、能思想交流','控制、情緒勒索、要求你迎合傳統期待'],
    '雙魚座':['溫柔、同理、願意理解感受','界線模糊、逃避現實、把拯救責任丟給你']
  }[moon] || ['理解你、尊重你、有一致行動','長期忽視需求、控制與情緒勒索'];

  const workMode={
    '生產者':'有明確回應感、能長期累積熟練度的工作；先感受「有沒有想做」再承諾。',
    '顯示生產者':'可多線並進、允許快速迭代的工作；你需要彈性，不適合被僵硬流程綁死。',
    '投射者':'策略、顧問、觀察與引導型角色；價值來自看見系統，而不只是長工時。',
    '顯示者':'高自主、能發起與帶方向的工作；過度被管理會消耗你的推進力。',
    '反映者':'環境品質與團隊文化非常重要；適合保留觀察週期再做重大承諾。'
  }[hdType] || '選擇能讓你保有自主性、持續累積專業價值的工作。';

  const wealth={
    1:['個人品牌／主理人服務','顧問與決策型收入','高自主專案'],
    2:['客戶經營／陪伴服務','合作分潤','社群信任型收入'],
    3:['內容變現／自媒體','美感或創意商品','課程／表達型產品'],
    4:['流程與營運服務','長期會員／訂閱','系統化數位商品'],
    5:['行銷／業務／流量變現','跨領域接案','聯盟／合作收入'],
    6:['生活美感／療癒陪伴','教育與顧問服務','信任型個人品牌商品'],
    7:['知識產品／研究報告','顧問分析','深度內容訂閱'],
    8:['高客單商業服務','管理／資源整合','品牌與團隊型收入'],
    9:['教育／文化／內容影響力','社群型商品','跨國或公益結合商業模式'],
    11:['啟發型內容品牌','課程／社群','概念型數位商品'],
    22:['平台／系統／品牌資產','團隊專案','可規模化產品'],
    33:['教育／陪伴／療癒服務','美感品牌','長期社群與信任型收入']
  }[lifeNum] || ['專業服務','數位商品','個人品牌'];

  const moneyBlind={
    1:'過早單打獨鬥，忽略合作能放大成果。',2:'不好意思談價格，容易把體貼變成免費加碼。',3:'想法很多但商品線太散，收入難累積。',4:'過度求穩，可能錯過合理的升級與調價。',5:'追逐新機會太快，還沒建立複利就轉向。',6:'把照顧客人等同無限責任，容易低估自己的服務價值。',7:'研究太久才推出，錯過市場回饋。',8:'把收入當成自我價值，容易承擔過高風險。',9:'理想感很強，可能忽略商業邊界與現金流。',11:'靈感很強但缺乏固定交付，價值不容易被購買。',22:'一開始就做太大，成本和壓力先超過收入。',33:'容易免費付出太多，需要清楚定價與服務範圍。'
  }[lifeNum] || '收入成長需要同時照顧價值、定價與可持續交付。';

  const shadow={
    1:['怕被看輕，所以什麼都想自己證明','把求助視為能力的一部分'],
    2:['怕關係失衡，所以先壓住自己','練習在小事上直接說需求'],
    3:['怕不夠好，所以靠新鮮感逃避持續','固定一個主題做滿一個週期'],
    4:['怕失控，所以用規則保護自己','留下 20% 彈性給未知'],
    5:['怕被困住，所以提前離開','區分「不適合」和「只是進入累積期」'],
    6:['怕讓人失望，所以承擔過量','先問自己：這真的是我的責任嗎？'],
    7:['怕判斷錯，所以一直分析','用小規模測試替代無限思考'],
    8:['怕失敗，所以控制更多','建立停損、授權與客觀指標'],
    9:['怕失去，所以很難真正結束','允許完成也是一種愛'],
    11:['感受太多容易焦慮與過載','把直覺寫下來，再用現實資訊驗證'],
    22:['怕辜負大願景，所以標準過高','把願景拆成 90 天成果'],
    33:['怕別人受傷，所以一直拯救','陪伴不等於替別人承擔後果']
  }[lifeNum] || ['容易把壓力內化','把課題拆成可練習的小行動'];

  const innerChild={
    '金牛座':'你內在的小孩需要的是「穩定不會突然消失的愛」。',
    '摩羯座':'你內在的小孩很早就學會懂事，現在需要允許自己有脆弱與休息。',
    '水瓶座':'你內在的小孩希望即使與別人不同，也不用為了被愛而改掉自己。',
    '巨蟹座':'你內在的小孩最在意被接住，而不是被快速糾正。',
    '雙魚座':'你內在的小孩需要柔軟的界線：可以共感，但不用承擔所有人的情緒。'
  }[moon] || `你內在的小孩需要被允許以自己的節奏感受、選擇與成長。`;

  const q={
    1:['Q1 建立新方向','Q2 快速試做與修正','Q3 強化個人主導權','Q4 固化有效模式'],
    2:['Q1 整理關係','Q2 合作與耐心','Q3 深化信任','Q4 做出關係選擇'],
    3:['Q1 找到表達主題','Q2 增加曝光','Q3 把創意商品化','Q4 留下代表作品'],
    4:['Q1 整理制度','Q2 穩定現金流','Q3 建立流程','Q4 檢查長期基礎'],
    5:['Q1 打開新選項','Q2 嘗試與移動','Q3 過濾真正機會','Q4 固定值得留下的方向'],
    6:['Q1 關係排序','Q2 家庭與責任','Q3 承諾與生活品質','Q4 建立更健康的界線'],
    7:['Q1 減少雜訊','Q2 深度學習','Q3 驗證新理解','Q4 做出更成熟的選擇'],
    8:['Q1 設定成果','Q2 談價格與資源','Q3 放大有效收入','Q4 財務與權責盤點'],
    9:['Q1 整理舊事物','Q2 完成未竟項目','Q3 放下不再適合的關係／工作','Q4 為下一輪騰空']
  }[py2027] || [];

  return {
    green:partner[0], red:partner[1], workMode,
    wealth, moneyBlind,
    shadow:shadow[0], breakthrough:shadow[1], innerChild,
    akashicLetter:`給現在的你：你不需要把每一次辛苦都解釋成命運安排。若用阿卡西式書寫作為象徵性反思，你此刻更重要的靈魂課題，是把注意力從「我要證明什麼」移回「我真正想創造什麼」。當選擇同時尊重你的感受、現實條件與長期價值，那通常比追求一個神秘的正確答案更可靠。`,
    quarters:q,
    action30:`30 天：只選一個最重要的課題。若是事業，就完成一個能被看見的作品／商品；若是關係，就練習一次清楚而不攻擊的需求表達。`,
    action90:`90 天：建立可衡量成果。收入看成交與現金流、內容看有效觸及與詢問、關係看溝通品質與界線，而不是只看感覺。`,
    action365:`365 天：建立一個不依賴短期情緒的長期系統——作品庫、客戶資產、儲蓄／投資紀律、關係習慣或專業能力。`
  };
}

document.querySelector('#app').innerHTML = `
<div class="stars"></div>
<header class="hero">
  <nav><div class="brand">玄學人格研究所</div><a href="#birth">開始探索 ✦</a></nav>
  <div class="hero-copy">
    <span class="eyebrow">MYSTIC PROFILE LAB · V5 PREMIUM</span>
    <h1>五種系統，<br><em>拼出更完整的你。</em></h1>
    <p>生命靈數 × 西洋占星 × 人類圖 × 八字五行 × 水晶象徵。輸入出生資料，生成你的個人能量說明書。</p>
    <a class="primary" href="#birth">先生成免費人格解析</a>
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
<section class="section" id="tools">
  <div class="section-title"><span class="eyebrow">CHOOSE YOUR READING</span><h2>今天想看哪一種解析？</h2><p>原本的個人解析完整保留，另外新增雙人感情契合度測驗。</p></div>
  <div class="mode-grid">
    <a class="mode-card" href="#birth"><strong>🔮 個人完整解析</strong><span>生命靈數 × 星座 × 人類圖 × 八字五行 × 水晶</span></a>
    <a class="mode-card" href="#relationship"><strong>💗 雙人感情契合度</strong><span>只要兩個生日，看感情需求、卡點、相處模式與關係建議</span></a>
  </div>
</section>

<section id="relationship" class="section">
  <div class="section-title"><span class="eyebrow">LOVE COMPATIBILITY</span><h2>你們的感情使用說明書</h2><p>有些問題不是不愛，而是愛人的方式不同。輸入兩個人的生日，看看彼此的需求與互動模式。</p></div>
  <form id="relationshipForm" class="form-card relationship-form">
    <label>你的暱稱 <small>選填</small><input id="relNameA" type="text" placeholder="例：曼曼"></label>
    <label>你的生日<input id="relDateA" type="date" required></label>
    <label>對方暱稱 <small>選填</small><input id="relNameB" type="text" placeholder="例：豪豪"></label>
    <label>對方生日<input id="relDateB" type="date" required></label>
    <button class="primary submit" type="submit">看看我們的感情模式 💗</button>
    <p class="fineprint">此結果以生命靈數作為娛樂與自我探索用途，不代表關係好壞，也不是心理或伴侶諮商評估。</p>
  </form>
</section>

<section id="relationshipResults" class="section hidden relationship-results">
  <div class="share-card">
    <span class="eyebrow">OUR LOVE PROFILE</span>
    <div class="score"><span id="relScore">--</span><small>%</small></div>
    <h2 id="relType"></h2><p id="relSummary"></p>
    <div class="chips" id="relChips"></div><div class="sig">玄學人格研究所 · 感情使用說明書</div>
    <button class="secondary share-love" id="shareLoveCard" type="button">分享我們的戀愛關係卡 💌</button>
  </div>
  <div class="relationship-bars">
    <div><small>情感理解</small><strong id="relEmotion"></strong></div><div><small>溝通契合</small><strong id="relTalk"></strong></div><div><small>長期相處</small><strong id="relLong"></strong></div><div><small>成長互補</small><strong id="relGrowth"></strong></div>
  </div>
  <div class="cards" style="margin-top:17px">
    <article class="panel"><span class="eyebrow">01 · LOVE NEED</span><h3 id="relNeedATitle"></h3><p id="relNeedA"></p></article>
    <article class="panel"><span class="eyebrow">02 · LOVE NEED</span><h3 id="relNeedBTitle"></h3><p id="relNeedB"></p></article>
    <article class="panel feature"><span class="eyebrow">03 · STUCK POINT</span><h3>你們最容易卡住的地方</h3><p id="relStuck"></p></article>
    <div id="relPaidGate" class="rel-paid-gate">
      <div class="rel-lock-icon">🔒</div><span class="premium-badge">LOVE DEEP READING</span>
      <h2>你們真正卡住的原因，還在後面</h2>
      <p>免費版先讓你看見彼此需要的愛與最容易卡住的地方。完整版本會繼續拆解吵架模式、感情地雷、互相吸引、長期相處與專屬建議。</p>
      <div class="rel-paid-list"><span>♡ 吵架時的你們</span><span>⚡ 彼此的感情地雷</span><span>✦ 為什麼互相吸引</span><span>∞ 長期相處模式</span><span>☾ 關係成長課題</span><span>✓ 3 個專屬相處方法</span></div>
      <div class="price-box"><div class="price-launch"><span>雙人完整感情解析</span><strong>NT$149</strong></div><div class="price-caption">一次解鎖・不用重新測驗</div></div>
      <a class="line-pay" href="https://line.me/ti/p/Vfr2_tJJK7" target="_blank" rel="noopener">立即解鎖 NT$149</a>
      <p class="unlock-note">付款完成後取得專屬解鎖碼，回到這裡輸入即可展開剛剛兩人的完整結果。</p>
      <div class="code-unlock"><label for="relUnlockCode">已付款？輸入感情解析解鎖碼</label><div class="code-row"><input id="relUnlockCode" type="text" autocomplete="off" placeholder="輸入解鎖碼"><button id="unlockRelationship" type="button">解鎖感情解析</button></div><p id="relUnlockStatus" class="unlock-status">站長測試可輸入 TEST149，不需實際付款。</p></div>
    </div>
    <div id="relPaidContent" class="cards hidden" style="grid-column:1/-1">
      <article class="panel"><span class="eyebrow">04 · CONFLICT</span><h3>吵架時的你們</h3><p id="relConflict"></p></article>
      <article class="panel"><span class="eyebrow">05 · TRIGGER</span><h3>彼此的感情地雷</h3><p id="relTrigger"></p></article>
      <article class="panel"><span class="eyebrow">06 · ATTRACTION</span><h3>為什麼會被彼此吸引</h3><p id="relAttraction"></p></article>
      <article class="panel"><span class="eyebrow">07 · LONG TERM</span><h3>長期相處模式</h3><p id="relLongTerm"></p></article>
      <article class="panel feature"><span class="eyebrow">08 · LESSON</span><h3>這段關係的成長課題</h3><p id="relLesson"></p></article>
      <article class="panel feature"><span class="eyebrow">09 · ADVICE</span><h3>讓關係更舒服的 3 個方法</h3><div id="relAdvice"></div></article>
    </div>
  </div>
</section>

<section id="birth" class="section">
  <div class="section-title">
    <span class="eyebrow">YOUR BIRTH CODE</span>
    <h2>輸入你的出生資料</h2>
    <p>出生資料用於瀏覽器內排盤；後台只記錄「暱稱（如有填寫）＋解析結果摘要＋測試時間」，不儲存出生日期與出生時間。</p>
  </div>

  <form id="birthForm" class="form-card">
    <label>報告姓名／暱稱 <small>選填</small><input id="clientName" type="text" placeholder="例：伊玲"></label>
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
    <button class="primary submit" type="submit">生成免費解析 ✦</button>
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
      <h3 id="lifeTitle"></h3>
      <p id="lifeText"></p>
      <div class="deep-box"><small>深度解析</small><p id="lifeDeep"></p></div>
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
      <div class="deep-box"><small>深度解析</small><p id="astroDeep"></p></div>
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
      <div class="deep-box"><small>深度解析</small><p id="hdDeep"></p></div>
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
      <div class="deep-box"><small>深度解析</small><p id="baziDeep"></p></div>
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

    <article class="panel synthesis deep-life">
      <span class="eyebrow">06 · CORE IDENTITY</span><h3>你天生是什麼樣的人？</h3><p id="identityDeep"></p>
    </article>
    <article class="panel"><span class="eyebrow">07 · LOVE</span><h3>感情模式與真正需要的愛</h3><p id="loveDeep"></p></article>
    <article class="panel"><span class="eyebrow">08 · CAREER</span><h3>事業天賦與適合的舞台</h3><p id="careerDeep"></p></article>
    <article class="panel synthesis"><span class="eyebrow">09 · MONEY</span><h3>你比較適合賺什麼錢？</h3><div class="money-list" id="moneyModes"></div><p id="moneyDeep"></p></article>
    <article class="panel"><span class="eyebrow">10 · LIFE LESSON</span><h3>人生容易遇到的挑戰</h3><p id="challengeDeep"></p></article>
    <article class="panel"><span class="eyebrow">11 · AKASHIC-STYLE REFLECTION</span><h3>阿卡西式靈魂探索</h3><p id="akashicDeep"></p><div class="note">此區是象徵性自我探索文字，不宣稱能讀取或驗證超自然的「阿卡西紀錄」。</div></article>
    <article class="panel synthesis year-panel"><span class="eyebrow">12 · 2027 NAVIGATION</span><h3>2027 年度導航</h3><p id="year2027Deep"></p><div class="month-grid" id="monthGuide"></div></article>
    <article class="panel synthesis takeaway"><span class="eyebrow">REMEMBER THESE 5 THINGS</span><h3>如果你只記得這份報告的 5 件事</h3><div id="fiveTakeaways"></div></article>
  </div>
</section>

<section id="unlock" class="section unlock-section">
  <div class="unlock-card">
    <span class="premium-badge">PREMIUM 完整人生解析</span>
    <h2>想看更深的你？</h2>
    <p>完整版本包含感情關係藍圖、事業與財富模式、人生挑戰、內在小孩、阿卡西式靈魂探索、2027 四季導航與行動計畫。</p>
    <div class="unlock-points"><span>♡ 感情深度解析</span><span>✦ 事業／適合賺什麼錢</span><span>☾ 2027 年度導航</span><span>◇ 完整深度人生報告</span></div>
    <div class="price-box" aria-label="付費完整解析價格">
      <div class="price-original"><span>原價</span><del>NT$990</del></div>
      <div class="price-launch"><span>首發體驗價</span><strong>NT$590</strong></div>
      <div class="price-caption">一次解鎖・完整深度解析報告</div>
    </div>
    <a class="line-pay" href="https://line.me/ti/p/Vfr2_tJJK7" target="_blank" rel="noopener">加入 LINE｜詢問付費完整解析</a>
    <p class="unlock-note">加入後請傳送「完整解析＋你的姓名／暱稱」。付款確認後，我會提供你的專屬解鎖碼。</p>
    <div class="code-unlock">
      <label for="premiumCode">已付款？輸入解鎖碼</label>
      <div class="code-row"><input id="premiumCode" type="text" autocomplete="off" placeholder="輸入解鎖碼"><button id="unlockPremium" type="button">解鎖完整報告</button></div>
      <p id="unlockStatus" class="unlock-status">付款完成後，請輸入你在 LINE 收到的專屬解鎖碼。每組代碼可限制使用次數。</p>
    </div>
  </div>
</section>

<section id="premiumReport" class="section premium-report hidden">
  <div class="premium-head">
    <span class="premium-badge">PREMIUM COMPLETE READING</span>
    <h2><span id="reportName">你的</span>完整人生解析</h2>
    <p>這一區為付費完整版內容。建議搭配實際生活經驗閱讀，而不是把任何玄學系統當成命定答案。</p>
  </div>
  <div class="premium-grid">
    <article class="premium-panel"><span class="eyebrow">13 · RELATIONSHIP BLUEPRINT</span><h3>你的關係藍圖</h3><div class="premium-split"><div><small>適合你的綠旗</small><p id="loveGreen"></p></div><div><small>需要留意的紅旗</small><p id="loveRed"></p></div></div><div class="premium-callout"><small>感情使用說明</small><p id="loveManual"></p></div></article>
    <article class="premium-panel"><span class="eyebrow">14 · CAREER BLUEPRINT</span><h3>你的職涯使用說明</h3><p id="workMode"></p><div class="premium-callout"><small>適合你的工作環境</small><p id="workEnvironment"></p></div></article>
    <article class="premium-panel"><span class="eyebrow">15 · WEALTH BLUEPRINT</span><h3>你的財富藍圖</h3><div id="wealthTop3" class="wealth-cards"></div><div class="premium-callout warning"><small>最需要避免的金錢盲點</small><p id="moneyBlind"></p></div></article>
    <article class="premium-panel"><span class="eyebrow">16 · SHADOW & BREAKTHROUGH</span><h3>人生反覆卡住你的地方</h3><div class="premium-split"><div><small>陰影模式</small><p id="shadowPattern"></p></div><div><small>突破練習</small><p id="breakthrough"></p></div></div></article>
    <article class="premium-panel"><span class="eyebrow">17 · INNER CHILD</span><h3>內在小孩真正想告訴你的事</h3><p id="innerChild"></p></article>
    <article class="premium-panel mystic-letter"><span class="eyebrow">18 · AKASHIC-STYLE LETTER</span><h3>一封象徵性的靈魂信</h3><p id="akashicLetter"></p><div class="note">此內容是創意反思／靈性書寫，不宣稱能實際讀取或驗證阿卡西紀錄。</div></article>
    <article class="premium-panel full"><span class="eyebrow">19 · 2027 QUARTERLY MAP</span><h3>2027 四季導航</h3><div id="quarterGuide" class="quarter-grid"></div><div class="premium-callout"><small>年度提醒</small><p>把年度與月份當成整理注意力的工具，不要用它取代合約審閱、醫療、財務或重大人生決策的實際資訊。</p></div></article>
    <article class="premium-panel full action-plan"><span class="eyebrow">20 · ACTION PLAN</span><h3>把解析真的變成人生行動</h3><div class="action-grid"><div><b>30 DAYS</b><p id="action30"></p></div><div><b>90 DAYS</b><p id="action90"></p></div><div><b>365 DAYS</b><p id="action365"></p></div></div></article>
  </div>
</section>
</main>
<footer>© 2026 玄學人格研究所 · Self-exploration only</footer>
`;

document.querySelector('#city').addEventListener('change', e=>{
  document.querySelector('#customFields').classList.toggle('hidden',e.target.value!=='custom');
});

let premiumReady=false;
let premiumUnlocked=false;

function getDeviceToken(){
  let token=localStorage.getItem('mysticPremiumDeviceToken');
  if(!token){
    token=(crypto?.randomUUID?.() || `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem('mysticPremiumDeviceToken',token);
  }
  return token;
}

function apiConfigured(){
  return PREMIUM_API?.url && PREMIUM_API?.anonKey && !PREMIUM_API.url.includes('YOUR_PROJECT') && !PREMIUM_API.anonKey.includes('YOUR_');
}

async function callPremiumRpc(fn, payload){
  if(!apiConfigured()) throw new Error('Premium 授權後端尚未設定');

  let res;
  try{
    res=await fetch(`${PREMIUM_API.url}/rest/v1/rpc/${fn}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
        'apikey':PREMIUM_API.anonKey
      },
      body:JSON.stringify(payload)
    });
  }catch(networkErr){
    throw new Error(`無法連到 Supabase：${networkErr?.message || 'Network error'}`);
  }

  const raw=await res.text();
  let data=null;
  if(raw){
    try{ data=JSON.parse(raw); }
    catch{ data=raw; }
  }

  if(!res.ok){
    const detail =
      (data && typeof data === 'object' && (data.message || data.details || data.hint || data.code))
      || (typeof data === 'string' ? data : '')
      || `HTTP ${res.status}`;
    throw new Error(`Supabase ${res.status}：${detail}`);
  }

  return data;
}

async function logFreeTestSummary(payload){
  if(!apiConfigured()) return;
  try{
    await callPremiumRpc('record_free_test', payload);
  }catch(err){
    // 紀錄失敗不能影響使用者取得解析結果
    console.warn('Free test log failed', err);
  }
}

function setPremiumState(unlocked, message=''){
  premiumUnlocked=!!unlocked;
  const msg=document.querySelector('#unlockStatus');
  msg.classList.toggle('success',premiumUnlocked);
  if(message) msg.textContent=message;
  if(premiumUnlocked && premiumReady) document.querySelector('#premiumReport').classList.remove('hidden');
  if(!premiumUnlocked) document.querySelector('#premiumReport').classList.add('hidden');
}

async function restorePremiumAccess(){
  const msg=document.querySelector('#unlockStatus');
  if(!apiConfigured()){
    msg.textContent='授權系統尚未完成後端設定。網站管理員請依 README 完成 V6 設定。';
    return;
  }
  try{
    const result=await callPremiumRpc('check_premium_license',{p_device_token:getDeviceToken()});
    const ok = result === true || result?.ok === true || result?.active === true;
    if(ok) setPremiumState(true,'✓ 此裝置已取得 Premium 授權。重新產生資料後會顯示完整報告。');
  }catch(err){
    console.warn('Premium restore failed',err);
  }
}

document.querySelector('#unlockPremium').addEventListener('click',async()=>{
  const input=document.querySelector('#premiumCode');
  const btn=document.querySelector('#unlockPremium');
  const msg=document.querySelector('#unlockStatus');
  const code=input.value.trim().toUpperCase();
  if(!code){ msg.textContent='請先輸入 LINE 收到的專屬解鎖碼。'; return; }
  if(!apiConfigured()){
    msg.textContent='授權系統尚未完成設定，請聯絡網站管理員。';
    return;
  }
  btn.disabled=true;
  btn.textContent='驗證中…';
  msg.classList.remove('success');
  msg.textContent='正在驗證你的專屬代碼…';
  try{
    const result=await callPremiumRpc('activate_premium_code',{p_code:code,p_device_token:getDeviceToken()});
    const ok=result?.success === true || result?.ok === true;
    if(ok){
      setPremiumState(true,'✓ 解鎖成功！此裝置已綁定 Premium 授權。');
      input.value='';
      if(premiumReady) document.querySelector('#premiumReport').scrollIntoView({behavior:'smooth'});
    }else{
      const messages={invalid:'解鎖碼不存在，請確認是否輸入正確。',expired:'此解鎖碼已過期，請透過 LINE 聯絡。',used:'此解鎖碼已達使用次數上限。',inactive:'此解鎖碼目前已停用。'};
      setPremiumState(false,result?.message || messages[result?.reason] || '無法啟用此代碼，請透過 LINE 聯絡。');
    }
  }catch(err){
    console.error(err);
    setPremiumState(false,`驗證失敗：${err?.message || '未知錯誤'}`);
  }finally{
    btn.disabled=false;
    btn.textContent='解鎖完整報告';
  }
});
restorePremiumAccess();



const loveProfiles={
  1:{need:'被尊重、被信任，也需要保有自己的決定空間。',trigger:'被控制、被否定，或每件事都要被追問。',conflict:'情緒上來時容易先捍衛立場，語氣可能比心意更強。'},
  2:{need:'穩定回應、溫柔確認，以及「你有把我放在心上」的感覺。',trigger:'冷處理、忽冷忽熱、敷衍回應。',conflict:'容易先忍耐，累積久了才一次把委屈說出來。'},
  3:{need:'分享感、肯定與有趣的互動，希望愛情裡可以做自己。',trigger:'長期沒有回應、過度嚴肅或一直被潑冷水。',conflict:'可能用玩笑帶過真正的情緒，讓對方沒發現你其實受傷了。'},
  4:{need:'穩定、承諾與可預期的行動，比漂亮話更相信「你有做到」。',trigger:'反覆改變、失約、說到卻做不到。',conflict:'會抓住事情本身與規則，容易讓對方覺得缺少情緒理解。'},
  5:{need:'新鮮感、自由與一起體驗生活，不喜歡關係變成束縛。',trigger:'過度查勤、限制交友、每天都一模一樣。',conflict:'壓力大時會想先離開現場，需要空間整理自己。'},
  6:{need:'被珍惜、被需要與穩定陪伴，也很在意關係中的責任感。',trigger:'把付出視為理所當然，或重要時刻缺席。',conflict:'容易一邊照顧一邊期待對方懂，沒被理解時會特別失落。'},
  7:{need:'深度理解、信任與適量獨處，不喜歡被逼著立刻表態。',trigger:'逼問、侵犯隱私、情緒還沒整理好就要求答案。',conflict:'容易先沉默思考，對方可能誤會成冷淡或逃避。'},
  8:{need:'尊重、可靠與共同成長，希望兩個人能一起把生活變得更好。',trigger:'不負責任、反覆失信，或把所有壓力丟給你。',conflict:'容易快速進入解決問題模式，忘了對方可能先需要被理解。'},
  9:{need:'情感共鳴、真誠與價值觀連結，希望愛不只是日常安排。',trigger:'冷漠、自私，或對你的感受毫不在意。',conflict:'容易把當下問題連到過去的感受，需要避免一次背太多情緒。'},
  11:{need:'深度共鳴、真心回應與精神上的理解。',trigger:'敷衍、忽視直覺感受、說一套做一套。',conflict:'感受很快很深，容易先讀到氣氛再放大不安。'},
  22:{need:'可靠承諾、共同目標與可以一起建立未來的安全感。',trigger:'沒有規劃、責任不對等、重大事情總是逃避。',conflict:'容易把關係問題當成待完成的專案，需記得先處理感受。'},
  33:{need:'溫柔互相照顧、被理解，也希望自己的付出被看見。',trigger:'只索取不回應、情緒勒索、把你的善意當義務。',conflict:'太容易先照顧對方，最後才發現自己已經累積很多委屈。'}
};
function relationshipType(a,b){const d=Math.abs(a-b);if(a===b)return['同頻鏡像型','你們很容易理解彼此，也可能因為太相似而同時踩進同一個盲點。'];if(d<=2)return['默契陪伴型','你們的節奏接近，建立安全感不難，關鍵是別把「應該懂我」當成不用說。'];if(d>=6)return['反差互補型','差異是吸引力也是課題。懂得翻譯彼此需求時，反而能補上對方看不到的角度。'];return['互補成長型','你們不是用同一種方式愛人，但有機會在磨合裡長出很強的合作感。'];}
function clamp(n){return Math.max(58,Math.min(96,Math.round(n)));}
function loveMetrics(a,b){const d=Math.abs(a-b), master=(a>9||b>9)?2:0;return {emotion:clamp(91-d*3+master),talk:clamp(86-d*2+(a%2===b%2?3:0)),long:clamp(88-d+(a===b?4:0)),growth:clamp(80+d*2+master)};}
document.querySelector('#relationshipForm').addEventListener('submit',e=>{
  e.preventDefault();const da=document.querySelector('#relDateA').value,db=document.querySelector('#relDateB').value;if(!da||!db)return;
  const a=lifePath(da),b=lifePath(db),pa=loveProfiles[a]||loveProfiles[reduceLife(a)],pb=loveProfiles[b]||loveProfiles[reduceLife(b)];
  const na=document.querySelector('#relNameA').value.trim()||'你',nb=document.querySelector('#relNameB').value.trim()||'對方';const [type,summary]=relationshipType(a,b),m=loveMetrics(a,b);const score=Math.round((m.emotion+m.talk+m.long+m.growth)/4);
  document.querySelector('#relScore').textContent=score;document.querySelector('#relType').textContent=type;document.querySelector('#relSummary').textContent=summary;
  document.querySelector('#relChips').innerHTML=`<span>${na}｜${a}號</span><span>${nb}｜${b}號</span><span>${type}</span>`;
  [['#relEmotion',m.emotion],['#relTalk',m.talk],['#relLong',m.long],['#relGrowth',m.growth]].forEach(([id,v])=>document.querySelector(id).textContent=v+'%');
  document.querySelector('#relNeedATitle').textContent=`${na}真正需要的愛`;document.querySelector('#relNeedA').textContent=pa.need;document.querySelector('#relNeedBTitle').textContent=`${nb}真正需要的愛`;document.querySelector('#relNeedB').textContent=pb.need;
  document.querySelector('#relStuck').textContent=`${na}比較在意的是「${pa.need.replace(/。$/,'')}」；${nb}比較在意的是「${pb.need.replace(/。$/,'')}」。真正容易卡住的通常不是愛不愛，而是兩個人確認愛的方式不同。發生摩擦時，先確認對方現在要的是理解、答案還是空間。`;
  document.querySelector('#relConflict').textContent=`${na}：${pa.conflict} ${nb}：${pb.conflict}`;document.querySelector('#relTrigger').textContent=`${na}較容易被「${pa.trigger.replace(/。$/,'')}」踩到；${nb}較容易被「${pb.trigger.replace(/。$/,'')}」踩到。`;
  const d=Math.abs(a-b);
  document.querySelector('#relAttraction').textContent=a===b?`${na}和${nb}很容易在彼此身上看到熟悉感：想事情、在意的點或愛人的節奏相近。這種「你真的懂我」會是吸引力，但也要小心兩個人同時固執或同時沉默。`:d>=6?`${na}與${nb}的吸引力很大一部分來自反差。對方身上有自己比較少使用的特質，所以一開始容易覺得新鮮、互補；關係走久後，真正的功課是把差異從「你怎麼跟我不一樣」變成「原來你是這樣接收愛」。`:`${na}與${nb}既有相近的節奏，也保留一些不同。你們容易因為相處舒服而靠近，又會被彼此不同的處理方式吸引。當差異被理解時，這段關係很有一起成長的空間。`;
  document.querySelector('#relLongTerm').textContent=m.long>=88?`長期來看，你們比較適合建立固定但不僵化的相處默契，例如重要事情提前說、衝突後一定回來談、保留各自空間。穩定感越清楚，越能把彼此的差異變成互補。`:`長期相處的關鍵不是要求兩個人變得一樣，而是建立一套雙方都懂的規則。尤其在聯絡頻率、情緒需要空間時怎麼說、承諾如何做到這三件事上，越具體越不容易反覆卡住。`;
  document.querySelector('#relLesson').textContent=`這段關係比較值得練習的是「翻譯需求」。${na}要練習把需要說得更具體，${nb}也要練習不要只用自己的方式判斷對方有沒有被愛。契合不是完全沒有摩擦，而是摩擦後越來越知道怎麼回到彼此身邊。`;
  document.querySelector('#relAdvice').innerHTML=`<p>① 衝突開始時，先說「我現在感覺___，我希望___」，不先替對方下結論。</p><p>② 把「你應該懂」改成具體請求，例如：我現在希望你先陪我五分鐘，再一起想辦法。</p><p>③ 每週留一次不處理問題的相處時間，只分享最近開心、累或期待的事情。</p>`;
  window.__loveShare={na,nb,score,type,summary,a,b,m};
  const out=document.querySelector('#relationshipResults');out.classList.remove('hidden');out.scrollIntoView({behavior:'smooth'});
});


function setRelationshipUnlocked(on){
  const paid=document.querySelector('#relPaidContent'), gate=document.querySelector('#relPaidGate');
  if(!paid||!gate)return;
  paid.classList.toggle('hidden',!on);
  gate.classList.toggle('hidden',on);
  if(on) localStorage.setItem('mysticRelationship149Test','1');
}
document.querySelector('#unlockRelationship').addEventListener('click',()=>{
  const code=document.querySelector('#relUnlockCode').value.trim().toUpperCase();
  const msg=document.querySelector('#relUnlockStatus');
  if(code==='TEST149'){
    msg.textContent='✓ 測試解鎖成功！'; msg.classList.add('success');
    setRelationshipUnlocked(true);
    setTimeout(()=>document.querySelector('#relPaidContent').scrollIntoView({behavior:'smooth'}),80);
  }else{
    msg.textContent='目前此版本僅開放站長測試碼 TEST149；正式客戶碼需串接付款／授權後台。'; msg.classList.remove('success');
  }
});

document.querySelector('#shareLoveCard').addEventListener('click',async()=>{
  const x=window.__loveShare;if(!x)return;
  const text=`💗 ${x.na} × ${x.nb}｜${x.type}\n整體契合度 ${x.score}%\n情感理解 ${x.m.emotion}%・溝通契合 ${x.m.talk}%・長期相處 ${x.m.long}%・成長互補 ${x.m.growth}%\n\n${x.summary}\n— 玄學人格研究所・感情使用說明書`;
  try{if(navigator.share){await navigator.share({title:'我們的戀愛關係卡',text});}else{await navigator.clipboard.writeText(text);alert('戀愛關係卡文字已複製，可以貼到 IG 限動或訊息分享 💌');}}catch(e){}
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

    const lp=lifePath(date), life=lifeProfiles[lp], py=personalYear(date,2026), py2027=personalYear(date,2027);
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
    const dom=dominantElementText(astro);
    const dm=getDayMaster(bazi);
    const profile=hd?.profile?.numbers || '—';
    const strategy=strategyName(hd);

    cardNumber.textContent=lp;
    cardTitle.textContent=`${life.name} · ${sun}`;
    cardSub.textContent=`月亮 ${moon}｜上升 ${rising}｜${typeName(hd)}｜日主 ${dm.stem}${dm.element}`;
    cardChips.innerHTML=[...life.keys,typeName(hd),`${dm.element}能量`].map(x=>`<span>${esc(x)}</span>`).join('');

    lifeTitle.textContent=`生命靈數 ${lp}｜${life.name}`;
    lifeText.textContent=life.text;
    lifeDeep.textContent=life.deep;
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
    astroDeep.textContent=astroDeepText(sun,moon,rising,dom);

    hdType.textContent=typeName(hd);
    hdAuthority.textContent=authorityName(hd);
    hdProfile.textContent=profile;
    hdDefinition.textContent=definitionName(hd);
    hdStrategy.textContent=strategy;
    hdText.textContent=`在人類圖系統裡，你的類型是 ${typeName(hd)}，內在權威為 ${authorityName(hd)}。可把「策略＋權威」當成一套自我觀察與決策練習，而不是絕對規則。`;
    hdDeep.textContent=hdDeepText(typeName(hd),authorityName(hd),profile,strategy);

    yearP.textContent=baziPillar(bazi?.pillars?.year);
    monthP.textContent=baziPillar(bazi?.pillars?.month);
    dayP.textContent=baziPillar(bazi?.pillars?.day);
    hourP.textContent=baziPillar(bazi?.pillars?.hour);
    dayMaster.textContent=`${dm.stem}${dm.element}`;
    dmElement.textContent=dm.element;
    baziText.textContent=`八字以節氣與干支建立四柱。這份排盤啟用真太陽時修正；你的日主為「${dm.stem}${dm.element}」。不同命理流派在日界、用神與解讀方式上可能存在差異。`;
    baziDeep.textContent=baziDeepText(dm);

    const cFromBazi=elementCrystal[dm.element];
    const crystalName=cFromBazi?.[0] || life.crystal;
    const crystalTheme=cFromBazi?.[1] || '自我覺察';
    crystal.textContent=`推薦探索：${crystalName}`;
    crystalText.textContent=`依你的日主五行與生命靈數，這版推薦以「${crystalTheme}」作為象徵性主題。你可以把 ${crystalName} 當作日常提醒物，而不是具有保證效果的能量工具。`;

    synthesis.textContent=`你的生命靈數是 ${lp} 號 ${life.name}；星盤三巨頭為 ${sun}、${moon}、${rising}；人類圖為 ${typeName(hd)}／${authorityName(hd)}／${profile}，策略是「${strategy}」；八字日主為 ${dm.stem}${dm.element}。把五套系統放在一起時，最值得觀察的不是「哪一個標籤最像你」，而是哪些主題反覆出現：你的行動方式、情緒需求、決策習慣、關係界線，以及你想如何把天賦落到生活裡。`;

    const deep=deepProfileBundle({life,sun,moon,rising,hdType:typeName(hd),authority:authorityName(hd),dm,py2027});
    identityDeep.textContent=deep.identity; loveDeep.textContent=deep.love; careerDeep.textContent=deep.career;
    moneyModes.textContent=deep.money; moneyDeep.textContent=deep.moneyText; challengeDeep.textContent=deep.challenge;
    akashicDeep.textContent=deep.akashic; year2027Deep.textContent=deep.year2027; monthGuide.innerHTML=monthGuideFn(date);
    fiveTakeaways.innerHTML=[`你是：${life.name}，核心組合 ${sun} × ${moon} × ${rising}` ,`愛情：需要${({牡羊座:'直接回應',金牛座:'穩定安心',雙子座:'交流互動',巨蟹座:'情緒承接',獅子座:'肯定珍惜',處女座:'可靠細節',天秤座:'平衡陪伴',天蠍座:'忠誠深度',射手座:'自由成長',摩羯座:'承諾可靠',水瓶座:'空間與共鳴',雙魚座:'共感溫柔'}[moon]||'理解與尊重')}`,`事業：優先累積可被看見、可重複交付的專業價值`,`金錢：先做強一個核心收入，再延伸多元收入`,`2027：個人流年 ${py2027}，把年度主題當導航，不當命定`].map((x,i)=>`<div><b>0${i+1}</b><span>${esc(x)}</span></div>`).join('');

    const premium=premiumBundle({lifeNum:lp,life,moon,rising,hdType:typeName(hd),authority:authorityName(hd),strategy,dm,py2027});
    const client=document.querySelector('#clientName')?.value?.trim();
    reportName.textContent=client ? `${client}的` : '你的';
    loveGreen.textContent=premium.green; loveRed.textContent=premium.red;
    loveManual.textContent=`你的月亮是${moon}、上升是${rising}。關係裡比起猜測對方心意，更適合建立「需求可以說、界線可以談、承諾看行動」的互動方式。`;
    workMode.textContent=premium.workMode;
    workEnvironment.textContent=`優先選擇能累積作品、專業與自主性的環境。以${authorityName(hd)}為自我觀察框架，重大決定不要只因外界催促，留意自己的決策節奏。`;
    wealthTop3.innerHTML=premium.wealth.map((x,i)=>`<div><b>0${i+1}</b><span>${esc(x)}</span></div>`).join('');
    moneyBlind.textContent=premium.moneyBlind;
    shadowPattern.textContent=premium.shadow; breakthrough.textContent=premium.breakthrough;
    innerChild.textContent=premium.innerChild; akashicLetter.textContent=premium.akashicLetter;
    quarterGuide.innerHTML=premium.quarters.map((x,i)=>`<div><small>Q${i+1}</small><strong>${esc(x)}</strong></div>`).join('');
    action30.textContent=premium.action30; action90.textContent=premium.action90; action365.textContent=premium.action365;
    premiumReady=true;
    if(premiumUnlocked) premiumReport.classList.remove('hidden');
    else premiumReport.classList.add('hidden');

    // 只記錄解析摘要，不送出出生日期／出生時間
    logFreeTestSummary({
      p_nickname: client || null,
      p_life_path: lp,
      p_life_name: life.name,
      p_sun: sun,
      p_moon: moon,
      p_rising: rising,
      p_hd_type: typeName(hd),
      p_hd_authority: authorityName(hd),
      p_hd_profile: profile,
      p_day_master: `${dm.stem}${dm.element}`,
      p_access_type: premiumUnlocked ? 'Premium' : '免費'
    });

    results.classList.remove('hidden');
    results.scrollIntoView({behavior:'smooth'});
    status.textContent=premiumUnlocked
      ? `Premium 完整解析完成｜出生地：${place.label}`
      : `免費解析完成｜出生地：${place.label}｜完整報告請於下方付款後輸入專屬解鎖碼`;
  }catch(err){
    console.error(err);
    status.textContent='排盤時發生錯誤。請確認資料格式；若部署後仍出現此訊息，可查看瀏覽器 Console 取得錯誤內容。';
  }
});
