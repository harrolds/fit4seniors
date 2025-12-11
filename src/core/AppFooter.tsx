import React from 'react';
import { useLocation } from 'react-router-dom';
import { footerMenu } from '../config/appConfig';
import { useNavigation } from '../shared/lib/navigation/useNavigation';
import { useI18n } from '../shared/lib/i18n';
import { Button } from '../shared/ui/Button';
import { useTheme } from './theme/ThemeProvider';

export const AppFooter: React.FC = () => {
  const location = useLocation();
  const { goTo } = useNavigation();
  const { t } = useI18n();
  const { components } = useTheme();
  const navTokens = components.navBar;

  const getIconSymbol = (icon: string): string => {
    switch (icon) {
      case 'home':
        return '🏠';
      case 'notes':
        return '📝';
      case 'notifications':
        return '🔔';
      case 'settings':
        return '⚙️';
      default:
        return '•';
    }
  };

  return (
    <footer
      className="app-shell__footer"
      aria-label={t('app.footer.navigation')}
      style={{
        backgroundColor: navTokens.background,
        borderTop: `1px solid ${navTokens.border}`,
        color: navTokens.text,
      }}
    >
      <nav className="app-shell__footer-nav">
        {footerMenu.map((item) => {
          const isActive = location.pathname === item.route;

          return (
            <Button
              key={item.id}
              type="button"
              variant={isActive ? 'secondary' : 'ghost'}
              className="app-shell__footer-nav-item"
              aria-current={isActive ? 'page' : undefined}
              aria-label={t(item.labelKey)}
              onClick={() => goTo(item.route)}
            >
              <span
                className="app-shell__footer-nav-icon"
                aria-hidden="true"
                style={{ color: isActive ? navTokens.active : navTokens.text }}
              >
                {getIconSymbol(item.icon)}
              </span>
            </Button>
          );
        })}
      </nav>
    </footer>
  );
};
