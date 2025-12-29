import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { DedicatedSessionScreen } from './screens/DedicatedSessionScreen';
import { hashSeed, mulberry32 } from './session/seed';
import { pickUniqueRoundIndices } from './session/pickUnique';
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

    // Recompute the deterministic target word and shuffled grid to click the correct letters
    const targetMask = container.querySelector('.brain-session__target')?.textContent ?? '';
    const maskedLength = (targetMask.match(/_/g) ?? []).length;

    const WORDS_DE = ['KAFFEE', 'BANANE', 'APFEL', 'BLUME', 'WASSER', 'FAMILIE', 'REISE', 'MUSIK', 'GARTEN', 'SONNE', 'HERZ', 'KÜCHE'];
    const WORDS_EN = ['COFFEE', 'BANANA', 'APPLE', 'FLOWER', 'WATER', 'FAMILY', 'TRAVEL', 'MUSIC', 'GARDEN', 'SUNNY', 'HEART', 'KITCHEN'];

    const gridLetters = buttons.map((btn) => btn.textContent ?? '');

    const fitsGrid = (word: string): boolean => {
      if (maskedLength > 0 && word.length !== maskedLength) return false;
      const counts = new Map<string, number>();
      gridLetters.forEach((ch) => counts.set(ch, (counts.get(ch) ?? 0) + 1));
      for (const ch of word) {
        const remaining = counts.get(ch) ?? 0;
        if (remaining <= 0) return false;
        counts.set(ch, remaining - 1);
      }
      return true;
    };

    const targetWord = [...WORDS_DE, ...WORDS_EN].find(fitsGrid) ?? WORDS_DE[0];

    const letterGrid = gridLetters;
    const selectionIndices: number[] = [];
    const used = new Set<number>();
    for (const char of targetWord) {
      const idx = letterGrid.findIndex((c, i) => c === char && !used.has(i));
      if (idx >= 0) {
        selectionIndices.push(idx);
        used.add(idx);
      }
    }

    vi.setSystemTime(new Date('2024-01-01T00:00:05Z'));

    act(() => {
      selectionIndices.forEach((idx) => {
        buttons[idx]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      vi.advanceTimersByTime(2000);
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



