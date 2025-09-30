import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import FeedingTimeCell from './FeedingTimeCell';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Wrapper component to provide theme
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('FeedingTimeCell', () => {
  const mockOnTimeSave = vi.fn();
  const testTime = DateTime.fromObject({ hour: 14, minute: 30 });

  it('renders with existing feeding time', () => {
    const { container } = render(
      <ThemeWrapper>
        <FeedingTimeCell
          feedingTime={testTime}
          onTimeSave={mockOnTimeSave}
          blockId="block-1"
          entryId="entry-1"
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders without feeding time (new entry)', () => {
    const { container } = render(
      <ThemeWrapper>
        <FeedingTimeCell
          feedingTime={undefined}
          onTimeSave={mockOnTimeSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});