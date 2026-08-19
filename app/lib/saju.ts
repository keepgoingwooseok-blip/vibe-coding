import { Solar } from "lunar-typescript";

export type ElementName = "목" | "화" | "토" | "금" | "수";

export type Profile = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "female" | "male" | "none";
  location: string;
  unknownTime: boolean;
};

export type Pillar = {
  label: string;
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

export type SajuReading = {
  profile: Profile;
  targetDate: string;
  dateLabel: string;
  dayPillars: string;
  pillars: Pillar[];
  dayMaster: { gan: string; element: ElementName; label: string; ratio: number };
  tenGod: string;
  keyword: string;
  summary: string;
  balanceScore: number;
  elementBalance: Array<{ name: ElementName; value: number; color: string }>;
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
};

const ELEMENTS: ElementName[] = ["목", "화", "토", "금", "수"];
const ELEMENT_META: Record<ElementName, { color: string; colorName: string; direction: string; image: string }> = {
  목: { color: "#5f876f", colorName: "솔잎 초록", direction: "동쪽", image: "새순" },
  화: { color: "#c86e57", colorName: "다홍빛", direction: "남쪽", image: "햇살" },
  토: { color: "#b9955f", colorName: "황토빛", direction: "가운데", image: "너른 땅" },
  금: { color: "#8b8d87", colorName: "은백색", direction: "서쪽", image: "맑은 쇠", },
  수: { color: "#547a8c", colorName: "쪽빛", direction: "북쪽", image: "물길" },
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
      body: dailyTenGod.includes("재") ? "오늘 천간에 재성의 결이 드러납니다. 이미 가진 자원과 시간을 구체적인 숫자로 다루면 성과가 또렷해져요." : "큰 수익을 좇기보다 현금 흐름과 반복 지출을 정리하는 쪽에 운의 무게가 실립니다.",
      doThis: "예산 확인 · 미뤄둔 정산 · 가격 비교", avoid: "충동 결제 · 구두 약속만 믿기",
    },
    {
      key: "love", title: "애정운", hanja: "情", score: scores.love, band: band(scores.love),
      headline: rising(scores.love, "진심이 자연스럽게 닿는 날", "익숙한 사이에 온기를 더할 날", "대답보다 마음을 먼저 들을 날"),
      body: relationName === "합" ? "나의 일지와 오늘의 지지가 합을 이룹니다. 관계의 간격을 좁히고 오해를 풀기 좋은 흐름이에요." : relationName === "충" ? "일지에 충이 닿아 감정의 속도가 빨라질 수 있어요. 결론을 서두르지 않으면 솔직함이 오히려 관계를 단단하게 합니다." : "거창한 표현보다 작은 배려가 오래 남습니다. 먼저 안부를 묻고 상대의 리듬을 존중해 보세요.",
      doThis: "짧은 안부 · 눈을 보고 듣기 · 솔직한 칭찬", avoid: "마음 떠보기 · 지난 일 재판하기",
    },
    {
      key: "work", title: "일·학업운", hanja: "業", score: scores.work, band: band(scores.work),
      headline: rising(scores.work, "집중이 결과로 바뀌는 날", "기준을 세우면 일이 가벼워지는 날", "범위를 줄일수록 완성되는 날"),
      body: dailyTenGod.includes("관") || dailyTenGod === "칠살" ? "관성의 압력이 책임감과 실행력으로 번역되는 날입니다. 마감과 규칙이 있는 일부터 처리하세요." : dailyTenGod.includes("인") ? "인성의 흐름이 강해 자료를 읽고 구조화하는 데 유리합니다. 배운 것을 한 장으로 요약해 보세요." : "완벽한 시작보다 한 단계를 끝내는 힘이 중요합니다. 우선순위를 세 개 이하로 줄이면 속도가 붙어요.",
      doThis: "핵심 업무 먼저 · 문서화 · 25분 집중", avoid: "동시다발 착수 · 불필요한 완벽주의",
    },
    {
      key: "health", title: "건강 리듬", hanja: "養", score: scores.health, band: band(scores.health),
      headline: rising(scores.health, "몸과 마음의 호흡이 고른 날", "무리만 덜면 리듬이 유지되는 날", "회복을 일정에 넣어야 하는 날"),
      body: "오행 균형을 생활 리듬의 비유로 읽었습니다. 몸의 신호를 단정하지 말고, 수분·식사·수면처럼 확인 가능한 기본을 챙기는 데 활용하세요.",
      doThis: "따뜻한 식사 · 가벼운 걷기 · 물 자주 마시기", avoid: "무리한 운동 · 증상에 대한 자가진단",
    },
    {
      key: "people", title: "관계운", hanja: "緣", score: scores.people, band: band(scores.people),
      headline: rising(scores.people, "사람 사이에서 답이 오는 날", "역할을 나누면 편안해지는 날", "경계를 부드럽게 세울 날"),
      body: relationName === "합" ? "오늘은 연결과 협의가 힘을 얻습니다. 혼자 끌어안은 일을 나누거나 도움을 구해도 좋아요." : relationName === "충" ? "의견 차이가 선명해질 수 있습니다. 사람을 판단하기보다 쟁점을 한 문장으로 정리하면 충돌이 생산적으로 바뀝니다." : "짧고 명확한 소통이 신뢰를 만듭니다. 기대하는 바를 상대가 추측하게 두지 마세요.",
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
  const birth = parseDate(profile.birthDate);
  const birthTime = profile.unknownTime ? { hour: 12, minute: 0 } : parseTime(profile.birthTime);
  const birthLunar = Solar.fromYmdHms(birth.year, birth.month, birth.day, birthTime.hour, birthTime.minute, 0).getLunar();
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

  const pillarLabels = ["연주", "월주", "일주", "시주"];
  const pillars = birthGz.map((ganZhi, index) => {
    const known = index !== 3 || !profile.unknownTime;
    return {
      label: pillarLabels[index],
      ganZhi: known ? ganZhi : "미상",
      ganElement: known ? GAN_ELEMENT[ganZhi[0]] : dayElement,
      zhiElement: known ? ZHI_ELEMENT[ganZhi[1]] : dayElement,
      relation: index === 2 ? "일간" : known ? tenGod(dayGan, ganZhi[0]) : "—",
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
  const strengthLabel = supportRatio > 0.56 ? "신강 경향" : supportRatio < 0.43 ? "신약 경향" : "중화 경향";

  let favorable: ElementName[];
  if (supportRatio > 0.56) favorable = [generates(dayElement), controls(dayElement)];
  else if (supportRatio < 0.43) favorable = [producerOf(dayElement), dayElement];
  else favorable = [...ELEMENTS].sort((a, b) => counts[a] - counts[b]).slice(0, 2);

  const elementBalance = ELEMENTS.map((name) => ({
    name,
    value: Math.round((counts[name] / total) * 100),
    color: ELEMENT_META[name].color,
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

  const relationText = relationName === "합" ? "관계의 합이 있어 협의와 연결이 부드럽습니다." : relationName === "충" ? "일지에 충이 닿아 변화 욕구가 커질 수 있습니다." : relationName === "형" ? "같은 생각을 반복하기 쉬우니 시선을 바꾸어 보세요." : "큰 충돌보다 꾸준한 조율에 힘이 실립니다.";
  const summary = `${profile.name || "당신"}님의 ${dayGan}${dayElement} 일간에 오늘은 ${dailyTenGod}의 흐름이 닿습니다. ${relationText} ${favorable.join("·")} 기운을 생활 속에 더하면 균형을 잡는 데 도움이 됩니다.`;

  const rankedHours = HOURS.map((hour, index) => ({
    ...hour,
    index,
    score: (favorable.includes(hour.element) ? 8 : 0) + (hasPair(COMBINES, dayBranch, hour.branch) ? 4 : 0) - (hasPair(CLASHES, dayBranch, hour.branch) ? 7 : 0),
  }));
  const goodHours = [...rankedHours].sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 2).map((hour) => hour.label);
  const cautionHours = [...rankedHours].sort((a, b) => a.score - b.score || a.index - b.index).slice(0, 2).map((hour) => hour.label);
  const primaryFavorable = favorable[0];

  return {
    profile,
    targetDate,
    dateLabel: `${target.year}. ${String(target.month).padStart(2, "0")}. ${String(target.day).padStart(2, "0")}`,
    dayPillars: `${todayGz[0]}년 · ${todayGz[1]}월 · ${todayGz[2]}일`,
    pillars,
    dayMaster: { gan: dayGan, element: dayElement, label: strengthLabel, ratio: Math.round(supportRatio * 100) },
    tenGod: dailyTenGod,
    keyword,
    summary,
    balanceScore,
    elementBalance,
    favorable,
    favorableText: `${favorable.map((element) => `${element}(${ELEMENT_META[element].image})`).join(" · ")} · 정리와 ${fit > 0 ? "실행" : "호흡"}`,
    cautionText: `${controllerOf(dayElement)} 기운의 과잉 · 성급한 결론 · 한 번에 큰 결정`,
    relationLabel: relationName === "평" ? "큰 합충 없음" : `일지 ${relationName}`, 
    categories: categoryDetails(scores, dailyTenGod, relationName),
    goodHours,
    cautionHours,
    luckyColor: ELEMENT_META[primaryFavorable].colorName,
    luckyDirection: ELEMENT_META[primaryFavorable].direction,
    confidence: profile.unknownTime ? "시주 미상 · 3주 기준의 간략 해석" : "4주 8자 · 절기 기준 계산",
  };
}
