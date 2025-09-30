import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import CalendarManager from './CalendarManager';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import BabyBootcampApi from './api/api';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

// Mock the API
vi.mock('./api/api', () => ({
  default: {
    getUserBlocksWithEntries: vi.fn(),
    createBlockWithEntries: vi.fn(),
    deleteBlock: vi.fn(),
    updateIsEliminating: vi.fn(),
    setStartDateForElimination: vi.fn(),
    updateTime: vi.fn(),
    updateFeedingAmount: vi.fn(),
    getBlocksForWeek: vi.fn(),
  },
}));

describe('CalendarManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API call with empty blocks
    (BabyBootcampApi.getUserBlocksWithEntries as any).mockResolvedValue([]);
  });

  it('renders loading state initially', () => {
    const { container } = render(
      <ThemeWrapper>
        <CalendarManager />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with loaded data', async () => {
    const mockBlocks = [
      {
        id: 'block-1',
        number: 1,
        isEliminating: false,
        username: 'testuser',
        eliminationStartDate: new Date(),
        baselineVolume: 5,
        currentGroup: 1,
        feedingEntries: [],
      },
    ];

    (BabyBootcampApi.getUserBlocksWithEntries as any).mockResolvedValue(mockBlocks);

    const { container } = render(
      <ThemeWrapper>
        <CalendarManager />
      </ThemeWrapper>
    );

    await waitFor(() => {
      expect(BabyBootcampApi.getUserBlocksWithEntries).toHaveBeenCalled();
    });

    expect(container).toMatchSnapshot();
  });
});