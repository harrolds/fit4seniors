import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelHost } from '../../core/panels/PanelHost';
import { PanelProvider, usePanels } from '../../shared/lib/panels';
import { SettingsRoutes } from './SettingsRoutes';
import { applySettingsToDocument, ensureSettingsHydrated } from './settingsStorage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderSettings = (initialPath: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    applySettingsToDocument(ensureSettingsHydrated());
    const PanelOutlet: React.FC = () => {
      const { state, closePanel } = usePanels();
      return <PanelHost state={state} onClose={closePanel} />;
    };

    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route path="/settings/*" element={<SettingsRoutes />} />
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

describe('Settings module smoke test', () => {
  it('renders settings overview', async () => {
    const { container, cleanup } = renderSettings('/settings');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Textgr|Text size/i);

    cleanup();
  });

  it('opens bottom toast for text & contrast', async () => {
    const { container, cleanup } = renderSettings('/settings');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const textButton = buttons.find((btn) => btn.textContent?.match(/Textgröße|Text size/i));
    expect(textButton).toBeTruthy();

    await act(async () => {
      textButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Kontrast|Contrast/i);

    cleanup();
  });

  it('opens bottom toast for sound', async () => {
    const { container, cleanup } = renderSettings('/settings');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const soundButton = buttons.find((btn) => btn.textContent?.match(/Ton|Sound/i));
    expect(soundButton).toBeTruthy();

    await act(async () => {
      soundButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Vibration|Volume/i);

    cleanup();
  });

  it('opens bottom toast for language', async () => {
    const { container, cleanup } = renderSettings('/settings');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const languageButton = buttons.find((btn) => btn.textContent?.match(/Sprache|Language/i));
    expect(languageButton).toBeTruthy();

    await act(async () => {
      languageButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Deutsch|English/i);

    cleanup();
  });
});


