const dims = {
  chat: "聊天／腦迴路匹配",
  initiative: "主動推進",
  collab: "生活協作",
  emotion: "情緒成熟",
  attention: "細節與投入",
  security: "安全感穩定",
  progress: "關係推進意願",
  mental: "需要伴侶當 PM 的風險"
};

const sectionTitles = [
  "一、日常出沒觀察 🐾",
  "二、貓咪社交模式 🐈",
  "三、生活小習慣 🧶",
  "四、突發事件反應 🐟",
  "五、你的隱藏貓格 ✨"
];

const sectionAt = [0, 4, 8, 12, 16];

function render() {
  let h = "";

  QUIZ_QUESTIONS.forEach((q, i) => {
    let si = sectionAt.indexOf(i);

    if (si >= 0) {
      h += `<div class="section">${sectionTitles[si]}</div>`;
    }

    h += `
      <div class="card">
        <div class="q">${i + 1}. ${q.t}</div>
    `;

    q.o.forEach((o, j) => {
      h += `
        <label class="opt">
          <input type="radio" name="q${i}" value="${j}">
          <span>${o[0]}</span>
        </label>
      `;
    });

    h += "</div>";
  });

  document.querySelector("#quiz").innerHTML = h;
}


/* ==========================================
   真正的隱藏評分
   這些資料仍然會送進後台
   ========================================== */

function calc() {

  const totals = {};
  const counts = {};

  Object.keys(dims).forEach(k => {
    totals[k] = 0;
    counts[k] = 0;
  });

  const answers = [];

  for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {

    const p = document.querySelector(
      `input[name=q${i}]:checked`
    );

    if (!p) {
      alert(`第 ${i + 1} 題還沒填喔 ฅ^•ﻌ•^ฅ`);
      return null;
    }

    answers.push(+p.value);

    const obj =
      QUIZ_QUESTIONS[i].o[+p.value][1];

    Object.entries(obj).forEach(([k, v]) => {
      totals[k] += v;
      counts[k]++;
    });
  }


  /* ================================
     先算原始人格分數 0 ~ 100
     ================================ */

  const pct = {};

  Object.keys(dims).forEach(k => {
    pct[k] = counts[k]
      ? Math.round(
          totals[k] /
          (counts[k] * 5) *
          100
        )
      : 0;
  });


  /* ================================
     墨昕適配度 V2
     ================================ */

  const clamp = (value, min = 0, max = 100) =>
    Math.max(min, Math.min(max, value));


  /*
    1. 區間型

    適合用於聊天：
    不是越高越好，
    而是落在舒服區間最好。
  */

  function rangeFit(
    value,
    idealMin,
    idealMax,
    penaltyPerPoint = 2
  ) {

    if (
      value >= idealMin &&
      value <= idealMax
    ) {
      return 100;
    }

    if (value < idealMin) {
      return clamp(
        100 -
        (idealMin - value) *
        penaltyPerPoint
      );
    }

    return clamp(
      100 -
      (value - idealMax) *
      penaltyPerPoint
    );
  }


  /*
    2. 門檻型

    適合：
    主動、協作、情緒成熟、
    細節、安全感、推進

    達標就不再要求更高。
  */

  function thresholdFit(
    value,
    target,
    penaltyPerPoint = 2
  ) {

    if (value >= target) {
      return 100;
    }

    return clamp(
      100 -
      (target - value) *
      penaltyPerPoint
    );
  }


  /*
    3. 風險型

    PM 風險越低越好。

    0~30：理想
    31~50：小幅扣分
    51~70：開始明顯危險
    71+：墨昕可能會變 PM
  */

  function riskFit(value) {

    if (value <= 30) {
      return 100;
    }

    if (value <= 50) {
      return clamp(
        100 -
        (value - 30) * 1.5
      );
    }

    if (value <= 70) {
      return clamp(
        70 -
        (value - 50) * 2
      );
    }

    return clamp(
      30 -
      (value - 70) * 2
    );
  }


  /* ================================
     各維度與墨昕的適配分
     ================================ */


  /*
    墨昕聊天原始值約 80。

    70~90 都視為非常舒服。
    太低可能沒內容；
    太高可能變成聊天壓力。
  */

  const chatFit =
    rangeFit(
      pct.chat,
      70,
      90,
      1.8
    );


  /*
    主動：
    不需要霸總，
    但至少不能每一步都等墨昕推。
  */

  const initiativeFit =
    thresholdFit(
      pct.initiative,
      70,
      2
    );


  /*
    協作：
    墨昕自己是 92，
    因此很在乎共同解題能力。
  */

  const collabFit =
    thresholdFit(
      pct.collab,
      75,
      2.4
    );


  /*
    情緒成熟：
    不需要完美，
    但不能一直需要墨昕收拾。
  */

  const emotionFit =
    thresholdFit(
      pct.emotion,
      75,
      2.2
    );


  /*
    細節與投入：
    記得對方說過什麼、
    願意理解對方的世界。
  */

  const attentionFit =
    thresholdFit(
      pct.attention,
      70,
      2
    );


  /*
    安全感：
    墨昕本人 97，
    很難長期承受高頻 reassurance。
  */

  const securityFit =
    thresholdFit(
      pct.security,
      75,
      2.4
    );


  /*
    關係推進：
    慢熱沒關係，
    但不能永遠停在聊天室。
  */

  const progressFit =
    thresholdFit(
      pct.progress,
      55,
      1.8
    );


  /*
    PM 風險
  */

  const mentalFit =
    riskFit(
      pct.mental
    );


  /* ================================
     最終墨昕適配度

     權重依妳目前最在意的東西配置
     ================================ */

  const compatibility = Math.round(

      chatFit       * 0.18

    + initiativeFit * 0.14

    + collabFit     * 0.20

    + emotionFit    * 0.16

    + attentionFit  * 0.10

    + securityFit   * 0.10

    + progressFit   * 0.06

    + mentalFit     * 0.06

  );


  /* ================================
     貓咪人格
     前台顯示用
     ================================ */

  let type;
  let desc;
  let catEmoji;


  if (
    pct.collab >= 75 &&
    pct.initiative >= 70
  ) {

    type = "三花管家貓";
    catEmoji = "🐈";

    desc =
      "你是可靠的三花管家貓！" +
      "遇到事情時很自然就會開始整理資訊、想辦法，" +
      "也不太喜歡把所有決定都丟給別人。" +
      "跟你一起出門，通常不用擔心兩個人站在路邊一起發呆。";
  }


  else if (
    pct.chat >= 78 &&
    pct.emotion >= 70
  ) {

    type = "熱情橘貓";
    catEmoji = "🐈";

    desc =
      "你是熱情橘貓！" +
      "熟起來之後存在感會越來越強，" +
      "看到有趣的東西會想分享，也很容易接住別人的情緒。" +
      "你的世界不是安安靜靜的那種，是會突然跑過來拍人一下的那種。";
  }


  else if (
    pct.security >= 75 &&
    pct.initiative < 65
  ) {

    type = "神秘黑貓";
    catEmoji = "🐈‍⬛";

    desc =
      "你是神秘黑貓。" +
      "不太需要一直黏著別人，也很習慣擁有自己的生活。" +
      "剛認識時可能有點難靠近，" +
      "但熟了之後會默默出現在喜歡的人附近。";
  }


  else if (
    pct.attention >= 78 &&
    pct.chat >= 60
  ) {

    type = "機靈賓士貓";
    catEmoji = "🐈‍⬛";

    desc =
      "你是機靈賓士貓！" +
      "觀察力很好，常常會注意到別人沒發現的小地方。" +
      "聊天也有自己奇妙的切入角度，" +
      "偶爾大家還在看主角，你已經在研究背景那盆植物了。";
  }


  else if (
    pct.emotion >= 75 &&
    pct.collab >= 65
  ) {

    type = "溫柔布偶貓";
    catEmoji = "🐱";

    desc =
      "你是溫柔布偶貓。" +
      "你很容易注意到身邊人的狀態，" +
      "不一定會搶著主導事情，但通常願意陪伴、傾聽和幫忙。" +
      "屬於待在旁邊就會讓人慢慢放鬆的類型。";
  }


  else {

    type = "自在虎斑貓";
    catEmoji = "🐱";

    desc =
      "你是自在虎斑貓！" +
      "有自己的節奏，也不太喜歡把事情搞得太複雜。" +
      "想靠近的時候會靠近，想自己待著的時候也很自在。" +
      "對你來說，舒服自然比照著某種標準生活重要得多。";
  }


  return {
    answers,
    pct,
    compatibility,
    type,
    desc,
    catEmoji,

    /*
      這些只方便未來除錯／分析，
      前台不用顯示。
    */

    compatibilityDetail: {
      chatFit,
      initiativeFit,
      collabFit,
      emotionFit,
      attentionFit,
      securityFit,
      progressFit,
      mentalFit
    }
  };
}



