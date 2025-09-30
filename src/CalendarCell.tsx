import React, { useState } from 'react';
import { DateTime } from 'luxon';
import {
  TableCell,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from '@mui/material';
import { Star, Edit } from '@mui/icons-material';
import FeedingTimeCell from './FeedingTimeCell';
import { FeedingEntry } from './types';
import FeedingAmountCell from './FeedingAmountCell';
import TimezoneHandler from './helpers/TimezoneHandler';

type CalendarCellProps = {
  isEliminating?: boolean;
  feedingEntry?: FeedingEntry | undefined;
  currentDate: DateTime;
  onSetEliminationStart?: (entry: FeedingEntry) => void;
  onTimeSave: (blockId: string, entryId: string, newTime: DateTime) => void;
  onAmountSave: (blockId: string, entryId: string, newAmount: number) => void;
}

/** Calendar cell component displays time and feeding amount (in ounces) for a
 * given day and time block.
 *
 * Props:
 * - feedingEntry
 * - date: DateTime object representing the day
 * - currentDate: DateTime object maintained by CalendarManager
 *
 * State: none
 *
 * Renders:
 * - If feedingEntry exist: displays time for each entry
 * - If no entry: displays time form with currentDate from parent
 *
 * CalendarView -> CalendarCell -> { FeedingTimeCell, FeedingAmountCell }
 */
function CalendarCell({
  feedingEntry,
  currentDate,
  isEliminating = false,
  onTimeSave,
  onAmountSave,
  onSetEliminationStart
}: CalendarCellProps) {

  const tzHandler = new TimezoneHandler();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleOpenModal = () => setEditModalOpen(true);
  const handleCloseModal = () => setEditModalOpen(false);

  return (
    <>
      <TableCell
        sx={{
          bgcolor: currentDate.hasSame(DateTime.now(), 'day') ? 'action.hover' : 'inherit',
          p: 1,
          borderLeft: '2px solid',
          borderColor: 'divider',
          cursor: feedingEntry ? 'pointer' : 'default',
          '&:hover': feedingEntry ? {
            bgcolor: 'action.hover',
          } : {},
        }}
      >
        <Box>
          {feedingEntry ? (
            <Box onClick={handleOpenModal}>
              <Stack spacing={0.5} alignItems="center">
                {isEliminating && (
                  <Tooltip title="Mark this entry as the elimination start point">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetEliminationStart?.(feedingEntry);
                      }}
                      size="small"
                      color="warning"
                    >
                      <Star fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Typography variant="body2" fontWeight="medium">
                  {tzHandler.parseToUserTimezone(feedingEntry.feedingTime).toFormat('h:mm a')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feedingEntry.volumeInOunces?.toFixed(2) || '0.00'} oz
                </Typography>
                <IconButton size="small" color="primary">
                  <Edit fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ) : (
            <Box textAlign="center" onClick={handleOpenModal}>
              <IconButton size="small" color="primary">
                <Edit fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Add entry
              </Typography>
            </Box>
          )}
        </Box>
      </TableCell>

      <Dialog open={editModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {feedingEntry ? 'Edit Feeding Entry' : 'Add Feeding Entry'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FeedingTimeCell
              feedingTime={feedingEntry ? tzHandler.parseToUserTimezone(feedingEntry.feedingTime) : undefined}
              onTimeSave={(blockId, entryId, newTime) => {
                onTimeSave(blockId, entryId, newTime);
                handleCloseModal();
              }}
              entryId={feedingEntry?.id}
              blockId={feedingEntry?.blockId}
            />
            <FeedingAmountCell
              volumeInOunces={feedingEntry?.volumeInOunces || 0}
              onAmountSave={(blockId, entryId, newAmount) => {
                onAmountSave(blockId, entryId, newAmount);
                handleCloseModal();
              }}
              entryId={feedingEntry?.id}
              blockId={feedingEntry?.blockId}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarCell;