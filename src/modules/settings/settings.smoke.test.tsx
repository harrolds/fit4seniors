import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelProvider } from '../../shared/lib/panels';
import { SettingsRoutes } from './SettingsRoutes';
import { applySettingsToDocument, ensureSettingsHydrated } from './settingsStorage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderSettings = (initialPath: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    applySettingsToDocument(ensureSettingsHydrated());
    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route path="/settings/*" element={<SettingsRoutes />} />
            </Routes>
          </MemoryRouter>
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

describe('Settings module smoke test', () => {
  it('renders settings overview', async () => {
    const { container, cleanup } = renderSettings('/settings');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Textgr|Text size/i);

    cleanup();
  });

  it('renders accessibility detail', async () => {
    const { container, cleanup } = renderSettings('/settings/accessibility');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Textgröße|Adjust text size/i);

    cleanup();
  });

  it('renders info & help', async () => {
    const { container, cleanup } = renderSettings('/settings/help');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Info|Hilfe/i);

    cleanup();
  });
});

