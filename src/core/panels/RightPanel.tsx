import React from 'react';
import type { PanelContainerProps } from './PanelHost';

export const RightPanel: React.FC<PanelContainerProps> = ({ isOpen, onClose: _onClose, children, panelId }) => {
  return (
    <aside
      className={`panel-surface panel-surface--right ${isOpen ? 'panel-surface--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Right panel"
      data-panel-id={panelId ?? undefined}
    >
      <div className="panel-surface__body">{children}</div>
    </aside>
  );
};

