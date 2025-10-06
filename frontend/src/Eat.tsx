import { Container, Box, Typography } from '@mui/material';
import CalendarManager from "./CalendarManager.tsx";
import { EatProps } from './types.ts';

/** Presentational component that renders calendar.
 *
 * RoutesList -> Eat -> CalendarManager
 */
function Eat({ username, babyName }: EatProps) {

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Feeding Calendar for {babyName}
        </Typography>
        <CalendarManager />
      </Box>
    </Container>
  )
}

export default Eat;