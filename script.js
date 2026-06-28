const MIN_WAGES = {
  2024: 9860,
  2025: 10030,
  2026: 10320,
  2027: 10320, // 추후 확정 시 변경 가능
  2028: 10320,
  2029: 10320,
  2030: 10320,
};

const PUBLIC_HOLIDAYS = {
  2024: [
    "2024-01-01", "2024-02-09", "2024-02-10", "2024-02-11", "2024-02-12",
    "2024-03-01", "2024-04-10", "2024-05-05", "2024-05-06", "2024-05-15",
    "2024-06-06", "2024-08-15", "2024-09-16", "2024-09-17", "2024-09-18",
    "2024-10-03", "2024-10-09", "2024-12-25",
  ],
  2025: [
    "2025-01-01", "2025-01-28", "2025-01-29", "2025-01-30",
    "2025-03-01", "2025-03-03", "2025-05-05", "2025-05-06", "2025-06-06",
    "2025-08-15", "2025-10-03", "2025-10-05", "2025-10-06", "2025-10-07",
    "2025-10-08", "2025-10-09", "2025-12-25",
  ],
  2026: [
    "2026-01-01", "2026-02-16", "2026-02-17", "2026-02-18",
    "2026-03-01", "2026-05-05", "2026-05-24", "2026-06-06",
    "2026-08-15", "2026-09-24", "2026-09-25", "2026-09-26",
    "2026-10-03", "2026-10-09", "2026-12-25",
  ],
  2027: [
    "2027-01-01", "2027-02-06", "2027-02-07", "2027-02-08", "2027-02-09",
    "2027-03-01", "2027-05-05", "2027-05-13", "2027-06-06", "2027-08-15",
    "2027-10-03", "2027-10-09", "2027-12-25"
  ],
  2028: [
    "2028-01-01", "2028-01-26", "2028-01-27", "2028-01-28", "2028-01-29",
    "2028-03-01", "2028-05-02", "2028-05-05", "2028-06-06", "2028-08-15",
    "2028-10-03", "2028-10-05", "2028-10-06", "2028-10-09", "2028-12-25"
  ],
  2029: [
    "2029-01-01", "2029-02-12", "2029-02-13", "2029-02-14", "2029-03-01",
    "2029-05-05", "2029-05-20", "2029-06-06", "2029-08-15", "2029-09-21",
    "2029-09-22", "2029-09-23", "2029-10-03", "2029-10-09", "2029-12-25"
  ],
  2030: [
    "2030-01-01", "2030-02-02", "2030-02-03", "2030-02-04", "2030-03-01",
    "2030-05-05", "2030-05-09", "2030-06-06", "2030-08-15", "2030-10-03",
    "2030-10-07", "2030-10-08", "2030-10-09", "2030-12-25"
  ]
};

const TAX_RATES = {
  insurance: 0.097174,
  income: 0.033,
};

const WEEKLY_HOLIDAY_THRESHOLD = 15;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const EMPLOYEE_INSURANCE_RATES = {
  nationalPension: 0.045,
  healthInsurance: 0.03545,
  longTermCare: 0.01295,
  employmentInsurance: 0.009,
};

function calculateEmployeeInsurance(monthlyWage) {
  const nationalPension = monthlyWage * EMPLOYEE_INSURANCE_RATES.nationalPension;
  const healthInsurance = monthlyWage * EMPLOYEE_INSURANCE_RATES.healthInsurance;
  const longTermCare = healthInsurance * EMPLOYEE_INSURANCE_RATES.longTermCare;
  const employmentInsurance = monthlyWage * EMPLOYEE_INSURANCE_RATES.employmentInsurance;

  return {
    nationalPension: Math.round(nationalPension),
    healthInsurance: Math.round(healthInsurance),
    longTermCare: Math.round(longTermCare),
    employmentInsurance: Math.round(employmentInsurance),
    totalInsurance: Math.round(nationalPension + healthInsurance + longTermCare + employmentInsurance),
  };
}

function calculateEmployeeIncomeTax(monthlyWage, familyCount) {
  let baseTax = monthlyWage * 0.055;
  let familyDeduction = familyCount * 50000;
  let incomeTax = Math.max(0, baseTax - familyDeduction);
  let localTax = Math.round(incomeTax * 0.1);

  return {
    incomeTax: Math.round(incomeTax),
    localTax: localTax,
    totalTax: Math.round(incomeTax) + localTax,
  };
}

function updateEmployeeCalculation() {
  const salaryEl = els.employeeAnnualSalary;
  const familyEl = els.employeeFamilyCount;
  if (!salaryEl || !familyEl) return;

  const annualSalary = parseInt(salaryEl.value, 10) || 0;
  const familyCount = parseInt(familyEl.value, 10) || 0;
  const monthlyGross = Math.round(annualSalary / 12);

  const insurance = calculateEmployeeInsurance(monthlyGross);
  const tax = calculateEmployeeIncomeTax(monthlyGross, familyCount);
  const totalDeduction = insurance.totalInsurance + tax.totalTax;
  const monthlyNet = monthlyGross - totalDeduction;

  if (!els.empMonthlyGross) return;

  els.empMonthlyGross.textContent = monthlyGross.toLocaleString("ko-KR") + "원";
  els.empNationalPension.textContent = insurance.nationalPension.toLocaleString("ko-KR") + "원";
  els.empHealthInsurance.textContent = insurance.healthInsurance.toLocaleString("ko-KR") + "원";
  els.empLongTermCare.textContent = insurance.longTermCare.toLocaleString("ko-KR") + "원";
  els.empEmploymentInsurance.textContent = insurance.employmentInsurance.toLocaleString("ko-KR") + "원";
  els.empIncomeTax.textContent = tax.incomeTax.toLocaleString("ko-KR") + "원";
  els.empLocalTax.textContent = tax.localTax.toLocaleString("ko-KR") + "원";
  els.empTotalDeduction.textContent = totalDeduction.toLocaleString("ko-KR") + "원";
  els.empMonthlyNet.textContent = monthlyNet.toLocaleString("ko-KR") + "원";
}

function initEmployee() {
  if (!els.employeeAnnualSalary || !els.employeeFamilyCount) return;

  els.employeeAnnualSalary.addEventListener("input", updateEmployeeCalculation);
  els.employeeAnnualSalary.addEventListener("change", updateEmployeeCalculation);
  els.employeeFamilyCount.addEventListener("change", updateEmployeeCalculation);
  updateEmployeeCalculation();
}

function createDefaultSettings() {
  return {
    name: "알바 1",
    hourlyWage: 10320,
    autoMinWage: true,
    startTime: "09:00",
    endTime: "18:00",
    breakMinutes: 60,
    autoBreak: true,
    taxMode: "none",
    colors: {
      work: "#4f46e5",
      off: "#e5e7eb",
      night: "#7c3aed",
      overtime: "#ea580c",
      bg: "#f5f6f8",
    },
  };
}

function createJob(name) {
  return {
    id: "job-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    settings: { ...createDefaultSettings(), name: name || "알바" },
    workDays: {},
  };
}

const state = {
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
  selectedDate: null,
  activeJobId: null,
  jobs: [],
};

const els = {
  jobTabs: document.getElementById("jobTabs"),
  addJobBtn: document.getElementById("addJobBtn"),
  jobName: document.getElementById("jobName"),
  hourlyWage: document.getElementById("hourlyWage"),
  autoMinWage: document.getElementById("autoMinWage"),
  minWageLabel: document.getElementById("minWageLabel"),
  startTime: document.getElementById("startTime"),
  endTime: document.getElementById("endTime"),
  breakMinutes: document.getElementById("breakMinutes"),
  autoBreak: document.getElementById("autoBreak"),
  defaultHoursHint: document.getElementById("defaultHoursHint"),
  colorToggle: document.getElementById("colorToggle"),
  colorPanel: document.getElementById("colorPanel"),
  colorWork: document.getElementById("colorWork"),
  colorOff: document.getElementById("colorOff"),
  colorNight: document.getElementById("colorNight"),
  colorOvertime: document.getElementById("colorOvertime"),
  colorBg: document.getElementById("colorBg"),
  prevMonth: document.getElementById("prevMonth"),
  nextMonth: document.getElementById("nextMonth"),
  copyPatternBtn: document.getElementById("copyPatternBtn"),
  resetMonthBtn: document.getElementById("resetMonthBtn"),
  calendarTitle: document.getElementById("calendarTitle"),
  calendarGrid: document.getElementById("calendarGrid"),
  dayDetail: document.getElementById("dayDetail"),
  dayDetailTitle: document.getElementById("dayDetailTitle"),
  dayWorkToggle: document.getElementById("dayWorkToggle"),
  dayStartTime: document.getElementById("dayStartTime"),
  dayEndTime: document.getElementById("dayEndTime"),
  dayBreakMinutes: document.getElementById("dayBreakMinutes"),
  dayCustomHours: document.getElementById("dayCustomHours"),
  dayMemo: document.getElementById("dayMemo"),
  dayCalcHint: document.getElementById("dayCalcHint"),
  statWorkDays: document.getElementById("statWorkDays"),
  statTotalHours: document.getElementById("statTotalHours"),
  statNightHours: document.getElementById("statNightHours"),
  statOvertimeHours: document.getElementById("statOvertimeHours"),
  payBase: document.getElementById("payBase"),
  payNight: document.getElementById("payNight"),
  payOvertime: document.getElementById("payOvertime"),
  payWeeklyHoliday: document.getElementById("payWeeklyHoliday"),
  payHoliday: document.getElementById("payHoliday"),
  payTotal: document.getElementById("payTotal"),
  payNet: document.getElementById("payNet"),
  employeeAnnualSalary: document.getElementById("employeeAnnualSalary"),
  employeeFamilyCount: document.getElementById("employeeFamilyCount"),
  empMonthlyGross: document.getElementById("empMonthlyGross"),
  empNationalPension: document.getElementById("empNationalPension"),
  empHealthInsurance: document.getElementById("empHealthInsurance"),
  empLongTermCare: document.getElementById("empLongTermCare"),
  empEmploymentInsurance: document.getElementById("empEmploymentInsurance"),
  empIncomeTax: document.getElementById("empIncomeTax"),
  empLocalTax: document.getElementById("empLocalTax"),
  empTotalDeduction: document.getElementById("empTotalDeduction"),
  empMonthlyNet: document.getElementById("empMonthlyNet"),
  themeToggle: document.getElementById("themeToggle"),
  feedbackForm: document.getElementById("feedbackForm"),
  feedbackAuthor: document.getElementById("feedbackAuthor"),
  feedbackMessage: document.getElementById("feedbackMessage"),
  feedbackSubmit: document.getElementById("feedbackSubmit"),
  feedbackSuccess: document.getElementById("feedbackSuccess"),
  feedbackError: document.getElementById("feedbackError"),
};

