/* =========================================================
   דוח בדיקה תרמית — תבנית
   ---------------------------------------------------------
   כל הנתונים של הדוח נמצאים באובייקט REPORT למטה.
   כדי להפיק דוח חדש: מחליפים את הנתונים, פותחים את הדף
   בדפדפן ושומרים כ-PDF. הדף מייצר לבד את הכרטיסים,
   המפה, הטבלאות וההמלצות.
   ========================================================= */
(function () {
  'use strict';

  const REPORT = {
    client: { name: 'חברת לוגיסטיקה בע״מ (דוגמה)', contact: 'מנהל תפעול, 050-000-0000' },
    site: {
      name: 'גג מרכז לוגיסטי, אזור תעשייה צפוני',
      address: 'רחוב הדוגמה 12, עיר (דוגמה)',
      kwp: 498,
      modules: 912,
      moduleWatt: 546,
      commissioned: '2021',
    },
    report: {
      id: 'SS-2026-0042',
      inspectionDate: '14.09.2026',
      reportDate: '16.09.2026',
      type: 'בדיקה תקופתית שנתית',
      inspector: 'שם המטיס',
      license: 'מטיס מורשה רת״א, רישיון מסחרי מס׳ 000000',
      equipment: 'DJI Matrice 30T, מצלמה תרמית רדיומטרית 640×512',
      standard: 'IEC TS 62446-3, תרמוגרפיה חיצונית של מודולים פוטו-וולטאיים',
    },
    economics: { yieldKwhPerKwp: 1650, tariff: 0.48 },

    /* מבנה המערכת: מהפכים > סטרינגים > פאנלים. סדר הופעה במפה מלמעלה למטה. */
    layout: [
      { inverter: 1, strings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], modulesPerString: 24 },
      { inverter: 2, strings: [11, 12, 13, 14, 15, 16, 17, 18, 19], modulesPerString: 24 },
      { inverter: 3, strings: [20, 21, 22, 23, 24, 25, 26, 27, 28], modulesPerString: 24 },
      { inverter: 4, strings: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38], modulesPerString: 24 },
    ],

    conditions: [
      { name: 'שעת צילום', measured: '11:40 עד 12:35', required: 'סביב הצהריים, שמש גבוהה', ok: true },
      { name: 'קרינה', measured: '842 ואט למ״ר', required: '600 ואט למ״ר ומעלה', ok: true },
      { name: 'טמפרטורת סביבה', measured: '31°', required: 'מתועד', ok: true },
      { name: 'רוח', measured: '2.5 מ׳/ש׳', required: 'עד 4 מ׳/ש׳ מומלץ', ok: true },
      { name: 'עננות', measured: 'שמיים נקיים', required: 'ללא עננות בזמן הצילום', ok: true },
      { name: 'מצב המערכת', measured: 'מחוברת, כל המהפכים מייצרים', required: 'תחת עומס, ללא ניתוקים', ok: true },
      { name: 'גובה טיסה', measured: '22 מטר מעל הגג', required: 'לפי דרישת הרזולוציה', ok: true },
      { name: 'רזולוציית קרקע (GSD)', measured: '2.9 ס״מ לפיקסל', required: '3 ס״מ לפיקסל או טוב יותר', ok: true },
      { name: 'זווית צילום', measured: '25° מהניצב', required: '5° עד 60° מהניצב', ok: true },
      { name: 'פליטות (אמיסיביות)', measured: '0.85 (זכוכית)', required: 'מוגדר לפי חומר', ok: true },
    ],

    /*
      סוגי ממצאים: hotcell | diode | string | junction | shading | soiling | crack
      severity: high | mid | low
      module: מספר פאנל בתוך הסטרינג (1 = הראשון מימין במפה). לסטרינג מנותק: null.
      lossPct: אובדן הספק משוער מכלל המערכת, באחוזים.
    */
    findings: [
      { id: 1, type: 'string', inverter: 2, string: 9, module: null, dt: 6, severity: 'high', lossPct: 2.63, cell: null,
        rec: 'בדיקת נתיך, מחבר ו-DC של הסטרינג במהפך. חיבור מחדש ומדידת זרם.',
        note: 'כל 24 הפאנלים בסטרינג חמים באופן אחיד ב-6° מהסטרינגים הסמוכים, סימן מובהק לסטרינג במעגל פתוח. המהפך לא דיווח על תקלה. הסטרינג לא מייצר כלל.' },
      { id: 2, type: 'hotcell', inverter: 2, string: 7, module: 4, dt: 31, severity: 'high', lossPct: 0.04, cell: [3, 2],
        rec: 'החלפת פאנל. תיעוד לתביעת אחריות מול היצרן.',
        note: 'תא בודד בטמפרטורה של 74° לעומת 43° בפאנלים סמוכים. בזום נראה שינוי צבע בתא. סיכון להתפתחות נזק לזכוכית ולחומר האיטום.' },
      { id: 3, type: 'hotcell', inverter: 2, string: 7, module: 5, dt: 27, severity: 'high', lossPct: 0.04, cell: [1, 4],
        rec: 'החלפת פאנל. לבדוק את שני הפאנלים הסמוכים באותה הזדמנות.',
        note: 'תא חם בפאנל הסמוך לממצא 2. שני פאנלים סמוכים עם אותה תופעה מעלים חשד לפגם ייצור מאותה סדרה.' },
      { id: 4, type: 'diode', inverter: 1, string: 3, module: 12, dt: 24, severity: 'high', lossPct: 0.02, cell: null, third: 1,
        rec: 'החלפת קופסת חיבורים או פאנל, לפי הנחיית היצרן.',
        note: 'שליש מהפאנל חם באופן אחיד. הדיודה המעקפית במצב הולכה קבועה, ושליש מהספק הפאנל אבוד.' },
      { id: 5, type: 'junction', inverter: 1, string: 5, module: 8, dt: 22, severity: 'mid', lossPct: 0.01, cell: null,
        rec: 'בדיקת קופסת החיבורים והמחברים על ידי חשמלאי. סיכון בטיחותי אפשרי.',
        note: 'נקודה חמה במיקום קופסת החיבורים בגב הפאנל. עלול להעיד על מגע רופף או מחבר פגום.' },
      { id: 6, type: 'diode', inverter: 3, string: 15, module: 20, dt: 19, severity: 'mid', lossPct: 0.02, cell: null, third: 2,
        rec: 'החלפה בתחזוקה הקרובה.',
        note: 'דפוס שליש פאנל חם, אופייני לדיודה מעקפית פגומה.' },
      { id: 7, type: 'diode', inverter: 4, string: 36, module: 3, dt: 21, severity: 'mid', lossPct: 0.02, cell: null, third: 0,
        rec: 'החלפה בתחזוקה הקרובה.',
        note: 'דפוס שליש פאנל חם. הפאנל הותקן במסגרת החלפה קודמת לפי דיווח הלקוח.' },
      { id: 8, type: 'crack', inverter: 3, string: 20, module: 6, dt: 16, severity: 'mid', lossPct: 0.03, cell: null,
        rec: 'החלפת פאנל. אין להשאיר פאנל עם זכוכית שבורה במערכת.',
        note: 'סדק בזכוכית נראה בבירור בזום, עם פס חם לאורכו. חדירת לחות תחמיר את התקלה.' },
      { id: 9, type: 'hotcell', inverter: 3, string: 17, module: 2, dt: 14, severity: 'mid', lossPct: 0.02, cell: [5, 1],
        rec: 'מעקב. אם ΔT יעלה בבדיקה הבאה, להחליף.',
        note: 'תא חם בעוצמה בינונית ללא סימן חזותי.' },
      { id: 10, type: 'hotcell', inverter: 1, string: 2, module: 17, dt: 12, severity: 'mid', lossPct: 0.02, cell: [2, 5],
        rec: 'מעקב בבדיקה הבאה.',
        note: 'תא חם בעוצמה בינונית ללא סימן חזותי.' },
      { id: 11, type: 'hotcell', inverter: 4, string: 30, module: 9, dt: 11, severity: 'low', lossPct: 0.01, cell: [4, 3],
        rec: 'מעקב בבדיקה הבאה.',
        note: 'תא מעט חם. ייתכן מיקרו-סדק בשלב מוקדם.' },
      { id: 12, type: 'shading', inverter: 4, string: 33, module: 1, dt: 9, severity: 'low', lossPct: 0.05, cell: null, span: 3,
        rec: 'גיזום או הזזת המכשול. אובדן ההספק גדול יחסית לחומרה התרמית.',
        note: 'שלושת הפאנלים הראשונים בסטרינג מוצללים חלקית בשעות הבוקר על ידי מבנה מיזוג סמוך. בזמן הצילום נראית הצללה חלקית עם תאים חמים בקצה.' },
      { id: 13, type: 'soiling', inverter: 4, string: 35, module: 11, dt: 8, severity: 'low', lossPct: 0.01, cell: null,
        rec: 'ניקוי נקודתי.',
        note: 'לשלשת ציפורים על התא, גורמת לתא חם מקומי.' },
      { id: 14, type: 'soiling', inverter: 2, string: 11, module: 22, dt: 7, severity: 'low', lossPct: 0.01, cell: null,
        rec: 'ניקוי נקודתי. לשקול ניקוי כללי של הגג לפני החורף.',
        note: 'הצטברות אבק בפינת הפאנל, סימן לניקוז לקוי בזווית ההתקנה.' },
    ],

    summary: {
      text: 'נסרקו 912 פאנלים בארבעה מהפכים. נמצאו 14 ממצאים, מהם 4 בחומרה גבוהה. הממצא המשמעותי ביותר הוא סטרינג מנותק במהפך 2 (24 פאנלים) שאינו מייצר כלל ולא דווח על ידי המהפך. בנוסף נמצאו שני תאים חמים חריגים בפאנלים סמוכים באותו סטרינג, שלוש דיודות מעקפיות פגומות וזכוכית סדוקה אחת. מצב המערכת הכללי טוב, ורוב האובדן מרוכז בתקלה אחת שקל לתקן.',
    },
  };

  /* =========================================================
     רינדור. מכאן והלאה אין צורך לערוך כדי להפיק דוח חדש.
     ========================================================= */
  const $ = (s, c = document) => c.querySelector(s);
  const fmt = (n, d = 0) => Number(n).toLocaleString('he-IL', { maximumFractionDigits: d });
  const TYPE_LABEL = {
    hotcell: 'תא חם', diode: 'דיודה מעקפית', string: 'סטרינג מנותק', junction: 'קופסת חיבורים חמה',
    shading: 'הצללה', soiling: 'לכלוך', crack: 'זכוכית סדוקה',
  };
  const SEV_LABEL = { high: 'גבוהה', mid: 'בינונית', low: 'נמוכה' };
  const SEV_ORDER = { high: 0, mid: 1, low: 2 };

  /* ---- fields ---- */
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), REPORT);
  document.querySelectorAll('[data-field]').forEach((el) => {
    const v = get(el.dataset.field);
    el.textContent = typeof v === 'number' ? fmt(v) : (v ?? '');
  });
  document.title = `דוח בדיקה תרמית ${REPORT.report.id} | ${REPORT.site.name}`;

  /* ---- derived numbers ---- */
  const findings = [...REPORT.findings].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || b.dt - a.dt);
  const stringSize = (inv, str) => {
    const block = REPORT.layout.find((b) => b.inverter === inv);
    return block ? block.modulesPerString : 0;
  };
  const affectedModules = findings.reduce((n, f) => {
    if (f.type === 'string') return n + stringSize(f.inverter, f.string);
    return n + (f.span || 1);
  }, 0);
  const totalLossPct = findings.reduce((n, f) => n + f.lossPct, 0);
  const lostKwh = REPORT.site.kwp * REPORT.economics.yieldKwhPerKwp * (totalLossPct / 100);
  const lostMoney = lostKwh * REPORT.economics.tariff;
  const bySev = { high: 0, mid: 0, low: 0 };
  findings.forEach((f) => { bySev[f.severity] += 1; });

  /* ---- KPIs ---- */
  $('#kpis').innerHTML = [
    ['פאנלים נסרקו', fmt(REPORT.site.modules), ''],
    ['ממצאים', fmt(findings.length), `${bySev.high} בחומרה גבוהה`],
    ['פאנלים מושפעים', fmt(affectedModules), `${fmt((affectedModules / REPORT.site.modules) * 100, 1)}% מהמערכת`],
    ['הספק אבוד משוער', `${fmt(totalLossPct, 1)}%`, `כ-${fmt(lostKwh)} קוט״ש בשנה`],
    ['הפסד שנתי משוער', `₪${fmt(lostMoney)}`, `לפי ${REPORT.economics.tariff} ₪ לקוט״ש`],
  ].map(([label, val, sub]) => `<div class="kpi"><span class="kpi__label">${label}</span><span class="kpi__val">${val}</span><span class="kpi__sub">${sub}</span></div>`).join('');

  /* ---- severity bar ---- */
  const total = findings.length || 1;
  $('#severityBar').innerHTML = `
    <div class="sbar">
      <i class="sbar__seg sbar__seg--high" style="width:${(bySev.high / total) * 100}%"></i>
      <i class="sbar__seg sbar__seg--mid" style="width:${(bySev.mid / total) * 100}%"></i>
      <i class="sbar__seg sbar__seg--low" style="width:${(bySev.low / total) * 100}%"></i>
    </div>
    <div class="sbar__legend">
      <span><i class="dot dot--high"></i>גבוהה: ${bySev.high}</span>
      <span><i class="dot dot--mid"></i>בינונית: ${bySev.mid}</span>
      <span><i class="dot dot--low"></i>נמוכה: ${bySev.low}</span>
    </div>`;

  /* ---- top actions ---- */
  $('#topActions').innerHTML = findings.slice(0, 3)
    .map((f) => `<li><b>#${f.id} ${TYPE_LABEL[f.type]}</b>, מהפך ${f.inverter} סטרינג ${f.string}${f.module ? ` פאנל ${f.module}` : ''}. ${f.rec}</li>`).join('');

  /* ---- conditions ---- */
  $('#conditionsTable tbody').innerHTML = REPORT.conditions
    .map((c) => `<tr><td>${c.name}</td><td>${c.measured}</td><td class="muted">${c.required}</td><td>${c.ok ? '<span class="ok">✓</span>' : '<span class="bad">✗</span>'}</td></tr>`).join('');

  /* ---- map ---- */
  (function drawMap() {
    const MW = 13, MH = 8, GX = 2, GY = 3, BLOCK_GAP = 22, LABEL_W = 62;
    const maxModules = Math.max(...REPORT.layout.map((b) => b.modulesPerString));
    const width = LABEL_W + maxModules * (MW + GX) + 16;
    let y = 16;
    const parts = [];
    const byLoc = {};
    findings.forEach((f) => {
      const key = f.type === 'string' ? `s${f.inverter}-${f.string}` : `m${f.inverter}-${f.string}-${f.module}`;
      byLoc[key] = f;
      if (f.span > 1) for (let i = 1; i < f.span; i++) byLoc[`m${f.inverter}-${f.string}-${f.module + i}`] = f;
    });

    REPORT.layout.forEach((block) => {
      parts.push(`<text x="${width - 8}" y="${y}" class="map__inv">מהפך ${block.inverter}</text>`);
      y += 8;
      block.strings.forEach((s) => {
        const strF = byLoc[`s${block.inverter}-${s}`];
        parts.push(`<text x="${width - LABEL_W + 40}" y="${y + MH - 1}" class="map__str">S${s}</text>`);
        if (strF) {
          parts.push(`<rect x="${width - LABEL_W - block.modulesPerString * (MW + GX) - 2}" y="${y - 2}" width="${block.modulesPerString * (MW + GX) + 2}" height="${MH + 4}" rx="2" class="map__stringbox"/>`);
        }
        for (let m = 1; m <= block.modulesPerString; m++) {
          const x = width - LABEL_W - m * (MW + GX);
          const f = byLoc[`m${block.inverter}-${s}-${m}`];
          const cls = strF ? 'map__mod map__mod--string' : f ? `map__mod map__mod--${f.severity}` : 'map__mod';
          parts.push(`<rect x="${x}" y="${y}" width="${MW}" height="${MH}" class="${cls}"/>`);
          if (f && (f.module === m)) {
            parts.push(`<text x="${x + MW / 2}" y="${y + MH - 1.5}" class="map__id">${f.id}</text>`);
          }
        }
        if (strF) parts.push(`<text x="${width - LABEL_W - block.modulesPerString * (MW + GX) + 4}" y="${y + MH - 1.5}" class="map__id map__id--string">${strF.id}</text>`);
        y += MH + GY;
      });
      y += BLOCK_GAP;
    });
    const svg = $('#map');
    svg.setAttribute('viewBox', `0 0 ${width} ${y}`);
    /* מידות מפורשות: בלעדיהן Safari ב-iOS מציג SVG ריק או בגובה 0 */
    svg.setAttribute('width', width);
    svg.setAttribute('height', y);
    svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    svg.innerHTML = parts.join('');
  })();

  /* ---- findings table ---- */
  $('#findingsTable tbody').innerHTML = findings.map((f) => `
    <tr>
      <td><b>${f.id}</b></td>
      <td>${TYPE_LABEL[f.type]}</td>
      <td>${f.inverter}</td>
      <td>S${f.string}</td>
      <td>${f.module ? (f.span > 1 ? `${f.module}–${f.module + f.span - 1}` : f.module) : 'כל הסטרינג'}</td>
      <td dir="ltr">${f.dt}°</td>
      <td><span class="sev sev--${f.severity}">${SEV_LABEL[f.severity]}</span></td>
      <td>${fmt(f.lossPct, 2)}%</td>
      <td class="muted">${f.rec}</td>
    </tr>`).join('');

  /* ---- thermal & visual thumbnails ---- */
  function thermalSvg(f) {
    const cells = (color = '#1B0A3D') => `<g stroke="${color}" stroke-width=".8" opacity=".8"><path d="M0 30h120M0 60h120M20 0v90M40 0v90M60 0v90M80 0v90M100 0v90"/></g>`;
    const defs = `<defs><radialGradient id="h${f.id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF7B0"/><stop offset=".45" stop-color="#F7931E"/><stop offset="1" stop-color="#C1272D" stop-opacity="0"/></radialGradient></defs>`;
    let body = '';
    switch (f.type) {
      case 'hotcell': {
        const [cx, cy] = f.cell || [3, 2];
        const x = cx * 20 - 10, y = cy * 30 - 15;
        body = `<circle cx="${x}" cy="${y}" r="${10 + f.dt / 3}" fill="url(#h${f.id})"/><circle cx="${x}" cy="${y}" r="4" fill="#FFF7B0"/>`;
        break;
      }
      case 'diode': {
        const x = (f.third ?? 0) * 40;
        body = `<rect x="${x}" y="0" width="40" height="90" fill="#C1272D"/><rect x="${x}" y="0" width="40" height="90" fill="#F7931E" opacity=".35"/>`;
        break;
      }
      case 'string':
        body = `<rect x="0" y="0" width="120" height="30" fill="#2A0B57"/><rect x="0" y="30" width="120" height="30" fill="#8E2A7A"/><rect x="0" y="60" width="120" height="30" fill="#2A0B57"/>`;
        break;
      case 'junction':
        body = `<circle cx="60" cy="84" r="14" fill="url(#h${f.id})"/><circle cx="60" cy="86" r="4" fill="#FFF7B0"/>`;
        break;
      case 'shading':
        body = `<rect x="0" y="0" width="30" height="90" fill="#12063A"/><circle cx="34" cy="20" r="9" fill="url(#h${f.id})"/><circle cx="34" cy="50" r="9" fill="url(#h${f.id})"/><circle cx="34" cy="78" r="9" fill="url(#h${f.id})"/>`;
        break;
      case 'soiling':
        body = `<ellipse cx="70" cy="40" rx="9" ry="7" fill="url(#h${f.id})"/><ellipse cx="72" cy="41" rx="4" ry="3" fill="#FDE68A"/>`;
        break;
      case 'crack':
        body = `<path d="M20 10 L45 40 L40 60 L70 85" stroke="#F7931E" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/><path d="M20 10 L45 40 L40 60 L70 85" stroke="#FFF7B0" stroke-width="1.5" fill="none"/>`;
        break;
      default: body = '';
    }
    const base = f.type === 'string' ? '' : `<rect width="120" height="90" fill="#2A0B57"/>`;
    return `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">${defs}${base}${body}${cells()}<text x="4" y="12" class="thumb__tag">IR · ΔT ${f.dt}°</text></svg>`;
  }
  function visualSvg(f) {
    const cells = `<g stroke="#0B1F3A" stroke-width=".8" opacity=".5"><path d="M0 30h120M0 60h120M20 0v90M40 0v90M60 0v90M80 0v90M100 0v90"/></g>`;
    let mark = '';
    if (f.type === 'hotcell' && f.cell) { const [cx, cy] = f.cell; mark = `<rect x="${cx * 20 - 20}" y="${cy * 30 - 30}" width="20" height="30" fill="none" stroke="#F97316" stroke-width="2"/>`; }
    if (f.type === 'diode') mark = `<rect x="${(f.third ?? 0) * 40}" y="0" width="40" height="90" fill="none" stroke="#F97316" stroke-width="2"/>`;
    if (f.type === 'crack') mark = `<path d="M20 10 L45 40 L40 60 L70 85" stroke="#F8FAFC" stroke-width="1.2" fill="none"/>`;
    if (f.type === 'soiling') mark = `<ellipse cx="70" cy="40" rx="8" ry="6" fill="#E7E5E4"/>`;
    if (f.type === 'shading') mark = `<rect x="0" y="0" width="30" height="90" fill="#0B1F3A" opacity=".55"/>`;
    if (f.type === 'junction') mark = `<rect x="48" y="76" width="24" height="12" fill="none" stroke="#F97316" stroke-width="2"/>`;
    if (f.type === 'string') mark = `<rect x="1" y="31" width="118" height="28" fill="none" stroke="#F97316" stroke-width="2" stroke-dasharray="4 3"/>`;
    return `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="90" fill="#1E4D8C"/>${cells}${mark}<text x="4" y="12" class="thumb__tag">RGB · זום</text></svg>`;
  }

  $('#findings').innerHTML = findings.map((f) => `
    <article class="finding">
      <div class="finding__head">
        <span class="finding__id">#${f.id}</span>
        <h3>${TYPE_LABEL[f.type]}</h3>
        <span class="sev sev--${f.severity}">${SEV_LABEL[f.severity]}</span>
      </div>
      <div class="finding__thumbs">
        <figure class="thumb">${thermalSvg(f)}<figcaption>תרמי</figcaption></figure>
        <figure class="thumb">${visualSvg(f)}<figcaption>חזותי</figcaption></figure>
      </div>
      <dl class="finding__meta">
        <div><dt>מיקום</dt><dd>מהפך ${f.inverter}, סטרינג ${f.string}${f.module ? `, פאנל ${f.span > 1 ? `${f.module}–${f.module + f.span - 1}` : f.module}` : ' (כולו)'}</dd></div>
        <div><dt>ΔT</dt><dd dir="ltr">${f.dt}°</dd></div>
        <div><dt>אובדן משוער</dt><dd>${fmt(f.lossPct, 2)}% מהמערכת</dd></div>
      </dl>
      <p class="finding__note">${f.note}</p>
      <p class="finding__rec"><b>המלצה:</b> ${f.rec}</p>
    </article>`).join('');

  /* ---- recommendations ---- */
  const recs = [];
  const seen = new Set();
  findings.forEach((f) => {
    const key = `${f.type}-${f.severity}`;
    if (seen.has(key)) return;
    seen.add(key);
    const ids = findings.filter((x) => `${x.type}-${x.severity}` === key).map((x) => `#${x.id}`).join(', ');
    recs.push({ severity: f.severity, text: `${TYPE_LABEL[f.type]} (${ids}): ${f.rec}` });
  });
  $('#recs').innerHTML = recs.map((r) => `<li class="rec rec--${r.severity}"><span class="sev sev--${r.severity}">${SEV_LABEL[r.severity]}</span><span>${r.text}</span></li>`).join('')
    + `<li class="rec rec--next"><span class="sev sev--ok">הבא</span><span>בדיקה חוזרת בעוד 12 חודשים, או מוקדם יותר לאחר ביצוע התיקונים כדי לאמת אותם.</span></li>`;
})();
