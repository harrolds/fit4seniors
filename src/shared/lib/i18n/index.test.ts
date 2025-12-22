import { describe, expect, it } from 'vitest';
import { createTranslator } from './index';

describe('i18n translator', () => {
  const translator = createTranslator({
    greeting: 'Hello',
    countLabel: 'Count {count} / {{count}}',
  });

  it('returns the message when no params are provided', () => {
    expect(translator('greeting')).toBe('Hello');
  });

  it('returns the key when the message is missing', () => {
    expect(translator('missing')).toBe('missing');
  });

  it('interpolates placeholders with provided params', () => {
    expect(translator('countLabel', { count: 3 })).toBe('Count 3 / 3');
  });
});


