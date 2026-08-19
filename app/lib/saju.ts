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

export type LifeEssaySection = {
  number: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  points: string[];
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
    detailedSections: LifeEssaySection[];
    reportCharacters: number;
    reportBasis: string;
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

const ELEMENT_LIFE_DETAIL: Record<ElementName, { instinct: string; talent: string; relationship: string; growth: string }> = {
  목: {
    instinct: "가능성을 발견하면 먼저 움직이고, 아직 완성되지 않은 일도 시간을 들여 키워내려는 성향이 있습니다. 정해진 답을 반복하기보다 더 나은 방향을 찾을 때 생기가 살아납니다.",
    talent: "처음 길을 만들거나 사람과 일을 성장시키는 역할에서 강점이 드러납니다. 기획, 교육, 육성, 새로운 프로젝트처럼 오늘의 수고가 미래의 변화로 이어지는 일과 잘 맞습니다.",
    relationship: "가까운 사람에게도 함께 나아갈 방향을 제안하는 편입니다. 다만 상대가 아직 준비되지 않았을 때는 좋은 뜻이 재촉이나 간섭으로 들릴 수 있습니다.",
    growth: "시작한 일을 끝까지 다듬는 힘과 다른 사람의 속도를 기다리는 여유가 더해질수록 타고난 성장력이 오래 갑니다.",
  },
  화: {
    instinct: "느낀 것과 생각한 것을 밖으로 표현하며 주변의 온도를 바꾸는 성향이 있습니다. 반응이 빠르고 분위기를 움직이는 힘이 있어, 가만히 있기보다 직접 참여할 때 존재감이 살아납니다.",
    talent: "사람의 관심을 모으고 복잡한 내용을 생생하게 전달하는 일에서 강점이 드러납니다. 발표, 설득, 창작, 서비스처럼 나의 표현이 누군가의 행동을 이끄는 일과 잘 맞습니다.",
    relationship: "마음이 움직이면 표현도 빠른 편이라 관계에 온기를 더합니다. 다만 감정의 온도가 높은 순간에는 결론까지 너무 빨리 내리지 않는 것이 중요합니다.",
    growth: "빛을 오래 유지하려면 쉬는 시간과 감정의 간격이 필요합니다. 즉각적인 반응보다 한 번 정리한 표현을 선택할수록 영향력이 깊어집니다.",
  },
  토: {
    instinct: "흩어진 것을 모아 안정시키고, 쉽게 무너지지 않는 기반을 만들려는 성향이 있습니다. 급격한 변화보다 충분히 확인한 뒤 움직일 때 마음이 편안합니다.",
    talent: "사람과 자원을 연결하고 꾸준히 운영하는 일에서 강점이 드러납니다. 관리, 조정, 돌봄, 장기 프로젝트처럼 신뢰와 지속성이 중요한 역할과 잘 맞습니다.",
    relationship: "한 번 인연을 맺으면 쉽게 놓지 않고 책임을 지려는 편입니다. 다만 모든 짐을 내 몫처럼 품으면 배려가 부담으로 바뀔 수 있습니다.",
    growth: "안정을 지키는 것과 변화를 미루는 것은 다릅니다. 작은 실험을 허용하고 걱정을 구체적인 일정으로 바꿀수록 든든함이 강점이 됩니다.",
  },
  금: {
    instinct: "상황의 핵심을 빠르게 가르고 기준을 세우려는 성향이 있습니다. 무엇이 필요한지, 어디까지가 내 책임인지 선명해질 때 집중력이 높아집니다.",
    talent: "복잡한 것을 정리하고 품질을 높이는 일에서 강점이 드러납니다. 분석, 편집, 설계, 판단처럼 정확한 기준과 완성도가 중요한 역할과 잘 맞습니다.",
    relationship: "말보다 책임과 행동으로 신뢰를 보여주는 편입니다. 다만 정확함을 중시하는 마음이 상대에게는 평가나 차가움으로 느껴질 수 있습니다.",
    growth: "옳고 그름 사이에 사람의 사정이 들어올 자리를 남겨두는 것이 중요합니다. 기준에 유연함이 더해질수록 날카로움이 지혜가 됩니다.",
  },
  수: {
    instinct: "상황을 오래 관찰하고 여러 가능성을 연결하며 움직이는 성향이 있습니다. 겉으로는 조용해 보여도 머릿속에서는 정보와 감정이 끊임없이 흐릅니다.",
    talent: "변화를 읽고 보이지 않는 맥락을 찾아내는 일에서 강점이 드러납니다. 연구, 상담, 전략, 콘텐츠처럼 깊이 생각하고 연결하는 역할과 잘 맞습니다.",
    relationship: "상대의 말 뒤에 있는 분위기까지 살피는 편이라 공감이 섬세합니다. 다만 마음속 생각을 오래 묵히면 상대는 무엇을 원하는지 알기 어렵습니다.",
    growth: "생각이 충분해지는 순간을 기다리기보다 작은 결정을 먼저 행동으로 옮기는 연습이 필요합니다. 흐름에 방향이 생길 때 유연함이 큰 힘이 됩니다.",
  },
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

function careerEssay(value: string) {
  if (value === "비견" || value === "겁재") return {
    title: "내 방식과 협업의 균형에서 커지는 일복",
    body: "사회생활에서는 스스로 판단할 수 있는 여지와 동료와 나란히 실력을 겨룰 환경이 중요합니다. 지나치게 세세한 통제를 받으면 의욕이 떨어질 수 있지만, 목표와 역할이 분명한 팀에서는 주도성과 실행력이 살아납니다. 직업 이름 하나보다 ‘내 몫이 선명하고 성과를 직접 확인할 수 있는 구조’가 잘 맞습니다.",
    advice: "경쟁자를 이겨야 할 사람으로만 보지 말고 내 기준을 다듬게 하는 거울로 활용해 보세요. 혼자 결정할 부분과 도움을 받을 부분을 미리 나누면 사람 때문에 힘이 새는 일을 줄일 수 있습니다.",
  };
  if (value === "식신" || value === "상관") return {
    title: "표현과 결과물이 곧 경력이 되는 사람",
    body: "사회생활에서는 머릿속 생각을 보이는 결과로 바꾸는 능력이 중요합니다. 말, 글, 기획, 기술, 서비스처럼 내가 만든 것이 다른 사람에게 전달될 때 성취감이 커집니다. 규칙만 반복하는 자리보다 개선할 여지가 있고 의견을 낼 수 있는 환경에서 실력이 빠르게 드러나는 편입니다.",
    advice: "좋은 아이디어가 많을수록 마감과 전달 방식을 함께 정해야 합니다. 솔직함을 그대로 쏟기보다 상대가 받아들일 순서로 정리하면 재능이 반발이 아닌 영향력으로 바뀝니다.",
  };
  if (value === "편재" || value === "정재") return {
    title: "현실 감각과 관리 능력이 성과로 이어지는 사람",
    body: "사회생활에서는 시간, 돈, 사람, 물건처럼 한정된 자원을 효율적으로 배치하는 능력이 중요합니다. 추상적인 가능성보다 실제로 무엇이 남는지를 확인할 때 판단이 선명해집니다. 운영, 영업, 관리, 사업처럼 움직이는 상황 속에서 실속을 만들어내는 역할과 인연이 있습니다.",
    advice: "성과가 보일수록 더 많은 일을 떠안기 쉬우니, 수익과 노력의 비율을 정기적으로 확인하세요. 눈앞의 기회를 잡는 능력만큼 장기적으로 지킬 기준을 세우는 것이 중요합니다.",
  };
  if (value === "칠살" || value === "정관") return {
    title: "책임과 신뢰가 쌓일수록 자리가 커지는 사람",
    body: "사회생활에서는 기준, 약속, 역할이 분명할수록 능력이 안정적으로 드러납니다. 처음에는 책임이 부담처럼 느껴져도 경험이 쌓이면 복잡한 상황을 정리하고 사람들에게 방향을 제시하는 힘으로 바뀔 수 있습니다. 조직, 전문직, 관리 역할처럼 신뢰가 누적되는 환경과 잘 맞습니다.",
    advice: "모든 기대를 완벽하게 충족하려 하면 성취보다 압박이 먼저 커질 수 있습니다. 책임의 범위를 문장으로 정하고, 잘하는 것과 반드시 해야 하는 것을 구분하면 오래 가는 권위가 생깁니다.",
  };
  return {
    title: "배움과 해석의 깊이가 경쟁력이 되는 사람",
    body: "사회생활에서는 자료를 읽고 의미를 정리하거나, 다른 사람이 놓친 관점을 발견하는 능력이 중요합니다. 충분히 이해한 뒤 움직이려는 편이라 출발은 느려 보여도 한 번 익힌 분야에서는 깊이가 생깁니다. 연구, 교육, 상담, 기획처럼 지식과 통찰을 축적하는 역할과 잘 맞습니다.",
    advice: "준비가 완벽해질 때까지 기다리면 기회를 늦게 잡을 수 있습니다. 배운 내용을 작은 결과물로 정리하고 주기적으로 밖에 보여주는 습관이 경력의 속도를 높입니다.",
  };
}

function strengthEssay(ratio: number) {
  if (ratio > 0.56) return "내 안에서 스스로 힘을 만들어내는 비율이 높은 편입니다. 주변의 반응이 없어도 결정을 밀고 갈 수 있다는 장점이 있지만, 이미 방향을 정한 뒤에는 다른 의견이 늦게 들어올 수 있습니다. 중요한 선택에서는 ‘내가 원하는가’와 함께 ‘지금 환경도 이를 받쳐주는가’를 확인하는 과정이 필요합니다.";
  if (ratio < 0.43) return "주변 환경과 사람의 영향을 섬세하게 받아들이는 편입니다. 혼자 버티는 방식보다 믿을 만한 사람, 반복 가능한 생활, 충분한 준비가 갖춰졌을 때 잠재력이 안정적으로 나옵니다. 도움을 받는 것을 약함으로 보지 않고 내 힘을 오래 쓰기 위한 기반으로 이해하는 것이 중요합니다.";
  return "내 의지와 주변 자극이 비교적 고르게 맞물리는 편입니다. 상황에 맞춰 앞에 나서거나 한 걸음 물러설 수 있다는 것이 장점입니다. 다만 선택지가 많을 때는 어느 쪽도 틀리지 않아 결정을 미룰 수 있으므로, 내게 가장 중요한 기준을 한 문장으로 정해두는 것이 도움이 됩니다.";
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
  let lifeTransitions: Array<{ age: number; ganZhi: string; headline: string; focus: string }> = [];

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

    lifeTransitions = daYun
      .filter((flow) => flow.getStartAge() >= 10 && flow.getStartAge() <= 89)
      .map((flow) => {
        const theme = lifeTheme(tenGod(dayGan, flow.getGanZhi()[0]));
        return { age: flow.getStartAge(), ganZhi: flow.getGanZhi(), headline: theme.headline, focus: theme.focus };
      });
  }

  const weakestElement = [...ELEMENTS].sort((a, b) => counts[a] - counts[b])[0];
  const monthElement = ZHI_ELEMENT[eight.getMonthZhi()];
  const dayBranchElement = ZHI_ELEMENT[dayBranch];
  const monthRole = tenGod(dayGan, eight.getMonthGan());
  const career = careerEssay(monthRole);
  const wealthElement = controls(dayElement);
  const wealthShare = counts[wealthElement] / total;
  const name = profile.name || "당신";

  let natalCombineCount = 0;
  let natalClashCount = 0;
  let natalPunishCount = 0;
  for (let left = 0; left < natalBranches.length; left += 1) {
    for (let right = left + 1; right < natalBranches.length; right += 1) {
      if (hasPair(COMBINES, natalBranches[left], natalBranches[right])) natalCombineCount += 1;
      if (hasPair(CLASHES, natalBranches[left], natalBranches[right])) natalClashCount += 1;
      if (hasPair(PUNISHES, natalBranches[left], natalBranches[right])) natalPunishCount += 1;
    }
  }

  const seasonText = monthElement === dayElement || monthElement === producerOf(dayElement)
    ? `태어난 계절의 ${ELEMENT_META[monthElement].plainLabel} 성향이 중심의 힘을 받쳐주는 편이라, 익숙한 분야에서는 스스로 속도를 만들기 쉽습니다. 힘이 충분할 때일수록 일을 더 벌이기보다 무엇을 끝낼지 정하는 선택이 중요합니다.`
    : monthElement === generates(dayElement) || monthElement === controls(dayElement)
      ? `태어난 계절은 내 힘을 밖으로 쓰게 만드는 ${ELEMENT_META[monthElement].plainLabel} 성향이 두드러집니다. 가만히 힘을 비축하기보다 실제 역할을 맡고 결과를 만들면서 성장하는 편이지만, 회복할 틈 없이 계속 책임지면 쉽게 지칠 수 있습니다.`
      : `태어난 계절의 ${ELEMENT_META[monthElement].plainLabel} 성향은 내 중심에 일정한 긴장과 기준을 줍니다. 처음에는 환경의 요구가 부담으로 느껴질 수 있으나, 경험이 쌓이면 압박을 구조와 실력으로 바꾸는 힘이 생깁니다.`;

  const moneyPattern = wealthShare >= 0.24
    ? `사주에 돈과 자원을 뜻하는 성향이 비교적 선명합니다. 무엇을 얼마나 쓰고 남길지, 노력에 비해 결과가 적절한지를 현실적으로 살피는 감각이 있는 편입니다. 다만 돈의 흐름이 잘 보이는 사람일수록 가족이나 조직의 몫까지 관리하려 들 수 있으므로, 내 책임의 범위를 정하는 일이 필요합니다.`
    : wealthShare <= 0.1
      ? `사주에서 돈과 자원을 뜻하는 성향이 겉으로 강하게 드러나는 편은 아닙니다. 이것은 재물운이 없다는 뜻이 아니라, 돈 관리가 관심과 습관 없이 저절로 굴러가지는 않는다는 뜻에 가깝습니다. 자동 저축, 예산표, 계약 기록처럼 눈에 보이는 장치를 만들면 다른 재능이 실제 자산으로 남기 쉬워집니다.`
      : `돈과 자원을 다루는 감각은 지나치게 강하거나 약하지 않은 편입니다. 필요할 때 현실적으로 계산할 수 있지만, 삶의 다른 가치가 중요해지면 재정 관리를 뒤로 미룰 수 있습니다. 큰 한 번을 기대하기보다 일정한 수입과 반복 지출을 함께 관리하는 방식이 잘 맞습니다.`;
  const moneyBalance = favorable.includes(wealthElement)
    ? `${ELEMENT_META[wealthElement].plainLabel}하는 힘은 삶의 균형에도 도움이 됩니다. 가격과 숫자를 확인하고 결과를 분명히 하는 습관이 단순한 절약을 넘어 자신감과 선택권을 키워줍니다.`
    : `${ELEMENT_META[wealthElement].plainLabel}하는 힘을 너무 오래 쓰면 타고난 중심이 소모될 수 있습니다. 수익을 위해 무조건 더 많이 움직이기보다, 감당할 수 있는 범위와 쉬는 시간을 먼저 정한 뒤 기회를 선택하는 편이 오래 갑니다.`;

  const relationPattern = natalClashCount > 0
    ? `사주 안에 서로 다른 방향이 부딪히는 모습이 있어, 가까운 관계나 생활 환경에서 한 번씩 큰 조정이 필요할 수 있습니다. 갈등이 생긴다는 예언이 아니라, 익숙한 상태를 그대로 유지하기보다 솔직한 대화를 통해 관계의 방식을 바꿀 때 성장한다는 뜻에 가깝습니다.`
    : natalCombineCount > 0
      ? `사주 안에 서로 다른 성향이 맞물리는 모습이 있어, 좋은 인연이나 협업을 통해 혼자서는 만들기 어려운 결과를 얻는 편입니다. 다만 관계가 잘 이어질수록 상대의 기대까지 내 책임처럼 받아들이지 않도록 경계를 분명히 해야 합니다.`
      : `관계에서 극단적인 밀고 당기기보다 시간을 두고 신뢰를 확인하는 편입니다. 처음부터 모든 마음을 보여주기보다 행동의 일관성을 보며 가까워지므로, 오래된 인연에서 안정감을 느끼기 쉽습니다.`;
  const repeatPattern = natalPunishCount > 0
    ? `또한 같은 생각이나 감정을 안에서 반복하기 쉬운 신호가 있어, 말하지 않고 혼자 정리하려는 시간이 길어질 수 있습니다. 결론이 나지 않을 때는 생각을 더 하는 것보다 상대에게 확인 질문을 건네는 편이 효과적입니다.`
    : `감정이 복잡할 때에도 문제를 지나치게 오래 붙들기보다는 관계의 현실적인 답을 찾으려는 편입니다. 다만 괜찮은 척 넘어가기보다 필요한 말을 짧게라도 남기는 것이 중요합니다.`;

  const makeStageSection = (number: string, kicker: string, title: string, periods: LifePeriod[]): LifeEssaySection => {
    const strongest = [...periods].sort((a, b) => b.score - a.score)[0];
    const gentlest = [...periods].sort((a, b) => a.score - b.score)[0];
    const sequence = periods.map((period) => `${period.decade}에는 ‘${period.headline}’`).join(", 이어 ");
    return {
      number,
      kicker,
      title,
      paragraphs: [
        `${sequence}가 중심 주제로 들어옵니다. 나이가 바뀐다고 성격이 완전히 달라지는 것이 아니라, 같은 사람이 어떤 능력을 앞에 꺼내 쓰게 되는지가 달라진다고 이해하면 정확합니다. 이 시기의 공통 과제는 ${periods.map((period) => period.focus).join("에서 ")}로 이어집니다.`,
        `특히 ${strongest.decade}는 흐름을 비교적 자연스럽게 활용하기 쉬운 구간입니다. 반대로 ${gentlest.decade}는 나쁜 시기가 아니라 속도와 방식을 조정해야 성과가 남는 구간이에요. ${gentlest.care}을 줄이고 ${strongest.focus}을 구체적인 일정으로 옮기면 큰 흐름을 내 편으로 쓰는 데 도움이 됩니다.`,
      ],
      points: periods.map((period) => `${period.decade} · ${period.band} · ${period.focus}`),
    };
  };

  const detailedSections: LifeEssaySection[] = [
    {
      number: "01",
      kicker: "타고난 기질과 내면",
      title: `${ELEMENT_META[dayElement].plainLabel}하는 방식으로 세상을 만납니다`,
      paragraphs: [
        `${name}님의 사주에서 ‘나’를 나타내는 중심은 ${dayGan}${dayElement}입니다. 쉬운 말로 옮기면 ${ELEMENT_META[dayElement].plainText}이 삶을 움직이는 기본 방식이라는 뜻입니다. ${ELEMENT_LIFE_DETAIL[dayElement].instinct} ${ELEMENT_LIFE_DETAIL[dayElement].relationship}`,
        `${strengthEssay(supportRatio)} ${seasonText} ${ELEMENT_LIFE_DETAIL[dayElement].growth}`,
      ],
      points: [`타고난 중심 · ${ELEMENT_META[dayElement].plainText}`, `내 힘의 비율 · ${Math.round(supportRatio * 100)}% · ${strengthLabel}`, `태어난 계절의 주제 · ${ELEMENT_META[monthElement].plainLabel}`],
    },
    {
      number: "02",
      kicker: "재능·직업·사회생활",
      title: career.title,
      paragraphs: [
        `${name}님이 사회와 일을 대하는 자리에 가장 먼저 드러난 주제는 ‘${tenGodShort(monthRole)}’입니다. ${career.body} ${ELEMENT_LIFE_DETAIL[dayElement].talent}`,
        `${career.advice} 직업을 고를 때는 이름이나 겉모습보다, 내가 ${ELEMENT_META[dayElement].plainText}을 실제로 사용할 수 있는지와 ${favorable.map((element) => ELEMENT_META[element].plainText).join("과 ")}을 더할 수 있는지를 확인하는 편이 좋습니다.`,
      ],
      points: [`사회에서 드러나는 주제 · ${tenGodShort(monthRole)}`, `강점이 되는 방식 · ${ELEMENT_META[dayElement].plainLabel} 후 ${ELEMENT_META[favorable[0]].plainLabel}`, `일 선택의 기준 · 자율성보다 지속 가능한 구조 확인`],
    },
    {
      number: "03",
      kicker: "재물과 생활 기반",
      title: "버는 힘보다 남기는 구조가 재물운을 완성합니다",
      paragraphs: [moneyPattern, `${moneyBalance} 재물 흐름을 볼 때는 수입의 크기만 보지 말고, 시간과 체력이 함께 남는지도 확인해야 합니다. 사주가 말하는 재물은 현금만이 아니라 내가 꾸준히 활용할 수 있는 기술, 신뢰, 관계, 생활 기반까지 포함합니다.`],
      points: [`재물을 나타내는 성향 · ${ELEMENT_META[wealthElement].plainLabel}`, `표면에 드러난 비중 · 약 ${Math.round(wealthShare * 100)}%`, `실천 기준 · 수입·지출·시간을 같은 표에서 보기`],
    },
    {
      number: "04",
      kicker: "사랑과 인간관계",
      title: `${ELEMENT_META[dayBranchElement].plainLabel}의 방식으로 가까운 사람을 대합니다`,
      paragraphs: [
        `겉으로 보이는 성향과 별개로, 아주 가까운 관계에서는 ${ELEMENT_META[dayBranchElement].plainText}을 중요하게 여깁니다. ${ELEMENT_LIFE_DETAIL[dayElement].relationship} 마음을 알아주기를 기다리기보다 원하는 것과 어려운 것을 한 문장으로 말할 때 관계의 오해가 크게 줄어듭니다.`,
        `${relationPattern} ${repeatPattern} 관계운의 핵심은 좋은 사람을 기다리는 것보다, 내 속도와 상대의 속도가 다를 때 어떤 방식으로 조율할지를 배우는 데 있습니다.`,
      ],
      points: [`가까운 관계의 필요 · ${ELEMENT_META[dayBranchElement].plainText}`, `맞물림 ${natalCombineCount} · 부딪힘 ${natalClashCount} · 반복 긴장 ${natalPunishCount}`, `관계의 원칙 · 추측보다 확인 질문`],
    },
    {
      number: "05",
      kicker: "몸과 마음의 생활 리듬",
      title: `${ELEMENT_META[dominantElement].plainLabel}은 덜어내고 ${ELEMENT_META[weakestElement].plainLabel}은 생활 속에서 보충하세요`,
      paragraphs: [
        `다섯 성향 가운데 ${ELEMENT_META[dominantElement].plainLabel}의 비중이 가장 높고, ${ELEMENT_META[weakestElement].plainLabel}은 상대적으로 적습니다. 많다고 무조건 좋거나 적다고 나쁜 것은 아닙니다. 익숙한 힘은 피곤할 때도 자동으로 반복되기 때문에, ${ELEMENT_META[dominantElement].excessText} 반대로 ${ELEMENT_META[weakestElement].plainText}을 일정 속에 의도적으로 넣으면 한쪽으로 쏠리는 것을 줄일 수 있습니다.`,
        `건강에 관한 사주 해석은 병이나 체질을 진단하는 도구가 아닙니다. 실제 생활에서는 수면 시간, 식사 간격, 움직인 시간, 기분의 변화를 기록해 확인 가능한 신호를 먼저 보세요. ${profile.unknownTime ? "출생 시간을 모르므로 생활 리듬에 관한 해석은 해·달·날의 범위에서만 참고하는 것이 안전합니다." : "태어난 시간까지 반영했지만, 불편한 증상은 반드시 의료 전문가의 판단을 우선해야 합니다."}`,
      ],
      points: [`가장 익숙한 힘 · ${ELEMENT_META[dominantElement].plainLabel}`, `의식적으로 보충할 힘 · ${ELEMENT_META[weakestElement].plainLabel}`, `생활 기준 · 느낌보다 수면·식사·활동 기록`],
    },
  ];

  if (lifeAvailable) {
    detailedSections.push({
      number: "06",
      kicker: "큰 전환점 읽기",
      title: "대운이 바뀌는 나이는 사건이 아니라 삶의 질문이 달라지는 때입니다",
      paragraphs: [
        `${lifeStartNote} 이후 큰 흐름은 대략 10년 단위로 바뀝니다. ${lifeTransitions.map((transition) => `약 ${transition.age}세에는 ${transition.headline.replace("시기", "흐름")}`).join(", ")}이 차례로 들어옵니다. 이 나이에 반드시 특정 사건이 생긴다는 뜻은 아니며, 이전 방식이 잘 맞지 않아 새로운 역할과 선택 기준을 찾게 될 가능성이 커진다는 의미입니다.`,
        `전환기에는 바로 결론을 내리기보다 앞선 2년의 반복된 문제와 앞으로 2년 동안 키우고 싶은 능력을 함께 적어보세요. 대운의 이름보다 실제 생활에서 반복되는 주제를 확인하는 것이 더 중요합니다. 특히 흐름이 바뀌는 전후에는 직업, 관계, 거주처럼 큰 결정을 한 번에 묶기보다 순서를 나누는 편이 안전합니다.`,
      ],
      points: lifeTransitions.map((transition) => `${transition.age}세 전후 · ${transition.ganZhi} · ${transition.focus}`),
    });
    detailedSections.push(makeStageSection("07", "인생 전반 · 10–20대", "가능성을 시험하고 나만의 기준을 만드는 시간", lifeTimeline.slice(0, 2)));
    detailedSections.push(makeStageSection("08", "인생 중반 · 30–50대", "선택한 일을 현실의 기반과 책임으로 바꾸는 시간", lifeTimeline.slice(2, 5)));
    detailedSections.push(makeStageSection("09", "인생 후반 · 60–80대", "쌓아온 경험을 정리하고 나누며 깊이를 만드는 시간", lifeTimeline.slice(5, 8)));
  }

  detailedSections.push({
    number: lifeAvailable ? "10" : "06",
    kicker: "인생을 내 편으로 쓰는 법",
    title: "운이 좋은 때를 기다리기보다, 나에게 맞는 선택 순서를 만드세요",
    paragraphs: [
      `${name}님의 사주는 ${ELEMENT_META[dayElement].plainLabel}의 힘을 없애라고 말하지 않습니다. 오히려 그 힘을 충분히 쓰되, ${favorable.map((element) => ELEMENT_META[element].plainLabel).join("과 ")}을 함께 두라고 권합니다. 하고 싶은 일이 생기면 먼저 ${ELEMENT_META[dayElement].plainText}을 사용하고, 그다음 ${favorable.map((element) => ELEMENT_META[element].plainText).join("과 ")}으로 현실성을 확인하는 순서가 잘 맞습니다.`,
      `좋은 흐름에서는 기회를 넓히되 감당할 범위를 정하고, 조정이 필요한 흐름에서는 실패라고 단정하기보다 방식과 속도를 바꾸세요. 사주 전체에서 가장 중요한 것은 하나의 강점을 평생 같은 방식으로 반복하는 것이 아니라, 나이가 들수록 그 강점을 더 부드럽고 정확하게 사용하는 것입니다. 이 해석은 정답지가 아니라 중요한 선택 앞에서 내 패턴을 점검하는 지도처럼 활용하는 것이 가장 좋습니다.`,
    ],
    points: [`먼저 쓸 힘 · ${ELEMENT_META[dayElement].plainLabel}`, `함께 더할 힘 · ${favorable.map((element) => ELEMENT_META[element].plainLabel).join(" · ")}`, `마지막 확인 · 이 선택 뒤에도 시간·체력·관계가 남는가`],
  });

  const reportCharacters = detailedSections.reduce((sum, section) => sum + section.title.length + section.paragraphs.join("").length + section.points.join("").length, 0);
  const reportBasis = `사주 원국 ${birthGz.filter((_, index) => index !== 3 || !profile.unknownTime).join(" · ")} · 중심 ${dayGan}${dayElement} · 타고난 힘 ${Math.round(supportRatio * 100)}% · ${lifeAvailable ? `${lifeTimeline.length}개 연령대 대운 반영` : "대운 방향 미확정"}`;

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
      detailedSections,
      reportCharacters,
      reportBasis,
      timeline: lifeTimeline,
      notice: lifeAvailable ? "나이대 점수는 좋고 나쁜 운명의 등급이 아니라, 그 시기의 흐름을 내 편으로 쓰기 쉬운 정도예요." : "전통 대운은 태어난 해의 음양과 성별에 따라 진행 방향이 달라져요. 성별을 선택하고 다시 보기를 누르면 10대부터 80대까지 정확한 방향으로 계산해 드려요.",
    },
  };
}
