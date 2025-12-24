import React from 'react';
import '../../../shared/panels/bottom-sheet.css';
import './bottomToast.css';
import { BottomToastTextContrast } from './BottomToastTextContrast';
import { BottomToastSprache } from './BottomToastSprache';
import { BottomToastTonFeedback } from './BottomToastTonFeedback';

export type SettingsToastKind = 'text' | 'sound' | 'language';

export const SETTINGS_BOTTOM_TOAST_ID = 'settings-bottom-toast';

type SettingsBottomToastHostProps = {
  activeToast?: SettingsToastKind;
  onClose: () => void;
};

export const SettingsBottomToastHost: React.FC<SettingsBottomToastHostProps> = ({ activeToast = 'text', onClose }) => {
  switch (activeToast) {
    case 'text':
      return <BottomToastTextContrast onClose={onClose} />;
    case 'sound':
      return <BottomToastTonFeedback onClose={onClose} />;
    case 'language':
      return <BottomToastSprache onClose={onClose} />;
    default:
      return <BottomToastTextContrast onClose={onClose} />;
  }
};

