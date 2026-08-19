import { Lunar, LunarYear, Solar } from "lunar-typescript";

export type ElementName = "목" | "화" | "토" | "금" | "수";

export type Profile = {
  name: string;
  birthDate: string;
  birthTime: string;
  calendarType: "solar" | "lunar";
  leapMonth: boolean;
  gender: "female" | "male" | "none";
  location: string;
  unknownTime: boolean;
};

export type Pillar = {
  label: string;
  term: string;
  ganZhi: string;
  ganElement: ElementName;
  zhiElement: ElementName;
  relation: string;
  known: boolean;
};

export type CategoryReading = {
  key: string;
  title: string;
  hanja: string;
  score: number;
  band: string;
  headline: string;
  body: string;
  doThis: string;
  avoid: string;
};

export type LifePeriod = {
  decade: string;
  ages: string;
  score: number;
  band: string;
  headline: string;
  body: string;
  focus: string;
  care: string;
  traditional: string[];
};

export type SajuReading = {
  profile: Profile;
  targetDate: string;
  dateLabel: string;
  dayPillars: string;
  pillars: Pillar[];
  dayMaster: { gan: string; element: ElementName; label: string; term: string; plainMeaning: string; ratio: number };
  tenGod: string;
  tenGodPlain: string;
  keyword: string;
  summary: string;
  balanceScore: number;
  elementBalance: Array<{ name: ElementName; value: number; color: string; plainLabel: string; plainText: string }>;
  favorable: ElementName[];
  favorableText: string;
  cautionText: string;
  relationLabel: string;
  categories: CategoryReading[];
  goodHours: string[];
  cautionHours: string[];
  luckyColor: string;
  luckyDirection: string;
  confidence: string;
  birthDateGuide: string;
  life: {
    available: boolean;
    keyword: string;
    summary: string;
    startNote: string;
    directionTerm: string;
    coreCards: Array<{ label: string; title: string; body: string }>;
    timeline: LifePeriod[];
    notice: string;
  };
};

const ELEMENTS: ElementName[] = ["목", "화", "토", "금", "수"];
const ELEMENT_META: Record<ElementName, { color: string; colorName: string; direction: string; plainLabel: string; plainText: string; excessText: string }> = {
  목: { color: "#5f876f", colorName: "솔잎 초록", direction: "동쪽", plainLabel: "시작", plainText: "새 일을 시작하고 계획을 키우는 힘", excessText: "새 일을 계속 벌이거나 내 방식대로 밀고 싶은 마음이 커질 수 있어요." },
  화: { color: "#c86e57", colorName: "다홍빛", direction: "남쪽", plainLabel: "표현", plainText: "생각을 밖으로 표현하고 행동에 옮기는 힘", excessText: "말과 행동이 평소보다 빨라지고 감정이 앞설 수 있어요." },
  토: { color: "#b9955f", colorName: "황토빛", direction: "가운데", plainLabel: "안정", plainText: "흐트러진 일을 안정시키고 꾸준히 이어가는 힘", excessText: "안전을 지키려다 변화를 미루거나 걱정을 오래 품을 수 있어요." },
  금: { color: "#8b8d87", colorName: "은백색", direction: "서쪽", plainLabel: "정리", plainText: "기준을 세우고 필요한 것과 아닌 것을 가르는 힘", excessText: "옳고 그름을 너무 엄격하게 따지거나 자신과 남에게 날카로워질 수 있어요." },
  수: { color: "#547a8c", colorName: "쪽빛", direction: "북쪽", plainLabel: "유연", plainText: "상황을 살피고 생각을 유연하게 바꾸는 힘", excessText: "생각과 감정이 한곳에 오래 머물러 결정을 미루기 쉬워요." },
};

const GAN_ELEMENT: Record<string, ElementName> = {
  甲: "목", 乙: "목", 丙: "화", 丁: "화", 戊: "토", 己: "토", 庚: "금", 辛: "금", 壬: "수", 癸: "수",
};
const ZHI_ELEMENT: Record<string, ElementName> = {
  寅: "목", 卯: "목", 巳: "화", 午: "화", 辰: "토", 戌: "토", 丑: "토", 未: "토", 申: "금", 酉: "금", 亥: "수", 子: "수",
};
const STEM_POLARITY: Record<string, "yang" | "yin"> = {
  甲: "yang", 乙: "yin", 丙: "yang", 丁: "yin", 戊: "yang", 己: "yin", 庚: "yang", 辛: "yin", 壬: "yang", 癸: "yin",
};

