import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import Eat from './Eat';
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
  },
}));

describe('Eat', () => {
  it('renders with baby name and calendar', async () => {
    (BabyBootcampApi.getUserBlocksWithEntries as any).mockResolvedValue([]);

    const { container } = render(
      <ThemeWrapper>
        <Eat username="testuser" babyName="Baby Emma" />
      </ThemeWrapper>
    );

    await waitFor(() => {
      expect(BabyBootcampApi.getUserBlocksWithEntries).toHaveBeenCalled();
    });

    expect(container).toMatchSnapshot();
  });

  it('renders with different baby name', async () => {
    (BabyBootcampApi.getUserBlocksWithEntries as any).mockResolvedValue([]);

    const { container } = render(
      <ThemeWrapper>
        <Eat username="testuser2" babyName="Baby Oliver" />
      </ThemeWrapper>
    );

    await waitFor(() => {
      expect(BabyBootcampApi.getUserBlocksWithEntries).toHaveBeenCalled();
    });

    expect(container).toMatchSnapshot();
  });
});