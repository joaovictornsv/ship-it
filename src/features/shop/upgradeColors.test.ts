import { describe, expect, it } from 'vitest';
import { CI_CD_ID, DEV_ID, ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import { upgradeColorVar, upgradeIconColorVar } from './upgradeColors';

describe('upgradeColors', () => {
  it('maps upgrade ids to CSS color vars', () => {
    expect(upgradeColorVar(ESPRESSO_MACHINE_ID)).toBe(
      '--ship-upgrade-espresso',
    );
    expect(upgradeColorVar(DEV_ID)).toBe('--ship-upgrade-dev');
    expect(upgradeColorVar(CI_CD_ID)).toBe('--ship-upgrade-ci-cd');
  });

  it('maps icon ids consistently with upgrade ids', () => {
    expect(upgradeIconColorVar('coffee')).toBe('--ship-upgrade-espresso');
    expect(upgradeIconColorVar('dev')).toBe('--ship-upgrade-dev');
    expect(upgradeIconColorVar('on-call')).toBe('--ship-upgrade-on-call');
  });
});
