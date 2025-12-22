import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelProvider } from '../../shared/lib/panels';
import { BrainRoutes } from './BrainRoutes';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderBrain = (entry: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={[entry]}>
            <Routes>
              <Route path="/brain/*" element={<BrainRoutes />} />
            </Routes>
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

describe('Brain module smoke test', () => {
  it('renders the brain overview card', async () => {
    const { container, cleanup } = renderBrain('/brain');

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent ?? '').toMatch(/Word puzzle|Wortpuzzle/i);

    cleanup();
  });

  it('renders the dedicated session target section', async () => {
    const { container, cleanup } = renderBrain('/brain/session/wordpuzzle');

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent ?? '').toMatch(/Target word|Zielwort/i);

    cleanup();
  });
});



