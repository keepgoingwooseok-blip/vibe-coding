"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { createReading, getBirthDateInfo, getLunarLeapMonth, getLunarMonthDays, getTodayValue, moveDate, type Profile } from "./lib/saju";

const DEFAULT_PROFILE: Profile = {
  name: "온담",
  birthDate: "1992-10-18",
  birthTime: "08:30",
  calendarType: "solar",
  leapMonth: false,
  gender: "female",
  location: "서울",
  unknownTime: false,
};

const sourceBooks = [
  {
    order: "一",
    title: "자평진전",
    original: "子平眞詮",
    author: "청 · 심효첨 원저 / 서락오 평주",
    role: "태어난 계절과 기본 구조",
    term: "명리 기준: 월령·격국",
    note: "태어난 계절을 먼저 살피고, 내 성향과 주변 환경이 어떤 관계를 이루는지 읽는 기준으로 사용합니다.",
    href: "https://ci.nii.ac.jp/ncid/BA59778911",
  },
  {
    order: "二",
    title: "적천수",
    original: "滴天髓",
    author: "전승본 / 임철초 주해 · 서락오 교정본 참조",
    role: "내 힘과 주변 영향의 균형",
    term: "명리 기준: 강약·생극",
    note: "다섯 성향을 단순히 개수로만 판단하지 않고, 계절과 서로 돕거나 누르는 관계를 함께 살핍니다.",
    href: "https://ctext.org/wiki.pl?chapter=530386&if=gb&remap=gb",
  },
  {
    order: "三",
    title: "궁통보감",
    original: "窮通寶鑑",
    author: "청 · 여춘대 편 / 서락오 평주",
    role: "계절에 따라 필요한 보완",
    term: "명리 기준: 조후·한난조습",
    note: "춥고 덥거나 메마르고 습한 계절적 특징을 살펴, 어떤 성향을 보완하면 좋을지 판단합니다.",
    href: "https://ndlsearch.ndl.go.jp/books/R100000136-I1970304959960755998",
  },
  {
    order: "四",
    title: "삼명통회",
    original: "三命通會",
    author: "명 · 만민영",
    role: "오늘 사람·일과 만나는 방식",
    term: "명리 기준: 합·충·형·일진",
    note: "전통 규칙 가운데 잘 맞물림, 부딪힘, 반복되는 긴장과 오늘 날짜의 특징만 보조 신호로 사용합니다.",
    href: "https://ctext.org/wiki.pl?if=gb&remap=gb&res=758991",
  },
];

