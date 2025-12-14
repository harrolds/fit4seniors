import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelProvider } from '../../shared/lib/panels';
import { setItems } from '../../shared/lib/storage';
import { ProgressRoutes } from './ProgressRoutes';
import { PROGRESS_STORAGE_KEY, type CompletedSessionRecord } from './progressStorage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderProgress = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={['/progress']}>
            <Routes>
              <Route path="/progress/*" element={<ProgressRoutes />} />
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

describe('Progress module smoke test', () => {
  it('renders progress overview with stored session data', async () => {
    const mockSession: CompletedSessionRecord = {
      id: 'demo-1',
      completedAt: Date.now(),
      moduleId: 'cardio',
      trainingId: 'morning-walk',
      trainingTitle: 'Morning Walk',
      intensity: 'light',
      durationMinPlanned: 20,
      durationSecActual: 1200,
      paceCue: 'Stay steady',
      stepsSummary: 'Warm up • Walk • Cool down',
    };

    setItems(PROGRESS_STORAGE_KEY, [mockSession]);

    const { container, cleanup } = renderProgress();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toContain('Activity this week');

    cleanup();
  });
});
