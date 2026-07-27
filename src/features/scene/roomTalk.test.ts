import { describe, expect, it } from 'vitest';
import {
  EMOTIONAL_PEAK_CHANCE,
  emotionalPeakCandidates,
  pickEmotionalPeak,
  roomLines,
  roomDialogues,
} from './roomTalk';

describe('emotionalPeakCandidates', () => {
  it('includes angry and happy static lines', () => {
    const peaks = emotionalPeakCandidates({});
    expect(peaks.some((p) => p.mood === 'angry')).toBe(true);
    expect(peaks.some((p) => p.mood === 'happy')).toBe(true);
    expect(peaks.some((p) => /bug|Critic|regression/i.test(p.text))).toBe(true);
    expect(peaks.some((p) => /works|Green build|Promotion/i.test(p.text))).toBe(
      true,
    );
  });

  it('weaves issue numbers and contributor names into peaks', () => {
    const peaks = emotionalPeakCandidates({
      openIssues: [{ number: 31, title: 'Richer office talk' }],
      contributorNames: ['joaovictornsv'],
    });
    expect(peaks.some((p) => p.text.includes('#31'))).toBe(true);
    expect(peaks.some((p) => p.text.includes('joaovictornsv'))).toBe(true);
  });
});

describe('pickEmotionalPeak', () => {
  it('returns null when the peak roll misses', () => {
    expect(
      pickEmotionalPeak({
        random: () => EMOTIONAL_PEAK_CHANCE,
      }),
    ).toBeNull();
  });

  it('returns a peak when the roll hits', () => {
    const peak = pickEmotionalPeak({
      openIssues: [],
      contributorNames: [],
      random: () => 0,
    });
    expect(peak).not.toBeNull();
    expect(peak!.mood === 'angry' || peak!.mood === 'happy').toBe(true);
  });
});

describe('room pools', () => {
  it('keeps office lines broad and themed rooms distinct', () => {
    expect(roomLines('office').length).toBeGreaterThan(20);
    expect(
      roomDialogues('break-room').some((d) =>
        /Coffee|sip|snacks/i.test(d.a + d.b),
      ),
    ).toBe(true);
  });
});