function getActiveJob() {
  if (!state.jobs || state.jobs.length === 0) {
    const defaultJob = createJob("알바 1");
    state.jobs = [defaultJob];
    state.activeJobId = defaultJob.id;
  }
  return state.jobs.find((j) => j.id === state.activeJobId) || state.jobs[0];
}

function getSettings() {
  return getActiveJob().settings;
}

function getWorkDays() {
  return getActiveJob().workDays;
}

function formatCurrency(amount) {
  return Math.round(amount).toLocaleString("ko-KR") + "원";
}

function formatHours(hours) {
  if (hours === 0) return "0시간";
  return hours % 1 === 0 ? hours + "시간" : hours.toFixed(1) + "시간";
}

function formatHoursShort(hours) {
  if (hours === 0) return "";
  return hours % 1 === 0 ? hours + "h" : hours.toFixed(1) + "h";
}

function normalizeTime(str) {
  if (!str && str !== 0) return null;
  const trimmed = String(str).trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h > 23 || m > 59) return null;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

function getTimeInputValue(el) {
  return normalizeTime(el.value) || normalizeTime(el.defaultValue) || "09:00";
}

function setTimeInputValue(el, time) {
  el.value = normalizeTime(time) || "09:00";
}

function bindTimeInput(el) {
  el.addEventListener("blur", () => {
    const norm = normalizeTime(el.value);
    if (norm) el.value = norm;
  });
}
function formatTimeShort(time) {
  const norm = normalizeTime(time);
  if (!norm) return "";
  const [h, m] = norm.split(":");
  return m === "00" ? String(parseInt(h, 10)) : h + ":" + m;
}

function formatTimeRange(start, end) {
  return formatTimeShort(start) + "~" + formatTimeShort(end);
}

function dateKey(y, m, d) {
  return y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
}

function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

function timeToMinutes(time) {
  const norm = normalizeTime(time);
  if (!norm) return 0;
  const [h, m] = norm.split(":").map(Number);
  return h * 60 + m;
}

function calcGrossMinutes(start, end) {
  let s = timeToMinutes(start);
  let e = timeToMinutes(end);
  if (e <= s) e += 24 * 60;
  return e - s;
}

function calcAutoBreakMinutes(grossMinutes) {
  if (grossMinutes >= 8 * 60) return 60;
  if (grossMinutes >= 4 * 60) return 30;
  return 0;
}

function calcNightMinutes(start, end, breakMin) {
  let s = timeToMinutes(start);
  let e = timeToMinutes(end);
  if (e <= s) e += 24 * 60;

  const gross = e - s;
  if (gross <= 0) return 0;

  let night = 0;
  for (let t = s; t < e; t++) {
    const mod = t % (24 * 60);
    if (mod >= 22 * 60 || mod < 6 * 60) night++;
  }

  if (breakMin > 0 && gross > 0) {
    night = Math.max(0, night - Math.round(breakMin * (night / gross)));
  }
  return night;
}

function getMinWage(year) {
  if (MIN_WAGES[year]) return MIN_WAGES[year];
  const years = Object.keys(MIN_WAGES).map(Number).sort((a, b) => b - a);
  for (const y of years) {
    if (year >= y) return MIN_WAGES[y];
  }
  return MIN_WAGES[years[years.length - 1]];
}

function isPublicHoliday(key) {
  const { year } = parseDateKey(key);
  const list = PUBLIC_HOLIDAYS[year] || [];
  return list.includes(key);
}

function getDefaultBreak() {
  const settings = getSettings();
  if (settings.autoBreak) {
    const gross = calcGrossMinutes(settings.startTime, settings.endTime);
    return calcAutoBreakMinutes(gross);
  }
  return parseInt(settings.breakMinutes, 10) || 0;
}

function getDayRecord(key) {
  return getWorkDays()[key] || null;
}

function createDefaultDayRecord() {
  const settings = getSettings();
  const breakMin = getDefaultBreak();
  return {
    work: true,
    startTime: settings.startTime,
    endTime: settings.endTime,
    breakMinutes: breakMin,
    customHours: null,
    memo: "",
    useAutoBreak: settings.autoBreak,
  };
}

function calcDayHours(record) {
  const settings = getSettings();
  if (!record || !record.work) {
    return { hours: 0, nightHours: 0, overtimeHours: 0, breakMin: 0 };
  }

  let breakMin = record.breakMinutes;
  if (record.useAutoBreak !== false && settings.autoBreak) {
    const gross = calcGrossMinutes(record.startTime, record.endTime);
    breakMin = calcAutoBreakMinutes(gross);
  }

  if (record.customHours != null && record.customHours !== "") {
    const hours = Math.max(0, parseFloat(record.customHours) || 0);
    const gross = calcGrossMinutes(record.startTime, record.endTime);
    const nightRatio = calcNightMinutes(record.startTime, record.endTime, breakMin) /
      Math.max(1, gross - breakMin);
    const nightHours = Math.min(hours, hours * nightRatio);
    const overtimeHours = Math.max(0, hours - 8);
    return { hours, nightHours, overtimeHours, breakMin };
  }

  const gross = calcGrossMinutes(record.startTime, record.endTime);
  const workMin = Math.max(0, gross - breakMin);
  const hours = workMin / 60;
  const nightHours = calcNightMinutes(record.startTime, record.endTime, breakMin) / 60;
  const overtimeHours = Math.max(0, hours - 8);

  return { hours, nightHours, overtimeHours, breakMin };
}

