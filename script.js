const meanings = {
  1: {
    title: "1 號人｜開創者",
    keywords: ["獨立","行動","領導","開創"],
    intro: "你的人生主題，是學會相信自己、走出自己的路。你通常不喜歡被限制，越能掌握主導權，越容易發揮真正的力量。",
    personality: "直接、有主見、行動快，喜歡靠自己完成事情。",
    talent: "領導、開創、決策與把想法變成第一步。",
    love: "需要被尊重與信任，不喜歡過度依賴或控制。",
    money: "適合靠主動創造機會、個人品牌、領導或創業累積收入。",
    challenge: "太逞強、不願求助，或把獨立變成孤軍奮戰。",
    lesson: "真正的強大，不只是自己做到，也包括相信別人、允許合作。"
  },
  2: {
    title: "2 號人｜共感者",
    keywords: ["感受","合作","關係","細膩"],
    intro: "你對人與情緒非常敏銳。你擅長看見別人沒說出口的需要，也容易在關係裡找到自己的價值。",
    personality: "溫柔、敏感、細心，重視和諧與安全感。",
    talent: "協調、傾聽、陪伴，以及建立讓人安心的關係。",
    love: "重視回應與情緒交流，容易因對方的態度影響心情。",
    money: "適合透過合作、人際、服務與信任感累積機會。",
    challenge: "過度在意他人、害怕衝突，容易委屈自己。",
    lesson: "學會保有自己的立場，不需要靠討好換取愛。"
  },
  3: {
    title: "3 號人｜表達者",
    keywords: ["創意","表達","魅力","快樂"],
    intro: "你天生有把想法說出來、演出來、創作出來的能力。當你敢被看見，你的能量就會開始流動。",
    personality: "活潑、有想法、反應快，容易帶動氣氛。",
    talent: "內容創作、說故事、藝術、美感與社群表達。",
    love: "需要有趣、能聊天、願意分享生活的關係。",
    money: "靠創意、內容、曝光與個人特色更容易產生收入。",
    challenge: "容易分心、三分鐘熱度，情緒來得快也去得快。",
    lesson: "把靈感變成持續輸出，你的天賦才會真正累積成價值。"
  },
  4: {
    title: "4 號人｜建構者",
    keywords: ["穩定","秩序","執行","責任"],
    intro: "你的人生力量來自穩定、累積與可依靠。你不是最快的人，但你往往是最能把事情做紮實的人。",
    personality: "務實、有責任感、重視規則與安全感。",
    talent: "規劃、執行、流程、管理與長期累積。",
    love: "重視承諾與可靠，比浪漫更在意對方有沒有做到。",
    money: "適合透過長期規劃、穩定系統與紀律累積資產。",
    challenge: "害怕變動、太過僵化，容易把自己困在安全範圍。",
    lesson: "穩定不是不變，而是即使變化也能重新建立秩序。"
  },
  5: {
    title: "5 號人｜自由者",
    keywords: ["自由","冒險","變化","體驗"],
    intro: "你需要透過體驗世界認識自己。越有空間探索、移動與變化，你越有生命力。",
    personality: "好奇、靈活、喜歡新鮮感，不喜歡被綁住。",
    talent: "適應、溝通、跨領域、行銷與創造變化。",
    love: "需要自由與新鮮感，關係裡最怕窒息與控制。",
    money: "機會常來自變化、人脈、新領域與快速反應。",
    challenge: "衝動、容易膩，或還沒累積就急著換方向。",
    lesson: "真正的自由，不是一直離開，而是有能力選擇留下或出發。"
  },
  6: {
    title: "6 號人｜療癒者",
    keywords: ["愛","責任","療癒","美感"],
    intro: "你很容易察覺別人的情緒，也習慣照顧身邊的人。但你這一生真正要學習的，可能不是怎麼對別人更好，而是別在愛別人的過程裡，把自己放到最後。",
    personality: "溫暖、有責任感、重視關係，也有明顯的美感與照顧能量。",
    talent: "療癒、陪伴、審美、教育、服務與營造安全感。",
    love: "一旦認定會很願意付出，但也容易默默承擔太多。",
    money: "適合把照顧、美感、服務與信任轉化成長期價值。",
    challenge: "過度付出、責任感太重，或對自己與別人要求太高。",
    lesson: "愛別人的同時，也要允許自己被照顧、被選擇、被放在心上。"
  },
  7: {
    title: "7 號人｜探索者",
    keywords: ["思考","洞察","內在","真相"],
    intro: "你不喜歡只看表面。你習慣思考背後的原因，也需要大量獨處與內在整理。",
    personality: "理性、敏銳、內斂，對知識與真相有強烈好奇心。",
    talent: "研究、分析、觀察、深度內容與洞察。",
    love: "需要精神交流與私人空間，不容易快速打開自己。",
    money: "適合靠專業、知識、研究與深度判斷創造價值。",
    challenge: "想太多、過度懷疑，或因害怕受傷而保持距離。",
    lesson: "不是所有事情都要先想通才可以開始，有些答案要在行動中才會出現。"
  },
  8: {
    title: "8 號人｜成就者",
    keywords: ["事業","權力","財富","成果"],
    intro: "你的人生課題與資源、影響力、成就和金錢關係很深。你會被推著學習如何真正掌握力量。",
    personality: "目標感強、務實、有企圖心，重視成果。",
    talent: "管理、商業、資源整合、談判與放大成果。",
    love: "需要互相尊重、能並肩成長的伴侶。",
    money: "具有放大財富的潛力，但需要建立成熟的風險與資源觀。",
    challenge: "容易把價值綁在成敗、收入或控制感上。",
    lesson: "真正的力量，是能掌握資源，卻不被資源定義。"
  },
  9: {
    title: "9 號人｜理想者",
    keywords: ["共感","理想","療癒","完成"],
    intro: "你常常能感受到比自己更大的事情。你對人性、故事與情緒有深度共鳴，也容易背著不屬於自己的重量。",
    personality: "有同理心、理想感、感受深，也容易念舊。",
    talent: "療癒、創作、公益、教育與影響他人的能力。",
    love: "愛得深，也容易為了關係包容太多。",
    money: "當你的價值與影響力被清楚看見，收入通常會跟著放大。",
    challenge: "難以放下、容易犧牲自己，或沉浸在過去。",
    lesson: "結束不是失去，而是替新的生命階段騰出空間。"
  },
  11: {
    title: "11 號人｜直覺啟發者",
    keywords: ["直覺","靈感","敏銳","啟發"],
    intro: "11 是大師數。你通常有很高的感受力與直覺，也容易同時感受到理想與現實之間的拉扯。",
    personality: "敏感、有靈感、直覺強，容易接收到細微的氛圍與訊息。",
    talent: "啟發、創作、療癒、溝通與精神層面的洞察。",
    love: "需要深度理解與精神共鳴，表面的關係很難滿足你。",
    money: "當你把靈感具體化、建立穩定輸出，價值會被放大。",
    challenge: "焦慮、神經緊繃、理想太高或容易自我懷疑。",
    lesson: "讓直覺落地，而不是只停留在感受與想像。"
  },
  22: {
    title: "22 號人｜築夢實踐者",
    keywords: ["願景","建構","影響力","落地"],
    intro: "22 是大師數，被視為能把巨大願景實際建構出來的能量。你需要學習把理想轉化成系統。",
    personality: "格局大、責任感強，同時兼具理想與務實。",
    talent: "大型規劃、組織、系統化與長期影響力。",
    love: "重視穩定與共同目標，希望兩個人能一起建構未來。",
    money: "適合建立可放大的事業、資產、系統或團隊。",
    challenge: "容易背太大壓力，或因怕失敗而不敢真正開始。",
    lesson: "不用一次完成全部，把大願景拆成下一個可以完成的小步驟。"
  },
  33: {
    title: "33 號人｜慈愛導師",
    keywords: ["慈愛","療癒","奉獻","影響"],
    intro: "33 是大師數，帶著強烈的愛、責任與療癒能量。你可能很自然地想幫助別人，但也最需要學會界線。",
    personality: "溫暖、包容、責任感強，對他人的情緒很敏銳。",
    talent: "教學、療癒、藝術、陪伴與以生命經驗影響他人。",
    love: "非常重感情，也容易把照顧別人當成自己的責任。",
    money: "當你願意替自己的價值定價，服務與影響力可以形成穩定收入。",
    challenge: "過度犧牲、拯救別人，最後耗盡自己。",
    lesson: "真正的慈愛包含自己，界線不是冷漠，而是讓愛可以長久。"
  }
};

