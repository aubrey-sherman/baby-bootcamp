import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import CalendarView from './CalendarView';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { FeedingBlock } from './types';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CalendarView', () => {
  const mockDeleteFeedingBlock = vi.fn();
  const mockSetToEliminate = vi.fn();
  const mockOnSetEliminationStart = vi.fn();
  const mockOnTimeSave = vi.fn();
  const mockOnAmountSave = vi.fn();

  const startOfWeek = DateTime.fromObject({ year: 2024, month: 1, day: 14 }); // Sunday
  const currentDate = DateTime.fromObject({ year: 2024, month: 1, day: 15 });
  const monthAndYear = 'January 2024';

  const mockFeedingBlocks: FeedingBlock[] = [
    {
      id: 'block-1',
      number: 1,
      isEliminating: false,
      username: 'testuser',
      eliminationStartDate: new Date(),
      baselineVolume: 5,
      currentGroup: 1,
      feedingEntries: [
        {
          id: 'entry-1',
          username: 'testuser',
          feedingTime: new Date('2024-01-15T14:30:00Z'),
          volumeInOunces: 4.5,
          blockId: 'block-1',
        },
      ],
    },
    {
      id: 'block-2',
      number: 2,
      isEliminating: true,
      username: 'testuser',
      eliminationStartDate: new Date(),
      baselineVolume: 4,
      currentGroup: 1,
      feedingEntries: [],
    },
  ];

  it('renders with feeding blocks', () => {
    const { container } = render(
      <ThemeWrapper>
        <CalendarView
          startOfWeek={startOfWeek}
          monthAndYear={monthAndYear}
          feedingBlocks={mockFeedingBlocks}
          currentDate={currentDate}
          deleteFeedingBlock={mockDeleteFeedingBlock}
          setToEliminate={mockSetToEliminate}
          onSetEliminationStart={mockOnSetEliminationStart}
          onTimeSave={mockOnTimeSave}
          onAmountSave={mockOnAmountSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with no feeding blocks', () => {
    const { container } = render(
      <ThemeWrapper>
        <CalendarView
          startOfWeek={startOfWeek}
          monthAndYear={monthAndYear}
          feedingBlocks={[]}
          currentDate={currentDate}
          deleteFeedingBlock={mockDeleteFeedingBlock}
          setToEliminate={mockSetToEliminate}
          onTimeSave={mockOnTimeSave}
          onAmountSave={mockOnAmountSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with eliminating block highlighted', () => {
    const eliminatingBlocks: FeedingBlock[] = [
      {
        id: 'block-1',
        number: 1,
        isEliminating: true,
        username: 'testuser',
        eliminationStartDate: new Date(),
        baselineVolume: 5,
        currentGroup: 1,
        feedingEntries: [],
      },
    ];

    const { container } = render(
      <ThemeWrapper>
        <CalendarView
          startOfWeek={startOfWeek}
          monthAndYear={monthAndYear}
          feedingBlocks={eliminatingBlocks}
          currentDate={currentDate}
          deleteFeedingBlock={mockDeleteFeedingBlock}
          setToEliminate={mockSetToEliminate}
          onTimeSave={mockOnTimeSave}
          onAmountSave={mockOnAmountSave}
        />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});