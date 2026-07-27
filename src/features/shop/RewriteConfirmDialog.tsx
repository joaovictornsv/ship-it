import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { RewritesShop } from './RewritesShop';

type RewriteConfirmDialogProps = {
  onClose: () => void;
  tokensLost: number;
  rewritesGained: number;
  nextRewrites: number;
  nextTpsMult: number;
};

type FlowStep = 'confirm' | 'shop';

/**
 * Rewrite flow: confirm soft reset, then Rewrites shop (#49).
 * Dialog pattern mirrors ShopDrawer (Escape / backdrop / focus restore).
 */
export function RewriteConfirmDialog({
  onClose,
  tokensLost,
  rewritesGained: gained,
  nextRewrites,
  nextTpsMult,
}: RewriteConfirmDialogProps) {
  const rewrite = useGameStore((s) => s.rewrite);
  const [step, setStep] = useState<FlowStep>('confirm');
  const titleId = useId();
  const shopHeadingId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (step === 'confirm') {
      cancelRef.current?.focus();
    } else {
      doneRef.current?.focus();
    }
  }, [step]);

  function confirm() {
    rewrite();
    setStep('shop');
  }

  const isShop = step === 'shop';

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ship-ink)_40%,transparent)]"
        aria-label={isShop ? 'Close Rewrites shop' : 'Cancel Rewrite'}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'absolute left-1/2 top-1/2 max-h-[min(90dvh,40rem)] -translate-x-1/2 -translate-y-1/2',
          'flex flex-col overflow-hidden rounded-2xl border border-[var(--ship-line)] bg-[var(--ship-bg-elevated)]',
          'shadow-[0_12px_40px_color-mix(in_srgb,var(--ship-ink)_18%,transparent)]',
          isShop ? 'w-[min(100%-2rem,24rem)]' : 'w-[min(100%-2rem,22rem)]',
        ].join(' ')}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 p-4 pb-0">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-base font-semibold tracking-tight text-[var(--ship-ink)]"
            >
              {isShop ? 'Spend your Rewrites' : 'Rewrite the whole thing?'}
            </h2>
            <p className="mt-1 text-xs text-[var(--ship-muted)]">
              {isShop
                ? 'Permanent power for the next run. Spend now, or wait for the next Rewrite.'
                : "Soft reset — keep Rewrites power and unlocked rooms, lose this run's grind."}
            </p>
          </div>
          <button
            type="button"
            className={[
              'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
              'border border-[var(--ship-line)] text-[var(--ship-ink)]',
              'hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
            ].join(' ')}
            aria-label={isShop ? 'Close Rewrites shop' : 'Cancel Rewrite'}
            onClick={onClose}
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </div>

        {isShop ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <RewritesShop headingId={shopHeadingId} />
          </div>
        ) : (
          <ul className="mt-4 list-none space-y-2 px-4 p-0 text-sm text-[var(--ship-ink)]">
            <li className="flex justify-between gap-3 tabular-nums">
              <span className="text-[var(--ship-muted)]">Tokens lost</span>
              <span className="font-semibold text-[var(--ship-token)]">
                {formatTokensCompact(tokensLost)}
              </span>
            </li>
            <li className="flex justify-between gap-3 tabular-nums">
              <span className="text-[var(--ship-muted)]">Rewrites gained</span>
              <span className="font-semibold text-[var(--ship-rewrite)]">
                +{formatTokensCompact(gained)}
              </span>
            </li>
            <li className="flex justify-between gap-3 tabular-nums">
              <span className="text-[var(--ship-muted)]">Rewrites bank</span>
              <span className="font-semibold">
                {formatTokensCompact(nextRewrites)}
              </span>
            </li>
            <li className="flex justify-between gap-3 tabular-nums">
              <span className="text-[var(--ship-muted)]">
                New tokens/s power
              </span>
              <span className="font-semibold">×{nextTpsMult.toFixed(2)}</span>
            </li>
          </ul>
        )}

        <div className="flex shrink-0 gap-2 border-t border-[var(--ship-line)] p-4">
          {isShop ? (
            <button
              ref={doneRef}
              type="button"
              className={[
                'flex-1 rounded-lg bg-[var(--ship-accent)] px-3 py-2',
                'text-sm font-semibold text-white hover:brightness-110',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
              ].join(' ')}
              onClick={onClose}
            >
              Continue
            </button>
          ) : (
            <>
              <button
                ref={cancelRef}
                type="button"
                className={[
                  'flex-1 rounded-lg border border-[var(--ship-line)] px-3 py-2',
                  'text-sm font-semibold text-[var(--ship-ink)]',
                  'hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
                ].join(' ')}
                onClick={onClose}
              >
                Keep grinding
              </button>
              <button
                type="button"
                className={[
                  'flex-1 rounded-lg bg-[var(--ship-accent)] px-3 py-2',
                  'text-sm font-semibold text-white hover:brightness-110',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
                ].join(' ')}
                onClick={confirm}
              >
                Rewrite
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