function calcDayPay(record, key, hourlyWage) {
  if (!record || !record.work) {
    return { base: 0, night: 0, overtime: 0, holiday: 0, total: 0, hours: 0, nightHours: 0, overtimeHours: 0 };
  }

  const { hours, nightHours, overtimeHours } = calcDayHours(record);
  const isHoliday = isPublicHoliday(key);

  const base = hourlyWage * hours;
  const night = hourlyWage * 0.5 * nightHours;
  const overtime = hourlyWage * 0.5 * overtimeHours;
  const holiday = isHoliday ? hourlyWage * 0.5 * hours : 0;

  return {
    base,
    night,
    overtime,
    holiday,
    total: base + night + overtime + holiday,
    hours,
    nightHours,
    overtimeHours,
  };
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function calcWeeklyHolidayPay(year, month, hourlyWage, workDays) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let weekStart = getWeekStart(firstDay);
  let totalWeeklyHoliday = 0;

  while (weekStart <= lastDay) {
    let weekHours = 0;
    let weekPay = 0;
    let workDayCount = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
      const record = workDays[key];
      if (record && record.work) {
        const pay = calcDayPay(record, key, hourlyWage);
        weekHours += pay.hours;
        weekPay += pay.base + pay.night + pay.overtime + pay.holiday;
        workDayCount++;
      }
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const touchesMonth =
      (weekStart.getMonth() === month && weekStart.getFullYear() === year) ||
      (weekEnd.getMonth() === month && weekEnd.getFullYear() === year);

    if (touchesMonth && weekHours >= WEEKLY_HOLIDAY_THRESHOLD && workDayCount > 0) {
      totalWeeklyHoliday += weekPay / workDayCount;
    }

    weekStart.setDate(weekStart.getDate() + 7);
  }

  return totalWeeklyHoliday;
}

function calcNetPay(gross, taxMode) {
  if (taxMode === "insurance") return gross * (1 - TAX_RATES.insurance);
  if (taxMode === "income") return gross * (1 - TAX_RATES.income);
  return gross;
}

function calcMonthStatsForJob(job) {
  const { viewYear, viewMonth } = state;
  const settings = job.settings;
  const workDays = job.workDays;
  const hourlyWage = parseFloat(settings.hourlyWage) || 0;
  const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

  let workDayCount = 0;
  let totalHours = 0;
  let nightHours = 0;
  let overtimeHours = 0;
  let base = 0;
  let night = 0;
  let overtime = 0;
  let holiday = 0;

  for (let d = 1; d <= lastDay; d++) {
    const key = dateKey(viewYear, viewMonth, d);
    const record = workDays[key];
    if (!record || !record.work) continue;

    const pay = calcDayPay(record, key, hourlyWage);
    workDayCount++;
    totalHours += pay.hours;
    nightHours += pay.nightHours;
    overtimeHours += pay.overtimeHours;
    base += pay.base;
    night += pay.night;
    overtime += pay.overtime;
    holiday += pay.holiday;
  }

  const weeklyHoliday = calcWeeklyHolidayPay(viewYear, viewMonth, hourlyWage, workDays);
  const total = base + night + overtime + holiday + weeklyHoliday;
  const net = calcNetPay(total, settings.taxMode);

  return {
    workDays: workDayCount,
    totalHours,
    nightHours,
    overtimeHours,
    base,
    night,
    overtime,
    weeklyHoliday,
    holiday,
    total,
    net,
  };
}

function calcMonthStats() {
  return calcMonthStatsForJob(getActiveJob());
}

function getCellType(record, key) {
  if (!record || !record.work) return "off";
  const { nightHours, overtimeHours } = calcDayHours(record);
  if (overtimeHours > 0) return "overtime";
  if (nightHours > 0) return "night";
  return "work";
}

function applyColors() {
  const c = getSettings().colors;
  document.documentElement.style.setProperty("--color-work", c.work);
  document.documentElement.style.setProperty("--color-night", c.night);
  document.documentElement.style.setProperty("--color-overtime", c.overtime);
  if (getTheme() === "light") {
    document.documentElement.style.setProperty("--color-off", c.off);
    document.documentElement.style.setProperty("--bg", c.bg);
  } else {
    document.documentElement.style.removeProperty("--color-off");
    document.documentElement.style.removeProperty("--bg");
  }
}

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  applyColors();
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(saved || preferred);

  els.themeToggle.addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xykqjyne";

function hideFeedbackStatus() {
  if (els.feedbackSuccess) els.feedbackSuccess.hidden = true;
  if (els.feedbackError) els.feedbackError.hidden = true;
}

function showFeedbackError(message) {
  if (els.feedbackSuccess) els.feedbackSuccess.hidden = true;
  if (els.feedbackError) {
    els.feedbackError.textContent = message;
    els.feedbackError.hidden = false;
  } else {
    alert(message);
  }
}

