import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './Button';

// Enable React act environment hints for jsdom tests.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderButton = (node: React.ReactElement) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);
  act(() => {
    root.render(node);
  });

  const cleanup = () => {
    act(() => {
      root.unmount();
    });
    container.remove();
  };

  return { container, cleanup };
};

describe('Button', () => {
  it('renders its children', () => {
    const { container, cleanup } = renderButton(<Button>Click me</Button>);
    const button = container.querySelector('button');
    expect(button?.textContent).toContain('Click me');
    cleanup();
  });

  it('applies disabled state', () => {
    const { container, cleanup } = renderButton(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
    cleanup();
  });

  it('fires click handler', () => {
    const handleClick = vi.fn();
    const { container, cleanup } = renderButton(<Button onClick={handleClick}>Tap</Button>);
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    act(() => {
      button?.click();
    });
    expect(handleClick).toHaveBeenCalledTimes(1);
    cleanup();
  });
});

