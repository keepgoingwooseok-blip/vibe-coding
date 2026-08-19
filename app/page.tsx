"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { createReading, getTodayValue, moveDate, type Profile } from "./lib/saju";

const DEFAULT_PROFILE: Profile = {
  name: "온담",
  birthDate: "1992-10-18",
  birthTime: "08:30",
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
    role: "월령과 격국",
    note: "사주의 중심축을 월령에서 잡고, 일간과 구조의 관계를 읽는 기준으로 사용합니다.",
    href: "https://ci.nii.ac.jp/ncid/BA59778911",
  },
  {
    order: "二",
    title: "적천수",
    original: "滴天髓",
    author: "전승본 / 임철초 주해 · 서락오 교정본 참조",
    role: "강약과 기의 흐름",
    note: "오행을 개수로만 단정하지 않고 계절, 생극, 흐름을 함께 보는 원칙을 취합니다.",
    href: "https://ctext.org/wiki.pl?chapter=530386&if=gb&remap=gb",
  },
  {
    order: "三",
    title: "궁통보감",
    original: "窮通寶鑑",
    author: "청 · 여춘대 편 / 서락오 평주",
    role: "계절과 조후",
    note: "태어난 달의 한난조습을 살펴 필요한 기운을 보정하는 보조 기준으로 사용합니다.",
    href: "https://ndlsearch.ndl.go.jp/books/R100000136-I1970304959960755998",
  },
  {
    order: "四",
    title: "삼명통회",
    original: "三命通會",
    author: "명 · 만민영",
    role: "합충과 일진",
    note: "방대한 고법 가운데 합·충·형과 일진 관련 항목만 보조 신호로 제한해 적용합니다.",
    href: "https://ctext.org/wiki.pl?if=gb&remap=gb&res=758991",
  },
];

