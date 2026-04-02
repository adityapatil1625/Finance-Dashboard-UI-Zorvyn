interface LoadingPanelProps {
  title: string;
  description: string;
}

export function LoadingPanel({ title, description }: LoadingPanelProps) {
  return (
    <section className="panel loading-panel" aria-live="polite">
      <div className="loading-panel__spinner" aria-hidden="true" />
      <div>
        <p className="section-kicker">Mock API</p>
        <h2>{title}</h2>
        <p className="panel__meta">{description}</p>
      </div>
    </section>
  );
}
