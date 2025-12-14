import React from 'react';
import { useLocation } from 'react-router-dom';
import { footerMenu, type FooterMenuItem } from '../config/appConfig';
import { useNavigation } from '../shared/lib/navigation/useNavigation';
import { useI18n } from '../shared/lib/i18n';
import { useTheme } from './theme/themeContext';
import { Icon } from '../shared/ui/Icon';
import { useNotifications } from '../shared/lib/notifications';

export const AppFooter: React.FC = () => {
  const location = useLocation();
  const { goTo } = useNavigation();
  const { t } = useI18n();
  const { components } = useTheme();
  const { showToast } = useNotifications();
  const navTokens = components.navBar;

  const handleNavClick = (item: FooterMenuItem) => {
    if (item.available !== false) {
      goTo(item.route);
      return;
    }

    showToast('nav.comingSoon');
    goTo(item.fallbackRoute ?? '/');
  };

  const isActivePath = (item: FooterMenuItem): boolean => {
    if (item.route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(item.route);
  };

  return (
    <footer
      className="app-shell__footer"
      aria-label={t('app.footer.navigation')}
      style={{
        backgroundColor: navTokens.background,
        borderTop: `1px solid ${navTokens.border}`,
        color: navTokens.text,
        boxShadow: 'var(--shadow-footer)',
      }}
    >
      <nav className="app-shell__footer-nav">
        {footerMenu.map((item) => {
          const isActive = isActivePath(item);

          return (
            <button
              key={item.id}
              type="button"
              className={`app-shell__footer-nav-item${isActive ? ' app-shell__footer-nav-item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t(item.labelKey)}
              onClick={() => handleNavClick(item)}
            >
              <Icon
                name={item.icon}
                filled={isActive}
                size={26}
                className="app-shell__footer-nav-icon"
              />
              <span className="app-shell__footer-nav-label">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};
