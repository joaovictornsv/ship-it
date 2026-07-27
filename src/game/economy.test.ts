import { describe, expect, it } from 'vitest';
import {
  MUSCLE_MEMORY_ID,
  POSTMORTEM_ID,
  STUB_REPO_ID,
} from '../data/prestigeUpgrades';
import {
  DARK_MODE_ID,
  GREEN_BUILD_ID,
  LGTM_STAMP_ID,
  MECHANICAL_KEYBOARD_ID,
  PAIR_PROGRAMMING_ID,
  POMODORO_ID,
  README_DRIVEN_ID,
  RUBBER_DUCK_ID,
  SHIP_IT_FRIDAY_ID,
  STACK_OVERFLOW_TAB_ID,
  STANDUP_ID,
  STICKY_NOTES_ID,
  shipUpgrades,
  visibleShipUpgradeQueue,
} from '../data/shipUpgrades';
import {
  CODE_REVIEW,
  CODE_REVIEW_ID,
  DEV,
  DEV_ID,
  ESPRESSO_MACHINE,
  ESPRESSO_MACHINE_ID,
} from '../data/upgrades';
import {
  DOUBLE_SHOT_ID,
  visibleBuildingUpgradeQueue,
} from '../data/buildingUpgrades';
import {
  canBuyBuildingUpgrade,
  canBuyPrestigeUpgrade,
  clickPower,
  COST_GROWTH,
  espressoMachineCost,
  hasBuildingUpgrade,
  hasShipUpgrade,
  hasStubRepo,
  highestShipUpgrade,
  isRewriteAvailable,
  maxAffordableUpgrades,
  nextPrestigeUpgradeCost,
  nextShipUpgradeId,
  ownedAfterRewrite,
  prestigeTokensPerSecondMult,
  producerTokensPerSecondMult,
  REWRITE_K,
  REWRITE_TPS_BONUS_PER,
  rewritesGained,
  shipItCta,
  shipUpgradesUnlocked,
  tokensFromDelta,
  tokensPerSecond,
  tokensUntilRewrite,
  upgradeCost,
  upgradeCostForN,
} from './economy';

describe('clickPower', () => {
  it('returns base click power of 1 token with no Ship upgrades', () => {
    expect(clickPower()).toBe(1);
    expect(clickPower({})).toBe(1);
  });

  it('adds flat Ship upgrades before multiplying', () => {
    expect(clickPower({ [RUBBER_DUCK_ID]: true })).toBe(2);
    expect(
      clickPower({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
      }),
    ).toBe(4);
    expect(
      clickPower({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
        [STANDUP_ID]: true,
        [STACK_OVERFLOW_TAB_ID]: true,
        [STICKY_NOTES_ID]: true,
      }),
    ).toBe(1 + 1 + 2 + 3 + 5 + 8);
  });

  it('applies mult Ship upgrades after flats', () => {
    const throughDark = {
      [RUBBER_DUCK_ID]: true,
      [MECHANICAL_KEYBOARD_ID]: true,
      [STANDUP_ID]: true,
      [STACK_OVERFLOW_TAB_ID]: true,
      [STICKY_NOTES_ID]: true,
      [DARK_MODE_ID]: true,
    } as const;
    expect(clickPower(throughDark)).toBe((1 + 1 + 2 + 3 + 5 + 8) * 2);

    const full = {
      ...throughDark,
      [PAIR_PROGRAMMING_ID]: true,
      [LGTM_STAMP_ID]: true,
      [POMODORO_ID]: true,
      [GREEN_BUILD_ID]: true,
      [README_DRIVEN_ID]: true,
      [SHIP_IT_FRIDAY_ID]: true,
    } as const;
    // flats 1+2+3+5+8+15+25+50 = 109 → base 110; mults 2×2×2×3 = 24
    expect(clickPower(full)).toBe(110 * 24);
  });
});

