import { describe, it, expect } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '../../shared/lib/i18n';
import { TrainingInfoPanelContent } from './TrainingInfoPanelContent';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderPanel = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  act(() => {
    root.render(
      <I18nProvider>
        <TrainingInfoPanelContent moduleId="cardio" trainingId="cardio_march_01" intensity="light" />
      </I18nProvider>,
    );
  });

  const cleanup = () => {
    act(() => {
      root.unmount();
    });
    container.remove();
  };

  return { container, cleanup };
};

describe('TrainingInfoPanelContent', () => {
  it('renders base training info without crashing', async () => {
    const { container, cleanup } = renderPanel();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toContain('Training');
    expect(container.textContent).toContain('Training information');
    expect(container.textContent).toContain('March in Place');
    expect(container.textContent).toContain('About this training');
    cleanup();
  });
});


