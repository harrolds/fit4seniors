import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Card, CardBody, CardHeader } from './Card';

describe('Card', () => {
  it('renders header and body content', () => {
    const html = renderToString(
      <Card>
        <CardHeader>Card title</CardHeader>
        <CardBody>Body content</CardBody>
      </Card>
    );

    expect(html).toContain('Card title');
    expect(html).toContain('Body content');
  });
});

