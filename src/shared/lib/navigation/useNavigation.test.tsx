import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { I18nProvider } from '../i18n';
import { useNavigation } from './useNavigation';
import { PanelProvider } from '../panels';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const NavigationHarness: React.FC = () => {
  const { goBack } = useNavigation();
  const location = useLocation();

  return (
    <div>
      <span data-testid="path">{location.pathname}</span>
      <button type="button" onClick={() => goBack()}>
        back
      </button>
    </div>
  );
};

const renderWithHistory = (entries: string[], index = entries.length - 1) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={entries} initialIndex={index}>
            <NavigationHarness />
          </MemoryRouter>
        </PanelProvider>
      </I18nProvider>,
    );
  });

  const cleanup = () => {
    act(() => root.unmount());
    container.remove();
  };

  const clickBack = async () => {
    const button = container.querySelector('button');
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  const currentPath = () => container.querySelector('[data-testid="path"]')?.textContent;

  return { cleanup, clickBack, currentPath };
};

describe('useNavigation goBack behavior', () => {
  it('navigates back when history is available', async () => {
    const { cleanup, clickBack, currentPath } = renderWithHistory(['/', '/settings'], 1);

    expect(currentPath()).toBe('/settings');
    await clickBack();
    expect(currentPath()).toBe('/');

    cleanup();
  });

  it('falls back to /settings when starting on settings without history', async () => {
    const { cleanup, clickBack, currentPath } = renderWithHistory(['/settings'], 0);

    expect(currentPath()).toBe('/settings');
    await clickBack();
    expect(currentPath()).toBe('/settings');

    cleanup();
  });

  it('falls back to /more when starting on /more without history', async () => {
    const { cleanup, clickBack, currentPath } = renderWithHistory(['/more'], 0);

    expect(currentPath()).toBe('/more');
    await clickBack();
    expect(currentPath()).toBe('/more');

    cleanup();
  });

  it('falls back to home for other routes without history', async () => {
    const { cleanup, clickBack, currentPath } = renderWithHistory(['/profile'], 0);

    expect(currentPath()).toBe('/profile');
    await clickBack();
    expect(currentPath()).toBe('/');

    cleanup();
  });
});