describe('ship upgrade ladder helpers', () => {
  it('unlocks after the first producer is owned', () => {
    expect(shipUpgradesUnlocked({})).toBe(false);
    expect(shipUpgradesUnlocked({ [ESPRESSO_MACHINE_ID]: 1 })).toBe(true);
  });

  it('walks the one-shot ladder in catalog order', () => {
    expect(nextShipUpgradeId({})).toBe(RUBBER_DUCK_ID);
    expect(nextShipUpgradeId({ [RUBBER_DUCK_ID]: true })).toBe(
      MECHANICAL_KEYBOARD_ID,
    );
    expect(nextShipUpgradeId({ [RUBBER_DUCK_ID]: true })).not.toBe(STANDUP_ID);
  });

  it('visible queue shows only the next available (not owned) upgrade', () => {
    expect(visibleShipUpgradeQueue({}).map((u) => u.id)).toEqual([
      RUBBER_DUCK_ID,
    ]);
    expect(
      visibleShipUpgradeQueue({ [RUBBER_DUCK_ID]: true }).map((u) => u.id),
    ).toEqual([MECHANICAL_KEYBOARD_ID]);
  });

  it('visible queue is empty when the ladder is complete', () => {
    const allOwned = Object.fromEntries(
      [
        RUBBER_DUCK_ID,
        MECHANICAL_KEYBOARD_ID,
        STANDUP_ID,
        STACK_OVERFLOW_TAB_ID,
        STICKY_NOTES_ID,
        DARK_MODE_ID,
        PAIR_PROGRAMMING_ID,
        LGTM_STAMP_ID,
        POMODORO_ID,
        GREEN_BUILD_ID,
        README_DRIVEN_ID,
        SHIP_IT_FRIDAY_ID,
      ].map((id) => [id, true as const]),
    );
    expect(visibleShipUpgradeQueue(allOwned)).toEqual([]);
  });

  it('reports the highest owned Ship upgrade for CTA evolution', () => {
    expect(highestShipUpgrade({})).toBeNull();
    expect(
      highestShipUpgrade({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
      })?.id,
    ).toBe(MECHANICAL_KEYBOARD_ID);
    expect(hasShipUpgrade({ [RUBBER_DUCK_ID]: true }, RUBBER_DUCK_ID)).toBe(
      true,
    );
  });

  it('shipItCta changes label for every owned ladder step', () => {
    expect(shipItCta({}).label).toBe('Ship It');
    expect(shipItCta({ [RUBBER_DUCK_ID]: true }).label).toBe('Duck ship');
    expect(
      shipItCta({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
      }).label,
    ).toBe('Type & ship');
  });

  it('every Ship upgrade defines a CTA label distinct from the base', () => {
    for (const def of shipUpgrades) {
      expect(def.ctaLabel).not.toBe('Ship It');
      expect(def.ctaLabel.length).toBeGreaterThan(0);
    }
  });
});

describe('upgradeCost', () => {
  it('returns base cost when owned is 0', () => {
    expect(upgradeCost(15, 0)).toBe(15);
  });

  it('grows Cookie-style by COST_GROWTH per owned unit', () => {
    expect(upgradeCost(15, 1)).toBe(Math.ceil(15 * COST_GROWTH));
    expect(upgradeCost(15, 2)).toBe(Math.ceil(15 * COST_GROWTH ** 2));
    expect(upgradeCost(15, 5)).toBe(Math.ceil(15 * COST_GROWTH ** 5));
  });

  it('rejects negative owned counts', () => {
    expect(() => upgradeCost(15, -1)).toThrow(/owned/);
  });
});

describe('espressoMachineCost', () => {
  it('matches catalog base cost for the first machine', () => {
    expect(espressoMachineCost(0)).toBe(ESPRESSO_MACHINE.baseCost);
  });
});

describe('upgradeCostForN', () => {
  it('returns 0 for n = 0', () => {
    expect(upgradeCostForN(15, 0, 0)).toBe(0);
  });

  it('matches a single next cost when n = 1', () => {
    expect(upgradeCostForN(15, 0, 1)).toBe(upgradeCost(15, 0));
    expect(upgradeCostForN(15, 3, 1)).toBe(upgradeCost(15, 3));
  });

  it('sums Cookie rising costs across the next n purchases', () => {
    const owned = 2;
    const n = 5;
    let expected = 0;
    for (let i = 0; i < n; i++) {
      expected += upgradeCost(15, owned + i);
    }
    expect(upgradeCostForN(15, owned, n)).toBe(expected);
  });

  it('rejects negative owned or n', () => {
    expect(() => upgradeCostForN(15, -1, 1)).toThrow(/owned/);
    expect(() => upgradeCostForN(15, 0, -1)).toThrow(/n/);
  });
});

