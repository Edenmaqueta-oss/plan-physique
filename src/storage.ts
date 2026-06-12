export const STORAGE_KEYS = {
  JAW: 'jaw_v2',
  PROTEIN_HISTORY: 'protein_history_v2',
  API_KEY: 'anthropic_api_key',
};

export type DayProtein = { date: string; total: number; goal: number };
export type JawDay = { date: string; checked: Record<string, boolean> };

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadJawChecked(): Record<string, boolean> {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.JAW) || '{}') as JawDay;
    return raw.date === getTodayKey() ? (raw.checked || {}) : {};
  } catch { return {}; }
}

export function saveJawChecked(checked: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEYS.JAW, JSON.stringify({ date: getTodayKey(), checked }));
  } catch {}
}

export function loadProteinHistory(): DayProtein[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROTEIN_HISTORY) || '[]');
  } catch { return []; }
}

export function saveProteinDay(total: number, goal: number) {
  try {
    const history = loadProteinHistory();
    const today = getTodayKey();
    const existing = history.findIndex(d => d.date === today);
    if (existing >= 0) history[existing] = { date: today, total, goal };
    else history.push({ date: today, total, goal });
    const trimmed = history.sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    localStorage.setItem(STORAGE_KEYS.PROTEIN_HISTORY, JSON.stringify(trimmed));
  } catch {}
}

export function getStreak(history: DayProtein[], jawHistory: JawDay[]): number {
  let streak = 0;
  const today = getTodayKey();
  let d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().split('T')[0];
    const pDay = history.find(h => h.date === key);
    const jDay = jawHistory.find(j => j.date === key);
    const protOk = pDay && pDay.total >= pDay.goal;
    const jawOk = jDay && Object.values(jDay.checked || {}).filter(Boolean).length >= 16;
    if (i === 0 && !protOk && !jawOk) { d.setDate(d.getDate()-1); continue; }
    if (protOk || jawOk) streak++;
    else break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function loadAllJawHistory(): JawDay[] {
  try {
    return JSON.parse(localStorage.getItem('jaw_history_v2') || '[]');
  } catch { return []; }
}

export function saveJawHistory(checked: Record<string, boolean>) {
  try {
    const history: JawDay[] = loadAllJawHistory();
    const today = getTodayKey();
    const existing = history.findIndex(d => d.date === today);
    if (existing >= 0) history[existing] = { date: today, checked };
    else history.push({ date: today, checked });
    localStorage.setItem('jaw_history_v2', JSON.stringify(history.slice(-30)));
  } catch {}
}

export function loadApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}
export function saveApiKey(key: string) {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}
