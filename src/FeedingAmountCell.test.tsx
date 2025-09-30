import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import FeedingAmountCell from './FeedingAmountCell';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('FeedingAmountCell', () => {
  const mockOnAmountSave = vi.fn();

  it('renders with existing volume amount', () => {
    const { container } = render(
      <ThemeWrapper>
        <FeedingAmountCell
          volumeInOunces={4.5}
          blockId="block-1"
          entryId="entry-1"
          onAmountSave={mockOnAmountSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with zero volume (new entry)', () => {
    const { container } = render(
      <ThemeWrapper>
        <FeedingAmountCell
          volumeInOunces={0}
          onAmountSave={mockOnAmountSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders without blockId or entryId', () => {
    const { container } = render(
      <ThemeWrapper>
        <FeedingAmountCell
          onAmountSave={mockOnAmountSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});