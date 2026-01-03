import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelProvider, usePanels } from '../../shared/lib/panels';
import { PanelHost } from '../../core/panels/PanelHost';
import { MoreRoutes } from './MoreRoutes';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderMore = (initialPath: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    const PanelOutlet: React.FC = () => {
      const { state, closePanel } = usePanels();
      return <PanelHost state={state} onClose={closePanel} />;
    };

    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route path="/more/*" element={<MoreRoutes />} />
            </Routes>
          </MemoryRouter>
          <PanelOutlet />
        </PanelProvider>
      </I18nProvider>,
    );
  });

  const cleanup = () => {
    act(() => root.unmount());
    container.remove();
  };

  return { container, cleanup };
};

describe('More module smoke test', () => {
  it('renders the more hub items', async () => {
    const { container, cleanup } = renderMore('/more');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Hilfe|Help/i);
    expect(container.textContent).toMatch(/Datenschutz|Privacy/i);

    cleanup();
  });

  it('opens right panel from help item', async () => {
    const { container, cleanup } = renderMore('/more');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const helpButton = buttons.find((btn) => btn.textContent?.match(/Hilfe|Help/i));
    expect(helpButton).toBeTruthy();

    await act(async () => {
      helpButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Info|Information/i);
    expect(container.textContent).toMatch(/Erste Schritte|Getting started/i);

    cleanup();
  });
});

