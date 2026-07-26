/** Tiny pub/sub so production ticks can pulse the HUD without store churn. */

type Listener = () => void;

const listeners = new Set<Listener>();

export function notifyProductionTick(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeProductionTick(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