function showFeedbackSuccess() {
  if (els.feedbackError) els.feedbackError.hidden = true;
  if (els.feedbackSuccess) {
    els.feedbackSuccess.hidden = false;
  } else {
    alert("피드백이 전송되었습니다. 감사합니다!");
  }
}

async function submitFeedback(e) {
  e.preventDefault();
  hideFeedbackStatus();

  const message = els.feedbackMessage.value.trim();
  if (!message) return;

  const author = els.feedbackAuthor.value.trim() || "익명";
  els.feedbackSubmit.disabled = true;
  els.feedbackSubmit.textContent = "전송 중…";

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author,
        message,
        _subject: "급여 계산기 피드백 — " + author,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      els.feedbackForm.reset();
      showFeedbackSuccess();
    } else {
      showFeedbackError(data.error || "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  } catch (_) {
    showFeedbackError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
  } finally {
    els.feedbackSubmit.disabled = false;
    els.feedbackSubmit.textContent = "등록";
  }
}

function initFeedback() {
  els.feedbackForm.addEventListener("submit", submitFeedback);
}

function saveState() {
  localStorage.setItem("wageCalc", JSON.stringify({
    jobs: state.jobs,
    activeJobId: state.activeJobId,
    viewYear: state.viewYear,
    viewMonth: state.viewMonth,
  }));
}

function loadState() {
  try {
    const savedData = localStorage.getItem("wageCalc");
    if (!savedData) {
      initDefaultJob();
      return;
    }

    const saved = JSON.parse(savedData);
    // 구조가 비정상적인 유효성 검사 (안전 장치)
    if (!saved || typeof saved !== 'object' || !Array.isArray(saved.jobs)) {
      throw new Error("Invalid data format");
    }

    if (saved.jobs.length > 0) {
      state.jobs = saved.jobs;
      state.activeJobId = saved.activeJobId || saved.jobs[0].id;
    } else {
      initDefaultJob();
    }

    if (saved.viewYear != null) state.viewYear = saved.viewYear;
    if (saved.viewMonth != null) state.viewMonth = saved.viewMonth;
  } catch (error) {
    console.error("데이터 로드 실패, 안전 모드로 초기화합니다:", error);
    initDefaultJob();
  }
}

function initDefaultJob() {
  const job = createJob("알바 1");
  state.jobs = [job];
  state.activeJobId = job.id;
}

function readSettingsFromUI() {
  const s = getSettings();
  s.name = els.jobName.value.trim() || "알바";
  s.startTime = getTimeInputValue(els.startTime);
  s.endTime = getTimeInputValue(els.endTime);
  s.autoBreak = els.autoBreak.checked;
  s.autoMinWage = els.autoMinWage.checked;

  if (s.autoBreak) {
    s.breakMinutes = getDefaultBreak();
  } else {
    s.breakMinutes = parseInt(els.breakMinutes.value, 10) || 0;
  }

  // 최저시급 자동적용 체크 여부에 따라 분기 처리
  if (s.autoMinWage) {
    s.hourlyWage = getMinWage(state.viewYear);
  } else {
    s.hourlyWage = parseFloat(els.hourlyWage.value) || 0;
  }

  const taxRadio = document.querySelector('input[name="taxMode"]:checked');
  s.taxMode = taxRadio ? taxRadio.value : "none";
}

function syncSettingsToUI() {
  const s = getSettings();
  els.jobName.value = s.name;
  els.hourlyWage.value = s.hourlyWage;
  els.autoMinWage.checked = s.autoMinWage;
  setTimeInputValue(els.startTime, s.startTime);
  setTimeInputValue(els.endTime, s.endTime);
  els.autoBreak.checked = s.autoBreak;
  els.breakMinutes.value = s.autoBreak ? getDefaultBreak() : s.breakMinutes;
  els.breakMinutes.disabled = s.autoBreak;

  const minWage = getMinWage(state.viewYear);
  els.minWageLabel.textContent = state.viewYear + "년 " + minWage.toLocaleString("ko-KR") + "원";

  // 변경점: 최저시급 체크박스가 켜져있어도 수정이 가능하도록 readOnly 해제
  if (s.autoMinWage) {
    s.hourlyWage = minWage;
    els.hourlyWage.value = minWage;
    els.hourlyWage.readOnly = false;
    els.hourlyWage.style.opacity = "1";
  } else {
    els.hourlyWage.readOnly = false;
    els.hourlyWage.style.opacity = "1";
  }

  document.querySelectorAll('input[name="taxMode"]').forEach((radio) => {
    radio.checked = radio.value === s.taxMode;
  });

  els.colorWork.value = s.colors.work;
  els.colorOff.value = s.colors.off;
  els.colorNight.value = s.colors.night;
  els.colorOvertime.value = s.colors.overtime;
  els.colorBg.value = s.colors.bg;

  updateDefaultHoursHint();
  applyColors();
  renderJobTabs();
}

function renderJobTabs() {
  els.jobTabs.innerHTML = "";
  state.jobs.forEach((job) => {
    const wrap = document.createElement("div");
    wrap.className = "job-tab-wrap" + (job.id === state.activeJobId ? " active" : "");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "job-tab" + (job.id === state.activeJobId ? " active" : "");
    btn.textContent = job.settings.name || "알바";
    btn.title = job.settings.name;
    btn.addEventListener("click", () => switchJob(job.id));
    wrap.appendChild(btn);

    if (state.jobs.length > 1) {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "job-tab-delete";
      delBtn.textContent = "×";
      delBtn.title = "알바 삭제";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteJob(job.id);
      });
      wrap.appendChild(delBtn);
    }

    els.jobTabs.appendChild(wrap);
  });
}

