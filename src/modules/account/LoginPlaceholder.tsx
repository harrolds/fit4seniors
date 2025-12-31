import React from 'react';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';

export const LoginPlaceholder: React.FC = () => {
  const { goBack } = useNavigation();
  return (
    <div className="page">
      <h1>Login</h1>
      <p>Login & Registrierung folgen in einer späteren Version.</p>
      <Button type="button" onClick={goBack}>
        Zurück
      </Button>
    </div>
  );
};