export default function Home() {
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [targetDate, setTargetDate] = useState(getTodayValue);
  const [notice, setNotice] = useState(false);
  const reportRef = useRef<HTMLElement>(null);
  const reading = useMemo(() => createReading(profile, targetDate), [profile, targetDate]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
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
          <div className="eyebrow"><span /> 오늘의 기운을 읽는 작은 의식</div>
          <h1>나의 사주로 읽는<br /><em>오늘의 흐름</em></h1>
          <p>생년월일시와 오늘의 일진을 함께 살펴, 지금 힘을 줄 곳과 가볍게 지나갈 곳을 한눈에 정리해 드려요.</p>
        </div>
        <div className="heroStamp" aria-hidden="true">
          <span>甲 乙 丙 丁 戊</span>
          <span>子 丑 寅 卯 辰</span>
        </div>
      </section>

      <section className="readingGrid" id="today">
        <form className="profileCard" onSubmit={submit}>
          <div className="cardHeading">
            <span className="step">01</span>
            <div>
              <h2>사주 정보</h2>
              <p>절기 기준으로 네 기둥을 세웁니다.</p>
            </div>
          </div>

          <label htmlFor="name">이름<span className="inputHint">결과에만 표시돼요</span></label>
          <input id="name" value={draft.name} onChange={(event) => update("name", event.target.value)} maxLength={20} required />

          <div className="twoColumns formRow">
            <div>
              <label htmlFor="birth-date">생년월일<span className="inputHint">양력</span></label>
              <input id="birth-date" type="date" min="1900-01-01" max={getTodayValue()} value={draft.birthDate} onChange={(event) => update("birthDate", event.target.value)} required />
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
          <button className="primaryButton" type="submit">오늘의 사주 보기 <span>→</span></button>
          <p className="privacy"><span>●</span> 입력 정보는 브라우저 안에서만 계산하며 서버에 저장하지 않아요.</p>
        </form>

        <article className="resultCard" ref={reportRef}>
          <div className="resultTopline">
            <div className="dateLine"><span>{reading.dateLabel}</span><i />{reading.dayPillars}</div>
            <div className="dateNavigator" aria-label="풀이 날짜 선택">
              <button type="button" aria-label="전날" onClick={() => setTargetDate((date) => moveDate(date, -1))}>‹</button>
              <input type="date" aria-label="풀이 날짜" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
              <button type="button" aria-label="다음 날" onClick={() => setTargetDate((date) => moveDate(date, 1))}>›</button>
              <button type="button" className="todayButton" onClick={() => setTargetDate(getTodayValue())}>오늘</button>
            </div>
          </div>

          <div className="keyword">
            <span className="seal">今日</span>
            <div>
              <p>{reading.profile.name}님의 오늘 한 줄</p>
              <h2>“{reading.keyword}”</h2>
            </div>
          </div>
          <p className="summary">{reading.summary}</p>

          <div className="overviewGrid">
            <div className="balancePanel">
              <div className="sectionTitle"><h3>오늘의 기운</h3><span>{reading.confidence}</span></div>
              <div className="balanceBody">
                <div className="ring" style={{ background: `conic-gradient(#315d4d ${reading.balanceScore * 3.6}deg, #e7e3d9 0deg)` }}>
                  <div><b>{reading.balanceScore}</b><span>균형 지수</span></div>
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
              <div className="sectionTitle"><h3>나의 오행 분포</h3><span>{reading.dayMaster.gan} {reading.dayMaster.element} 일간</span></div>
              <div className="elementBars">
                {reading.elementBalance.map((element) => (
                  <div className="element" key={element.name}>
                    <b>{element.value}%</b>
                    <div><i style={{ height: `${Math.max(element.value * 2.6, 12)}px`, background: element.color }} /></div>
                    <span>{element.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="energyNotes">
            <div><span className="dot good" /><p><b>돋우면 좋은 기운</b>{reading.favorableText}</p></div>
            <div><span className="dot caution" /><p><b>한 번 더 살필 것</b>{reading.cautionText}</p></div>
          </div>
        </article>
      </section>

      <section className="pillarsSection">
        <div className="sectionIntro">
          <span className="step">02</span>
          <div><p>나를 읽는 네 기둥</p><h2>{reading.profile.name}님의 사주 원국</h2></div>
        </div>
        <div className="pillarsWrap">
          <div className="pillarsTable">
            {reading.pillars.map((pillar, index) => (
              <div className={`pillar ${index === 2 ? "dayPillar" : ""}`} key={pillar.label}>
                <span>{pillar.label}</span>
                <b>{pillar.known ? pillar.ganZhi[0] : "?"}</b>
                <i>{pillar.known ? pillar.ganElement : "—"}</i>
                <b>{pillar.known ? pillar.ganZhi[1] : "?"}</b>
                <i>{pillar.known ? pillar.zhiElement : "—"}</i>
                <small>{pillar.relation}</small>
              </div>
            ))}
          </div>
          <div className="dayMasterNote">
            <span>日干</span>
            <div><p>나를 나타내는 중심</p><h3>{reading.dayMaster.gan} · {reading.dayMaster.element} 일간</h3></div>
            <dl>
              <div><dt>세력</dt><dd>{reading.dayMaster.label} {reading.dayMaster.ratio}%</dd></div>
              <div><dt>오늘 십성</dt><dd>{reading.tenGod}</dd></div>
              <div><dt>일지 관계</dt><dd>{reading.relationLabel}</dd></div>
            </dl>
          </div>
        </div>
        <p className="calculationNote">연·월주는 입춘과 절기 교접 시각을 기준으로 계산하고, 야자시는 당일 일주로 보는 2파 기준을 적용했습니다.</p>
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
          <div><span>色</span><p>균형을 돕는 색</p><b>{reading.luckyColor}</b></div>
          <div><span>方</span><p>기운을 환기할 방향</p><b>{reading.luckyDirection}</b></div>
        </div>
      </section>

      <section className="sourcesSection" id="sources">
        <div className="sourcesHeading">
          <div><span>04</span><p>해석의 뿌리</p><h2>네 권의 고전, <em>서로 다른 역할</em></h2></div>
          <div className="principle"><b>원칙</b><p>여러 유파의 단문을 무작위로 섞지 않습니다. 원국 → 계절 → 강약 → 오늘의 합충 순서로 읽고, 고전끼리 기준이 다른 부분은 하나의 확정적 예언으로 단정하지 않습니다.</p></div>
        </div>
        <div className="bookGrid">
          {sourceBooks.map((book) => (
            <a className="bookCard" href={book.href} target="_blank" rel="noreferrer" key={book.title}>
              <span className="bookOrder">{book.order}</span>
              <p>{book.original}</p>
              <h3>{book.title}</h3>
              <small>{book.author}</small>
              <i>{book.role}</i>
              <span className="bookNote">{book.note}</span>
              <b>원문·서지 보기 ↗</b>
            </a>
          ))}
        </div>
        <div className="methodStrip">
          <p><b>계산</b> 양력 입력 → 절기 기준 사주팔자 → 일간 강약과 오행 균형 → 오늘의 천간 십성·지지 합충 → 5개 생활 영역</p>
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