const yearMeanings = {
  1:"新的開始年。適合主動、開局、做出新的選擇，把注意力拉回自己真正想走的方向。",
  2:"關係與醞釀年。很多事情不一定要急著衝，合作、等待時機與情緒整理反而更重要。",
  3:"表達與曝光年。適合創作、社群、學習、拓展人脈，讓自己更敢被看見。",
  4:"打地基的一年。適合建立制度、習慣、工作流程與財務秩序，穩定比速度重要。",
  5:"變化與突破年。容易遇到新環境、新機會或方向轉換，保持彈性會比死守原計畫更有利。",
  6:"關係與責任年。家庭、感情、承諾與照顧議題會被放大，也很適合重新整理生活品質。",
  7:"內在與學習年。適合沉澱、進修、研究與重新理解自己，不需要一直向外證明。",
  8:"成果與財務年。事業、收入、權責與資源議題較突出，適合談成果、做商業與放大影響力。",
  9:"完成與釋放年。適合整理、告別、收尾與清理不再適合的人事物，為下一個循環留空間。"
};

function sumDigits(value) {
  return String(value).split("").reduce((sum, d) => sum + Number(d), 0);
}

function reduceLifePath(total) {
  while (total > 9 && ![11,22,33].includes(total)) {
    total = sumDigits(total);
  }
  return total;
}