function deleteJob(jobId) {
  if (state.jobs.length <= 1) {
    alert("마지막 알바는 삭제할 수 없습니다.");
    return;
  }

  const job = state.jobs.find((j) => j.id === jobId);
  const name = job?.settings?.name || "알바";
  if (!confirm("「" + name + "」 알바를 삭제하시겠습니까?\n저장된 근무 데이터도 함께 삭제됩니다.")) return;

  readSettingsFromUI();
  state.jobs = state.jobs.filter((j) => j.id !== jobId);
  if (state.activeJobId === jobId) {
    state.activeJobId = state.jobs[0].id;
  }
  state.selectedDate = null;
  els.dayDetail.hidden = true;
  saveState();
  syncSettingsToUI();
  renderCalendar();
}

function switchJob(jobId) {
  if (jobId === state.activeJobId) return;
  readSettingsFromUI();
  state.activeJobId = jobId;
  state.selectedDate = null;
  els.dayDetail.hidden = true;
  saveState();
  syncSettingsToUI();
  renderCalendar();
}

function addJob() {
  readSettingsFromUI();
  const num = state.jobs.length + 1;
  const job = createJob("알바 " + num);
  state.jobs.push(job);
  state.activeJobId = job.id;
  state.selectedDate = null;
  els.dayDetail.hidden = true;
  saveState();
  syncSettingsToUI();
  renderCalendar();
}

function updateDefaultHoursHint() {
  const settings = getSettings();
  const breakMin = getDefaultBreak();
  const gross = calcGrossMinutes(settings.startTime, settings.endTime);
  const hours = Math.max(0, (gross - breakMin) / 60);
  els.defaultHoursHint.textContent =
    "실 근무: " + formatHours(hours) +
    " · 휴게 " + breakMin + "분" +
    (calcNightMinutes(settings.startTime, settings.endTime, breakMin) > 0 ? " · 야간 포함" : "") +
    (hours > 8 ? " · 연장 포함" : "");
}

function renderCalendar() {
  const { viewYear, viewMonth } = state;
  els.calendarTitle.textContent = viewYear + "년 " + (viewMonth + 1) + "월";

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevLastDate = new Date(viewYear, viewMonth, 0).getDate();

  els.calendarGrid.innerHTML = "";

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevLastDate - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    els.calendarGrid.appendChild(createCell(y, m, day, true));
  }

  for (let d = 1; d <= lastDate; d++) {
    els.calendarGrid.appendChild(createCell(viewYear, viewMonth, d, false));
  }

  const totalCells = els.calendarGrid.children.length;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    els.calendarGrid.appendChild(createCell(y, m, d, true));
  }

  renderStats();
}

function createCell(year, month, day, otherMonth) {
  const key = dateKey(year, month, day);
  const record = getDayRecord(key);
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "cal-cell";
  cell.dataset.date = key;

  if (otherMonth) cell.classList.add("other-month");
  if (isPublicHoliday(key)) cell.classList.add("is-holiday");
  if (state.selectedDate === key) cell.classList.add("selected");

  if (record && record.work && isPublicHoliday(key)) {
    cell.classList.add("type-holiday-work");
  } else {
    const type = getCellType(record, key);
    if (type !== "off") cell.classList.add("type-" + type);
  }

  const num = document.createElement("span");
  num.className = "cal-day-num";
  num.textContent = day;
  cell.appendChild(num);

  if (record && record.work) {
    const timeEl = document.createElement("span");
    timeEl.className = "cal-time-range";
    timeEl.textContent = formatTimeRange(record.startTime, record.endTime);
    cell.appendChild(timeEl);

    const { hours } = calcDayHours(record);
    const hoursEl = document.createElement("span");
    hoursEl.className = "cal-hours";
    hoursEl.textContent = formatHoursShort(hours);
    cell.appendChild(hoursEl);
  }

  if (record && record.memo) {
    const dot = document.createElement("span");
    dot.className = "cal-memo-dot";
    cell.appendChild(dot);
  }

  cell.addEventListener("click", () => onCellClick(key));
  return cell;
}

function onCellClick(key) {
  const record = getDayRecord(key);
  const isWork = record && record.work;
  const isSelected = state.selectedDate === key;

  if (isWork && isSelected) {
    delete getWorkDays()[key];
  } else if (!isWork) {
    getWorkDays()[key] = createDefaultDayRecord();
  }

  state.selectedDate = key;
  saveState();
  renderCalendar();
  showDayDetail(key);
}

