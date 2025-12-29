export type CategoryId = 'memory' | 'attention' | 'reaction' | 'logic' | 'flexibility';

export type TemplateId = 'wordpuzzle' | 'choice' | 'odd_one_out' | 'pairs' | 'sequence' | 'reaction';

type PromptField = { prompt: string; promptKey?: undefined } | { promptKey: string; prompt?: undefined };
type OptionsField = { options: string[]; optionsKey?: undefined } | { optionsKey: string[]; options?: undefined };

type HintField = { hint?: string; hintKey?: string };

export type ChoiceRound = { id: string; correctIndex: number } & PromptField & OptionsField & HintField;

export type OddOneOutRound = { id: string; oddIndex: number } & PromptField & OptionsField & HintField;

type PromptOptional = PromptField | { prompt?: undefined; promptKey?: undefined };

export type PairsRound = { id: string; pairs: { a: string; b: string }[] } & PromptOptional;

export type SequenceRound = { id: string; items: string[]; correctOrder: string[] } & PromptField;

export type ReactionRound = { id: string; instructionKey: string; stimuli: { label: string; isTarget: boolean }[]; paceMs: number };