function calculateLifePath(dateString) {
  const digits = dateString.replace(/\D/g, "");
  return reduceLifePath(sumDigits(digits));
}

function calculatePersonalYear(dateString, year=2026) {
  const [y,m,d] = dateString.split("-").map(Number);
  let total = sumDigits(m) + sumDigits(d) + sumDigits(year);
  while (total > 9) total = sumDigits(total);
  return total;
}

const form = document.getElementById("numberForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const birthdate = document.getElementById("birthdate").value;
  if (!birthdate) return;

  const lifePath = calculateLifePath(birthdate);
  const data = meanings[lifePath];
  const pYear = calculatePersonalYear(birthdate, 2026);

  document.getElementById("lifePathNumber").textContent = lifePath;
  document.getElementById("resultTitle").textContent = data.title;
  document.getElementById("resultIntro").textContent = data.intro;
  document.getElementById("personality").textContent = data.personality;
  document.getElementById("talent").textContent = data.talent;
  document.getElementById("love").textContent = data.love;
  document.getElementById("money").textContent = data.money;
  document.getElementById("challenge").textContent = data.challenge;
  document.getElementById("lesson").textContent = data.lesson;

  const keywords = document.getElementById("keywords");
  keywords.innerHTML = "";
  data.keywords.forEach(k => {
    const s = document.createElement("span");
    s.className = "keyword";
    s.textContent = k;
    keywords.appendChild(s);
  });

  document.getElementById("personalYear").textContent = pYear;
  document.getElementById("yearMeaning").textContent = yearMeanings[pYear];

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("yearResult").classList.remove("hidden");
  document.getElementById("result").scrollIntoView({behavior:"smooth"});
});
