import React from 'react';
import { Box, Typography, Paper, Grid, GridSize } from '@mui/material';
import { format, differenceInDays, startOfYear, endOfYear, isBefore, isAfter, startOfMonth, endOfMonth } from 'date-fns';

// Define the shape of an event
interface Race {
  id: number;
  title: string;
  start: Date;
  end: Date;
  category: string; // e.g., 'primary.main', '#ff0000', or 'success.light'
  layer?: number;
}

// Sample events
const races: Race[] = [
  { id: 1, title: 'long race', start: new Date(2025, 0, 10), end: new Date(2025, 3, 20), category: 'primary.main' },
  { id: 2, title: 'tour de france', start: new Date(2025, 1, 5), end: new Date(2025, 2, 15), category: 'secondary.main' },
  { id: 3, title: 'volta portugal', start: new Date(2025, 3, 1), end: new Date(2025, 5, 30), category: 'success.main' },
  { id: 4, title: 'Meehan is my goat', start: new Date(2025, 6, 1), end: new Date(2025, 8, 15), category: 'warning.main' },
  { id: 5, title: 'ras tailteann', start: new Date(2025, 10, 1), end: new Date(2025, 10, 10), category: 'error.main' },
  { id: 6, title: 'simming is for nerds', start: new Date(2025, 10, 15), end: new Date(2025, 11, 5), category: 'primary.main' },
]

// Utility: Offset % relative to start/end of the quarter
const getOffsetPercentage = (date: Date, quarterStart: Date, quarterEnd: Date) => {
  const totalDays = differenceInDays(quarterEnd, quarterStart);
  return (differenceInDays(date, quarterStart) / totalDays) * 100;
};

// Utility: Clamp event dates within the quarter range
const clampDate = (date: Date, min: Date, max: Date): Date => {
  return isBefore(date, min) ? min : isAfter(date, max) ? max : date;
};

const BLOCKS = [
  { label: 'Block 1: 10 Jan – 14 Mar', start: new Date(2025, 0, 10), end: new Date(2025, 2, 14) },
  { label: 'Block 2: 15 Mar – 30 Jun', start: new Date(2025, 2, 15), end: new Date(2025, 5, 30) },
  { label: 'Block 3: 1 Jul – 20 Sep', start: new Date(2025, 6, 1),  end: new Date(2025, 8, 20) },
  { label: 'Block 4: 21 Sep – 31 Dec', start: new Date(2025, 8, 21), end: new Date(2025, 11, 31) },
];

const Calendar: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Year Timeline - 2025</Typography>

      {BLOCKS.map((block, bIndex) => {
        const start = block.start;
        const end = block.end;

        // Filter and clamp events that overlap with this quarter
        const blockRaces: Race[] = races
          .filter(e => !(e.end < start || e.start > end))
          .map(e => ({
            ...e,
            start: clampDate(e.start, start, end),
            end: clampDate(e.end, start, end),
          }));

        // Layering logic
        const layers: Race[][] = [];
        blockRaces.forEach(race => {
          let layerIndex = 0;
          while (
            layers[layerIndex]?.some(e =>
              !(race.end < e.start || race.start > e.end))
          ) {
            layerIndex++;
          }
          if (!layers[layerIndex]) layers[layerIndex] = [];
          layers[layerIndex].push(race);
          race.layer = layerIndex;
        });

        return (
          <Box key={bIndex} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{block.label}</Typography>

            {/* Month headers */}
            <Grid container spacing={0}>
              {Array.from({ length: end.getMonth() - start.getMonth() + 1 }).map((_, i) => {
                 const monthIndex = start.getMonth() + i;
                 return (
                    <Grid key={i} size ={{xs:4}}>
                        <Typography variant="caption" align="center" display="block">
                        {format(new Date(2025, monthIndex, 1), 'MMM')}
                        </Typography>
                    </Grid>
                 );
               })}
            </Grid>

            {/* Event bar section */}
            <Box
              sx={{
                position: 'relative',
                height: `${(layers.length + 1) * 50}px`,
                border: '1px solid #ccc',
                mt: 1,
                borderRadius: 1,
              }}
            >
              {blockRaces.map(race => {
                const left = getOffsetPercentage(race.start, start, end);
                const width = getOffsetPercentage(race.end, start, end) - left;

                return (
                  <Paper
                    key={race.id}
                    elevation={3}
                    sx={{
                      position: 'absolute',
                      top: (race.layer ?? 0) * 50 + 8,
                      left: `${left}%`,
                      width: `${width}%`,
                      padding: '4px 8px',
                      bgcolor: race.category,
                      color: 'white',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography variant="body2">{race.title}</Typography>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Calendar;
