import { useState } from 'react';
import {
  type BuyModeName,
  DEFAULT_BUY_MODE,
  readBuyModeFromSession,
  writeBuyModeToSession,
} from './buyMode';

/** Session-backed shop buy mode shared by rail and drawer mounts. */
export function useBuyMode(): [BuyModeName, (mode: BuyModeName) => void] {
  const [mode, setModeState] = useState<BuyModeName>(() =>
    typeof window === 'undefined' ? DEFAULT_BUY_MODE : readBuyModeFromSession(),
  );

  function setMode(next: BuyModeName) {
    setModeState(next);
    writeBuyModeToSession(next);
  }

  return [mode, setMode];
}
