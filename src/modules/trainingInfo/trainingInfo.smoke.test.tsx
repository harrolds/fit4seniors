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

    // Allow any catalog/data hook to resolve and render once.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Assert only on section labels that are always rendered for a found training.
    // Do NOT assert on the panel title (can be dynamic training title).
    expect(container.textContent).toContain('About this training');
    expect(container.textContent).toContain('How it works');
    expect(container.textContent).toContain('Intensity');
    expect(container.textContent).toContain('Duration');
    expect(container.textContent).toContain('Pace cue');

    // Optional: stable training title based on provided ids (keep, but not required for “smoke”).
    expect(container.textContent).toContain('March in Place');

    cleanup();
  });
});