function showDayDetail(key) {
  const { year, month, day } = parseDateKey(key);
  const date = new Date(year, month, day);
  const record = getDayRecord(key);
  const settings = getSettings();

  els.dayDetail.hidden = false;
  els.dayDetailTitle.textContent =
    (month + 1) + "월 " + day + "일 (" + WEEKDAYS[date.getDay()] + ")" +
    (isPublicHoliday(key) ? " · 공휴일" : "");

  if (record) {
    els.dayWorkToggle.checked = record.work;
    setTimeInputValue(els.dayStartTime, record.startTime);
    setTimeInputValue(els.dayEndTime, record.endTime);
    els.dayBreakMinutes.value = record.breakMinutes;
    els.dayCustomHours.value = record.customHours ?? "";
    els.dayMemo.value = record.memo || "";
    els.dayTimeFields.style.display = record.work ? "flex" : "none";
    els.dayBreakField.style.display = record.work ? "block" : "none";
    updateDayCalcHint(record, key);
  } else {
    els.dayWorkToggle.checked = false;
    setTimeInputValue(els.dayStartTime, settings.startTime);
    setTimeInputValue(els.dayEndTime, settings.endTime);
    els.dayBreakMinutes.value = getDefaultBreak();
    els.dayCustomHours.value = "";
    els.dayMemo.value = "";
    els.dayTimeFields.style.display = "none";
    els.dayBreakField.style.display = "none";
    els.dayCalcHint.textContent = "날짜를 클릭하면 근무일로 등록됩니다";
  }

  document.querySelectorAll(".cal-cell").forEach((c) => {
    c.classList.toggle("selected", c.dataset.date === key);
  });
}

function updateDayCalcHint(record, key) {
  if (!record || !record.work) return;
  const hourlyWage = parseFloat(getSettings().hourlyWage) || 0;
  const pay = calcDayPay(record, key, hourlyWage);
  const { breakMin } = calcDayHours(record);

  els.dayCalcHint.textContent =
    formatTimeRange(record.startTime, record.endTime) +
    " · " + formatHours(pay.hours) +
    " · 야간 " + formatHours(pay.nightHours) +
    " · 연장 " + formatHours(pay.overtimeHours) +
    " · 휴게 " + breakMin + "분" +
    " · 일급 " + formatCurrency(pay.total);
}

function updateDayRecord() {
  if (!state.selectedDate) return;
  const key = state.selectedDate;
  const workDays = getWorkDays();

  if (!els.dayWorkToggle.checked) {
    delete workDays[key];
    saveState();
    renderCalendar();
    showDayDetail(key);
    return;
  }

  let record = getDayRecord(key);
  if (!record) record = createDefaultDayRecord();

  record.work = true;
  record.startTime = getTimeInputValue(els.dayStartTime);
  record.endTime = getTimeInputValue(els.dayEndTime);
  record.breakMinutes = parseInt(els.dayBreakMinutes.value, 10) || 0;
  record.useAutoBreak = false;
  const customVal = els.dayCustomHours.value.trim();
  record.customHours = customVal === "" ? null : parseFloat(customVal);
  record.memo = els.dayMemo.value.trim();

  workDays[key] = record;
  saveState();
  updateDayCalcHint(record, key);
  renderCalendar();
  showDayDetail(key);
}

function getWeekdayPatterns(year, month, workDays) {
  const templates = {};
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    const wd = date.getDay();
    const key = dateKey(year, month, d);
    const record = workDays[key];
    if (record && record.work && !templates[wd]) {
      templates[wd] = JSON.parse(JSON.stringify(record));
    }
  }

  return templates;
}

function copyPatternToNextMonth() {
  const workDays = getWorkDays();
  const { viewYear, viewMonth } = state;
  let nextYear = viewYear;
  let nextMonth = viewMonth + 1;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }

  const weekdayPatterns = getWeekdayPatterns(viewYear, viewMonth, workDays);
  const activeWeekdays = Object.keys(weekdayPatterns);

  if (activeWeekdays.length === 0) {
    alert("복사할 근무 패턴이 없습니다.");
    return;
  }

  const nextLastDay = new Date(nextYear, nextMonth + 1, 0).getDate();
  let copied = 0;

  for (let d = 1; d <= nextLastDay; d++) {
    const date = new Date(nextYear, nextMonth, d);
    const wd = date.getDay();
    if (weekdayPatterns[wd]) {
      const nextKey = dateKey(nextYear, nextMonth, d);
      workDays[nextKey] = JSON.parse(JSON.stringify(weekdayPatterns[wd]));
      copied++;
    }
  }

  if (copied === 0) {
    alert("복사할 근무일이 없습니다.");
    return;
  }

  state.viewYear = nextYear;
  state.viewMonth = nextMonth;
  state.selectedDate = null;
  els.dayDetail.hidden = true;
  saveState();
  renderCalendar();
}

function resetMonthAttendance() {
  if (!confirm("정말 초기화하시겠습니까?\n이번 달 출근 표시가 모두 삭제됩니다.")) return;

  const workDays = getWorkDays();
  const { viewYear, viewMonth } = state;
  const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let d = 1; d <= lastDay; d++) {
    delete workDays[dateKey(viewYear, viewMonth, d)];
  }

  state.selectedDate = null;
  els.dayDetail.hidden = true;
  saveState();
  renderCalendar();
}

function renderStats() {
  const stats = calcMonthStats();

  els.statWorkDays.textContent = stats.workDays + "일";
  els.statTotalHours.textContent = formatHours(stats.totalHours);
  els.statNightHours.textContent = formatHours(stats.nightHours);
  els.statOvertimeHours.textContent = formatHours(stats.overtimeHours);
  els.payBase.textContent = formatCurrency(stats.base);
  els.payNight.textContent = formatCurrency(stats.night);
  els.payOvertime.textContent = formatCurrency(stats.overtime);
  els.payWeeklyHoliday.textContent = formatCurrency(stats.weeklyHoliday);
  els.payHoliday.textContent = formatCurrency(stats.holiday);
  els.payTotal.textContent = formatCurrency(stats.total);
  els.payNet.textContent = formatCurrency(stats.net);
}

