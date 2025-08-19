import React from 'react';
import { Box, Typography, Paper, Grid, Tooltip } from '@mui/material';
import { format, differenceInDays, isBefore, isAfter } from 'date-fns';
import { BLOCKS, MONTHS, RaceCategoryMap, races } from './utils/data.ts';

const clampDate = (date: Date, min: Date, max: Date): Date => {
  return isBefore(date, min) ? min : isAfter(date, max) ? max : date;
};

const getOffsetPercentage = (date: Date, rangeStart: Date, rangeEnd: Date) => {
  const totalDays = differenceInDays(rangeEnd, rangeStart);
  return (differenceInDays(date, rangeStart) / totalDays) * 100;
};

const Calendar: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'blocks' | 'months'>('blocks');
  const data = viewMode === 'blocks' ? BLOCKS : MONTHS;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Year Timeline - 2025</Typography>

      {/* Toggle button */}
      <Box sx={{ mb: 2 }}>
        <button onClick={() => setViewMode(viewMode === 'blocks' ? 'months' : 'blocks')}>
          Toggle View ({viewMode})
        </button>
      </Box>

      {data.map((range, index) => {
        const start = range.startDate;
        const end = range.endDate;

        const blockRaces: Race[] = races
          .filter(e => !(e.endDate < start || e.startDate > end))
          .map(e => ({
            ...e,
            startDate: clampDate(e.startDate, start, end),
            endDate: clampDate(e.endDate, start, end),
          }));

        // Layering logic
        const layers: Race[][] = [];
        blockRaces.forEach(race => {
          let layerIndex = 0;
          while (layers[layerIndex]?.some(e => !(race.endDate < e.startDate || race.startDate > e.endDate))) {
            layerIndex++;
          }
          if (!layers[layerIndex]) layers[layerIndex] = [];
          layers[layerIndex].push(race);
          race.layer = layerIndex;
        });

        return (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{range.label}</Typography>

            {/* Month headers */}
            <Grid container spacing={0}>
              {Array.from({ length: end.getMonth() - start.getMonth() + 1 }).map((_, i) => {
                const monthIndex = start.getMonth() + i;
                return (
                  <Grid key={i} size={{xs:4}}>
                    <Typography variant="caption" align="center" display="block">
                      {format(new Date(2025, monthIndex, 1), 'MMM')}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>

            {/* Event bars */}
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
                const left = getOffsetPercentage(race.startDate, start, end);
                const width = getOffsetPercentage(race.endDate, start, end) - left;
                const duration = differenceInDays(race.endDate, race.startDate) + 1;

                return (
                  <Tooltip
                    key={race.id}
                    title={
                      <>
                        <div><strong>{race.race}</strong></div>
                        <div>Category: {race.category}</div>
                        <div>Length: {duration} Stage{duration > 1 ? 's' : ''}</div>
                        <div>Number of riders: {race.numRiders}</div>
                        <div>Variant: {race.variant}</div>
                      </>
                    }
                    arrow
                    placement="top"
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        position: 'absolute',
                        top: (race.layer ?? 0) * 50 + 8,
                        left: `${left}%`,
                        width: `${width}%`,
                        padding: '4px 8px',
                        bgcolor: RaceCategoryMap[race.category] || race.category,
                        color: 'black',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      <Typography variant="body2">{race.race}</Typography>
                    </Paper>
                  </Tooltip>
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
