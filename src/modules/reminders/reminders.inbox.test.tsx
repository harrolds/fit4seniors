import { describe, expect, it, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '../../shared/lib/i18n';
import { NotificationsProvider } from '../../shared/lib/notifications';
import { PanelProvider } from '../../shared/lib/panels';
import {
  addReminderNotification,
  clearReminderNotifications,
  createReminderNotification,
  markNotificationRead,
  useReminderInbox,
} from './remindersStorage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CounterProbe: React.FC<{ onRender?: (count: number) => void }> = ({ onRender }) => {
  const { unreadCount } = useReminderInbox();
  onRender?.(unreadCount);
  return <span data-testid="count">{unreadCount}</span>;
};

describe('Reminders inbox store', () => {
  beforeEach(() => {
    clearReminderNotifications();
  });

  it('tracks unread count and marks items as read', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const renderLog: number[] = [];

    act(() => {
      root.render(
        <I18nProvider>
          <NotificationsProvider>
            <PanelProvider>
              <CounterProbe onRender={(value) => renderLog.push(value)} />
            </PanelProvider>
          </NotificationsProvider>
        </I18nProvider>,
      );
    });

    const notification = createReminderNotification({
      title: 'Test',
      body: 'Body',
    });

    act(() => {
      addReminderNotification(notification);
    });

    expect(container.querySelector('[data-testid="count"]')?.textContent).toBe('1');

    act(() => {
      markNotificationRead(notification.id);
    });

    expect(container.querySelector('[data-testid="count"]')?.textContent).toBe('0');
    expect(renderLog.some((value) => value === 1)).toBe(true);

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
