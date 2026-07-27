import { describe, expect, it } from 'vitest';
import {
  calendarLines,
  contributorLines,
  githubIssueLines,
  ownedUpgradeLines,
  pickSpecialtyLine,
  pickTalkBubble,
  pickTalkLine,
  roomFlavorLines,
  SPECIALTY_LINE_CHANCE,
  stageLines,
  type TalkContext,
} from './specialtyTalk';
import { EMOTIONAL_PEAK_CHANCE } from './roomTalk';
import { roomDialogues, roomLines } from './roomTalk';
import { DEV_LINES } from './devTalk';

const baseContext: TalkContext = {
  now: new Date('2026-07-27T15:30:00'), // Monday afternoon
  stageId: 'small-team',
  tokensPerSecond: 12,
  owned: { espresso: 0, codeReview: 0, ci: 0, onCall: 0 },
  roomId: 'office',
};

describe('githubIssueLines', () => {
  it('builds playful lines from snapshot issues', () => {
    const lines = githubIssueLines([{ number: 42, title: 'Unlockable rooms' }]);
    expect(lines).toContain('Anyone looking at #42?');
    expect(lines.some((line) => line.includes('Unlockable rooms'))).toBe(true);
  });

  it('flavors issue jokes by room', () => {
    const ops = githubIssueLines(
      [{ number: 9, title: 'Rewrite prestige' }],
      'ops-bay',
    );
    expect(
      ops.some(
        (line) => line.includes('#9') && /pag|incident|Runbook/i.test(line),
      ),
    ).toBe(true);

    const review = githubIssueLines(
      [{ number: 9, title: 'Rewrite prestige' }],
      'review-lab',
    );
    expect(review.some((line) => /LGTM|Reviewing|nit/i.test(line))).toBe(true);
  });

  it('returns empty when there are no issues', () => {
    expect(githubIssueLines([])).toEqual([]);
  });
});

describe('contributorLines', () => {
  it('name-drops allowlisted handles', () => {
    const lines = contributorLines(['joaovictornsv']);
    expect(lines.some((line) => line.includes('joaovictornsv'))).toBe(true);
  });

  it('flavors name-drops by room', () => {
    const breakRoom = contributorLines(['alice'], 'break-room');
    expect(breakRoom.some((line) => /AFK|espresso/i.test(line))).toBe(true);
  });

  it('skips blank names', () => {
    expect(contributorLines(['', '  '])).toEqual([]);
  });
});

describe('calendarLines', () => {
  it('includes Monday flavor', () => {
    const lines = calendarLines(new Date('2026-07-27T10:00:00'));
    expect(lines).toContain('Monday standup energy…');
  });

  it('includes Friday ship-it flavor', () => {
    const lines = calendarLines(new Date('2026-07-31T16:00:00'));
    expect(lines).toContain('Friday — ship it?');
  });

  it('includes late-night flavor', () => {
    const lines = calendarLines(new Date('2026-07-27T23:15:00'));
    expect(lines).toContain('Late-night build club.');
  });
});

describe('ownedUpgradeLines', () => {
  it('is empty when nothing relevant is owned', () => {
    expect(
      ownedUpgradeLines({ espresso: 0, codeReview: 0, ci: 0, onCall: 0 }),
    ).toEqual([]);
  });

  it('adds espresso / CI / on-call jokes when owned', () => {
    const lines = ownedUpgradeLines({
      espresso: 1,
      codeReview: 0,
      ci: 2,
      onCall: 1,
    });
    expect(lines.some((line) => /espresso/i.test(line))).toBe(true);
    expect(lines.some((line) => /CI|pipeline/i.test(line))).toBe(true);
    expect(lines.some((line) => /Pager|On-call/i.test(line))).toBe(true);
  });
});

describe('stageLines', () => {
  it('has crowded / solo flavor and none for empty', () => {
    expect(stageLines('empty')).toEqual([]);
    expect(stageLines('crowded').length).toBeGreaterThan(0);
    expect(stageLines('solo').length).toBeGreaterThan(0);
  });
});

