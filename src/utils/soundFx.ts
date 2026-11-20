// Gentle Web Audio API sound effects for kid-friendly tactile feedback

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled || typeof window === 'undefined') return null;
  const AudioContextCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextCtor();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  delaySec = 0,
  volume = 0.08
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationSec + 0.02);
  } catch {
    // Ignore audio context restrictions
  }
}

export function playTap(): void {
  playTone(520, 0.08, 'sine', 0, 0.06);
}

export function playSuccess(): void {
  playTone(523.25, 0.14, 'triangle', 0, 0.08); // C5
  playTone(659.25, 0.18, 'triangle', 0.09, 0.08); // E5
  playTone(783.99, 0.24, 'triangle', 0.18, 0.09); // G5
}

export function playTryAgain(): void {
  playTone(320, 0.14, 'sine', 0, 0.06);
  playTone(270, 0.18, 'sine', 0.1, 0.05);
}

export function playFanfare(): void {
  playTone(523.25, 0.14, 'triangle', 0, 0.08); // C5
  playTone(659.25, 0.14, 'triangle', 0.1, 0.08); // E5
  playTone(783.99, 0.16, 'triangle', 0.2, 0.09); // G5
  playTone(1046.5, 0.34, 'triangle', 0.32, 0.1); // C6
}
