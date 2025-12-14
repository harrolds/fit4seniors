import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { NotificationsProvider } from '../../shared/lib/notifications';
import { PanelProvider } from '../../shared/lib/panels';
import { ProfileRoutes } from './ProfileRoutes';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Profile module smoke test', () => {
  it('renders profile overview screen', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <I18nProvider>
          <NotificationsProvider>
            <PanelProvider>
              <MemoryRouter initialEntries={['/profile']}>
                <Routes>
                  <Route path="/profile/*" element={<ProfileRoutes />} />
                </Routes>
              </MemoryRouter>
            </PanelProvider>
          </NotificationsProvider>
        </I18nProvider>,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toMatch(/Movement goals|Bewegungsziele/);

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