describe('maxAffordableUpgrades', () => {
  it('returns 0 when the bank is empty or cannot afford one', () => {
    expect(maxAffordableUpgrades(15, 0, 0)).toBe(0);
    expect(maxAffordableUpgrades(15, 0, 14)).toBe(0);
  });

  it('returns 1 when the bank exactly fits the next unit', () => {
    const cost = upgradeCost(15, 0);
    expect(maxAffordableUpgrades(15, 0, cost)).toBe(1);
  });

  it('returns the largest n whose rising sum fits the bank', () => {
    const owned = 0;
    const n = 10;
    const exact = upgradeCostForN(15, owned, n);
    expect(maxAffordableUpgrades(15, owned, exact)).toBe(n);
    expect(maxAffordableUpgrades(15, owned, exact - 1)).toBe(n - 1);
  });

  it('rejects negative owned', () => {
    expect(() => maxAffordableUpgrades(15, -1, 100)).toThrow(/owned/);
  });
});

describe('tokensPerSecond', () => {
  it('is 0 with nothing owned', () => {
    expect(tokensPerSecond({})).toBe(0);
  });

  it('scales linearly with Espresso machines owned', () => {
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 1 })).toBeCloseTo(
      ESPRESSO_MACHINE.tokensPerSecond,
    );
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 3 })).toBeCloseTo(
      ESPRESSO_MACHINE.tokensPerSecond * 3,
    );
  });

  it('sums tokens/s across multiple upgrade types', () => {
    expect(
      tokensPerSecond({
        [ESPRESSO_MACHINE_ID]: 2,
        [DEV_ID]: 3,
        [CODE_REVIEW_ID]: 1,
      }),
    ).toBeCloseTo(
      ESPRESSO_MACHINE.tokensPerSecond * 2 +
        DEV.tokensPerSecond * 3 +
        CODE_REVIEW.tokensPerSecond,
    );
  });

  it('never gains click side-effects from producers', () => {
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 10 })).toBeCloseTo(1);
    expect(clickPower({})).toBe(1);
  });

  it('applies banked Rewrites and Postmortem as tokens/s mult', () => {
    const base = ESPRESSO_MACHINE.tokensPerSecond;
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 1 }, 2)).toBeCloseTo(
      base * (1 + 2 * REWRITE_TPS_BONUS_PER),
    );
    expect(
      tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 1 }, 0, {
        [POSTMORTEM_ID]: 2,
      }),
    ).toBeCloseTo(base * 1.1);
  });

  it('applies building upgrades as per-producer tokens/s mults', () => {
    const base = ESPRESSO_MACHINE.tokensPerSecond;
    expect(
      tokensPerSecond(
        { [ESPRESSO_MACHINE_ID]: 3 },
        0,
        {},
        {
          [DOUBLE_SHOT_ID]: true,
        },
      ),
    ).toBeCloseTo(base * 3 * 2);

    expect(
      producerTokensPerSecondMult(
        { [DOUBLE_SHOT_ID]: true },
        ESPRESSO_MACHINE_ID,
      ),
    ).toBe(2);
    expect(producerTokensPerSecondMult({}, ESPRESSO_MACHINE_ID)).toBe(1);
    expect(
      producerTokensPerSecondMult({ [DOUBLE_SHOT_ID]: true }, DEV_ID),
    ).toBe(1);
  });

  it('stacks building mult with prestige tokens/s mult', () => {
    const base = ESPRESSO_MACHINE.tokensPerSecond;
    expect(
      tokensPerSecond(
        { [ESPRESSO_MACHINE_ID]: 1 },
        2,
        { [POSTMORTEM_ID]: 1 },
        { [DOUBLE_SHOT_ID]: true },
      ),
    ).toBeCloseTo(base * 2 * (1 + 2 * REWRITE_TPS_BONUS_PER) * 1.05);
  });
});

describe('building upgrades unlock / queue', () => {
  it('unlocks when the target producer is owned', () => {
    expect(canBuyBuildingUpgrade(DOUBLE_SHOT_ID, {}, {}, 1_000)).toBe(false);
    expect(
      canBuyBuildingUpgrade(
        DOUBLE_SHOT_ID,
        { [ESPRESSO_MACHINE_ID]: 1 },
        {},
        1_000,
      ),
    ).toBe(true);
    expect(
      canBuyBuildingUpgrade(
        DOUBLE_SHOT_ID,
        { [ESPRESSO_MACHINE_ID]: 1 },
        { [DOUBLE_SHOT_ID]: true },
        1_000,
      ),
    ).toBe(false);
    expect(hasBuildingUpgrade({ [DOUBLE_SHOT_ID]: true }, DOUBLE_SHOT_ID)).toBe(
      true,
    );
  });

  it('shows unlocked not-owned building upgrades in the queue', () => {
    expect(visibleBuildingUpgradeQueue({}, {}).map((u) => u.id)).toEqual([]);
    expect(
      visibleBuildingUpgradeQueue({ [ESPRESSO_MACHINE_ID]: 1 }, {}).map(
        (u) => u.id,
      ),
    ).toEqual([DOUBLE_SHOT_ID]);
    expect(
      visibleBuildingUpgradeQueue(
        { [ESPRESSO_MACHINE_ID]: 1 },
        { [DOUBLE_SHOT_ID]: true },
      ),
    ).toEqual([]);
  });
});

