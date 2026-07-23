const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

pres.layout = "LAYOUT_WIDE";
pres.author = "JoCoding AI Product Builder";

// ─── Color Palette: Midnight Tech ───
const C = {
  bg:       "0F1629",  // deep navy
  bgLight:  "1A2744",  // slightly lighter navy
  card:     "1E3352",  // card background
  accent:   "00D4AA",  // mint/teal accent
  accent2:  "4F8CFF",  // blue accent
  accent3:  "FF6B6B",  // coral accent
  accent4:  "FFD93D",  // gold accent
  white:    "FFFFFF",
  gray:     "8899AA",
  lightGray:"C8D6E5",
  textBody: "D0DCE8",
};

function darkBg(slide) {
  slide.background = { fill: C.bg };
}
function lightBg(slide) {
  slide.background = { fill: "F0F4F8" };
}

function addPageNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 11.8, y: 7.05, w: 1.2, h: 0.35,
    fontSize: 9, color: C.gray, align: "right", fontFace: "Arial",
  });
}

const TOTAL = 20;

// ════════════════════════════════════════
// SLIDE 1: Title
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // accent line top
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.accent },
  });

  // main title
  s.addText("바이브 코딩\n1인 창업 실전 가이드", {
    x: 0.8, y: 1.2, w: 7.5, h: 3.0,
    fontSize: 44, fontFace: "Arial", color: C.white, bold: true,
    lineSpacingMultiple: 1.15,
  });

  // subtitle
  s.addText("AI로 기획부터 엑시트까지, 코드 한 줄 없이 글로벌 서비스 만들기", {
    x: 0.8, y: 4.2, w: 7.5, h: 0.6,
    fontSize: 18, fontFace: "Arial", color: C.accent, italic: true,
  });

  // info box
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 5.2, w: 5.5, h: 1.5, fill: { color: C.card },
    rectRadius: 0.15, shadow: { type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.3 },
  });
  s.addText([
    { text: "조코딩 JoCoding", options: { fontSize: 14, bold: true, color: C.white, breakLine: true } },
    { text: "YouTube: 바이브 코딩 1인 창업 3시간 통합본", options: { fontSize: 11, color: C.gray, breakLine: true } },
    { text: "도서: 한빛미디어 (2026.05)", options: { fontSize: 11, color: C.gray } },
  ], { x: 1.1, y: 5.35, w: 5.0, h: 1.3, valign: "middle", margin: 0 });

  // right side big icon area
  s.addShape(pres.ShapeType.ellipse, {
    x: 9.0, y: 1.5, w: 3.5, h: 3.5,
    fill: { color: C.card },
    shadow: { type: "outer", blur: 20, offset: 5, angle: 135, color: "000000", opacity: 0.3 },
  });
  s.addText("AI\n1인\n창업", {
    x: 9.0, y: 1.5, w: 3.5, h: 3.5,
    fontSize: 36, fontFace: "Arial", color: C.accent, bold: true,
    align: "center", valign: "middle",
  });

  addPageNum(s, 1, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 2: 목차 / Agenda
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("AGENDA", {
    x: 0.8, y: 0.4, w: 4, h: 0.7,
    fontSize: 32, fontFace: "Arial", color: C.accent, bold: true,
  });

  const items = [
    { num: "00", title: "페르소나 & 벤치마킹", desc: "나는 누구이고, 누구를 위해 만드는가" },
    { num: "01", title: "웹 기초 & 첫 수익", desc: "HTML/CSS, 배포, 광고 수익화" },
    { num: "02", title: "유입 & 성장", desc: "SEO/GEO, 바이럴, 데이터 분석" },
    { num: "03", title: "AI 서비스 & 결제", desc: "React, AI API, Stripe 결제" },
    { num: "04", title: "구독 & 반복 매출", desc: "회원 시스템, DB, 자동화" },
    { num: "05", title: "운영 & 엑시트", desc: "모바일 앱, 미국 법인, 매각" },
  ];

  items.forEach((item, i) => {
    const yBase = 1.4 + i * 0.95;
    // number circle
    s.addShape(pres.ShapeType.ellipse, {
      x: 0.8, y: yBase, w: 0.6, h: 0.6,
      fill: { color: C.accent },
    });
    s.addText(item.num, {
      x: 0.8, y: yBase, w: 0.6, h: 0.6,
      fontSize: 14, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    // title
    s.addText(item.title, {
      x: 1.7, y: yBase, w: 5, h: 0.35,
      fontSize: 18, fontFace: "Arial", color: C.white, bold: true, margin: 0,
    });
    // desc
    s.addText(item.desc, {
      x: 1.7, y: yBase + 0.32, w: 5, h: 0.3,
      fontSize: 12, fontFace: "Arial", color: C.gray, margin: 0,
    });
  });

  // right column: 5 week overview
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.5, y: 1.0, w: 5.2, h: 6.0, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("5주 완성 로드맵", {
    x: 7.8, y: 1.2, w: 4.5, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: C.accent, bold: true,
  });

  const weeks = [
    { w: "1주차", k: "기획 → 첫 수익", c: C.accent },
    { w: "2주차", k: "유입 → 성장", c: C.accent2 },
    { w: "3주차", k: "AI → 결제", c: C.accent3 },
    { w: "4주차", k: "구독 → 반복 매출", c: C.accent4 },
    { w: "5주차", k: "운영 → 엑시트", c: "B07CFF" },
  ];
  weeks.forEach((wk, i) => {
    const y = 2.0 + i * 0.95;
    s.addShape(pres.ShapeType.roundRect, {
      x: 8.0, y: y, w: 4.2, h: 0.7, fill: { color: C.bgLight },
      rectRadius: 0.1,
    });
    s.addShape(pres.ShapeType.rect, {
      x: 8.0, y: y, w: 0.08, h: 0.7, fill: { color: wk.c },
    });
    s.addText(wk.w, {
      x: 8.3, y: y, w: 1.2, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: wk.c, bold: true, valign: "middle", margin: 0,
    });
    s.addText(wk.k, {
      x: 9.5, y: y, w: 2.5, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: C.lightGray, valign: "middle", margin: 0,
    });
  });

  addPageNum(s, 2, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 3: 페르소나 설정
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("페르소나 설정", {
    x: 0.8, y: 0.4, w: 6, h: 0.7,
    fontSize: 32, fontFace: "Arial", color: C.white, bold: true,
  });
  s.addText("나는 누구이고, 누구를 위해 만드는가", {
    x: 0.8, y: 1.0, w: 6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.accent, italic: true,
  });

  // Left: 창업자 페르소나
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.8, w: 5.8, h: 5.2, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("창업자 페르소나 (나 자신)", {
    x: 1.1, y: 1.95, w: 5.2, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent, bold: true,
  });

  const creatorItems = [
    ["배경", "현재 직업/전공은?"],
    ["기술 수준", "코딩 경험이 있는가?"],
    ["목표", "왜 1인 창업을 하려는가?"],
    ["시간", "하루 투입 가능 시간?"],
    ["자금", "초기 투자 가능 금액?"],
    ["강점", "남들보다 잘 아는 분야?"],
  ];
  creatorItems.forEach(([label, q], i) => {
    const y = 2.5 + i * 0.7;
    s.addText(label, {
      x: 1.3, y, w: 1.5, h: 0.5,
      fontSize: 12, fontFace: "Arial", color: C.accent, bold: true, valign: "middle", margin: 0,
    });
    s.addText(q, {
      x: 2.8, y, w: 3.5, h: 0.5,
      fontSize: 12, fontFace: "Arial", color: C.textBody, valign: "middle", margin: 0,
    });
    if (i < creatorItems.length - 1) {
      s.addShape(pres.ShapeType.line, {
        x: 1.3, y: y + 0.55, w: 5.0, h: 0,
        line: { color: C.bgLight, width: 0.5 },
      });
    }
  });

  // Right: 사용자 페르소나
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.0, y: 1.8, w: 5.5, h: 5.2, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("사용자 페르소나 (고객)", {
    x: 7.3, y: 1.95, w: 5.0, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent2, bold: true,
  });

  const personas = [
    { name: "민지", age: "28", job: "신입사원", pain: "출근룩 매일 고민", pay: "월 $5~10" },
    { name: "James", age: "35", job: "개발자", pain: "소개팅 옷 추천", pay: "건당 $3" },
    { name: "Yuki", age: "22", job: "대학생", pain: "저예산 트렌드", pay: "광고(무료)" },
  ];
  personas.forEach((p, i) => {
    const y = 2.6 + i * 1.4;
    s.addShape(pres.ShapeType.roundRect, {
      x: 7.3, y, w: 4.9, h: 1.15, fill: { color: C.bgLight },
      rectRadius: 0.1,
    });
    s.addText(`${p.name} (${p.age})`, {
      x: 7.6, y: y + 0.05, w: 2.2, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: C.white, bold: true, margin: 0,
    });
    s.addText(p.job, {
      x: 9.9, y: y + 0.05, w: 2.0, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.gray, align: "right", margin: 0,
    });
    s.addText(`고민: ${p.pain}`, {
      x: 7.6, y: y + 0.4, w: 4.3, h: 0.3,
      fontSize: 11, fontFace: "Arial", color: C.textBody, margin: 0,
    });
    s.addText(`지불 의향: ${p.pay}`, {
      x: 7.6, y: y + 0.7, w: 4.3, h: 0.3,
      fontSize: 11, fontFace: "Arial", color: C.accent, margin: 0,
    });
  });

  addPageNum(s, 3, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 4: 벤치마킹
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("벤치마킹 — 성공 사례 분석", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, fontFace: "Arial", color: C.white, bold: true,
  });

  const cases = [
    { name: "PhotoAI", who: "Pieter Levels", tech: "AI + Web", model: "구독", result: "월 $100K+", c: C.accent },
    { name: "Carrd", who: "AJ", tech: "정적 사이트", model: "프리미엄", result: "$1M+ ARR", c: C.accent2 },
    { name: "TypingMind", who: "Tony Dinh", tech: "React", model: "일회성 결제", result: "월 $30K+", c: C.accent3 },
    { name: "RemoteOK", who: "Pieter Levels", tech: "HTML/JS", model: "채용광고", result: "월 $50K+", c: C.accent4 },
  ];

  cases.forEach((c2, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xBase = 0.8 + col * 6.0;
    const yBase = 1.5 + row * 2.8;

    s.addShape(pres.ShapeType.roundRect, {
      x: xBase, y: yBase, w: 5.5, h: 2.4, fill: { color: C.card },
      rectRadius: 0.15,
      shadow: { type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.25 },
    });

    // left accent
    s.addShape(pres.ShapeType.rect, {
      x: xBase, y: yBase, w: 0.08, h: 2.4, fill: { color: c2.c },
    });

    s.addText(c2.name, {
      x: xBase + 0.3, y: yBase + 0.15, w: 3, h: 0.4,
      fontSize: 20, fontFace: "Arial", color: C.white, bold: true, margin: 0,
    });
    s.addText(c2.result, {
      x: xBase + 3.0, y: yBase + 0.15, w: 2.2, h: 0.4,
      fontSize: 18, fontFace: "Arial", color: c2.c, bold: true, align: "right", margin: 0,
    });

    const details = [
      ["창업자", c2.who],
      ["기술", c2.tech],
      ["수익 모델", c2.model],
    ];
    details.forEach(([lbl, val], j) => {
      const dy = yBase + 0.75 + j * 0.48;
      s.addText(lbl, {
        x: xBase + 0.3, y: dy, w: 1.5, h: 0.35,
        fontSize: 11, fontFace: "Arial", color: C.gray, margin: 0,
      });
      s.addText(val, {
        x: xBase + 1.8, y: dy, w: 3.2, h: 0.35,
        fontSize: 12, fontFace: "Arial", color: C.textBody, margin: 0,
      });
    });
  });

  addPageNum(s, 4, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 5: 개발-테스트 반복 사이클
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("개발-테스트 반복 사이클", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, fontFace: "Arial", color: C.white, bold: true,
  });
  s.addText("한 번에 하나의 기능만. 기능 완성 즉시 테스트. 문제 시 즉시 롤백.", {
    x: 0.8, y: 1.0, w: 10, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: C.gray, italic: true,
  });

  // cycle steps
  const steps = [
    { label: "PLAN", desc: "프롬프트\n작성", c: C.accent2, x: 2.0 },
    { label: "DEV", desc: "AI가\n코드 생성", c: C.accent, x: 4.2 },
    { label: "TEST", desc: "결과\n확인", c: C.accent4, x: 6.4 },
    { label: "COMMIT", desc: "Git\n저장", c: "B07CFF", x: 8.6 },
    { label: "DEPLOY", desc: "배포\n라이브", c: C.accent3, x: 10.8 },
  ];

  steps.forEach((st, i) => {
    // circle
    s.addShape(pres.ShapeType.ellipse, {
      x: st.x, y: 2.0, w: 1.6, h: 1.6,
      fill: { color: C.card },
      shadow: { type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.3 },
    });
    s.addShape(pres.ShapeType.ellipse, {
      x: st.x + 0.05, y: 2.05, w: 1.5, h: 1.5,
      line: { color: st.c, width: 2 }, fill: { color: C.card },
    });
    s.addText(st.label, {
      x: st.x, y: 2.2, w: 1.6, h: 0.6,
      fontSize: 16, fontFace: "Arial", color: st.c, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(st.desc, {
      x: st.x, y: 2.85, w: 1.6, h: 0.6,
      fontSize: 10, fontFace: "Arial", color: C.lightGray,
      align: "center", valign: "top", margin: 0,
    });

    // arrow
    if (i < steps.length - 1) {
      s.addText(">>>", {
        x: st.x + 1.55, y: 2.4, w: 0.7, h: 0.5,
        fontSize: 14, fontFace: "Arial", color: C.gray, align: "center", valign: "middle", margin: 0,
      });
    }
  });

  // Bottom: rules
  const rules = [
    { icon: "01", text: "한 번에 하나의 기능만 개발", c: C.accent },
    { icon: "02", text: "기능 완성 즉시 테스트", c: C.accent2 },
    { icon: "03", text: "테스트 통과 후 즉시 커밋", c: C.accent4 },
    { icon: "04", text: "배포 후 라이브에서 재확인", c: "B07CFF" },
    { icon: "05", text: "문제 발생 시 이전 커밋으로 롤백", c: C.accent3 },
  ];

  rules.forEach((r, i) => {
    const y = 4.3 + i * 0.58;
    s.addShape(pres.ShapeType.ellipse, {
      x: 2.5, y: y, w: 0.4, h: 0.4,
      fill: { color: r.c },
    });
    s.addText(r.icon, {
      x: 2.5, y: y, w: 0.4, h: 0.4,
      fontSize: 10, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(r.text, {
      x: 3.1, y: y, w: 7, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: C.textBody, valign: "middle", margin: 0,
    });
  });

  addPageNum(s, 5, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 6: STEP 1 — 웹 기초 (1주차)
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // week badge
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5, fill: { color: C.accent },
    rectRadius: 0.1,
  });
  s.addText("1주차", {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.bg, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("웹 기초 & 첫 수익", {
    x: 2.6, y: 0.35, w: 6, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // three columns
  const cols = [
    { title: "HTML/CSS/JS\n웹 개발", items: ["메모장으로 웹 페이지 제작", "챗GPT로 코드 생성", "로또 번호 추첨기 실습", "반응형 디자인 적용"], c: C.accent },
    { title: "Cloudflare\n배포", items: ["GitHub 리포지터리 생성", "Cloudflare Pages 연결", "자동 빌드 & 배포", "HTTPS 자동 적용"], c: C.accent2 },
    { title: "AdSense\n광고 수익화", items: ["애드센스 코드 삽입", "승인 요건 충족", "반응형 광고 배치", "Privacy Policy 페이지"], c: C.accent4 },
  ];

  cols.forEach((col, i) => {
    const xBase = 0.8 + i * 4.1;

    s.addShape(pres.ShapeType.roundRect, {
      x: xBase, y: 1.3, w: 3.7, h: 5.8, fill: { color: C.card },
      rectRadius: 0.15,
    });

    s.addText(col.title, {
      x: xBase + 0.3, y: 1.5, w: 3.1, h: 1.0,
      fontSize: 18, fontFace: "Arial", color: col.c, bold: true, margin: 0,
    });

    col.items.forEach((item, j) => {
      const y = 2.8 + j * 0.75;
      s.addShape(pres.ShapeType.ellipse, {
        x: xBase + 0.3, y: y + 0.05, w: 0.25, h: 0.25,
        fill: { color: col.c },
      });
      s.addText(item, {
        x: xBase + 0.7, y: y, w: 2.7, h: 0.55,
        fontSize: 12, fontFace: "Arial", color: C.textBody, valign: "middle", margin: 0,
      });
    });
  });

  // bottom prompt hint
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 5.8, w: 11.7, h: 1.1, fill: { color: C.bgLight },
    rectRadius: 0.1,
  });
  s.addText("Prompt", {
    x: 1.1, y: 5.9, w: 1.0, h: 0.35,
    fontSize: 10, fontFace: "Arial", color: C.accent, bold: true, margin: 0,
  });
  s.addText("\"로또 번호 추첨 웹사이트를 HTML, CSS, JavaScript로 만들어주세요. 1~45 중 랜덤 6개 번호 + 보너스, 번호별 색상, 추첨 애니메이션, 이전 기록 5개, 반응형 디자인, 단일 index.html\"", {
    x: 1.1, y: 6.2, w: 11.1, h: 0.55,
    fontSize: 10, fontFace: "Courier New", color: C.lightGray, margin: 0,
  });

  addPageNum(s, 6, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 7: 프롬프트 실전 — 코드 생성
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("프롬프트 실전 — AI 코드 생성", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // prompt template formula
  s.addText("효과적인 프롬프트 5단계 공식", {
    x: 0.8, y: 1.2, w: 6, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent, bold: true,
  });

  const formula = [
    { step: "Role", desc: "역할 지정", ex: "\"너는 시니어 풀스택 개발자야\"", c: C.accent },
    { step: "Context", desc: "맥락 설명", ex: "\"비개발자가 바이브 코딩으로 만들고 있어\"", c: C.accent2 },
    { step: "Task", desc: "구체적 요구", ex: "\"사진 업로드 기능을 구현해줘\"", c: C.accent4 },
    { step: "Format", desc: "출력 형식", ex: "\"파일별로 분리해서 주석 포함\"", c: "B07CFF" },
    { step: "Constraints", desc: "제약 조건", ex: "\"React + Vite, 외부 라이브러리 최소화\"", c: C.accent3 },
  ];

  formula.forEach((f, i) => {
    const y = 1.8 + i * 0.85;
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y, w: 11.7, h: 0.7, fill: { color: C.card },
      rectRadius: 0.1,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: 1.0, y: y + 0.1, w: 1.2, h: 0.5, fill: { color: f.c },
      rectRadius: 0.08,
    });
    s.addText(f.step, {
      x: 1.0, y: y + 0.1, w: 1.2, h: 0.5,
      fontSize: 12, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(f.desc, {
      x: 2.4, y, w: 1.8, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0,
    });
    s.addText(f.ex, {
      x: 4.2, y, w: 8.0, h: 0.7,
      fontSize: 11, fontFace: "Courier New", color: C.lightGray, valign: "middle", margin: 0,
    });
  });

  // bottom: situation table
  s.addText("상황별 프롬프트 패턴", {
    x: 0.8, y: 6.2, w: 5, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.accent, bold: true,
  });
  const patterns = [
    ["새 기능", "\"~기능을 구현해줘\""],
    ["버그 수정", "\"~에서 ~에러가 발생해\""],
    ["디자인", "\"~디자인을 ~로 변경해줘\""],
    ["성능", "\"~가 느려. 최적화해줘\""],
  ];
  patterns.forEach((p, i) => {
    const x = 0.8 + i * 3.05;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 6.6, w: 2.8, h: 0.65, fill: { color: C.bgLight },
      rectRadius: 0.08,
    });
    s.addText(p[0], {
      x: x + 0.1, y: 6.62, w: 1.0, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.accent, bold: true, margin: 0,
    });
    s.addText(p[1], {
      x: x + 0.1, y: 6.9, w: 2.5, h: 0.3,
      fontSize: 9, fontFace: "Courier New", color: C.gray, margin: 0,
    });
  });

  addPageNum(s, 7, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 8: STEP 2 — 데이터 분석 & AARRR
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5, fill: { color: C.accent2 },
    rectRadius: 0.1,
  });
  s.addText("2주차", {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.bg, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("데이터 분석 & AARRR 퍼널", {
    x: 2.6, y: 0.35, w: 8, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // AARRR funnel
  const funnel = [
    { label: "Acquisition\n획득", desc: "방문자 수, 유입 채널", w: 6.0, c: C.accent },
    { label: "Activation\n활성화", desc: "회원가입률, Aha Moment", w: 5.2, c: C.accent2 },
    { label: "Retention\n유지", desc: "D1/D7/D30 유지율", w: 4.4, c: C.accent4 },
    { label: "Referral\n추천", desc: "K-Factor, 공유 횟수", w: 3.6, c: "B07CFF" },
    { label: "Revenue\n수익", desc: "ARPU, LTV, 전환율", w: 2.8, c: C.accent3 },
  ];

  funnel.forEach((f, i) => {
    const y = 1.4 + i * 1.05;
    const xCenter = 3.5;
    const xStart = xCenter + (6.0 - f.w) / 2;

    s.addShape(pres.ShapeType.roundRect, {
      x: xStart, y, w: f.w, h: 0.85, fill: { color: f.c }, transparency: 20,
      rectRadius: 0.1,
    });
    s.addText(f.label, {
      x: xStart + 0.2, y, w: 2.0, h: 0.85,
      fontSize: 12, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0,
    });
    s.addText(f.desc, {
      x: xStart + 2.2, y, w: f.w - 2.5, h: 0.85,
      fontSize: 11, fontFace: "Arial", color: C.lightGray, valign: "middle", margin: 0,
    });
  });

  // Right: Tools
  s.addShape(pres.ShapeType.roundRect, {
    x: 8.5, y: 1.4, w: 4.3, h: 5.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("분석 도구", {
    x: 8.8, y: 1.55, w: 3.7, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent, bold: true,
  });

  const tools = [
    { name: "Google Analytics", desc: "수치 데이터 분석\n페이지뷰, 체류 시간, 이탈률", c: C.accent4 },
    { name: "MS Clarity", desc: "행동 시각화\n히트맵, 세션 녹화, Rage Click", c: C.accent2 },
    { name: "Userback", desc: "피드백 수집\n스크린샷 + 버그 리포트", c: C.accent3 },
  ];
  tools.forEach((t, i) => {
    const y = 2.2 + i * 1.55;
    s.addShape(pres.ShapeType.roundRect, {
      x: 8.8, y, w: 3.7, h: 1.3, fill: { color: C.bgLight },
      rectRadius: 0.1,
    });
    s.addText(t.name, {
      x: 9.0, y: y + 0.1, w: 3.3, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: t.c, bold: true, margin: 0,
    });
    s.addText(t.desc, {
      x: 9.0, y: y + 0.5, w: 3.3, h: 0.7,
      fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  // PMF callout
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 6.7, w: 7.4, h: 0.5, fill: { color: C.accent }, transparency: 80,
    rectRadius: 0.08,
  });
  s.addText("PMF (Product-Market Fit): 유지율 40% 이상 = 유니콘 기업 수준", {
    x: 1.0, y: 6.7, w: 7.0, h: 0.5,
    fontSize: 12, fontFace: "Arial", color: C.accent, bold: true, valign: "middle", margin: 0,
  });

  addPageNum(s, 8, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 9: SEO & GEO
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("SEO vs GEO — 검색 최적화 전략", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Two columns
  // SEO
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.3, w: 5.8, h: 5.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("SEO", {
    x: 1.1, y: 1.5, w: 2, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: C.accent2, bold: true,
  });
  s.addText("Search Engine Optimization", {
    x: 2.5, y: 1.55, w: 3.5, h: 0.4,
    fontSize: 11, fontFace: "Arial", color: C.gray,
  });

  const seoItems = [
    { label: "대상", value: "Google, Bing 검색 엔진" },
    { label: "목표", value: "검색 결과 상위 노출" },
    { label: "핵심 파일", value: "robots.txt, sitemap.xml" },
    { label: "전략", value: "키워드, 백링크, 메타 태그" },
    { label: "시간", value: "2~6개월" },
  ];
  seoItems.forEach((item, i) => {
    const y = 2.3 + i * 0.85;
    s.addText(item.label, {
      x: 1.3, y, w: 1.6, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.accent2, bold: true, margin: 0,
    });
    s.addText(item.value, {
      x: 2.9, y, w: 3.2, h: 0.55,
      fontSize: 12, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  // GEO
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.0, y: 1.3, w: 5.8, h: 5.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("GEO", {
    x: 7.3, y: 1.5, w: 2, h: 0.5,
    fontSize: 24, fontFace: "Arial", color: C.accent, bold: true,
  });
  s.addText("Generative Engine Optimization", {
    x: 8.7, y: 1.55, w: 3.7, h: 0.4,
    fontSize: 11, fontFace: "Arial", color: C.gray,
  });

  const geoItems = [
    { label: "대상", value: "ChatGPT, Perplexity 등 AI" },
    { label: "목표", value: "AI 답변에 인용/추천" },
    { label: "핵심 파일", value: "llms.txt" },
    { label: "전략", value: "구조화된 정보, 명확한 답변" },
    { label: "시간", value: "즉시 ~ 2주" },
  ];
  geoItems.forEach((item, i) => {
    const y = 2.3 + i * 0.85;
    s.addText(item.label, {
      x: 7.5, y, w: 1.6, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.accent, bold: true, margin: 0,
    });
    s.addText(item.value, {
      x: 9.1, y, w: 3.2, h: 0.55,
      fontSize: 12, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  addPageNum(s, 9, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 10: Carrying Capacity & 바이럴
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("성장 엔진 — Carrying Capacity & 바이럴", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Big formula
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.3, w: 6.0, h: 1.4, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("Carrying Capacity  =  일일 유입 / 이탈률", {
    x: 1.1, y: 1.4, w: 5.5, h: 0.5,
    fontSize: 16, fontFace: "Courier New", color: C.accent, bold: true, margin: 0,
  });
  s.addText("예: 100명/일 / 5% = 최대 2,000명", {
    x: 1.1, y: 2.0, w: 5.5, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: C.textBody, margin: 0,
  });

  // Scenario table
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 3.0, w: 6.0, h: 3.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("시나리오별 비교", {
    x: 1.1, y: 3.15, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.accent, bold: true,
  });

  const scenarios = [
    { name: "현재", input: "50명", churn: "10%", cap: "500명", c: C.gray },
    { name: "마케팅 강화", input: "200명", churn: "10%", cap: "2,000명", c: C.accent2 },
    { name: "이탈 개선", input: "50명", churn: "3%", cap: "1,667명", c: C.accent },
    { name: "동시 적용", input: "200명", churn: "3%", cap: "6,667명", c: C.accent4 },
  ];

  // header
  ["시나리오", "유입", "이탈률", "Capacity"].forEach((h, i) => {
    s.addText(h, {
      x: 1.1 + i * 1.35, y: 3.65, w: 1.3, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.gray, bold: true, margin: 0,
    });
  });

  scenarios.forEach((sc, i) => {
    const y = 4.1 + i * 0.6;
    [sc.name, sc.input, sc.churn, sc.cap].forEach((v, j) => {
      s.addText(v, {
        x: 1.1 + j * 1.35, y, w: 1.3, h: 0.4,
        fontSize: 11, fontFace: "Arial", color: j === 3 ? sc.c : C.textBody,
        bold: j === 3, margin: 0,
      });
    });
  });

  // Right: K-Factor & channels
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.2, y: 1.3, w: 5.5, h: 2.0, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("K-Factor (바이럴 계수)", {
    x: 7.5, y: 1.45, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.accent4, bold: true,
  });
  s.addText("K = 초대수  x  전환율", {
    x: 7.5, y: 1.9, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Courier New", color: C.accent4, margin: 0,
  });
  s.addText("K > 1 이면 사용자가 자연 증가", {
    x: 7.5, y: 2.4, w: 4, h: 0.35,
    fontSize: 12, fontFace: "Arial", color: C.textBody, margin: 0,
  });

  // Marketing channels
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.2, y: 3.6, w: 5.5, h: 3.3, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("마케팅 채널", {
    x: 7.5, y: 3.75, w: 3, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.accent, bold: true,
  });

  s.addText("무료", {
    x: 7.5, y: 4.2, w: 1.0, h: 0.3,
    fontSize: 11, fontFace: "Arial", color: C.accent, bold: true, margin: 0,
  });
  ["SNS (X, IG)", "Reddit", "Product Hunt", "Discord", "Hacker News"].forEach((ch, i) => {
    s.addText(ch, {
      x: 7.7, y: 4.55 + i * 0.35, w: 2.2, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  s.addText("유료", {
    x: 10.0, y: 4.2, w: 1.0, h: 0.3,
    fontSize: 11, fontFace: "Arial", color: C.accent3, bold: true, margin: 0,
  });
  ["Google Ads", "Meta Ads", "TikTok Ads"].forEach((ch, i) => {
    s.addText(ch, {
      x: 10.2, y: 4.55 + i * 0.35, w: 2.2, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  addPageNum(s, 10, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 11: STEP 3 — 기술 아키텍처
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5, fill: { color: C.accent3 },
    rectRadius: 0.1,
  });
  s.addText("3주차", {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("기술 아키텍처 — AI 서비스 구조", {
    x: 2.6, y: 0.35, w: 8, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Architecture boxes
  const boxes = [
    { label: "프론트엔드", sub: "React + Vite", x: 0.8, y: 1.5, w: 3.0, h: 2.2, c: C.accent2,
      items: ["사용자 인터페이스", "입력 폼", "결과 표시", "반응형 디자인"] },
    { label: "서버리스 백엔드", sub: "Cloudflare Workers", x: 4.3, y: 1.5, w: 3.8, h: 2.2, c: C.accent,
      items: ["API Gateway", "서버리스 함수", "환경 변수 (API 키)", "CORS 설정"] },
    { label: "AI API", sub: "OpenAI / Claude", x: 8.6, y: 1.5, w: 4.0, h: 2.2, c: C.accent4,
      items: ["GPT-4o-mini (~$0.001/건)", "Claude Haiku (~$0.005/건)", "프롬프트 엔지니어링", "JSON 응답 파싱"] },
    { label: "결제", sub: "Polar + Stripe", x: 0.8, y: 4.3, w: 3.0, h: 2.2, c: C.accent3,
      items: ["3단계 요금제", "샌드박스 테스트", "Webhook 연동", "구독 관리"] },
    { label: "데이터베이스", sub: "Supabase", x: 4.3, y: 4.3, w: 3.8, h: 2.2, c: "B07CFF",
      items: ["PostgreSQL", "Auth (OAuth)", "RLS 보안 정책", "실시간 데이터"] },
    { label: "스토리지 & 분석", sub: "R2 + GA + Clarity", x: 8.6, y: 4.3, w: 4.0, h: 2.2, c: C.gray,
      items: ["파일 업로드 (R2)", "방문자 분석 (GA)", "행동 시각화 (Clarity)", "광고 수익 (AdSense)"] },
  ];

  boxes.forEach((b) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: C.card },
      rectRadius: 0.12,
    });
    s.addShape(pres.ShapeType.rect, {
      x: b.x, y: b.y, w: b.w, h: 0.06, fill: { color: b.c },
    });
    s.addText(b.label, {
      x: b.x + 0.2, y: b.y + 0.15, w: b.w - 0.4, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: b.c, bold: true, margin: 0,
    });
    s.addText(b.sub, {
      x: b.x + 0.2, y: b.y + 0.45, w: b.w - 0.4, h: 0.25,
      fontSize: 10, fontFace: "Arial", color: C.gray, margin: 0,
    });
    b.items.forEach((item, i) => {
      s.addText(item, {
        x: b.x + 0.4, y: b.y + 0.8 + i * 0.32, w: b.w - 0.6, h: 0.28,
        fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
      });
    });
  });

  addPageNum(s, 11, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 12: AI API 코드 예시
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("AI API 연동 — 코드 핵심 구조", {
    x: 0.8, y: 0.4, w: 10, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Code block
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.2, w: 7.5, h: 5.8, fill: { color: "0D1117" },
    rectRadius: 0.15,
  });
  s.addText("functions/api/recommend.js", {
    x: 1.0, y: 1.3, w: 4, h: 0.3,
    fontSize: 10, fontFace: "Courier New", color: C.gray, margin: 0,
  });

  const codeLines = [
    "export async function onRequestPost(context) {",
    "  const { gender, age, occasion } = ",
    "    await context.request.json();",
    "",
    "  const prompt = `패션 스타일리스트로서",
    "    ${gender}, ${age}세, ${occasion}에 맞는",
    "    코디 3가지를 JSON으로 추천해줘`;",
    "",
    "  const response = await fetch(",
    "    'https://api.openai.com/v1/chat/completions',",
    "    {",
    "      method: 'POST',",
    "      headers: {",
    "        Authorization: `Bearer ${context.env.API_KEY}`",
    "      },",
    "      body: JSON.stringify({",
    "        model: 'gpt-4o-mini',",
    "        messages: [{ role: 'user', content: prompt }]",
    "      })",
    "    }",
    "  );",
    "  return new Response(JSON.stringify(result));",
    "}",
  ];

  s.addText(codeLines.join("\n"), {
    x: 1.1, y: 1.7, w: 7.0, h: 5.1,
    fontSize: 9.5, fontFace: "Courier New", color: C.lightGray, margin: 0,
    valign: "top",
  });

  // Right: flow
  s.addShape(pres.ShapeType.roundRect, {
    x: 8.7, y: 1.2, w: 4.0, h: 5.8, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("요청 흐름", {
    x: 9.0, y: 1.35, w: 3.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.accent, bold: true,
  });

  const flow = [
    { step: "1", text: "사용자가 성별, 나이,\n상황 입력", c: C.accent2 },
    { step: "2", text: "프론트엔드에서\n입력값 검증", c: C.accent2 },
    { step: "3", text: "Workers로\nPOST 요청 전송", c: C.accent },
    { step: "4", text: "환경 변수에서\nAPI 키 로드", c: C.accent },
    { step: "5", text: "OpenAI API 호출\n(GPT-4o-mini)", c: C.accent4 },
    { step: "6", text: "JSON 응답 파싱\n→ 추천 3개 반환", c: C.accent4 },
    { step: "7", text: "프론트엔드에서\n결과 카드 렌더링", c: C.accent2 },
  ];

  flow.forEach((f, i) => {
    const y = 1.9 + i * 0.72;
    s.addShape(pres.ShapeType.ellipse, {
      x: 9.0, y: y + 0.05, w: 0.35, h: 0.35,
      fill: { color: f.c },
    });
    s.addText(f.step, {
      x: 9.0, y: y + 0.05, w: 0.35, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(f.text, {
      x: 9.5, y: y, w: 2.8, h: 0.55,
      fontSize: 9.5, fontFace: "Arial", color: C.textBody, valign: "middle", margin: 0,
    });
  });

  addPageNum(s, 12, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 13: 결제 시스템
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("글로벌 결제 시스템 구축", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // 3 pricing cards
  const plans = [
    { name: "Free", price: "$0", period: "영구 무료", features: ["일 3회 AI 추천", "기본 결과 표시", "광고 포함"], c: C.gray, highlight: false },
    { name: "Pro", price: "$9.99", period: "/월", features: ["무제한 AI 추천", "광고 제거", "우선 응답 속도"], c: C.accent, highlight: true },
    { name: "Premium", price: "$19.99", period: "/월", features: ["Pro 기능 전체", "추천 히스토리 저장", "스타일 프로필 분석"], c: C.accent4, highlight: false },
  ];

  plans.forEach((p, i) => {
    const xBase = 0.8 + i * 4.1;
    const bgColor = p.highlight ? C.accent : C.card;

    s.addShape(pres.ShapeType.roundRect, {
      x: xBase, y: 1.3, w: 3.7, h: 4.2, fill: { color: bgColor },
      rectRadius: 0.15,
      shadow: p.highlight ? { type: "outer", blur: 15, offset: 4, angle: 135, color: "000000", opacity: 0.4 } : undefined,
    });

    const textColor = p.highlight ? C.bg : C.white;
    const subColor = p.highlight ? "0A7A5C" : C.gray;

    s.addText(p.name, {
      x: xBase + 0.3, y: 1.5, w: 3.1, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: textColor, bold: true, margin: 0,
    });
    s.addText(p.price, {
      x: xBase + 0.3, y: 2.1, w: 2.0, h: 0.6,
      fontSize: 36, fontFace: "Arial", color: textColor, bold: true, margin: 0,
    });
    s.addText(p.period, {
      x: xBase + 2.3, y: 2.35, w: 1.2, h: 0.3,
      fontSize: 12, fontFace: "Arial", color: subColor, margin: 0,
    });

    p.features.forEach((f, j) => {
      const y = 3.0 + j * 0.55;
      s.addText("  " + f, {
        x: xBase + 0.3, y, w: 3.1, h: 0.4,
        fontSize: 12, fontFace: "Arial", color: p.highlight ? "0D4A35" : C.textBody, margin: 0,
      });
    });
  });

  // Bottom: required docs
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 5.8, w: 11.7, h: 1.4, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("글로벌 서비스 필수 문서", {
    x: 1.1, y: 5.95, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.accent3, bold: true,
  });

  const docs = ["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"];
  docs.forEach((d, i) => {
    const x = 1.1 + i * 2.85;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 6.4, w: 2.6, h: 0.55, fill: { color: C.bgLight },
      rectRadius: 0.08,
    });
    s.addText(d, {
      x, y: 6.4, w: 2.6, h: 0.55,
      fontSize: 11, fontFace: "Arial", color: C.textBody, align: "center", valign: "middle", margin: 0,
    });
  });

  addPageNum(s, 13, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 14: STEP 4 — 구독 & DB 스키마
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5, fill: { color: C.accent4 },
    rectRadius: 0.1,
  });
  s.addText("4주차", {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.bg, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("구독 시스템 & DB 설계", {
    x: 2.6, y: 0.35, w: 8, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // DB schema - three tables
  const tables = [
    { name: "profiles", fields: ["id (UUID, PK)", "email (TEXT)", "display_name", "plan (free/pro/premium)", "usage_count (INT)", "usage_reset_date"], x: 0.8, c: C.accent2 },
    { name: "subscriptions", fields: ["id (UUID, PK)", "user_id (FK)", "polar_subscription_id", "plan, status", "current_period_end", "created_at"], x: 4.8, c: C.accent },
    { name: "recommendations", fields: ["id (UUID, PK)", "user_id (FK)", "input_data (JSONB)", "output_data (JSONB)", "model_used", "tokens_used"], x: 8.8, c: C.accent4 },
  ];

  tables.forEach((t) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: t.x, y: 1.3, w: 3.6, h: 3.5, fill: { color: C.card },
      rectRadius: 0.12,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: t.x, y: 1.3, w: 3.6, h: 0.5, fill: { color: t.c },
      rectRadius: 0.12,
    });
    s.addShape(pres.ShapeType.rect, {
      x: t.x, y: 1.55, w: 3.6, h: 0.25, fill: { color: t.c },
    });
    s.addText(t.name, {
      x: t.x, y: 1.3, w: 3.6, h: 0.5,
      fontSize: 14, fontFace: "Courier New", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    t.fields.forEach((f, i) => {
      s.addText(f, {
        x: t.x + 0.2, y: 2.0 + i * 0.42, w: 3.2, h: 0.35,
        fontSize: 10, fontFace: "Courier New", color: C.textBody, margin: 0,
      });
    });
  });

  // arrows between tables
  s.addText("1:N", { x: 4.1, y: 2.8, w: 0.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.gray, align: "center", margin: 0 });
  s.addText("1:N", { x: 8.1, y: 2.8, w: 0.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.gray, align: "center", margin: 0 });

  // Bottom: usage limit algorithm
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 5.1, w: 11.7, h: 2.1, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("사용량 제한 알고리즘", {
    x: 1.1, y: 5.25, w: 5, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.accent, bold: true,
  });

  const algoSteps = [
    { step: "1", text: "인증 토큰 유효성 확인", result: "실패 -> 401" },
    { step: "2", text: "날짜 변경 시 카운터 리셋", result: "usage_count = 0" },
    { step: "3", text: "플랜별 한도 확인 (free: 3회)", result: "초과 -> 429 + 업그레이드 안내" },
    { step: "4", text: "AI 추천 처리 & 카운트 증가", result: "200 OK + 결과 반환" },
  ];
  algoSteps.forEach((a, i) => {
    const x = 1.1 + i * 2.85;
    s.addShape(pres.ShapeType.ellipse, {
      x: x, y: 5.75, w: 0.35, h: 0.35,
      fill: { color: C.accent },
    });
    s.addText(a.step, {
      x: x, y: 5.75, w: 0.35, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(a.text, {
      x: x + 0.45, y: 5.7, w: 2.2, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.white, margin: 0,
    });
    s.addText(a.result, {
      x: x + 0.45, y: 6.05, w: 2.2, h: 0.35,
      fontSize: 9, fontFace: "Arial", color: C.gray, margin: 0,
    });
  });

  addPageNum(s, 14, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 15: Webhook & 자동화
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("결제 Webhook & 구독 자동화", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Webhook event flow
  const events = [
    { event: "subscription.created", action: "DB에 구독 정보 저장\nplan 업그레이드", c: C.accent },
    { event: "subscription.updated", action: "구독 기간 갱신\nstatus 업데이트", c: C.accent2 },
    { event: "subscription.canceled", action: "status = 'canceled'\n만료일까지 사용 가능", c: C.accent4 },
    { event: "subscription.revoked", action: "plan = 'free'\nstatus = 'expired'", c: C.accent3 },
  ];

  events.forEach((e, i) => {
    const y = 1.3 + i * 1.45;

    // Polar badge
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y, w: 1.2, h: 0.45, fill: { color: e.c },
      rectRadius: 0.08,
    });
    s.addText("Polar", {
      x: 0.8, y, w: 1.2, h: 0.45,
      fontSize: 10, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // arrow
    s.addText(">>>", {
      x: 2.1, y, w: 0.6, h: 0.45,
      fontSize: 12, fontFace: "Arial", color: C.gray, align: "center", valign: "middle", margin: 0,
    });

    // event name
    s.addShape(pres.ShapeType.roundRect, {
      x: 2.8, y, w: 3.8, h: 1.15, fill: { color: C.card },
      rectRadius: 0.1,
    });
    s.addText(e.event, {
      x: 3.0, y: y + 0.05, w: 3.4, h: 0.35,
      fontSize: 11, fontFace: "Courier New", color: e.c, bold: true, margin: 0,
    });
    s.addText(e.action, {
      x: 3.0, y: y + 0.4, w: 3.4, h: 0.65,
      fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
    });

    // arrow to DB
    s.addText(">>>", {
      x: 6.7, y, w: 0.6, h: 0.45,
      fontSize: 12, fontFace: "Arial", color: C.gray, align: "center", valign: "middle", margin: 0,
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: 7.4, y, w: 1.2, h: 0.45, fill: { color: "B07CFF" },
      rectRadius: 0.08,
    });
    s.addText("Supabase", {
      x: 7.4, y, w: 1.2, h: 0.45,
      fontSize: 9, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
  });

  // Right: Cron automation
  s.addShape(pres.ShapeType.roundRect, {
    x: 9.0, y: 1.3, w: 3.8, h: 5.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("Cron 자동화", {
    x: 9.3, y: 1.5, w: 3.2, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent4, bold: true,
  });
  s.addText("매일 자정 자동 실행", {
    x: 9.3, y: 1.9, w: 3.2, h: 0.3,
    fontSize: 11, fontFace: "Arial", color: C.gray,
  });

  const cronTasks = [
    "만료 3일 전\n사용자 이메일 알림 전송",
    "만료된 구독\nstatus = 'expired' 변경",
    "plan = 'free'\n자동 다운그레이드",
    "일일 매출 리포트\n관리자에게 전송",
  ];
  cronTasks.forEach((t, i) => {
    const y = 2.5 + i * 1.1;
    s.addShape(pres.ShapeType.roundRect, {
      x: 9.3, y, w: 3.2, h: 0.85, fill: { color: C.bgLight },
      rectRadius: 0.08,
    });
    s.addText(t, {
      x: 9.5, y, w: 2.8, h: 0.85,
      fontSize: 10, fontFace: "Arial", color: C.textBody, valign: "middle", margin: 0,
    });
  });

  addPageNum(s, 15, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 16: STEP 5 — 앱 & 엑시트
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5, fill: { color: "B07CFF" },
    rectRadius: 0.1,
  });
  s.addText("5주차", {
    x: 0.8, y: 0.4, w: 1.6, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("앱 배포 & 엑시트 전략", {
    x: 2.6, y: 0.35, w: 8, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Left: App deployment
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.3, w: 5.8, h: 5.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("Expo 앱 배포 4단계", {
    x: 1.1, y: 1.5, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent2, bold: true,
  });

  const appSteps = [
    { step: "1", title: "개발자 계정 등록", detail: "Apple: $99/년, Google: $25 일회성", c: C.accent2 },
    { step: "2", title: "등록 정보 준비", detail: "아이콘, 스크린샷, 설명, 카테고리", c: C.accent },
    { step: "3", title: "EAS Build", detail: "클라우드 빌드 & 앱 서명", c: C.accent4 },
    { step: "4", title: "심사 & 출시", detail: "Apple 1~3일, Google 수시간", c: "B07CFF" },
  ];
  appSteps.forEach((a, i) => {
    const y = 2.2 + i * 1.1;
    s.addShape(pres.ShapeType.ellipse, {
      x: 1.3, y: y + 0.1, w: 0.5, h: 0.5,
      fill: { color: a.c },
    });
    s.addText(a.step, {
      x: 1.3, y: y + 0.1, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: "Arial", color: C.bg, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(a.title, {
      x: 2.1, y, w: 4, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.white, bold: true, margin: 0,
    });
    s.addText(a.detail, {
      x: 2.1, y: y + 0.4, w: 4, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.gray, margin: 0,
    });
  });

  // Right: Exit strategies
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.0, y: 1.3, w: 5.5, h: 5.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("엑시트 전략", {
    x: 7.3, y: 1.5, w: 4, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent3, bold: true,
  });

  const exits = [
    { name: "현금 흐름 유지", desc: "월 수익 계속 수령\n개인사업자/법인 선택", c: C.accent },
    { name: "매각", desc: "연 매출 3~5배로 매각\nAcquire.com 플랫폼", c: C.accent4 },
    { name: "Acqui-hire", desc: "기술력/인력 기반 인수\n대기업 제안", c: C.accent2 },
    { name: "IPO", desc: "기업 공개 (주식 상장)\n대규모 자본 조달", c: "B07CFF" },
  ];
  exits.forEach((e, i) => {
    const y = 2.2 + i * 1.1;
    s.addShape(pres.ShapeType.roundRect, {
      x: 7.3, y, w: 4.9, h: 0.9, fill: { color: C.bgLight },
      rectRadius: 0.1,
    });
    s.addShape(pres.ShapeType.rect, {
      x: 7.3, y, w: 0.06, h: 0.9, fill: { color: e.c },
    });
    s.addText(e.name, {
      x: 7.6, y: y + 0.05, w: 2, h: 0.3,
      fontSize: 13, fontFace: "Arial", color: e.c, bold: true, margin: 0,
    });
    s.addText(e.desc, {
      x: 7.6, y: y + 0.35, w: 4.2, h: 0.5,
      fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  addPageNum(s, 16, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 17: 비용 분석
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("도구별 비용 분석 — 초기 월 $20~50", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  const costData = [
    { tool: "Cloudflare Pages", free: "무제한 사이트", paid: "-", note: "완전 무료", c: C.accent },
    { tool: "Cloudflare Workers", free: "일 100K 요청", paid: "$5/월", note: "소규모 충분", c: C.accent },
    { tool: "Cloudflare R2", free: "10GB 저장", paid: "$0.015/GB", note: "소규모 충분", c: C.accent },
    { tool: "Supabase", free: "500MB, 50K MAU", paid: "$25/월", note: "무료 충분", c: "B07CFF" },
    { tool: "GitHub", free: "무제한 공개 저장소", paid: "$4/월", note: "무료 충분", c: C.gray },
    { tool: "OpenAI API", free: "-", paid: "사용량 비례", note: "월 $3~50", c: C.accent4 },
    { tool: "Claude Code", free: "-", paid: "$20/월", note: "핵심 도구", c: C.accent2 },
    { tool: "Polar", free: "수수료 4%", paid: "-", note: "매출 비례", c: C.accent3 },
    { tool: "GA + Clarity", free: "무제한", paid: "-", note: "완전 무료", c: C.accent },
  ];

  // headers
  const headers = ["도구", "무료 범위", "유료", "비고"];
  const colX = [1.0, 4.2, 7.5, 9.8];
  const colW = [3.0, 3.1, 2.1, 2.5];

  headers.forEach((h, i) => {
    s.addText(h, {
      x: colX[i], y: 1.25, w: colW[i], h: 0.4,
      fontSize: 11, fontFace: "Arial", color: C.accent, bold: true, margin: 0,
    });
  });

  s.addShape(pres.ShapeType.line, {
    x: 0.8, y: 1.65, w: 11.7, h: 0,
    line: { color: C.card, width: 1 },
  });

  costData.forEach((d, i) => {
    const y = 1.8 + i * 0.57;
    const bgFill = i % 2 === 0 ? C.card : C.bg;

    s.addShape(pres.ShapeType.rect, {
      x: 0.8, y, w: 11.7, h: 0.5, fill: { color: bgFill },
    });

    [d.tool, d.free, d.paid, d.note].forEach((v, j) => {
      s.addText(v, {
        x: colX[j], y, w: colW[j], h: 0.5,
        fontSize: 11, fontFace: "Arial",
        color: j === 0 ? d.c : C.textBody,
        bold: j === 0, valign: "middle", margin: 0,
      });
    });
  });

  // total
  s.addShape(pres.ShapeType.roundRect, {
    x: 3.5, y: 7.0, w: 6.5, h: 0.45, fill: { color: C.accent }, transparency: 80,
    rectRadius: 0.08,
  });
  s.addText("예상 월 운영비 (초기):  $20~50  (Claude Code + API)", {
    x: 3.7, y: 7.0, w: 6.0, h: 0.45,
    fontSize: 13, fontFace: "Arial", color: C.accent, bold: true, valign: "middle", margin: 0,
  });

  addPageNum(s, 17, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 18: 수익 시뮬레이션
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("6개월 수익 시뮬레이션", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Chart - bar chart
  const chartData = [
    { name: "월 매출", labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      values: [240, 519, 889, 1379, 1918, 2508] },
    { name: "순이익", labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      values: [213, 474, 822, 1277, 1781, 2332] },
  ];

  s.addChart(pres.charts.BAR, chartData, {
    x: 0.8, y: 1.2, w: 7.5, h: 4.5,
    showTitle: false,
    showValue: true,
    dataLabelPosition: "ctr",
    dataLabelFontSize: 9,
    dataLabelColor: C.white,
    chartColors: [C.accent2, C.accent],
    catAxisLabelColor: C.lightGray,
    catAxisLabelFontSize: 10,
    valAxisLabelColor: C.gray,
    valAxisLabelFontSize: 9,
    valGridLine: { color: C.card, size: 0.5 },
    catGridLine: { style: "none" },
    showLegend: true,
    legendPos: "t",
    legendColor: C.lightGray,
    legendFontSize: 10,
    plotArea: { fill: { color: C.bg } },
    valAxisNumFmt: "$#,##0",
  });

  // Right: key metrics
  s.addShape(pres.ShapeType.roundRect, {
    x: 8.7, y: 1.2, w: 4.0, h: 4.5, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("핵심 가정", {
    x: 9.0, y: 1.4, w: 3.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.accent, bold: true,
  });

  const assumptions = [
    { label: "일일 방문자", value: "100명 (점진 증가)" },
    { label: "무료->유료 전환", value: "3%" },
    { label: "월 구독료", value: "$9.99" },
    { label: "월 이탈률", value: "8%" },
    { label: "API 비용", value: "$0.001/건" },
  ];
  assumptions.forEach((a, i) => {
    const y = 2.0 + i * 0.55;
    s.addText(a.label, {
      x: 9.0, y, w: 2.0, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.gray, margin: 0,
    });
    s.addText(a.value, {
      x: 10.8, y, w: 1.5, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.textBody, align: "right", margin: 0,
    });
  });

  // Big number
  s.addText("6개월 누적 순이익", {
    x: 9.0, y: 4.7, w: 3.4, h: 0.3,
    fontSize: 11, fontFace: "Arial", color: C.gray,
  });
  s.addText("$6,898", {
    x: 9.0, y: 5.0, w: 3.4, h: 0.6,
    fontSize: 36, fontFace: "Arial", color: C.accent, bold: true,
  });

  // Bottom
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 6.1, w: 11.7, h: 1.1, fill: { color: C.card },
    rectRadius: 0.12,
  });
  s.addText("비즈니스 모델 공식", {
    x: 1.1, y: 6.2, w: 3, h: 0.35,
    fontSize: 12, fontFace: "Arial", color: C.accent4, bold: true,
  });
  s.addText("LTV = ARPU x 평균 구독 개월       CAC = 마케팅비 / 신규 유료       지속 가능 조건: LTV > 3 x CAC", {
    x: 1.1, y: 6.6, w: 11.0, h: 0.4,
    fontSize: 12, fontFace: "Courier New", color: C.lightGray, margin: 0,
  });

  addPageNum(s, 18, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 19: 미국 법인 비용
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("미국 법인 설립 — Stripe Atlas", {
    x: 0.8, y: 0.4, w: 10, h: 0.7,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  });

  // Cost table
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.3, w: 6.5, h: 5.0, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("법인 운영 비용 분석", {
    x: 1.1, y: 1.5, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent, bold: true,
  });

  const costs = [
    { item: "Stripe Atlas 법인 설립", init: "$500", annual: "-" },
    { item: "등록 대행 (Registered Agent)", init: "-", annual: "$100~300" },
    { item: "가상 오피스", init: "-", annual: "$100~200" },
    { item: "세무/법률 (CPA)", init: "-", annual: "$500~2,000" },
    { item: "Delaware Franchise Tax", init: "-", annual: "$400+" },
    { item: "은행 계좌 (Mercury)", init: "$0", annual: "$0" },
  ];

  ["항목", "초기 비용", "연간 유지"].forEach((h, i) => {
    s.addText(h, {
      x: 1.1 + i * 2.0, y: 2.05, w: 1.9, h: 0.35,
      fontSize: 10, fontFace: "Arial", color: C.accent, bold: true, margin: 0,
    });
  });

  costs.forEach((c2, i) => {
    const y = 2.5 + i * 0.55;
    s.addShape(pres.ShapeType.rect, {
      x: 1.0, y, w: 6.1, h: 0.45, fill: { color: i % 2 === 0 ? C.bgLight : C.card },
    });
    [c2.item, c2.init, c2.annual].forEach((v, j) => {
      s.addText(v, {
        x: 1.1 + j * 2.0, y, w: 1.9, h: 0.45,
        fontSize: 10, fontFace: "Arial", color: C.textBody, valign: "middle", margin: 0,
      });
    });
  });

  // Total
  s.addShape(pres.ShapeType.roundRect, {
    x: 1.0, y: 5.9, w: 6.1, h: 0.35, fill: { color: C.accent }, transparency: 80,
    rectRadius: 0.05,
  });
  s.addText("총합:  초기 ~$500  /  연간 ~$1,100~2,900", {
    x: 1.1, y: 5.9, w: 5.8, h: 0.35,
    fontSize: 11, fontFace: "Arial", color: C.accent, bold: true, valign: "middle", margin: 0,
  });

  // Right: Why US Corp
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.7, y: 1.3, w: 5.0, h: 5.0, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText("왜 미국 법인인가?", {
    x: 8.0, y: 1.5, w: 4.4, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.accent3, bold: true,
  });

  const reasons = [
    { title: "Stripe 직접 사용", desc: "190개국 결제 수수료 최소화" },
    { title: "글로벌 신뢰도", desc: "US Delaware C-Corp 신뢰" },
    { title: "투자 유치", desc: "미국 VC 투자 구조에 적합" },
    { title: "세금 최적화", desc: "한-미 조세 조약 활용" },
  ];
  reasons.forEach((r, i) => {
    const y = 2.2 + i * 1.0;
    s.addShape(pres.ShapeType.roundRect, {
      x: 8.0, y, w: 4.4, h: 0.75, fill: { color: C.bgLight },
      rectRadius: 0.08,
    });
    s.addText(r.title, {
      x: 8.2, y: y + 0.05, w: 4.0, h: 0.3,
      fontSize: 12, fontFace: "Arial", color: C.accent3, bold: true, margin: 0,
    });
    s.addText(r.desc, {
      x: 8.2, y: y + 0.35, w: 4.0, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.textBody, margin: 0,
    });
  });

  addPageNum(s, 19, TOTAL);
}

// ════════════════════════════════════════
// SLIDE 20: 마무리
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.accent },
  });

  s.addText("AI 시대,\n1인 유니콘의 시작", {
    x: 0.8, y: 1.0, w: 11.5, h: 2.5,
    fontSize: 48, fontFace: "Arial", color: C.white, bold: true,
    align: "center", lineSpacingMultiple: 1.2,
  });

  s.addText("코드 한 줄 없이, 기획부터 엑시트까지", {
    x: 0.8, y: 3.5, w: 11.5, h: 0.6,
    fontSize: 20, fontFace: "Arial", color: C.accent, italic: true,
    align: "center",
  });

  // 5 week summary pills
  const pills = [
    { label: "1주", desc: "첫 수익", c: C.accent },
    { label: "2주", desc: "성장", c: C.accent2 },
    { label: "3주", desc: "AI+결제", c: C.accent3 },
    { label: "4주", desc: "구독", c: C.accent4 },
    { label: "5주", desc: "엑시트", c: "B07CFF" },
  ];
  pills.forEach((p, i) => {
    const x = 1.8 + i * 2.0;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 4.5, w: 1.6, h: 0.9, fill: { color: p.c }, transparency: 20,
      rectRadius: 0.1,
    });
    s.addText(p.label, {
      x, y: 4.55, w: 1.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.white, bold: true,
      align: "center", margin: 0,
    });
    s.addText(p.desc, {
      x, y: 4.95, w: 1.6, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.lightGray,
      align: "center", margin: 0,
    });
  });

  // resources
  s.addShape(pres.ShapeType.roundRect, {
    x: 2.5, y: 5.8, w: 8.3, h: 1.3, fill: { color: C.card },
    rectRadius: 0.15,
  });
  s.addText([
    { text: "YouTube  ", options: { fontSize: 12, color: C.accent, bold: true } },
    { text: "youtube.com/watch?v=P3jFI-VpyLg", options: { fontSize: 11, color: C.gray, breakLine: true } },
    { text: "Website  ", options: { fontSize: 12, color: C.accent, bold: true } },
    { text: "jocoding.net", options: { fontSize: 11, color: C.gray, breakLine: true } },
    { text: "Book     ", options: { fontSize: 12, color: C.accent, bold: true } },
    { text: "한빛미디어 (2026.05)", options: { fontSize: 11, color: C.gray } },
  ], { x: 2.8, y: 5.9, w: 7.7, h: 1.1, valign: "middle", margin: 0 });

  addPageNum(s, 20, TOTAL);
}

// ════════════════════════════════════════
// Save
// ════════════════════════════════════════
const outputPath = "/Users/kimjongphil/Documents/GitHub/with_python_streamlit/docs/바이브코딩_1인창업_가이드.pptx";
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("Created: " + outputPath);
}).catch(err => {
  console.error("Error:", err);
});
