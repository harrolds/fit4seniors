import React from 'react';
import type { PanelContainerProps } from './PanelHost';

export const LeftPanel: React.FC<PanelContainerProps> = ({ isOpen, onClose, children, panelId }) => {
  return (
    <aside
      className={`panel-surface panel-surface--left ${isOpen ? 'panel-surface--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Left panel"
      data-panel-id={panelId ?? undefined}
    >
      <div className="panel-surface__header">
        <button type="button" className="panel-close-button" aria-label="Close panel" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="panel-surface__body">{children}</div>
    </aside>
  );
};

