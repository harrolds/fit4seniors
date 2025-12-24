import { getSettingsState, subscribeSettings, type SettingsPreferences } from '../../modules/settings/settingsStorage';

type FeedbackType = 'start' | 'pause' | 'stop' | 'complete' | 'saved' | 'notify';

type FeedbackPrefs = Pick<SettingsPreferences, 'soundEnabled' | 'hapticsEnabled' | 'soundVolume'>;

let currentPrefs: FeedbackPrefs | null = null;
let unsubscribeSettings: (() => void) | null = null;
let audioContext: AudioContext | null = null;

const ensurePrefs = (): FeedbackPrefs => {
  if (!currentPrefs) {
    const state = getSettingsState();
    currentPrefs = {
      soundEnabled: state.soundEnabled,
      hapticsEnabled: state.hapticsEnabled,
      soundVolume: state.soundVolume,
    };
    if (!unsubscribeSettings) {
      unsubscribeSettings = subscribeSettings(() => {
        const next = getSettingsState();
        currentPrefs = {
          soundEnabled: next.soundEnabled,
          hapticsEnabled: next.hapticsEnabled,
          soundVolume: next.soundVolume,
        };
      });
    }
  }
  return currentPrefs;
};

const getAudioContext = (): AudioContext | null => {
  if (audioContext) return audioContext;
  if (typeof window === 'undefined' || typeof AudioContext === 'undefined') return null;
  audioContext = new AudioContext();
  return audioContext;
};

const clampVolume = (value: number): number => {
  if (!Number.isFinite(value)) return 0.8;
  return Math.min(1, Math.max(0, value / 100));
};

const playTone = (frequency: number, durationMs: number, gainValue: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  osc.start(now);
  osc.stop(now + durationMs / 1000);
};

const tonePatterns: Record<FeedbackType, { frequency: number; duration: number }[]> = {
  start: [
    { frequency: 880, duration: 120 },
    { frequency: 1320, duration: 100 },
  ],
  pause: [{ frequency: 520, duration: 140 }],
  stop: [
    { frequency: 520, duration: 120 },
    { frequency: 340, duration: 120 },
  ],
  complete: [
    { frequency: 660, duration: 140 },
    { frequency: 990, duration: 140 },
    { frequency: 1320, duration: 120 },
  ],
  saved: [{ frequency: 1020, duration: 120 }],
  notify: [{ frequency: 880, duration: 100 }],
};

const hapticPatterns: Record<FeedbackType, VibratePattern> = {
  start: [10, 30, 10],
  pause: [10],
  stop: [20, 20],
  complete: [30, 30, 30],
  saved: [15, 20],
  notify: [10, 15],
};

const triggerHaptics = (type: FeedbackType, prefs: FeedbackPrefs) => {
  if (!prefs.hapticsEnabled) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  const pattern = hapticPatterns[type];
  navigator.vibrate(pattern);
};

const triggerSound = (type: FeedbackType, prefs: FeedbackPrefs) => {
  if (!prefs.soundEnabled) return;
  const volume = clampVolume(prefs.soundVolume);
  if (volume <= 0) return;
  const pattern = tonePatterns[type];
  pattern.forEach((step, index) => {
    window.setTimeout(() => playTone(step.frequency, step.duration, volume), pattern.slice(0, index).reduce((acc, item) => acc + item.duration + 20, 0));
  });
};

export const initFeedback = (): void => {
  ensurePrefs();
};

export const playFeedback = (type: FeedbackType, overrides?: Partial<FeedbackPrefs>): void => {
  const prefs = { ...ensurePrefs(), ...(overrides ?? {}) };
  triggerSound(type, prefs);
  triggerHaptics(type, prefs);
};


