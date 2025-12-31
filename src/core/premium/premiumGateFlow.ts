import { canStartTraining, type AccessDecision } from '../access/accessPolicy';
import { getSession, setSession } from '../user/userStore';

type StartableTraining = { id: string; requiresPremium: boolean };

type PendingIntent = { type: 'start_training'; trainingId: string; start: () => void };
type GateHandlers = {
  openGateSheet?: (context: { trainingId: string }) => void;
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
  handlers.openGateSheet?.({ trainingId: training.id });
  return decision;
};

export const onPremiumActivated = async () => {
  setSession({ entitlements: { isPremium: true } });
  handlers.showToast?.('premium.activated');

  const intent = pendingIntent;
  pendingIntent = null;

  if (intent?.type === 'start_training') {
    intent.start();
  }
};

export const getPendingIntent = () => pendingIntent;

