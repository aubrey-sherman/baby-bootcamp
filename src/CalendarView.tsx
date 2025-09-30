import React from 'react';
import { DateTime } from 'luxon';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Stack,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import CalendarCell from './CalendarCell';
import { FeedingBlock } from './types';
import { FeedingEntry } from './types';
import TimezoneHandler from "./helpers/TimezoneHandler";

type RemoveFeedingBlock = (blockId: string) => void;
type SetToEliminate = (blockId: string) => void;

type CalendarViewProps = {
  startOfWeek: DateTime;
  monthAndYear: string;
  feedingBlocks: FeedingBlock[];
  currentDate: DateTime;
  deleteFeedingBlock: RemoveFeedingBlock;
  setToEliminate: SetToEliminate;
  onSetEliminationStart?: (entry: FeedingEntry) => void;
  onTimeSave: (blockId: string, entryId: string, newTime: DateTime) => void;
  onAmountSave: (blockId: string, entryId: string, newAmount: number) => void;
}

/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 * Uses timezone-aware date handling.
 *
 * CalendarManager -> CalendarView
 */
function CalendarView({
  startOfWeek,
  monthAndYear,
  feedingBlocks,
  currentDate,
  deleteFeedingBlock,
  onSetEliminationStart,
  setToEliminate,
  onTimeSave,
  onAmountSave
 }: CalendarViewProps) {
  const tzHandler = new TimezoneHandler();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [blockToDelete, setBlockToDelete] = React.useState<string | null>(null);
  const [eliminateWarning, setEliminateWarning] = React.useState(false);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    DateTime.fromObject({
      weekday: (i % 7) + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7
    })
      .setZone(tzHandler.getCurrentUserTimezone())
      .setLocale('en-US') // Ensures Sunday is treated as first day
      .toFormat('EEE')
  );

  const week = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.plus({ days: i })
  );

  /** Handles opening the delete confirmation dialog. */
  function handleClickToDelete(blockId: string) {
    setBlockToDelete(blockId);
    setDeleteDialogOpen(true);
  }

  /** Handles confirming deletion. */
  function handleConfirmDelete() {
    if (blockToDelete) {
      deleteFeedingBlock(blockToDelete);
    }
    setDeleteDialogOpen(false);
    setBlockToDelete(null);
  }

  /** Handles canceling deletion. */
  function handleCancelDelete() {
    setDeleteDialogOpen(false);
    setBlockToDelete(null);
  }

  /** Handles a user's submission to eliminate a block.
   *
   * If no other block is currently set to be eliminated, this will set the
   * isEliminating property to true.
  */
  function handleSubmit(blockId: string) {
    // check whether any other block already has a true value
    const currentBlocksToEliminate = feedingBlocks.filter(
      (feedingBlock) => feedingBlock.isEliminating === true
    );

    // if there are any blocks already set to be eliminated
    if (currentBlocksToEliminate.length > 0) {
      setEliminateWarning(true);
      setTimeout(() => setEliminateWarning(false), 5000);
    } else {
      setToEliminate(blockId);
    }
  }

  // NOTE: Style for browser viewing
  // return (
  //   <div>
  //     <h2>{monthAndYear}</h2>
  //     <div className="calendar-container">
  //       <table className="calendar-table">
  //         <thead>
  //           <tr>
  //             {/* <th>Night Feeding</th> */}
  //             <th>
  //               <div className='cell-content header-content'>
  //                 <span className='truncate'>Night Feeding</span>
  //               </div>
  //             </th>
  //             {week.map((date) => (
  //               <th key={date.toISO()}>
  //                 <div className='cell-content header-content'>
  //                   <span className="truncate">
  //                     {date.toFormat('EEE')}<br />
  //                     {date.toFormat('M/d')}
  //                   </span>
  //                 </div>
  //               </th>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {feedingBlocks.length > 0 ? (
  //             feedingBlocks
  //                 .sort((a, b) => a.number - b.number)
  //                 .map((feedingBlock: FeedingBlock) => (
  //                   <tr key={feedingBlock.id} className={feedingBlock.isEliminating ? "eliminating" : "not-eliminating"}>
  //                     <td data-block-id={feedingBlock.id}>
  //                       <div className='cell-content data-content'>
  //                         <span className="truncate">
  //                           <svg onClick={handleClickToDelete} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-trash3-fill" viewBox="0 0 16 16">
  //                             <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
  //                           </svg>
  //                           {feedingBlock.number}
  //                           <form onSubmit={handleSubmit}>
  //                             <button type='submit'>Eliminate this block?</button>
  //                           </form>
  //                         </span>
  //                       </div>
  //                     </td>
  //                     {week.map((date) => {
  //                       const entry = feedingBlock.feedingEntries?.find(entry => {
  //                         const entryDate = tzHandler.parseToUserTimezone(entry.feedingTime);
  //                         const dateToMatch = date;

  //                         return entryDate.hasSame(dateToMatch, 'day');
  //                       });

  //                       return (
  //                         <CalendarCell
  //                           key={date.toISO()}
  //                           date={date}
  //                           currentDate={currentDate}
  //                           feedingEntry={entry}
  //                           onTimeSave={onTimeSave}
  //                           onAmountSave={onAmountSave}
  //                         />
  //                       );
  //                     })}
  //                   </tr>
  //                 ))
  //             ) : (
  //               <tr>
  //                 <td colSpan={daysOfWeek.length + 1} style={{ textAlign: 'center' }}>
  //                   Your baby is sleeping through the night!
  //                 </td>
  //               </tr>
  //             )}
  //          </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

  // NOTE: Style for mobile viewing
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {monthAndYear}
      </Typography>

      {eliminateWarning && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setEliminateWarning(false)}>
          You can only eliminate one block at a time.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  Day
                </Typography>
              </TableCell>
              {feedingBlocks
                .sort((a, b) => a.number - b.number)
                .map((feedingBlock) => (
                  <TableCell
                    key={feedingBlock.id}
                    sx={{
                      bgcolor: feedingBlock.isEliminating ? 'eliminating.main' : 'inherit',
                      borderLeft: '2px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleClickToDelete(feedingBlock.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" fontWeight="medium">
                          Block {feedingBlock.number}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleSubmit(feedingBlock.id)}
                      >
                        Eliminate this block?
                      </Button>
                    </Stack>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {feedingBlocks.length > 0 ? (
              week.map((date) => (
                <TableRow key={date.toISO()}>
                  <TableCell>
                    <Typography variant="body2">
                      {date.toFormat('EEE')}<br />
                      {date.toFormat('M/d')}
                    </Typography>
                  </TableCell>
                  {feedingBlocks
                    .sort((a, b) => a.number - b.number)
                    .map((feedingBlock) => {
                      const entry = feedingBlock.feedingEntries?.find(entry => {
                        const entryDate = tzHandler.parseToUserTimezone(entry.feedingTime);
                        const dateToMatch = date;

                        return entryDate.hasSame(dateToMatch, 'day');
                      });

                      return (
                        <CalendarCell
                          key={`${date.toISO()}-${feedingBlock.id}`}
                          currentDate={date}
                          feedingEntry={entry}
                          onTimeSave={onTimeSave}
                          onAmountSave={onAmountSave}
                          onSetEliminationStart={onSetEliminationStart}
                          isEliminating={feedingBlock.isEliminating}
                        />
                      );
                    })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={feedingBlocks.length + 1} align="center">
                  <Typography variant="body1" color="text.secondary">
                    Your baby is sleeping through the night!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this feeding block? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarView;