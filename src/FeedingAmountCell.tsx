import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Typography,
} from '@mui/material';

type FeedingAmountCellProps = {
  volumeInOunces?: number;
  blockId?: string;
  entryId?: string;
  onAmountSave: (
    blockId: string, entryId: string, newAmount: number
  ) => void;
}

/** Displays and allows editing of the feeding amount.
 *
 * CalendarCell -> FeedingAmountCell
 */
function FeedingAmountCell({
  volumeInOunces = 0,
  blockId,
  entryId,
  onAmountSave
}: FeedingAmountCellProps) {
  const [submitted, setSubmitted] = useState(false);
  const [initialWholeNumber, initialDecimal] = volumeInOunces.toFixed(2).split('.');
  const [wholeNumber, setWholeNumber] = useState(initialWholeNumber);
  const [decimalPart, setDecimalPart] = useState(initialDecimal);

  // Update state when prop changes
  useEffect(() => {
    const [newWholeNumber, newDecimal] = volumeInOunces.toFixed(2).split('.');
    setWholeNumber(newWholeNumber);
    setDecimalPart(newDecimal);
  }, [volumeInOunces]);

  function handleWholeNumberChange(e: any) {
    const value = e.target.value;
    if (value === '' || /^-?\d+$/.test(value)) {
      setWholeNumber(value);
    }
  };

  function handleDecimalChange(e: any) {
    const value = e.target.value;
    if (value === '' || /^\d{0,2}$/.test(value)) {
      setDecimalPart(value.padStart(2, '0'));
    }
  };

  const wholeNumbers = Array.from({ length: 16 }, (_, i) => i);
  const decimalNumbers = Array.from({ length: 4 }, (_, i) =>
    (i * 25).toString().padStart(2, '0')
  );

  const combinedNumber = `${wholeNumber || '0'}.${decimalPart || '00'}`;

  /** Converts saved value from string to number and calls onAmountSave in parent. */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    const newAmount = Number(combinedNumber);

    // Validate the blockId and entryId instead of using non-null assertion
    if (!blockId || !entryId) {
      console.error('Missing blockId or entryId');
      return;
    }

    // Validate the number before saving
    if (isNaN(newAmount)) {
      console.error('Invalid number format');
      return;
    }

    onAmountSave(blockId!, entryId!, newAmount);
  }

  return (
    <Box sx={{ p: 1 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="caption" color="text.secondary">
            Volume in oz
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 60 }}>
              <InputLabel id="whole-number-label">Oz</InputLabel>
              <Select
                labelId="whole-number-label"
                value={wholeNumber}
                label="Oz"
                onChange={handleWholeNumberChange}
              >
                {wholeNumbers.map(num => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6">.</Typography>

            <FormControl size="small" sx={{ minWidth: 60 }}>
              <InputLabel id="decimal-label">Dec</InputLabel>
              <Select
                labelId="decimal-label"
                value={decimalPart}
                label="Dec"
                onChange={handleDecimalChange}
              >
                {decimalNumbers.map(num => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Button
            type='submit'
            variant="contained"
            size="small"
          >
            Edit amount
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default FeedingAmountCell;