function onSettingsChange() {
  readSettingsFromUI();

  if (getSettings().autoBreak) {
    els.breakMinutes.value = getDefaultBreak();
    els.breakMinutes.disabled = true;
  } else {
    els.breakMinutes.disabled = false;
  }

  const s = getSettings();
  if (s.autoMinWage) {
    const minWage = getMinWage(state.viewYear);
    s.hourlyWage = minWage;
    els.hourlyWage.value = minWage;
  }

  updateDefaultHoursHint();
  renderJobTabs();
  saveState();
  renderCalendar();
  if (state.selectedDate) showDayDetail(state.selectedDate);
}

function onColorChange() {
  getSettings().colors = {
    work: els.colorWork.value,
    off: els.colorOff.value,
    night: els.colorNight.value,
    overtime: els.colorOvertime.value,
    bg: els.colorBg.value,
  };
  applyColors();
  saveState();
  renderCalendar();
}

function initEvents() {
  els.addJobBtn.addEventListener("click", addJob);
  els.jobName.addEventListener("input", onSettingsChange);
  els.autoMinWage.addEventListener("change", onSettingsChange);
  els.hourlyWage.addEventListener("input", () => {
    // 수동 변경 반영을 위한 분기 제거 및 직접 갱신 활성화
    getSettings().hourlyWage = parseFloat(els.hourlyWage.value) || 0;
    saveState();
    renderStats();
    if (state.selectedDate) updateDayCalcHint(getDayRecord(state.selectedDate), state.selectedDate);
  });
  els.hourlyWage.addEventListener("change", onSettingsChange);

  document.querySelectorAll(".time-input-24").forEach((el) => {
    bindTimeInput(el);
    if (el.id === "startTime" || el.id === "endTime") {
      el.addEventListener("change", onSettingsChange);
    }
  });

  els.autoBreak.addEventListener("change", onSettingsChange);
  els.breakMinutes.addEventListener("input", () => {
    if (!getSettings().autoBreak) onSettingsChange();
  });

  document.querySelectorAll('input[name="taxMode"]').forEach((radio) => {
    radio.addEventListener("change", onSettingsChange);
  });

  els.colorToggle.addEventListener("click", () => {
    const expanded = els.colorToggle.getAttribute("aria-expanded") === "true";
    els.colorToggle.setAttribute("aria-expanded", String(!expanded));
    els.colorPanel.hidden = expanded;
  });

  [els.colorWork, els.colorOff, els.colorNight, els.colorOvertime, els.colorBg].forEach((el) => {
    el.addEventListener("input", onColorChange);
  });

  els.prevMonth.addEventListener("click", () => {
    state.viewMonth--;
    if (state.viewMonth < 0) {
      state.viewMonth = 11;
      state.viewYear--;
    }
    // 연도가 바뀌었을 때 최저시급 업데이트 유도
    if(getSettings().autoMinWage) {
      getSettings().hourlyWage = getMinWage(state.viewYear);
    }
    saveState();
    syncSettingsToUI();
    renderCalendar();
  });

  els.nextMonth.addEventListener("click", () => {
    state.viewMonth++;
    if (state.viewMonth > 11) {
      state.viewMonth = 0;
      state.viewYear++;
    }
    // 연도가 바뀌었을 때 최저시급 업데이트 유도
    if(getSettings().autoMinWage) {
      getSettings().hourlyWage = getMinWage(state.viewYear);
    }
    saveState();
    syncSettingsToUI();
    renderCalendar();
  });

  els.copyPatternBtn.addEventListener("click", copyPatternToNextMonth);
  els.resetMonthBtn.addEventListener("click", resetMonthAttendance);

  els.dayWorkToggle.addEventListener("change", () => {
    if (!state.selectedDate) return;
    const key = state.selectedDate;
    const workDays = getWorkDays();
    if (els.dayWorkToggle.checked) {
      if (!getDayRecord(key)) workDays[key] = createDefaultDayRecord();
    } else {
      delete workDays[key];
    }
    saveState();
    renderCalendar();
    showDayDetail(key);
  });

  [els.dayStartTime, els.dayEndTime, els.dayBreakMinutes, els.dayCustomHours, els.dayMemo].forEach((el) => {
    el.addEventListener("change", updateDayRecord);
    el.addEventListener("input", () => {
      if (el === els.dayMemo) updateDayRecord();
    });
  });
}

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-nav .tab-btn");
  const tabParttime = document.getElementById("tabParttime");
  const tabEmployee = document.getElementById("tabEmployee");

  function switchTab(tab) {
    tabBtns.forEach((btn) => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    tabParttime.classList.toggle("active", tab === "parttime");
    tabParttime.hidden = tab !== "parttime";
    tabEmployee.classList.toggle("active", tab === "employee");
    tabEmployee.hidden = tab !== "employee";
    
    if (tab === "employee") {
      setTimeout(() => updateEmployeeCalculation(), 100);
    }

    localStorage.setItem("activeTab", tab);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  const savedTab = localStorage.getItem("activeTab");
  switchTab(savedTab === "employee" ? "employee" : "parttime");
}

function init() {
  initTheme();
  loadState();
  syncSettingsToUI();
  initEvents();
  initEmployee();
  initTabs();
  initFeedback();
  renderCalendar();
}

init();