describe('roomFlavorLines', () => {
  it('is empty for office and set for themed rooms', () => {
    expect(roomFlavorLines('office')).toEqual([]);
    expect(roomFlavorLines('ops-bay').length).toBeGreaterThan(0);
    expect(roomFlavorLines('datacenter').length).toBeGreaterThan(0);
  });
});

describe('roomLines / roomDialogues', () => {
  it('gives each room a distinct line pool', () => {
    expect(
      roomLines('break-room').some((line) => /espresso|Snack|mug/i.test(line)),
    ).toBe(true);
    expect(
      roomLines('review-lab').some((line) => /LGTM|Nit|review/i.test(line)),
    ).toBe(true);
    expect(roomDialogues('ops-bay').length).toBeGreaterThan(0);
  });
});

describe('pickSpecialtyLine', () => {
  it('returns null when no specialty buckets apply', () => {
    expect(
      pickSpecialtyLine({
        context: {
          ...baseContext,
          stageId: 'empty',
          tokensPerSecond: 0,
          // Wed 08:00 — no Mon/Fri/weekend/late/lunch/morning/afternoon hooks
          now: new Date('2026-07-29T08:00:00'),
          owned: { espresso: 0, codeReview: 0, ci: 0, onCall: 0 },
        },
        openIssues: [],
        contributorNames: [],
        random: () => 0,
      }),
    ).toBeNull();
  });

  it('can return a github line when issues exist', () => {
    const line = pickSpecialtyLine({
      context: baseContext,
      openIssues: [{ number: 7, title: 'Living office' }],
      contributorNames: [],
      // Force preferred front (github) and first line.
      random: () => 0,
    });
    expect(line).toBe('Anyone looking at #7?');
  });
});

describe('pickTalkLine', () => {
  it('falls back to room lines when specialty roll misses', () => {
    // First random() call is specialty chance — return value >= chance.
    const line = pickTalkLine({
      context: baseContext,
      openIssues: [{ number: 1, title: 'x' }],
      random: () => SPECIALTY_LINE_CHANCE,
    });
    expect(roomLines('office')).toContain(line);
  });

  it('can pick specialty when roll hits', () => {
    let calls = 0;
    const line = pickTalkLine({
      context: baseContext,
      openIssues: [{ number: 99, title: 'Test issue' }],
      contributorNames: [],
      random: () => {
        calls += 1;
        // 1st: specialty chance hit; later picks category/line index 0
        return 0;
      },
    });
    expect(line).toBe('Anyone looking at #99?');
    expect(calls).toBeGreaterThan(0);
  });
});

describe('pickTalkBubble', () => {
  it('can return an emotional peak with angry or happy mood', () => {
    const pick = pickTalkBubble({
      context: baseContext,
      openIssues: [{ number: 42, title: 'Critic bug' }],
      contributorNames: ['sam'],
      // 0 < EMOTIONAL_PEAK_CHANCE → peak; then index 0 → first angry line
      random: () => 0,
    });
    expect(pick.mood === 'angry' || pick.mood === 'happy').toBe(true);
    expect(pick.text.length).toBeGreaterThan(0);
  });

  it('returns neutral talk when peak roll misses', () => {
    let calls = 0;
    const pick = pickTalkBubble({
      context: baseContext,
      openIssues: [],
      contributorNames: [],
      random: () => {
        calls += 1;
        // 1st: peak miss (>= chance); 2nd: specialty miss (>= chance); then line index
        if (calls === 1) {
          return EMOTIONAL_PEAK_CHANCE;
        }
        if (calls === 2) {
          return SPECIALTY_LINE_CHANCE;
        }
        return 0;
      },
    });
    expect(pick.mood).toBe('neutral');
    expect(
      DEV_LINES.includes(pick.text as (typeof DEV_LINES)[number]) ||
        roomLines('office').includes(pick.text),
    ).toBe(true);
  });
});
