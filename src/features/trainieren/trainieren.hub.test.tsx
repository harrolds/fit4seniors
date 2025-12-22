import React, { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { TrainierenHub } from './TrainierenHub';

const goToMock = vi.fn();

vi.mock('../../shared/lib/navigation/useNavigation', () => ({
  useNavigation: () => ({ goTo: goToMock }),
}));

vi.mock('../../shared/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'de' }),
}));

vi.mock('./catalog', () => ({
  useTrainingCatalog: () => ({
    data: {
      modules: [
        { id: 'brain', title: 'Gehirntraining', description: 'Brain desc', tone: 'module-4', icon: 'psychology' },
      ],
    },
    isLoading: false,
    error: null,
  }),
  toneToCssVar: () => 'var(--color-card-module-4)',
}));

describe('TrainierenHub brain navigation', () => {
  it('navigates to /brain for brain module', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(<TrainierenHub />);
    });

    const tile = container.querySelector('.trainieren-module-card') as HTMLDivElement | null;
    expect(tile).toBeTruthy();

    act(() => {
      tile?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(goToMock).toHaveBeenCalledWith('/brain');

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});



