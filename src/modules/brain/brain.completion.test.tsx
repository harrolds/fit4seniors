import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { DedicatedSessionScreen } from './screens/DedicatedSessionScreen';
import { I18nProvider } from '../../shared/lib/i18n';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ exerciseId: 'wordpuzzle' }),
    useNavigate: () => navigateMock,
  };
});

describe('Brain session completion payload', () => {
  it('sends durationSec > 0 on success', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <I18nProvider>
          <MemoryRouter initialEntries={['/brain/session/wordpuzzle']}>
            <DedicatedSessionScreen />
          </MemoryRouter>
        </I18nProvider>,
      );
    });

    const buttons = Array.from(container.querySelectorAll('.brain-grid__cell'));
    expect(buttons.length).toBeGreaterThanOrEqual(6);

    vi.setSystemTime(new Date('2024-01-01T00:00:05Z'));

    act(() => {
      buttons.slice(0, 6).forEach((btn) => btn.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    });

    const finishButton = container.querySelector('.brain-session__success button');
    expect(finishButton).toBeTruthy();

    act(() => {
      finishButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const call = navigateMock.mock.calls.find((c) => c[0] === '/completion');
    expect(call).toBeTruthy();
    const state = call?.[1]?.state as { durationSec?: number } | undefined;
    expect(state?.durationSec).toBeGreaterThan(0);

    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });
});