const COMBINES = [["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"]];
const CLASHES = [["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]];
const PUNISHES = [["子", "卯"], ["寅", "巳"], ["巳", "申"], ["申", "寅"], ["丑", "戌"], ["戌", "未"], ["未", "丑"], ["辰", "辰"], ["午", "午"], ["酉", "酉"], ["亥", "亥"]];

const HOURS = [
  { branch: "子", label: "자시 23–01", element: "수" as ElementName },
  { branch: "丑", label: "축시 01–03", element: "토" as ElementName },
  { branch: "寅", label: "인시 03–05", element: "목" as ElementName },
  { branch: "卯", label: "묘시 05–07", element: "목" as ElementName },
  { branch: "辰", label: "진시 07–09", element: "토" as ElementName },
  { branch: "巳", label: "사시 09–11", element: "화" as ElementName },
  { branch: "午", label: "오시 11–13", element: "화" as ElementName },
  { branch: "未", label: "미시 13–15", element: "토" as ElementName },
  { branch: "申", label: "신시 15–17", element: "금" as ElementName },
  { branch: "酉", label: "유시 17–19", element: "금" as ElementName },
  { branch: "戌", label: "술시 19–21", element: "토" as ElementName },
  { branch: "亥", label: "해시 21–23", element: "수" as ElementName },
];

function clamp(value: number, min = 36, max = 92) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function parseTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return { hour: Number.isFinite(hour) ? hour : 12, minute: Number.isFinite(minute) ? minute : 0 };
}

export function getLunarLeapMonth(year: number) {
  if (!Number.isFinite(year)) return 0;
  try {
    return LunarYear.fromYear(year).getLeapMonth();
  } catch {
    return 0;
  }
}

export function getLunarMonthDays(year: number, month: number, leapMonth: boolean) {
  if (!Number.isFinite(year) || !Number.isFinite(month)) return 29;
  try {
    const lunarMonth = LunarYear.fromYear(year).getMonth(leapMonth ? -month : month);
    return lunarMonth?.getDayCount() ?? 29;
  } catch {
    return 29;
  }
}

export function getBirthDateInfo(profile: Profile) {
  const birth = parseDate(profile.birthDate);
  const birthTime = profile.unknownTime ? { hour: 12, minute: 0 } : parseTime(profile.birthTime);
  const birthLunar = profile.calendarType === "lunar"
    ? Lunar.fromYmdHms(birth.year, profile.leapMonth ? -birth.month : birth.month, birth.day, birthTime.hour, birthTime.minute, 0)
    : Solar.fromYmdHms(birth.year, birth.month, birth.day, birthTime.hour, birthTime.minute, 0).getLunar();
  const birthSolar = birthLunar.getSolar();
  const lunarMonth = Math.abs(birthLunar.getMonth());
  const lunarLabel = `음력 ${birthLunar.getYear()}년 ${birthLunar.getMonth() < 0 ? "윤" : ""}${lunarMonth}월 ${birthLunar.getDay()}일`;
  const solarLabel = `양력 ${birthSolar.getYear()}년 ${birthSolar.getMonth()}월 ${birthSolar.getDay()}일`;

  return {
    birthLunar,
    solarValue: birthSolar.toYmd(),
    guide: profile.calendarType === "lunar" ? `${lunarLabel} 입력 · ${solarLabel}로 환산` : `${solarLabel} 입력 · ${lunarLabel}로 환산`,
  };
}

function generates(element: ElementName) {
  return ELEMENTS[(ELEMENTS.indexOf(element) + 1) % ELEMENTS.length];
}

function controls(element: ElementName) {
  return ELEMENTS[(ELEMENTS.indexOf(element) + 2) % ELEMENTS.length];
}

function producerOf(element: ElementName) {
  return ELEMENTS[(ELEMENTS.indexOf(element) + 4) % ELEMENTS.length];
}

function controllerOf(element: ElementName) {
  return ELEMENTS[(ELEMENTS.indexOf(element) + 3) % ELEMENTS.length];
}

function hasPair(pairs: string[][], a: string, b: string) {
  return pairs.some(([left, right]) => (left === a && right === b) || (left === b && right === a));
}

function tenGod(dayGan: string, targetGan: string) {
  const dayElement = GAN_ELEMENT[dayGan];
  const targetElement = GAN_ELEMENT[targetGan];
  const samePolarity = STEM_POLARITY[dayGan] === STEM_POLARITY[targetGan];
  if (targetElement === dayElement) return samePolarity ? "비견" : "겁재";
  if (targetElement === generates(dayElement)) return samePolarity ? "식신" : "상관";
  if (targetElement === controls(dayElement)) return samePolarity ? "편재" : "정재";
  if (targetElement === controllerOf(dayElement)) return samePolarity ? "칠살" : "정관";
  return samePolarity ? "편인" : "정인";
}

function tenGodInPlainWords(value: string) {
  const meanings: Record<string, string> = {
    비견: "나와 비슷한 사람들과 힘을 맞추거나 실력을 비교하는 일이 두드러져요",
    겁재: "사람들과 몫을 나누고 경쟁할 일이 두드러져요",
    식신: "차분히 표현하고 눈에 보이는 결과를 만드는 일이 잘 맞아요",
    상관: "솔직하게 말하고 새로운 방식을 시도하려는 마음이 커져요",
    편재: "예상 밖의 기회나 움직이는 돈을 빠르게 살필 일이 생길 수 있어요",
    정재: "계획한 돈과 시간을 꾸준히 관리하는 일이 중요해요",
    칠살: "압박이나 빠른 책임이 생길 수 있어, 우선순위를 분명히 해야 해요",
    정관: "규칙을 지키고 맡은 책임을 완수할수록 신뢰를 얻기 쉬워요",
    편인: "익숙하지 않은 관점에서 답을 찾고 싶은 마음이 커져요",
    정인: "배우고 정리하거나 도움을 받아들이는 일이 잘 맞아요",
  };
  return meanings[value] ?? "평소의 리듬을 유지하며 상황을 차분히 살피는 일이 잘 맞아요";
}

function tenGodShort(value: string) {
  const labels: Record<string, string> = {
    비견: "비슷한 사람", 겁재: "나눔과 경쟁", 식신: "차분한 표현", 상관: "솔직한 표현",
    편재: "뜻밖의 기회", 정재: "꾸준한 관리", 칠살: "빠른 책임", 정관: "규칙과 신뢰",
    편인: "새로운 관점", 정인: "배움과 도움",
  };
  return labels[value] ?? "일상의 흐름";
}

function lifeTheme(value: string) {
  if (value === "비견" || value === "겁재") return {
    headline: "내 자리와 사람 사이의 균형을 배우는 시기",
    body: "혼자 해내는 힘과 함께 움직이는 힘이 동시에 중요해져요. 비교보다 역할을 분명히 할수록 내 색깔이 또렷해집니다.",
    focus: "독립 · 협업 · 내 기준 세우기",
    care: "비교심 · 무리한 경쟁 · 몫 다툼",
  };
  if (value === "식신" || value === "상관") return {
    headline: "배운 것과 생각을 밖으로 보여주는 시기",
    body: "말·기획·창작처럼 내 안의 것을 결과물로 꺼내는 흐름이 커져요. 솔직함에 한 번의 정리를 더하면 실력이 인정받기 쉽습니다.",
    focus: "표현 · 창작 · 결과물 만들기",
    care: "말이 앞서는 선택 · 산만한 확장",
  };
  if (value === "편재" || value === "정재") return {
    headline: "생활의 기반과 실속을 다지는 시기",
    body: "돈·시간·일처럼 현실적인 자원을 관리하는 힘이 커져요. 큰 한 번보다 꾸준히 남기는 습관이 다음 단계의 바탕이 됩니다.",
    focus: "재정 · 생활 기반 · 꾸준한 성과",
    care: "조급한 투자 · 성과만 좇기",
  };
  if (value === "칠살" || value === "정관") return {
    headline: "책임이 커지고 사회적 기준이 선명해지는 시기",
    body: "직업·직책·약속처럼 책임을 보여줄 일이 늘기 쉬워요. 모든 짐을 혼자 들기보다 기준과 순서를 정하면 신뢰가 자산이 됩니다.",
    focus: "직업 · 책임 · 신뢰 쌓기",
    care: "과도한 압박 · 완벽해야 한다는 마음",
  };
  return {
    headline: "배우고 정리하며 다음 방향을 찾는 시기",
    body: "지식·경험·도움이 새로운 길을 여는 흐름이에요. 충분히 생각하되 작은 실행을 함께 두면 배움이 실제 변화로 이어집니다.",
    focus: "배움 · 자격 · 내면 정리",
    care: "생각만 길어지기 · 실행 미루기",
  };
}

function lifeRelationText(value: string) {
  if (value === "합") return "사람이나 기회가 자연스럽게 이어지기 쉬워, 관계를 잘 활용하면 흐름이 넓어져요.";
  if (value === "충") return "환경이나 역할을 바꾸고 싶은 마음이 커질 수 있어요. 변화 자체보다 방향을 먼저 정하는 것이 중요해요.";
  if (value === "형") return "같은 고민을 반복하기 쉬운 때라, 익숙한 방식 밖의 조언을 받아들이면 막힘이 풀려요.";
  return "큰 충돌을 만들기보다 꾸준히 쌓고 조율하는 쪽에서 힘이 생겨요.";
}

function band(score: number) {
  if (score >= 80) return "맑음";
  if (score >= 68) return "상승";
  if (score >= 56) return "안정";
  return "돌봄";
}

function relation(dayBranch: string, todayBranch: string) {
  if (hasPair(COMBINES, dayBranch, todayBranch)) return "합";
  if (hasPair(CLASHES, dayBranch, todayBranch)) return "충";
  if (hasPair(PUNISHES, dayBranch, todayBranch)) return "형";
  return "평";
}

function categoryDetails(scores: Record<string, number>, dailyTenGod: string, relationName: string): CategoryReading[] {
  const rising = (score: number, high: string, steady: string, gentle: string) => score >= 75 ? high : score >= 58 ? steady : gentle;
  return [
    {
      key: "wealth", title: "재물운", hanja: "財", score: scores.wealth, band: band(scores.wealth),
      headline: rising(scores.wealth, "작은 실속이 눈에 보이는 날", "새는 돈을 막으면 남는 날", "결제보다 비교가 먼저인 날"),
      body: dailyTenGod.includes("재") ? "오늘은 돈·시간·물건처럼 내가 가진 것을 구체적으로 관리하는 주제가 두드러져요. 숫자로 확인하면 성과가 더 또렷해집니다." : "큰 수익을 좇기보다 현금 흐름과 반복 지출을 정리하는 쪽에 힘을 쓰기 좋은 날이에요.",
      doThis: "예산 확인 · 미뤄둔 정산 · 가격 비교", avoid: "충동 결제 · 구두 약속만 믿기",
    },
    {
      key: "love", title: "애정운", hanja: "情", score: scores.love, band: band(scores.love),
      headline: rising(scores.love, "진심이 자연스럽게 닿는 날", "익숙한 사이에 온기를 더할 날", "대답보다 마음을 먼저 들을 날"),
      body: relationName === "합" ? "나와 오늘의 흐름이 서로 잘 맞물리는 편이에요. 관계의 간격을 좁히고 오해를 풀기 좋습니다." : relationName === "충" ? "평소보다 감정이 빨리 움직이거나 관계에 변화를 주고 싶을 수 있어요. 결론을 서두르지 않으면 솔직함이 오히려 관계를 단단하게 합니다." : "거창한 표현보다 작은 배려가 오래 남습니다. 먼저 안부를 묻고 상대의 리듬을 존중해 보세요.",
      doThis: "짧은 안부 · 눈을 보고 듣기 · 솔직한 칭찬", avoid: "마음 떠보기 · 지난 일 재판하기",
    },
    {
      key: "work", title: "일·학업운", hanja: "業", score: scores.work, band: band(scores.work),
      headline: rising(scores.work, "집중이 결과로 바뀌는 날", "기준을 세우면 일이 가벼워지는 날", "범위를 줄일수록 완성되는 날"),
      body: dailyTenGod.includes("관") || dailyTenGod === "칠살" ? "책임이나 마감의 압박을 실행력으로 바꾸기 좋은 날입니다. 규칙과 기한이 분명한 일부터 처리하세요." : dailyTenGod.includes("인") ? "자료를 읽고 핵심을 정리하는 데 힘을 쓰기 좋은 날입니다. 배운 것을 한 장으로 요약해 보세요." : "완벽한 시작보다 한 단계를 끝내는 힘이 중요합니다. 우선순위를 세 개 이하로 줄이면 속도가 붙어요.",
      doThis: "핵심 업무 먼저 · 문서화 · 25분 집중", avoid: "동시다발 착수 · 불필요한 완벽주의",
    },
    {
      key: "health", title: "건강 리듬", hanja: "養", score: scores.health, band: band(scores.health),
      headline: rising(scores.health, "몸과 마음의 호흡이 고른 날", "무리만 덜면 리듬이 유지되는 날", "회복을 일정에 넣어야 하는 날"),
      body: "사주에서 보는 다섯 가지 성향의 균형을 생활 리듬에 빗대어 읽었습니다. 몸의 상태를 단정하지 말고, 수분·식사·수면처럼 확인 가능한 기본을 챙기는 데 활용하세요.",
      doThis: "따뜻한 식사 · 가벼운 걷기 · 물 자주 마시기", avoid: "무리한 운동 · 증상에 대한 자가진단",
    },
    {
      key: "people", title: "관계운", hanja: "緣", score: scores.people, band: band(scores.people),
      headline: rising(scores.people, "사람 사이에서 답이 오는 날", "역할을 나누면 편안해지는 날", "경계를 부드럽게 세울 날"),
      body: relationName === "합" ? "오늘은 사람과 일이 자연스럽게 연결되기 쉬워요. 혼자 끌어안은 일을 나누거나 도움을 구해도 좋습니다." : relationName === "충" ? "의견 차이가 평소보다 선명해질 수 있어요. 사람을 판단하기보다 쟁점을 한 문장으로 정리하면 충돌이 생산적으로 바뀝니다." : "짧고 명확한 소통이 신뢰를 만듭니다. 기대하는 바를 상대가 추측하게 두지 마세요.",
      doThis: "역할 확인 · 부탁을 구체적으로 · 답장 정리", avoid: "애매한 기대 · 즉석에서 편 가르기",
    },
  ];
}

export function getTodayValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function moveDate(value: string, amount: number) {
  const { year, month, day } = parseDate(value);
  const date = new Date(year, month - 1, day + amount);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function createReading(profile: Profile, targetDate: string): SajuReading {
  const { birthLunar, guide: birthDateGuide } = getBirthDateInfo(profile);
  const eight = birthLunar.getEightChar();
  eight.setSect(2);

  const target = parseDate(targetDate);
  const targetLunar = Solar.fromYmdHms(target.year, target.month, target.day, 12, 0, 0).getLunar();
  const todayEight = targetLunar.getEightChar();
  todayEight.setSect(2);

  const birthGz = [eight.getYear(), eight.getMonth(), eight.getDay(), eight.getTime()];
  const todayGz = [todayEight.getYear(), todayEight.getMonth(), todayEight.getDay()];
  const dayGan = eight.getDayGan();
  const dayBranch = eight.getDayZhi();
  const dayElement = GAN_ELEMENT[dayGan];
  const todayGan = todayEight.getDayGan();
  const todayBranch = todayEight.getDayZhi();
  const todayGanElement = GAN_ELEMENT[todayGan];
  const todayBranchElement = ZHI_ELEMENT[todayBranch];
  const dailyTenGod = tenGod(dayGan, todayGan);
  const dailyTenGodPlain = tenGodInPlainWords(dailyTenGod);

  const pillarLabels = ["태어난 해", "태어난 달", "태어난 날", "태어난 시각"];
  const pillarTerms = ["연주", "월주", "일주", "시주"];
  const pillars = birthGz.map((ganZhi, index) => {
    const known = index !== 3 || !profile.unknownTime;
    return {
      label: pillarLabels[index],
      term: pillarTerms[index],
      ganZhi: known ? ganZhi : "미상",
      ganElement: known ? GAN_ELEMENT[ganZhi[0]] : dayElement,
      zhiElement: known ? ZHI_ELEMENT[ganZhi[1]] : dayElement,
      relation: index === 2 ? "나의 중심" : known ? tenGodShort(tenGod(dayGan, ganZhi[0])) : "—",
      known,
    };
  });

  const counts: Record<ElementName, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  birthGz.forEach((ganZhi, index) => {
    if (index === 3 && profile.unknownTime) return;
    counts[GAN_ELEMENT[ganZhi[0]]] += 1;
    counts[ZHI_ELEMENT[ganZhi[1]]] += 1;
  });
  counts[ZHI_ELEMENT[eight.getMonthZhi()]] += 0.8;
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const supportRatio = (counts[dayElement] + counts[producerOf(dayElement)]) / total;
  const strengthTerm = supportRatio > 0.56 ? "신강 경향" : supportRatio < 0.43 ? "신약 경향" : "중화 경향";
  const strengthLabel = supportRatio > 0.56
    ? "내 힘이 비교적 충분한 편이에요"
    : supportRatio < 0.43
      ? "회복과 주변의 도움이 먼저 필요한 편이에요"
      : "내 힘과 바깥 자극이 비교적 고르게 맞아요";

  let favorable: ElementName[];
  if (supportRatio > 0.56) favorable = [generates(dayElement), controls(dayElement)];
  else if (supportRatio < 0.43) favorable = [producerOf(dayElement), dayElement];
  else favorable = [...ELEMENTS].sort((a, b) => counts[a] - counts[b]).slice(0, 2);

  const elementBalance = ELEMENTS.map((name) => ({
    name,
    value: Math.round((counts[name] / total) * 100),
    color: ELEMENT_META[name].color,
    plainLabel: ELEMENT_META[name].plainLabel,
    plainText: ELEMENT_META[name].plainText,
  }));

  const natalBranches = birthGz.filter((_, index) => index !== 3 || !profile.unknownTime).map((item) => item[1]);
  const comboCount = natalBranches.filter((branch) => hasPair(COMBINES, branch, todayBranch)).length;
  const clashCount = natalBranches.filter((branch) => hasPair(CLASHES, branch, todayBranch)).length;
  const punishCount = natalBranches.filter((branch) => hasPair(PUNISHES, branch, todayBranch)).length;
  const relationName = relation(dayBranch, todayBranch);
  const fit = Number(favorable.includes(todayGanElement)) + Number(favorable.includes(todayBranchElement));
  const imbalance = Math.abs(supportRatio - 0.5);
  const isWealth = dailyTenGod.includes("재");
  const isWork = dailyTenGod.includes("관") || dailyTenGod === "칠살" || dailyTenGod.includes("인") || dailyTenGod.includes("식");

  const scores = {
    wealth: clamp(58 + fit * 6 + (isWealth ? 13 : 0) + comboCount * 3 - clashCount * 5),
    love: clamp(62 + (relationName === "합" ? 16 : 0) - (relationName === "충" ? 14 : 0) - punishCount * 3 + fit * 3),
    work: clamp(59 + (isWork ? 9 : 2) + fit * 6 - clashCount * 3),
    health: clamp(72 - imbalance * 55 + fit * 3 - clashCount * 4 - punishCount * 2),
    people: clamp(63 + comboCount * 8 - clashCount * 8 - punishCount * 3 + (dailyTenGod === "비견" ? 5 : 0)),
  };
  const scoreValues = Object.values(scores);
  const balanceScore = clamp(scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length, 40, 90);

  const keyword = relationName === "합"
    ? "마음을 열면 사람이 기회가 되는 날"
    : relationName === "충"
      ? "속도를 늦추면 흔들림이 방향이 되는 날"
      : dailyTenGod.includes("재")
        ? "작은 계산이 단단한 결실로 이어지는 날"
        : dailyTenGod.includes("관") || dailyTenGod === "칠살"
          ? "기준을 세울수록 신뢰가 쌓이는 날"
          : dailyTenGod.includes("인")
            ? "배움과 정리가 다음 문을 여는 날"
            : dailyTenGod === "식신" || dailyTenGod === "상관"
              ? "말과 아이디어가 막힌 흐름을 여는 날"
              : "함께 움직일수록 내 리듬이 선명해지는 날";

  const relationText = relationName === "합" ? "사람이나 일이 서로 잘 맞물리기 쉬워 협의가 부드럽습니다." : relationName === "충" ? "평소보다 변화를 주고 싶거나 의견 차이가 커질 수 있습니다." : relationName === "형" ? "같은 생각을 반복하기 쉬우니 잠시 다른 시선으로 바라보세요." : "큰 충돌보다 꾸준한 조율에 힘이 실립니다.";
  const favorableActions = favorable.map((element) => ELEMENT_META[element].plainText).join(", 그리고 ");
  const summary = `${profile.name || "당신"}님은 기본적으로 ‘${ELEMENT_META[dayElement].plainText}’을 중심으로 세상을 대하는 편이에요. 오늘은 ${dailyTenGodPlain} ${relationText} 특히 ${favorableActions}을 의식하면 균형을 잡는 데 도움이 됩니다.`;

  const dominantElement = [...ELEMENTS].sort((a, b) => counts[b] - counts[a])[0];
  const dominantPercent = Math.round((counts[dominantElement] / total) * 100);
  const cautionText = dominantPercent >= 30
    ? `${ELEMENT_META[dominantElement].excessText} 한 번에 큰 결론을 내리기보다 잠시 멈춰 확인해 보세요.`
    : "한 가지 방식만 고집하거나 성급하게 결론 내리지 않도록 한 번 더 확인해 보세요.";

  const rankedHours = HOURS.map((hour, index) => ({
    ...hour,
    index,
    score: (favorable.includes(hour.element) ? 8 : 0) + (hasPair(COMBINES, dayBranch, hour.branch) ? 4 : 0) - (hasPair(CLASHES, dayBranch, hour.branch) ? 7 : 0),
  }));
  const goodHours = [...rankedHours].sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 2).map((hour) => hour.label);
  const cautionHours = [...rankedHours].sort((a, b) => a.score - b.score || a.index - b.index).slice(0, 2).map((hour) => hour.label);
  const primaryFavorable = favorable[0];
  const lifeKeyword = `${ELEMENT_META[dayElement].plainLabel}의 힘을 ${favorable.map((element) => ELEMENT_META[element].plainLabel).join("과 ")}으로 완성하는 삶`;
  const lifeSummary = `${profile.name || "당신"}님은 ${ELEMENT_META[dayElement].plainText}을 삶의 중심축으로 삼는 편이에요. 오래 갈수록 ${favorable.map((element) => ELEMENT_META[element].plainText).join("과 ")}을 의식할 때 타고난 힘이 한쪽으로 치우치지 않고 더 안정적으로 쓰입니다.`;
  const lifeAvailable = profile.gender !== "none";
  let lifeTimeline: LifePeriod[] = [];
  let lifeStartNote = "";
  let lifeDirectionTerm = "";

  if (lifeAvailable) {
    const yun = eight.getYun(profile.gender === "male" ? 1 : 0, 2);
    const daYun = yun.getDaYun(12).filter((flow) => flow.getGanZhi());
    const firstFlow = daYun[0];
    lifeStartNote = `첫 큰 흐름은 약 ${firstFlow.getStartAge()}세에 시작해요${profile.unknownTime ? ". 출생 시간을 몰라 시작 시점은 조금 달라질 수 있어요" : ""}.`;
    lifeDirectionTerm = yun.isForward() ? "시간의 순서대로 흐름을 읽어요 (순행)" : "시간의 반대 순서로 흐름을 읽어요 (역행)";

    lifeTimeline = Array.from({ length: 8 }, (_, index) => {
      const startAge = (index + 1) * 10;
      const endAge = startAge + 9;
      const middleAge = startAge + 5;
      const activeFlow = daYun.find((flow) => flow.getStartAge() <= middleAge && flow.getEndAge() >= middleAge) ?? daYun[daYun.length - 1];
      const ganZhi = activeFlow.getGanZhi();
      const flowTenGod = tenGod(dayGan, ganZhi[0]);
      const flowRelation = relation(dayBranch, ganZhi[1]);
      const flowElements = [GAN_ELEMENT[ganZhi[0]], ZHI_ELEMENT[ganZhi[1]]];
      const fitCount = flowElements.filter((element) => favorable.includes(element)).length;
      const score = clamp(58 + fitCount * 10 + (flowRelation === "합" ? 7 : 0) - (flowRelation === "충" ? 8 : 0) - (flowRelation === "형" ? 4 : 0), 45, 90);
      const theme = lifeTheme(flowTenGod);
      const traditional = daYun
        .filter((flow) => flow.getStartAge() <= endAge && flow.getEndAge() >= startAge)
        .map((flow) => `${Math.max(startAge, flow.getStartAge())}–${Math.min(endAge, flow.getEndAge())}세 · ${flow.getGanZhi()}`);

      return {
        decade: `${index + 1}0대`,
        ages: `${startAge}–${endAge}세`,
        score,
        band: score >= 76 ? "힘을 넓히기" : score >= 65 ? "기반을 키우기" : score >= 55 ? "방향을 다듬기" : "속도를 조절하기",
        headline: theme.headline,
        body: `${theme.body} ${lifeRelationText(flowRelation)}`,
        focus: theme.focus,
        care: theme.care,
        traditional,
      };
    });
  }

  return {
    profile,
    targetDate,
    dateLabel: `${target.year}. ${String(target.month).padStart(2, "0")}. ${String(target.day).padStart(2, "0")}`,
    dayPillars: `${todayGz[0]}년 · ${todayGz[1]}월 · ${todayGz[2]}일`,
    pillars,
    dayMaster: { gan: dayGan, element: dayElement, label: strengthLabel, term: strengthTerm, plainMeaning: ELEMENT_META[dayElement].plainText, ratio: Math.round(supportRatio * 100) },
    tenGod: dailyTenGod,
    tenGodPlain: dailyTenGodPlain,
    keyword,
    summary,
    balanceScore,
    elementBalance,
    favorable,
    favorableText: favorable.map((element) => ELEMENT_META[element].plainText).join(" · "),
    cautionText,
    relationLabel: relationName === "합" ? "사람과 일이 잘 맞물리기 쉬워요 (합)" : relationName === "충" ? "변화나 의견 차이가 커지기 쉬워요 (충)" : relationName === "형" ? "같은 고민을 반복하기 쉬워요 (형)" : "큰 충돌 신호가 두드러지지 않아요",
    categories: categoryDetails(scores, dailyTenGod, relationName),
    goodHours,
    cautionHours,
    luckyColor: ELEMENT_META[primaryFavorable].colorName,
    luckyDirection: ELEMENT_META[primaryFavorable].direction,
    confidence: profile.unknownTime ? "출생 시간을 몰라 해·달·날만으로 간략히 읽었어요" : "태어난 해·달·날·시간을 모두 반영했어요",
    birthDateGuide,
    life: {
      available: lifeAvailable,
      keyword: lifeKeyword,
      summary: lifeSummary,
      startNote: lifeStartNote,
      directionTerm: lifeDirectionTerm,
      coreCards: [
        { label: "평생의 중심", title: `${ELEMENT_META[dayElement].plainLabel}하는 사람`, body: `${ELEMENT_META[dayElement].plainText}이 타고난 중심이에요. 이 힘을 억누르기보다 상황에 맞게 쓰는 것이 중요해요.` },
        { label: "오래 갈수록 더할 힘", title: favorable.map((element) => ELEMENT_META[element].plainLabel).join(" · "), body: favorable.map((element) => ELEMENT_META[element].plainText).join(" 그리고 ") + "을 더할 때 삶의 균형이 좋아져요." },
        { label: "평생의 균형 포인트", title: `${ELEMENT_META[dominantElement].plainLabel}의 과속 줄이기`, body: ELEMENT_META[dominantElement].excessText + " 중요한 결론일수록 잠시 멈춰 확인해 보세요." },
      ],
      timeline: lifeTimeline,
      notice: lifeAvailable ? "나이대 점수는 좋고 나쁜 운명의 등급이 아니라, 그 시기의 흐름을 내 편으로 쓰기 쉬운 정도예요." : "전통 대운은 태어난 해의 음양과 성별에 따라 진행 방향이 달라져요. 성별을 선택하고 다시 보기를 누르면 10대부터 80대까지 정확한 방향으로 계산해 드려요.",
    },
  };
}
