// ⚠️ 생성 파일 — 직접 고치지 말 것. 원본: toss-minigames/packages/shared/src/engagement/remote-core.ts · config.ts
// 생성: node scripts/portal-config-build.mjs (시각을 넣지 않는다 — 내용이 같으면 파일도 같아야 배포가 no-op이 된다)
// packages/shared/src/engagement/remote-core.ts
var PARAMS = [
  { key: "rewardKillSwitch", type: "bool", apply: "instant" },
  { key: "rewardCoins", type: "int", min: 5, max: 100, apply: "day" },
  { key: "slotCap", type: "int", min: 50, max: 1e3, apply: "day" },
  { key: "adsDailyMax", type: "int", min: 5, max: 30, apply: "day" },
  { key: "gamePicksPerDay", type: "int", min: 1, max: 11, apply: "day" },
  { key: "dailySlotsPerDifficulty", type: "int", min: 1, max: 3, apply: "day" },
  { key: "energyTapsToFull", type: "int", min: 3, max: 30, apply: "day" },
  { key: "energyDailyMax", type: "int", min: 0, max: 5, apply: "day" },
  { key: "attendReward", type: "int", min: 0, max: 50, apply: "day" },
  { key: "attendStreakBonus", type: "int", min: 0, max: 200, apply: "day" },
  { key: "notiConsentReward", type: "int", min: 0, max: 300, apply: "day" },
  { key: "notiTemplateCode", type: "code", pattern: /^[A-Za-z0-9_-]{0,64}$/, apply: "day" },
  { key: "hostShareRate", type: "rate", min: 0.3, max: 0.5, apply: "day" },
  { key: "minConvertPoint", type: "int", min: 100, max: 1e3, apply: "day" },
  { key: "maxBalance", type: "int", min: 5e3, max: 2e4, apply: "day" }
];
var SPEC = new Map(PARAMS.map((p) => [p.key, p]));
var INSTANT_KEYS = PARAMS.filter((p) => p.apply === "instant").map((p) => p.key);
var DAY_KEYS = PARAMS.filter((p) => p.apply === "day").map((p) => p.key);
function checkValue(key, v) {
  const p = SPEC.get(key);
  if (!p) return null;
  switch (p.type) {
    case "bool":
      return typeof v === "boolean" ? null : `${key}: true/false\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
    case "enum":
      return typeof v === "string" && p.values.includes(v) ? null : `${key}: ${p.values.join("/")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
    case "int":
      if (typeof v !== "number" || !Number.isInteger(v)) return `${key}: \uC815\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
      return v >= p.min && v <= p.max ? null : `${key}: ${p.min}~${p.max} \uBC94\uC704\uC5EC\uC57C \uD569\uB2C8\uB2E4 (\uC785\uB825 ${v})`;
    case "rate":
      if (typeof v !== "number" || !Number.isFinite(v)) return `${key}: \uC22B\uC790\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
      return v >= p.min && v <= p.max ? null : `${key}: ${p.min}~${p.max} \uBC94\uC704\uC5EC\uC57C \uD569\uB2C8\uB2E4 (\uC785\uB825 ${v})`;
    case "code":
      return typeof v === "string" && p.pattern.test(v) ? null : `${key}: \uC601\uBB38\xB7\uC22B\uC790\xB7_\xB7- 64\uC790 \uC774\uB0B4\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
  }
}
function cleanValues(raw, where, errors) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    errors.push(`${where}: \uAC1D\uCCB4\uC5EC\uC57C \uD569\uB2C8\uB2E4`);
    return {};
  }
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!SPEC.has(k)) continue;
    const e = checkValue(k, v);
    if (e) errors.push(`${where}.${e}`);
    else out[k] = v;
  }
  return out;
}
function unknownKeys(doc) {
  const d = doc;
  const keys = [...Object.keys(d?.current?.values ?? {}), ...Object.keys(d?.pending?.values ?? {})];
  return [...new Set(keys.filter((k) => !SPEC.has(k)))];
}
var DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
function effectiveAtMs(date, boundaryHour = 5) {
  const m = DATE_RE.exec(date);
  if (!m) return NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const utc = Date.UTC(y, mo - 1, d, boundaryHour) - 9 * 36e5;
  const back = new Date(utc + 9 * 36e5);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return NaN;
  return utc;
}
function validateDoc(raw) {
  const errors = [];
  if (!raw || typeof raw !== "object") return { ok: false, errors: ["\uBB38\uC11C\uAC00 \uAC1D\uCCB4\uAC00 \uC544\uB2D9\uB2C8\uB2E4"] };
  const d = raw;
  if (d.schema !== 1) errors.push("schema\uB294 1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4");
  if (typeof d.rev !== "number" || !Number.isInteger(d.rev) || d.rev < 1) errors.push("rev\uB294 1 \uC774\uC0C1\uC758 \uC815\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4");
  const cur = d.current;
  const currentValues = cleanValues(cur?.values, "current.values", errors);
  let pending = null;
  if (d.pending != null) {
    const p = d.pending;
    if (typeof p.effectiveDate !== "string" || Number.isNaN(effectiveAtMs(p.effectiveDate))) {
      errors.push("pending.effectiveDate\uB294 YYYY-MM-DD \uD615\uC2DD\uC758 \uC2E4\uC81C \uB0A0\uC9DC\uC5EC\uC57C \uD569\uB2C8\uB2E4");
    }
    const values = cleanValues(p.values, "pending.values", errors);
    pending = { effectiveDate: String(p.effectiveDate), values };
  }
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    doc: {
      schema: 1,
      rev: d.rev,
      current: { values: currentValues },
      pending,
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : void 0
    }
  };
}
function resolveValues(doc, nowMs, boundaryHour = 5) {
  const p = doc.pending;
  if (p && nowMs >= effectiveAtMs(p.effectiveDate, boundaryHour)) {
    return { ...doc.current.values, ...p.values };
  }
  return { ...doc.current.values };
}
function pick(values, keys) {
  const out = {};
  for (const k of keys) if (values[k] !== void 0) out[k] = values[k];
  return out;
}
function valuesValid(values) {
  if (!values || typeof values !== "object") return false;
  return Object.entries(values).every(([k, v]) => SPEC.has(k) && checkValue(k, v) === null);
}

// packages/shared/src/engagement/config.ts
var PORTAL_ENGAGEMENT = {
  // 아침 05~11 / 점심 11~17 / 저녁 17~익일 05 (KST)
  timeSlots: [
    { id: "morning", name: "\uC544\uCE68", start: 5, end: 11, emoji: "\u{1F305}" },
    { id: "lunch", name: "\uC810\uC2EC", start: 11, end: 17, emoji: "\u2600\uFE0F" },
    // 저녁은 자정을 넘어간다 — end=29(=익일 05시)로 두지 않고 5로 두고, slotOf가 wrap을 처리한다.
    { id: "evening", name: "\uC800\uB141", start: 17, end: 5, emoji: "\u{1F319}" }
  ],
  // 타임당 150코인 소프트 캡 × 3타임 = 일 450코인. 액션 시작 시 캡 미만이면 보상 전액 지급(한 번의 보상만큼 넘칠 수 있음).
  slotCap: 150,
  // 공용 고정 보상 — 게임 한 판·타임 보너스·에너지 보상이 같은 금액을 준다(별 15개 = 1.5원).
  // eCPM 2,000원·목표 지급률 50% 역산값(≈17)보다 약간 낮게. 원격 `rewardCoins`로 덮는다.
  rewardCoins: 15,
  rewardKillSwitch: false,
  // 랭키 탭 10회 만충 → 광고 → 에너지 보상(고정). 하루 2회.
  energyTapsToFull: 10,
  energyDailyMax: 2,
  // 알림 동의 100코인 (캡 제외, 광고 없음, 1회성).
  // ⚠️ templateCode는 앱인토스 콘솔에서 알림 템플릿을 만들어야 나온다. 미발급이라 빈 문자열 —
  //    비어 있으면 홈이 알림 카드를 렌더하지 않는다(없는 기능을 광고하지 않기 위함).
  //    "무광고 지급"의 정책 적합성은 채널톡 확인 대기 항목이다(공통요소 v5.1 §10).
  notiConsentReward: 100,
  notiTemplateCode: "",
  // 출석은 **광고 없이** 10코인, 7일 연속 +50코인.
  // 무광고 장치라 하루 광고 한도 계산에 들어가지 않는다.
  attendReward: 10,
  attendStreakBonus: 50,
  // 랭키 복권 — **비활성**. 확률형(잭팟 0.05%)이라 게임 앱 프로모션과 결합 불가.
  // 0이면 홈 타일·복권 화면 진입이 사라진다. 원격으로 켤 수 없게 PARAMS에서도 뺐다.
  // 테이블은 코드 호환용으로만 남긴다(재활성은 정책 확인 후 번들 수정으로).
  lotteryTable: [
    { points: 10, weight: 85, tier: "small" },
    { points: 30, weight: 10, tier: "small" },
    { points: 100, weight: 4.95, tier: "mid" },
    { points: 5e3, weight: 0.05, tier: "jackpot" }
  ],
  lotteryDailyMax: 0,
  // 일 단위 리셋(게임 슬롯·에너지·출석)은 아침 타임 시작에 맞춘다.
  dayBoundaryHour: 5,
  // ── 광고 프리퀀시 (기획자 2·3차 지시, v5 회신 1·2번 "현행 유지") ──
  // 하루 5종 선점 × 난이도 3 × 1판 = 게임 15판. 기회는 상자2 + 타임3 + 게임15 = 20(복권 비활성),
  // 실제 광고 시청은 하루 20회로 묶는다(초과분은 광고 **전에** adLimit으로 차단).
  gamePicksPerDay: 5,
  adsDailyMax: 20,
  dailySlotsPerDifficulty: 1,
  // ── 전환·지갑 (코인 단위) ──
  // 차감률 40% **고정**(포인트경제성 v1.3 §2 "30~50% 랜덤 폐기", 공통요소 v5.1 §2-4 "랜덤 차감 금지").
  hostShareRate: 0.4,
  // 500코인 = 토스 포인트 30원부터
  minConvertPoint: 500,
  // 10,000코인 — 1회 전환 한도(350원 = 약 5,834코인)를 넘는 여유를 둔다.
  maxBalance: 1e4
};
export {
  PORTAL_ENGAGEMENT as BUNDLE_DEFAULTS,
  DAY_KEYS,
  INSTANT_KEYS,
  PARAMS,
  checkValue,
  effectiveAtMs,
  pick,
  resolveValues,
  unknownKeys,
  validateDoc,
  valuesValid
};