describe('rewritesGained', () => {
  it('is 0 below K and 1 at K', () => {
    expect(rewritesGained(REWRITE_K - 1)).toBe(0);
    expect(rewritesGained(REWRITE_K)).toBe(1);
    expect(isRewriteAvailable(REWRITE_K - 1)).toBe(false);
    expect(isRewriteAvailable(REWRITE_K)).toBe(true);
  });

  it('grows with floor(sqrt(earned / K))', () => {
    expect(rewritesGained(REWRITE_K * 4)).toBe(2);
    expect(rewritesGained(REWRITE_K * 9)).toBe(3);
  });

  it('tokensUntilRewrite hits the next whole Rewrite threshold', () => {
    expect(tokensUntilRewrite(0)).toBe(REWRITE_K);
    expect(tokensUntilRewrite(REWRITE_K)).toBe(REWRITE_K * 3);
    expect(tokensUntilRewrite(REWRITE_K - 1)).toBe(1);
  });
});

describe('prestigeTokensPerSecondMult', () => {
  it('starts at 1 and stacks Rewrites + Postmortem', () => {
    expect(prestigeTokensPerSecondMult(0)).toBe(1);
    expect(prestigeTokensPerSecondMult(4)).toBeCloseTo(
      1 + 4 * REWRITE_TPS_BONUS_PER,
    );
    expect(prestigeTokensPerSecondMult(4, { [POSTMORTEM_ID]: 1 })).toBeCloseTo(
      (1 + 4 * REWRITE_TPS_BONUS_PER) * 1.05,
    );
  });
});

describe('clickPower Muscle memory', () => {
  it('stacks permanent click % on top of Ship upgrades', () => {
    expect(clickPower({}, { [MUSCLE_MEMORY_ID]: 1 })).toBeCloseTo(1.1);
    expect(
      clickPower({ [RUBBER_DUCK_ID]: true }, { [MUSCLE_MEMORY_ID]: 2 }),
    ).toBeCloseTo(2 * 1.2);
  });
});

describe('prestige shop helpers', () => {
  it('uses rising Rewrites costs and respects Stub repo max', () => {
    expect(nextPrestigeUpgradeCost(POSTMORTEM_ID, 0)).toBe(1);
    expect(nextPrestigeUpgradeCost(POSTMORTEM_ID, 1)).toBe(2);
    expect(nextPrestigeUpgradeCost(STUB_REPO_ID, 0)).toBe(2);
    expect(canBuyPrestigeUpgrade(STUB_REPO_ID, {}, 2)).toBe(true);
    expect(
      canBuyPrestigeUpgrade(STUB_REPO_ID, { [STUB_REPO_ID]: 1 }, 100),
    ).toBe(false);
  });

  it('ownedAfterRewrite grants Espresso when Stub repo is owned', () => {
    expect(ownedAfterRewrite({})).toEqual({});
    expect(hasStubRepo({ [STUB_REPO_ID]: 1 })).toBe(true);
    expect(ownedAfterRewrite({ [STUB_REPO_ID]: 1 })).toEqual({
      [ESPRESSO_MACHINE_ID]: 1,
    });
  });
});

describe('tokensFromDelta', () => {
  it('accrues tps * seconds', () => {
    expect(tokensFromDelta(0.1, 1000)).toBeCloseTo(0.1);
    expect(tokensFromDelta(0.1, 10_000)).toBeCloseTo(1);
    expect(tokensFromDelta(1, 500)).toBeCloseTo(0.5);
  });

  it('returns 0 for non-positive delta or rate', () => {
    expect(tokensFromDelta(0.1, 0)).toBe(0);
    expect(tokensFromDelta(0.1, -100)).toBe(0);
    expect(tokensFromDelta(0, 1000)).toBe(0);
  });
});
