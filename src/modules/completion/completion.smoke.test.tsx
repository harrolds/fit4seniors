import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelProvider } from '../../shared/lib/panels';
import { setValue } from '../../shared/lib/storage';
import { CompletionScreen } from './CompletionScreen';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderCompletion = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={['/completion']}>
            <CompletionScreen />
          </MemoryRouter>
        </PanelProvider>
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

describe('CompletionScreen', () => {
  it('rotates completion message deterministically', async () => {
    setValue<number>('completion:last-index', 0);
    const { container, cleanup } = renderCompletion();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toContain('Nice work—stay in the flow.');

    cleanup();
  });
});
