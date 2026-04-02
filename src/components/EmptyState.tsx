interface EmptyStateProps {
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__eyebrow">No data to show</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="empty-state__actions">
        {primaryActionLabel && onPrimaryAction ? (
          <button
            type="button"
            className="button button--primary"
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </button>
        ) : null}
        {secondaryActionLabel && onSecondaryAction ? (
          <button
            type="button"
            className="button button--ghost"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
