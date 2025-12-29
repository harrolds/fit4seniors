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
        {
          id: 'cardio',
          title: 'Cardio',
          description: 'Cardio desc',
          tone: 'module-1',
          icon: 'monitor_heart',
          categoryId: 'cardio',
        },
      ],
    },
    isLoading: false,
    error: null,
  }),
  toneToCssVar: () => 'var(--color-card-module-1)',
}));

describe('TrainierenHub navigation', () => {
  it('navigates to module detail for training modules', () => {
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

    expect(goToMock).toHaveBeenCalledWith('/trainieren/cardio');

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});