export default function Home() {
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [targetDate, setTargetDate] = useState(getTodayValue);
  const [notice, setNotice] = useState(false);
  const [formError, setFormError] = useState("");
  const reportRef = useRef<HTMLElement>(null);
  const reading = useMemo(() => createReading(profile, targetDate), [profile, targetDate]);
  const [birthYear, birthMonth, birthDay] = draft.birthDate.split("-").map(Number);
  const leapMonth = getLunarLeapMonth(birthYear);
  const lunarDays = getLunarMonthDays(birthYear, birthMonth, draft.leapMonth);
  const years = useMemo(() => Array.from({ length: new Date().getFullYear() - 1899 }, (_, index) => new Date().getFullYear() - index), []);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setFormError("");
  };

  const updateLunarDate = (part: "year" | "month" | "day", value: number) => {
    const nextYear = part === "year" ? value : birthYear;
    const nextMonth = part === "month" ? value : birthMonth;
    const nextLeap = draft.leapMonth && getLunarLeapMonth(nextYear) === nextMonth;
    const maxDay = getLunarMonthDays(nextYear, nextMonth, nextLeap);
    const nextDay = Math.min(part === "day" ? value : birthDay, maxDay);
    setDraft((current) => ({
      ...current,
      birthDate: `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`,
      leapMonth: nextLeap,
    }));
    setFormError("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    try {
      const birthInfo = getBirthDateInfo(draft);
      if (birthInfo.solarValue > getTodayValue()) {
        setFormError("아직 오지 않은 날짜예요. 출생일을 다시 확인해 주세요.");
        return;
      }
    } catch {
      setFormError("선택한 음력 날짜를 달력에서 찾을 수 없어요. 윤달과 날짜를 다시 확인해 주세요.");
      return;
    }
    setProfile({ ...draft, name: draft.name.trim() || "당신" });
    setNotice(true);
    window.setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    window.setTimeout(() => setNotice(false), 2600);
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="온담 오늘의 사주 홈">
          <span className="brandMark">溫</span>
          <span>온담</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#today">오늘의 흐름</a>
          <a href="#details">운세 자세히</a>
          <a href="#sources">해석 원칙</a>
        </nav>
        <span className="headerNote">전통 명리 · 현대적 안내</span>
      </header>

      <section className="hero" id="top">
        <div className="heroCopy">
          <div className="eyebrow"><span /> CLASSIC WISDOM, TODAY&apos;S LANGUAGE</div>
          <h1>오늘의 나를<br /><em>조금 더 잘 쓰는 법</em></h1>
          <p>태어난 순간의 사주와 오늘의 흐름을 함께 읽어, 힘을 줄 곳과 쉬어갈 곳을 어려운 용어 없이 알려드려요.</p>
          <div className="heroFacts">
            <span><b>4</b>권의 명리 고전</span>
            <span><b>24</b>절기 반영</span>
            <span><b>0</b>개인정보 저장</span>
          </div>
        </div>
        <div className="heroOrbit" aria-hidden="true">
          <div className="orbitCore"><small>오늘의</small><b>今日</b><span>FLOW</span></div>
          <i className="orbitTag tagOne">시작</i><i className="orbitTag tagTwo">표현</i><i className="orbitTag tagThree">균형</i>
        </div>
      </section>

      <section className="trustShelf" aria-labelledby="trust-title">
        <div className="trustIntro">
          <span className="trustBadge">해석 기준 공개</span>
          <h2 id="trust-title">감이 아닌, <em>네 권의 고전</em>에서 시작합니다</h2>
          <p>한 권의 주장만 따르지 않고, 계절·균형·보완·오늘의 관계를 각 분야의 대표 고전으로 교차해 읽어요.</p>
          <a href="#sources">책과 풀이 원칙 자세히 보기 <span>↗</span></a>
        </div>
        <div className="trustBooks">
          {sourceBooks.map((book) => (
            <a href={book.href} target="_blank" rel="noreferrer" key={book.title}>
              <span>{book.order}</span>
              <div><small>{book.original}</small><b>{book.title}</b><em>{book.role}</em></div>
            </a>
          ))}
        </div>
      </section>

      <section className="readingGrid" id="today">
        <form className="profileCard" onSubmit={submit}>
          <div className="cardHeading">
            <span className="step">01</span>
            <div>
              <h2>사주 정보</h2>
              <p>태어난 해·달·날·시간을 전통 달력 기준으로 계산해요.</p>
            </div>
          </div>

          <label htmlFor="name">이름<span className="inputHint">결과에만 표시돼요</span></label>
          <input id="name" value={draft.name} onChange={(event) => update("name", event.target.value)} maxLength={20} required />

          <fieldset className="calendarField">
            <legend>달력 기준</legend>
            <div className="calendarSegment">
              <label className={draft.calendarType === "solar" ? "active" : ""}>
                <input type="radio" name="calendar-type" value="solar" checked={draft.calendarType === "solar"} onChange={() => setDraft((current) => ({ ...current, calendarType: "solar", leapMonth: false }))} />
                <b>양력</b><span>일반 달력 날짜</span>
              </label>
              <label className={draft.calendarType === "lunar" ? "active" : ""}>
                <input type="radio" name="calendar-type" value="lunar" checked={draft.calendarType === "lunar"} onChange={() => setDraft((current) => ({ ...current, calendarType: "lunar", leapMonth: false }))} />
                <b>음력</b><span>전통 달력 날짜</span>
              </label>
            </div>
          </fieldset>

          <div className="twoColumns formRow">
            <div>
              <label htmlFor={draft.calendarType === "solar" ? "birth-date" : "lunar-year"}>생년월일<span className="inputHint">{draft.calendarType === "solar" ? "양력 기준" : "음력 기준"}</span></label>
              {draft.calendarType === "solar" ? (
                <input id="birth-date" type="date" min="1900-01-01" max={getTodayValue()} value={draft.birthDate} onChange={(event) => update("birthDate", event.target.value)} required />
              ) : (
                <div className="lunarDateFields">
                  <select id="lunar-year" aria-label="음력 출생 연도" value={birthYear} onChange={(event) => updateLunarDate("year", Number(event.target.value))}>{years.map((year) => <option value={year} key={year}>{year}년</option>)}</select>
                  <select aria-label="음력 출생 월" value={birthMonth} onChange={(event) => updateLunarDate("month", Number(event.target.value))}>{Array.from({ length: 12 }, (_, index) => index + 1).map((month) => <option value={month} key={month}>{month}월</option>)}</select>
                  <select aria-label="음력 출생 일" value={Math.min(birthDay, lunarDays)} onChange={(event) => updateLunarDate("day", Number(event.target.value))}>{Array.from({ length: lunarDays }, (_, index) => index + 1).map((day) => <option value={day} key={day}>{day}일</option>)}</select>
                </div>
              )}
              {draft.calendarType === "lunar" && leapMonth > 0 && (
                <label className={`leapToggle ${birthMonth !== leapMonth ? "disabled" : ""}`}>
                  <input type="checkbox" checked={draft.leapMonth} disabled={birthMonth !== leapMonth} onChange={(event) => update("leapMonth", event.target.checked)} />
                  {leapMonth}월은 윤달이 있어요 · 윤{leapMonth}월로 입력
                </label>
              )}
            </div>
            <div>
              <label htmlFor="birth-time">태어난 시간</label>
              <input id="birth-time" type="time" value={draft.birthTime} disabled={draft.unknownTime} onChange={(event) => update("birthTime", event.target.value)} required={!draft.unknownTime} />
            </div>
          </div>

          <div className="twoColumns formRow">
            <div>
              <label htmlFor="gender">성별</label>
              <select id="gender" value={draft.gender} onChange={(event) => update("gender", event.target.value as Profile["gender"])}>
                <option value="female">여성</option>
                <option value="male">남성</option>
                <option value="none">선택 안 함</option>
              </select>
            </div>
            <div>
              <label htmlFor="location">출생지</label>
              <select id="location" value={draft.location} onChange={(event) => update("location", event.target.value)}>
                <option>서울</option><option>부산</option><option>대구</option><option>인천</option><option>광주</option><option>대전</option><option>울산</option><option>제주</option><option>기타 국내</option>
              </select>
            </div>
          </div>

          <label className="check" htmlFor="unknown-time">
            <input id="unknown-time" type="checkbox" checked={draft.unknownTime} onChange={(event) => update("unknownTime", event.target.checked)} />
            태어난 시간을 정확히 몰라요
          </label>
          <p className="formHelp">대한민국 표준시(UTC+9)를 사용합니다. 출생 시간이 없으면 시주를 제외해 해석 범위가 줄어듭니다.</p>
          {formError && <p className="formError" role="alert">{formError}</p>}
          <button className="primaryButton" type="submit">오늘의 사주 보기 <span>→</span></button>
          <p className="privacy"><span>●</span> 입력 정보는 브라우저 안에서만 계산하며 서버에 저장하지 않아요.</p>
        </form>

        <article className="resultCard" ref={reportRef}>
          <div className="resultTopline">
            <div className="dateLine"><span>{reading.dateLabel}</span><i />전통 달력으로 {reading.dayPillars}</div>
            <div className="dateNavigator" aria-label="풀이 날짜 선택">
              <button type="button" aria-label="전날" onClick={() => setTargetDate((date) => moveDate(date, -1))}>‹</button>
              <input type="date" aria-label="풀이 날짜" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
              <button type="button" aria-label="다음 날" onClick={() => setTargetDate((date) => moveDate(date, 1))}>›</button>
              <button type="button" className="todayButton" onClick={() => setTargetDate(getTodayValue())}>오늘</button>
            </div>
          </div>

          <div className="birthConversion"><span>{profile.calendarType === "lunar" ? "음력 입력" : "양력 입력"}</span>{reading.birthDateGuide}</div>

          <div className="keyword">
            <span className="seal">今日</span>
            <div>
              <p>{reading.profile.name}님의 오늘 한 줄</p>
              <h2>“{reading.keyword}”</h2>
            </div>
          </div>
          <p className="summary">{reading.summary}</p>
          <div className="plainLanguageNote">
            <b>‘기운’이라는 말, 이렇게 읽어주세요</b>
            <p>이 화면에서는 오늘 나타나기 쉬운 <strong>생각·감정·행동의 경향</strong>을 뜻해요. 좋고 나쁜 운명을 단정하는 말이 아닙니다.</p>
          </div>

          <div className="overviewGrid">
            <div className="balancePanel">
              <div className="sectionTitle"><h3>오늘 나와 잘 맞는 정도</h3><span>{reading.confidence}</span></div>
              <div className="balanceBody">
                <div className="ring" style={{ background: `conic-gradient(#315d4d ${reading.balanceScore * 3.6}deg, #e7e3d9 0deg)` }}>
                  <div><b>{reading.balanceScore}</b><span>오늘과의 조화</span></div>
                </div>
                <div className="miniScores">
                  {reading.categories.map((category) => (
                    <div key={category.key}>
                      <span>{category.title}</span>
                      <div><i style={{ width: `${category.score}%` }} /></div>
                      <b>{category.score}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="fivePanel">
              <div className="sectionTitle"><h3>나를 이루는 다섯 성향</h3><span>명리학에서는 ‘오행’이라고 불러요</span></div>
              <div className="elementBars">
                {reading.elementBalance.map((element) => (
                  <div className="element" key={element.name}>
                    <b>{element.value}%</b>
                    <div><i style={{ height: `${Math.max(element.value * 2.6, 12)}px`, background: element.color }} /></div>
                    <span>{element.plainLabel}<small>{element.name}</small></span>
                  </div>
                ))}
              </div>
              <p className="elementHelp">막대가 길수록 그 성향을 평소 더 자주 쓰는 편이에요. 시작·표현·안정·정리·유연은 오행의 전통적 상징을 생활 언어로 옮긴 이름입니다.</p>
            </div>
          </div>

          <div className="energyNotes">
            <div><span className="dot good" /><p><b>오늘 더 써보면 좋은 태도</b>{reading.favorableText}</p></div>
            <div><span className="dot caution" /><p><b>오늘 지나치기 쉬운 모습</b>{reading.cautionText}</p></div>
          </div>
        </article>
      </section>

      <section className="pillarsSection">
        <div className="sectionIntro">
          <span className="step">02</span>
          <div><p>태어난 순간을 네 부분으로 나누어 보기</p><h2>{reading.profile.name}님의 타고난 기본 모습</h2></div>
        </div>
        <div className="pillarsWrap">
          <div className="pillarsTable">
            {reading.pillars.map((pillar, index) => (
              <div className={`pillar ${index === 2 ? "dayPillar" : ""}`} key={pillar.label}>
                <span>{pillar.label}<small>{pillar.term}</small></span>
                <b>{pillar.known ? pillar.ganZhi[0] : "?"}</b>
                <i>{pillar.known ? pillar.ganElement : "—"}</i>
                <b>{pillar.known ? pillar.ganZhi[1] : "?"}</b>
                <i>{pillar.known ? pillar.zhiElement : "—"}</i>
                <small>{pillar.relation}</small>
              </div>
            ))}
          </div>
          <div className="dayMasterNote">
            <span>나</span>
            <div><p>내가 세상을 대하는 기본 방식</p><h3>{reading.dayMaster.plainMeaning}</h3></div>
            <dl>
              <div><dt>타고난 힘의 균형</dt><dd>{reading.dayMaster.label}</dd></div>
              <div><dt>오늘 두드러지는 주제</dt><dd>{reading.tenGodPlain}</dd></div>
              <div><dt>사람·일과의 흐름</dt><dd>{reading.relationLabel}</dd></div>
            </dl>
          </div>
        </div>
        <p className="calculationNote">달력의 숫자만 쓰지 않고 계절이 실제로 바뀌는 시각까지 반영해 계산했습니다.</p>
        <details className="technicalDetails">
          <summary>전문 명리 용어와 계산 기준 확인하기</summary>
          <p>사주 원국: {reading.pillars.map((pillar) => pillar.ganZhi).join(" · ")} / 일간: {reading.dayMaster.gan}{reading.dayMaster.element} / 세력: {reading.dayMaster.term} {reading.dayMaster.ratio}% / 오늘 십성: {reading.tenGod} / {reading.relationLabel}</p>
          <p>연주와 월주는 입춘·절기 교접 시각을 기준으로 하며, 야자시는 당일 일주로 보는 2파 기준을 적용했습니다.</p>
          <p>다섯 성향의 비율은 천간·지지의 대표 오행에 태어난 달의 계절 가중치를 더한 비교값입니다. 숨은 천간까지 모두 세는 정밀 감정과는 범위가 다릅니다.</p>
        </details>
      </section>

      <section className="detailSection" id="details">
        <div className="detailHeading">
          <div><span>03</span><p>오늘의 운세 자세히</p><h2>좋고 나쁨보다, <em>어떻게 쓸지</em></h2></div>
          <p>점수가 낮은 항목은 나쁜 미래를 뜻하지 않아요. 오늘 조금 더 천천히 살피면 좋은 영역을 표시합니다.</p>
        </div>
        <div className="categoryGrid">
          {reading.categories.map((category) => (
            <article className="categoryCard" key={category.key}>
              <div className="categoryTop">
                <span className="categoryHanja">{category.hanja}</span>
                <div><p>{category.band}</p><b>{category.score}</b><small>/ 100</small></div>
              </div>
              <h3>{category.title}</h3>
              <h4>{category.headline}</h4>
              <p>{category.body}</p>
              <div className="advice"><span>＋</span><p><b>이렇게 써보세요</b>{category.doThis}</p></div>
              <div className="advice quiet"><span>−</span><p><b>조금 덜어내세요</b>{category.avoid}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="dayGuide">
        <div className="guideHeading"><span>一日</span><div><p>오늘의 작은 나침반</p><h2>하루를 쓰는 구체적인 힌트</h2></div></div>
        <div className="guideGrid">
          <div><span>吉時</span><p>집중이 잘 맞는 시간</p><b>{reading.goodHours.join(" · ")}</b></div>
          <div><span>緩時</span><p>속도를 늦출 시간</p><b>{reading.cautionHours.join(" · ")}</b></div>
          <div><span>色</span><p>오늘 보완할 성향을 떠올리는 색</p><b>{reading.luckyColor}</b></div>
          <div><span>方</span><p>잠시 움직이며 분위기를 바꿔볼 방향</p><b>{reading.luckyDirection}</b></div>
        </div>
      </section>

      <section className="sourcesSection" id="sources">
        <div className="sourcesHeading">
          <div><span>04</span><p>해석의 뿌리</p><h2>네 권의 고전, <em>서로 다른 역할</em></h2></div>
          <div className="principle"><b>쉬운 말로 바꾸는 원칙</b><p>먼저 타고난 기본 모습과 계절의 영향을 살피고, 내 힘의 균형과 오늘 생기기 쉬운 변화를 차례로 읽습니다. 전문 용어는 생활 속 뜻으로 풀되, 고전마다 기준이 다른 부분은 확정적인 예언처럼 말하지 않습니다.</p></div>
        </div>
        <div className="bookGrid">
          {sourceBooks.map((book) => (
            <a className="bookCard" href={book.href} target="_blank" rel="noreferrer" key={book.title}>
              <span className="bookOrder">{book.order}</span>
              <p>{book.original}</p>
              <h3>{book.title}</h3>
              <small>{book.author}</small>
              <i>{book.role}</i>
              <span className="bookTerm">{book.term}</span>
              <span className="bookNote">{book.note}</span>
              <b>원문·서지 보기 ↗</b>
            </a>
          ))}
        </div>
        <div className="methodStrip">
          <p><b>풀이 순서</b> 태어난 날짜와 시간 → 타고난 기본 모습 → 다섯 성향의 균형 → 오늘 두드러지는 주제와 변화 → 5개 생활 영역</p>
          <a href="https://github.com/6tail/lunar-typescript" target="_blank" rel="noreferrer">역법 계산 근거 ↗</a>
        </div>
      </section>

      <footer>
        <a className="brand footerBrand" href="#top"><span className="brandMark">溫</span><span>온담</span></a>
        <p>전통 명리학을 오늘의 언어로 차분하게 번역합니다.</p>
        <p className="disclaimer">이 서비스는 전통 문화에 기반한 자기성찰용 콘텐츠이며 과학적 예측이 아닙니다. 의료·법률·재무상의 판단은 반드시 해당 분야 전문가와 상의하세요.</p>
      </footer>

      <div className={`toast ${notice ? "show" : ""}`} role="status" aria-live="polite">새 사주 정보로 오늘의 흐름을 읽었어요.</div>
    </main>
  );
}