/* ==========================================
   送出結果
   ========================================== */

async function submit() {

  const r = calc();

  if (!r) return;


  const nickname =
    document.querySelector("#nickname")
      .value
      .trim() || "匿名";


  const note =
    document.querySelector("#note")
      .value
      .trim();


  /*
    注意：
    pct 與 compatibility
    仍然完整送給後台
  */

  const payload = {
    nickname,
    note,
    answers: r.answers,
    pct: r.pct,
    compatibility: r.compatibility,
    type: r.type,
    desc: r.desc
  };


  const btn =
    document.querySelector("#submitBtn");

  btn.disabled = true;
  btn.textContent = "正在尋找你的貓咪人格…";


  try {

    const res = await fetch(
      "/api/submit",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(payload)
      }
    );


    if (!res.ok) {
      throw new Error(
        "submit failed"
      );
    }

  }

  catch (e) {

    console.error(e);

    alert(
      "貓咪結果算出來了，但資料暫時沒有成功儲存 ฅ( ̳• ·̫ • ̳ฅ)"
    );

  }


  btn.disabled = false;
  btn.textContent = "看我的貓咪人格 🐾";


  /* ==========================================
     公開結果

     這裡完全不顯示：
     - 相容度
     - 主動推進
     - PM 風險
     - 安全感
     ========================================== */

  const el =
    document.querySelector("#result");

  el.style.display = "block";


  el.innerHTML = `
    <div class="cat-result">

      <div style="
        font-size:64px;
        text-align:center;
        margin-bottom:10px;
      ">
        ${r.catEmoji}
      </div>

      <h2 style="text-align:center;">
        ${nickname} 是
        ${r.type}！
      </h2>

      <div class="typebox">
        ${r.desc}
      </div>

      <p
        class="muted"
        style="
          text-align:center;
          margin-top:20px;
        "
      >
        每隻貓都有自己的生活方式，
        沒有哪一種比較好。
        這只是個輕鬆的小測驗 ฅ^•ﻌ•^ฅ
      </p>

    </div>
  `;


  el.scrollIntoView({
    behavior: "smooth"
  });

}


render();

document
  .querySelector("#submitBtn")
  .addEventListener(
    "click",
    submit
  );