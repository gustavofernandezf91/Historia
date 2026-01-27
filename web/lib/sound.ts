"use client";

type SoundEvent =
  | "correct_answer"
  | "reflection_completed"
  | "lesson_completed"
  | "checkpoint_completed"
  | "error_feedback";

type SoundConfig = {
  frequency: number;
  durationMs: number;
  type: OscillatorType;
  gain: number;
  attackMs: number;
};

export const SOUND_MAP: Record<SoundEvent, SoundConfig> = {
  correct_answer: {
    frequency: 880,
    durationMs: 180,
    type: "triangle",
    gain: 0.055,
    attackMs: 12,
  },
  reflection_completed: {
    frequency: 520,
    durationMs: 240,
    type: "sine",
    gain: 0.06,
    attackMs: 18,
  },
  lesson_completed: {
    frequency: 300,
    durationMs: 320,
    type: "sine",
    gain: 0.05,
    attackMs: 20,
  },
  checkpoint_completed: {
    frequency: 220,
    durationMs: 360,
    type: "triangle",
    gain: 0.06,
    attackMs: 24,
  },
  error_feedback: {
    frequency: 260,
    durationMs: 160,
    type: "sine",
    gain: 0.045,
    attackMs: 10,
  },
};

const SOUND_ENABLED_KEY = "historiapp:sound-enabled";

let audioContext: AudioContext | null = null;
let activeNodes: { oscillator: OscillatorNode; gain: GainNode } | null = null;

const resolveAudioContext = () => {
  if (audioContext) return audioContext;
  const context = new AudioContext();
  audioContext = context;
  return context;
};

const prefersQuiet = () => {
  if (typeof window === "undefined") return true;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const reduceData = window.matchMedia?.("(prefers-reduced-data: reduce)")?.matches ?? false;
  const saveData = "connection" in navigator ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData : false;
  return reduceMotion || reduceData || Boolean(saveData);
};

export const isSoundEnabled = () => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(SOUND_ENABLED_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return !prefersQuiet();
};

const stopActiveSound = () => {
  if (!activeNodes) return;
  const { oscillator, gain } = activeNodes;
  try {
    oscillator.stop();
  } catch {
    // noop
  }
  oscillator.disconnect();
  gain.disconnect();
  activeNodes = null;
};

export const playSound = (event: SoundEvent) => {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;
  const config = SOUND_MAP[event];
  if (!config) return;

  const context = resolveAudioContext();
  if (context.state === "suspended") {
    void context.resume();
  }

  stopActiveSound();

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  const now = context.currentTime;
  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(config.gain, now + config.attackMs / 1000);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + config.durationMs / 1000);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + config.durationMs / 1000 + 0.02);

  activeNodes = { oscillator, gain: gainNode };
  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
    if (activeNodes?.oscillator === oscillator) {
      activeNodes = null;
    }
  };
};

export const setSoundEnabled = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SOUND_ENABLED_KEY, enabled ? "true" : "false");
};
