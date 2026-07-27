import type {
  GameState,
  OwnedAchievements,
  OwnedBuildingUpgrades,
  OwnedPrestigeUpgrades,
  OwnedRooms,
  OwnedShipUpgrades,
  OwnedThemes,
  OwnedUpgrades,
} from '../../game/types';
import type { AchievementId } from '../../data/achievements';
import { achievements } from '../../data/achievements';
import type { BuildingUpgradeId } from '../../data/buildingUpgrades';
import { buildingUpgrades } from '../../data/buildingUpgrades';
import {
  getOfficeThemeByName,
  officeThemes,
  type ThemeId,
} from '../../data/officeThemes';
import type { PrestigeUpgradeId } from '../../data/prestigeUpgrades';
import { prestigeUpgrades } from '../../data/prestigeUpgrades';
import { getRoomByName, rooms, type RoomId } from '../../data/rooms';
import type { ShipUpgradeId } from '../../data/shipUpgrades';
import { shipUpgrades } from '../../data/shipUpgrades';
import type { UpgradeId } from '../../data/upgrades';
import { upgrades } from '../../data/upgrades';
import { ensureOfficeUnlocked, resolveActiveRoom } from '../../game/rooms';
import { ensureDefaultThemeOwned, resolveActiveTheme } from '../../game/themes';

const knownUpgradeIds = new Set<string>(upgrades.map((u) => u.id));
const knownShipUpgradeIds = new Set<string>(shipUpgrades.map((u) => u.id));
const knownBuildingUpgradeIds = new Set<string>(
  buildingUpgrades.map((u) => u.id),
);
const knownPrestigeUpgradeIds = new Set<string>(
  prestigeUpgrades.map((u) => u.id),
);
const knownAchievementIds = new Set<string>(achievements.map((a) => a.name));
const knownRoomIds = new Set<string>(rooms.map((r) => r.name));
const knownThemeIds = new Set<string>(officeThemes.map((t) => t.name));

/**
 * Soft-normalize a game state for play.
 * Soft issues become warnings; never throws for plausibility alone.
 */
