import { useId, useRef, useState } from 'react';
import { selectPersistedState, useGameStore } from '../../game/state';
import { exportSaveBlob, parseSaveBlob } from './codec';
import { writeSaveToStorage } from './storage';

const EXPORT_FILENAME = 'ship-it-save.txt';

/**
 * Export (download) + import (file or paste) for the single save slot.
 */
export function SaveControls() {
  const pasteId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [paste, setPaste] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const hydrateFromSave = useGameStore((s) => s.hydrateFromSave);

  async function handleExport() {
    setBusy(true);
    setMessage(null);
    try {
      const blob = await exportSaveBlob(
        selectPersistedState(useGameStore.getState()),
      );
      const url = URL.createObjectURL(
        new Blob([blob], { type: 'text/plain;charset=utf-8' }),
      );
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = EXPORT_FILENAME;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage('Save downloaded.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setBusy(false);
    }
  }

  async function applyImportBlob(raw: string) {
    setBusy(true);
    setMessage(null);
    try {
      const outcome = await parseSaveBlob(raw);
      if (!outcome.ok) {
        setMessage(outcome.error);
        return;
      }
      const { result } = outcome;
      hydrateFromSave(result.file.state, {
        untrusted: !result.checksumOk,
        nowMs: Date.now(),
      });
      if (typeof localStorage !== 'undefined') {
        await writeSaveToStorage(result.file.state, localStorage);
      }
      setPaste('');
      setMessage(
        result.checksumOk
          ? 'Save imported.'
          : 'Save imported with integrity warning.',
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    await applyImportBlob(text);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  return (
    <section
      className="w-full max-w-md rounded-xl border border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-4 py-3 text-left shadow-[0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]"
      aria-label="Export and import"
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          className="rounded-lg bg-[var(--ship-accent)] px-3 py-2 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)] disabled:opacity-60"
          onClick={() => void handleExport()}
        >
          Export
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-lg border border-[var(--ship-line)] bg-[var(--ship-bg-elevated)] px-3 py-2 text-sm font-semibold text-[var(--ship-ink)] hover:bg-[color-mix(in_srgb,var(--ship-bg-elevated)_70%,var(--ship-bg))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)] disabled:opacity-60"
          onClick={() => fileRef.current?.click()}
        >
          Import file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,text/plain"
          className="sr-only"
          aria-label="Import save file"
          onChange={(e) => void handleFileChange(e.target.files)}
        />
      </div>

      <label
        htmlFor={pasteId}
        className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--ship-muted)]"
      >
        Or paste save
      </label>
      <textarea
        id={pasteId}
        value={paste}
        rows={3}
        spellCheck={false}
        className="mt-1 w-full resize-y rounded-lg border border-[var(--ship-line)] bg-[var(--ship-bg-elevated)] px-3 py-2 font-mono text-xs text-[var(--ship-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
        placeholder="Paste base64 save blob…"
        onChange={(e) => setPaste(e.target.value)}
      />
      <button
        type="button"
        disabled={busy || paste.trim() === ''}
        className="mt-2 rounded-lg border border-[var(--ship-line)] bg-[var(--ship-bg-elevated)] px-3 py-2 text-sm font-semibold text-[var(--ship-ink)] hover:bg-[color-mix(in_srgb,var(--ship-bg-elevated)_70%,var(--ship-bg))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => void applyImportBlob(paste)}
      >
        Import paste
      </button>

      {message ? (
        <p className="mt-2 text-sm text-[var(--ship-muted)]" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
