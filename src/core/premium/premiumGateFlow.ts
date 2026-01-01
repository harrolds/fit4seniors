import { canStartTraining, type AccessDecision } from '../access/accessPolicy';
import { getSession, setSession } from '../user/userStore';

type StartableTraining = {
  id: string;
  requiresPremium: boolean;
  title?: string;
  moduleId?: string;
  categoryId?: string;
};

type PendingIntent = { type: 'start_training'; trainingId: string; start: () => void };
type GateHandlers = {
  openGatePanel?: (context: { trainingId: string; title?: string; moduleId?: string; categoryId?: string }) => void;
  closeGatePanel?: () => void;
  showToast?: (messageKey: string) => void;
};

let pendingIntent: PendingIntent | null = null;
let handlers: GateHandlers = {};

export const registerPremiumGateHandlers = (nextHandlers: GateHandlers) => {
  handlers = { ...handlers, ...nextHandlers };
};

export const requestStartTrainingWithGate = (
  training: StartableTraining,
  startFn: () => void,
): AccessDecision => {
  const session = getSession();
  const decision = canStartTraining(session, training);

  if (decision.allowed) {
    startFn();
    return decision;
  }

  pendingIntent = { type: 'start_training', trainingId: training.id, start: startFn };
  handlers.openGatePanel?.({
    trainingId: training.id,
    title: training.title,
    moduleId: training.moduleId,
    categoryId: training.categoryId,
  });
  return decision;
};

export const onPremiumActivated = async () => {
  setSession({ entitlements: { isPremium: true } });
  handlers.showToast?.('premium.purchase.activated');
  handlers.closeGatePanel?.();

  const intent = pendingIntent;
  pendingIntent = null;

  if (intent?.type === 'start_training') {
    intent.start();
  }
};

export const getPendingIntent = () => pendingIntent;

