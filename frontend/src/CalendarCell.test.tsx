import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import CalendarCell from './CalendarCell';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { FeedingEntry } from './types';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CalendarCell', () => {
  const mockOnTimeSave = vi.fn();
  const mockOnAmountSave = vi.fn();
  const mockOnSetEliminationStart = vi.fn();
  const currentDate = DateTime.fromObject({ year: 2024, month: 1, day: 15 });

  const mockFeedingEntry: FeedingEntry = {
    id: 'entry-1',
    username: 'testuser',
    feedingTime: new Date('2024-01-15T14:30:00Z'),
    volumeInOunces: 4.5,
    blockId: 'block-1',
  };

  it('renders with feeding entry', () => {
    const { container } = render(
      <ThemeWrapper>
        <table>
          <tbody>
            <tr>
              <CalendarCell
                feedingEntry={mockFeedingEntry}
                currentDate={currentDate}
                onTimeSave={mockOnTimeSave}
                onAmountSave={mockOnAmountSave}
              />
            </tr>
          </tbody>
        </table>
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders without feeding entry (empty cell)', () => {
    const { container } = render(
      <ThemeWrapper>
        <table>
          <tbody>
            <tr>
              <CalendarCell
                feedingEntry={undefined}
                currentDate={currentDate}
                onTimeSave={mockOnTimeSave}
                onAmountSave={mockOnAmountSave}
              />
            </tr>
          </tbody>
        </table>
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with eliminating block and star button', () => {
    const { container } = render(
      <ThemeWrapper>
        <table>
          <tbody>
            <tr>
              <CalendarCell
                feedingEntry={mockFeedingEntry}
                currentDate={currentDate}
                isEliminating={true}
                onTimeSave={mockOnTimeSave}
                onAmountSave={mockOnAmountSave}
                onSetEliminationStart={mockOnSetEliminationStart}
              />
            </tr>
          </tbody>
        </table>
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders for current day with highlighted background', () => {
    const today = DateTime.now();
    const { container } = render(
      <ThemeWrapper>
        <table>
          <tbody>
            <tr>
              <CalendarCell
                feedingEntry={mockFeedingEntry}
                currentDate={today}
                onTimeSave={mockOnTimeSave}
                onAmountSave={mockOnAmountSave}
              />
            </tr>
          </tbody>
        </table>
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});