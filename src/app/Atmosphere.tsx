/**
 * Soft animated backdrop blobs behind the play shell.
 * Static under prefers-reduced-motion (CSS).
 */
export function Atmosphere() {
  return (
    <div className="ship-atmosphere" aria-hidden>
      <span className="ship-atmosphere-blob ship-atmosphere-blob-a" />
      <span className="ship-atmosphere-blob ship-atmosphere-blob-b" />
      <span className="ship-atmosphere-blob ship-atmosphere-blob-c" />
    </div>
  );
}