export function normalizeGameState(state: GameState): {
  state: GameState;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (state.tokens < 0) {
    warnings.push('tokens is negative; playing anyway');
  }
  if (state.tokensEarnedThisRun < 0) {
    warnings.push('tokensEarnedThisRun is negative; clamped to 0');
  }
  if (state.rewrites < 0) {
    warnings.push('rewrites is negative; clamped to 0');
  }
  if (state.lifetimeTokensEarned < 0) {
    warnings.push('lifetimeTokensEarned is negative; clamped to 0');
  }
  if (state.lifetimeClicks < 0) {
    warnings.push('lifetimeClicks is negative; clamped to 0');
  }
  if (state.lifetimePurchases < 0) {
    warnings.push('lifetimePurchases is negative; clamped to 0');
  }

  const owned: OwnedUpgrades = {};
  for (const [id, count] of Object.entries(state.owned ?? {})) {
    if (typeof count !== 'number' || !Number.isFinite(count)) {
      warnings.push(`owned.${id} is not a finite number; skipped`);
      continue;
    }
    if (count < 0) {
      warnings.push(`owned.${id} is negative; clamped to 0`);
    }
    if (!knownUpgradeIds.has(id)) {
      warnings.push(`unknown upgrade id "${id}"; kept for forward-compat`);
    }
    const safeCount = Math.max(0, Math.floor(count));
    if (safeCount > 0) {
      owned[id as UpgradeId] = safeCount;
    }
  }

  const shipOwned: OwnedShipUpgrades = {};
  const rawShip = state.shipOwned ?? {};
  for (const [id, flag] of Object.entries(rawShip)) {
    if (flag !== true && flag !== 1) {
      warnings.push(`shipOwned.${id} is not owned-true; skipped`);
      continue;
    }
    if (!knownShipUpgradeIds.has(id)) {
      warnings.push(`unknown ship upgrade id "${id}"; kept for forward-compat`);
    }
    shipOwned[id as ShipUpgradeId] = true;
  }

  const buildingOwned: OwnedBuildingUpgrades = {};
  const rawBuilding = state.buildingOwned ?? {};
  for (const [id, flag] of Object.entries(rawBuilding)) {
    if (flag !== true && flag !== 1) {
      warnings.push(`buildingOwned.${id} is not owned-true; skipped`);
      continue;
    }
    if (!knownBuildingUpgradeIds.has(id)) {
      warnings.push(
        `unknown building upgrade id "${id}"; kept for forward-compat`,
      );
    }
    buildingOwned[id as BuildingUpgradeId] = true;
  }

  const prestigeOwned: OwnedPrestigeUpgrades = {};
  const rawPrestige = state.prestigeOwned ?? {};
  for (const [id, count] of Object.entries(rawPrestige)) {
    if (typeof count !== 'number' || !Number.isFinite(count)) {
      warnings.push(`prestigeOwned.${id} is not a finite number; skipped`);
      continue;
    }
    if (count < 0) {
      warnings.push(`prestigeOwned.${id} is negative; clamped to 0`);
    }
    if (!knownPrestigeUpgradeIds.has(id)) {
      warnings.push(
        `unknown prestige upgrade id "${id}"; kept for forward-compat`,
      );
    }
    const safeCount = Math.max(0, Math.floor(count));
    if (safeCount > 0) {
      prestigeOwned[id as PrestigeUpgradeId] = safeCount;
    }
  }

  const achievementsUnlocked: OwnedAchievements = {};
  const rawAchievements = state.achievementsUnlocked ?? {};
  for (const [id, flag] of Object.entries(rawAchievements)) {
    if (flag !== true && flag !== 1) {
      warnings.push(`achievementsUnlocked.${id} is not owned-true; skipped`);
      continue;
    }
    if (!knownAchievementIds.has(id)) {
      warnings.push(`unknown achievement id "${id}"; kept for forward-compat`);
    }
    achievementsUnlocked[id as AchievementId] = true;
  }

  const roomsUnlocked: OwnedRooms = {};
  const rawRooms = state.roomsUnlocked ?? {};
  for (const [id, flag] of Object.entries(rawRooms)) {
    if (flag !== true && flag !== 1) {
      warnings.push(`roomsUnlocked.${id} is not owned-true; skipped`);
      continue;
    }
    if (!knownRoomIds.has(id)) {
      warnings.push(`unknown room id "${id}"; kept for forward-compat`);
    }
    roomsUnlocked[id as RoomId] = true;
  }
  const safeRooms = ensureOfficeUnlocked(roomsUnlocked);
  const activeRoom = resolveActiveRoom(state.activeRoom, safeRooms);
  if (
    state.activeRoom != null &&
    getRoomByName(String(state.activeRoom)) == null
  ) {
    warnings.push(
      `unknown activeRoom "${String(state.activeRoom)}"; fell back to ${activeRoom}`,
    );
  } else if (
    state.activeRoom != null &&
    safeRooms[state.activeRoom as RoomId] !== true
  ) {
    warnings.push(
      `activeRoom "${String(state.activeRoom)}" is locked; fell back to ${activeRoom}`,
    );
  }

  const themesOwned: OwnedThemes = {};
  const rawThemes = state.themesOwned ?? {};
  for (const [id, flag] of Object.entries(rawThemes)) {
    if (flag !== true && flag !== 1) {
      warnings.push(`themesOwned.${id} is not owned-true; skipped`);
      continue;
    }
    if (!knownThemeIds.has(id)) {
      warnings.push(`unknown theme id "${id}"; kept for forward-compat`);
    }
    themesOwned[id as ThemeId] = true;
  }
  const safeThemes = ensureDefaultThemeOwned(themesOwned);
  const activeTheme = resolveActiveTheme(state.activeTheme, safeThemes);
  if (
    state.activeTheme != null &&
    getOfficeThemeByName(String(state.activeTheme)) == null
  ) {
    warnings.push(
      `unknown activeTheme "${String(state.activeTheme)}"; fell back to ${activeTheme}`,
    );
  } else if (
    state.activeTheme != null &&
    safeThemes[state.activeTheme as ThemeId] !== true
  ) {
    warnings.push(
      `activeTheme "${String(state.activeTheme)}" is locked; fell back to ${activeTheme}`,
    );
  }

  return {
    state: {
      tokens: state.tokens,
      owned,
      shipOwned,
      buildingOwned,
      tokensEarnedThisRun: Math.max(0, state.tokensEarnedThisRun ?? 0),
      rewrites: Math.max(0, state.rewrites ?? 0),
      prestigeOwned,
      lifetimeTokensEarned: Math.max(0, state.lifetimeTokensEarned ?? 0),
      lifetimeClicks: Math.max(0, Math.floor(state.lifetimeClicks ?? 0)),
      lifetimePurchases: Math.max(0, Math.floor(state.lifetimePurchases ?? 0)),
      achievementsUnlocked,
      roomsUnlocked: safeRooms,
      activeRoom,
      themesOwned: safeThemes,
      activeTheme,
      lastTickAt: state.lastTickAt,
    },
    warnings,
  };
}
