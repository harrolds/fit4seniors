import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '../../shared/lib/i18n';
import { PanelProvider } from '../../shared/lib/panels';
import { setItems } from '../../shared/lib/storage';
import { ProgressRoutes } from './ProgressRoutes';
import { PROGRESS_STORAGE_KEY, type CompletedSessionRecord } from './progressStorage';

const renderProgress = (entry: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <I18nProvider>
        <PanelProvider>
          <MemoryRouter initialEntries={[entry]}>
            <Routes>
              <Route path="/progress/*" element={<ProgressRoutes />} />
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

describe('Progress brain integration', () => {
  it('shows brain entry in history with duration and badge', async () => {
    const session: CompletedSessionRecord = {
      id: 'brain-1',
      completedAt: Date.now(),
      moduleId: 'brain',
      trainingId: 'wordpuzzle',
      trainingTitle: 'Wortpuzzle',
      durationSecActual: 90,
      durationMinPlanned: 0,
      completed: true,
    };
    setItems(PROGRESS_STORAGE_KEY, [session]);

    const { container, cleanup } = renderProgress('/progress/history');

    await act(async () => Promise.resolve());

    expect(container.textContent).toMatch(/Brain Training|Gehirntraining/);
    expect(container.textContent).toContain('01:30');

    cleanup();
  });

  it('counts brain sessions in active days and brain card', async () => {
    const session: CompletedSessionRecord = {
      id: 'brain-2',
      completedAt: Date.now(),
      moduleId: 'brain',
      trainingId: 'wordpuzzle',
      trainingTitle: 'Wortpuzzle',
      durationSecActual: 120,
      durationMinPlanned: 0,
      completed: true,
    };
    setItems(PROGRESS_STORAGE_KEY, [session]);

    const { container, cleanup } = renderProgress('/progress');

    await act(async () => Promise.resolve());

    expect(container.textContent).toContain('1/7');
    expect(container.textContent).toMatch(/Sessions this week: 1|Einheiten diese Woche: 1/);

    cleanup();
  });
});



