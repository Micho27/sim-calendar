import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  format,
  differenceInDays,
  isBefore,
  isAfter,
} from "date-fns";
import { BLOCKS, MONTHS, races } from "./utils/constants.ts";
import { RACE_CATEGORIES } from "./utils/constants.ts";
import { Race, RaceCategoryLabel } from "./utils/types";

// ------------------ Utils ------------------

// Offset % relative to start/end of the range
const getOffsetPercentage = (date: Date, rangeStart: Date, rangeEnd: Date) => {
  const totalDays = differenceInDays(rangeEnd, rangeStart);
  return (differenceInDays(date, rangeStart) / totalDays) * 100;
};

// Clamp event dates within the range
const clampDate = (date: Date, min: Date, max: Date): Date => {
  return isBefore(date, min) ? min : isAfter(date, max) ? max : date;
};

// ------------------ Calendar Component ------------------
const Calendar: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"blocks" | "months">("blocks");
  const [activeCategories, setActiveCategories] = React.useState<RaceCategoryLabel[]>(
    ["Grand Tour Race", "World Tour Race", "Pro Tour Race", "Continental Tour Race", "Continental Tour Only"]
  );

  const data = viewMode === "blocks" ? BLOCKS : MONTHS;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Year Timeline - 2025
      </Typography>

      {/* Toggle button */}
      <Box sx={{ mb: 2 }}>
        <button onClick={() => setViewMode(viewMode === 'blocks' ? 'months' : 'blocks')}>
          Toggle View ({viewMode})
        </button>
      </Box>
      
      {/* Category Filters */}
      <Box sx={{ mb: 2 }}>
        {Object.entries(RACE_CATEGORIES).map(([key, { label }]) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={activeCategories.includes(key as RaceCategoryLabel)}
                onChange={() => {
                  setActiveCategories((prev) =>
                    prev.includes(key as RaceCategoryLabel)
                      ? prev.filter((c) => c !== key)
                      : [...prev, key as RaceCategoryLabel]
                  );
                }}
              />
            }
            label={label}
          />
        ))}
      </Box>

      {/* Timeline Data */}
      {data.map((range, Index) => {
        const start = range.startDate;
        const end = range.endDate;

        // Filter + clamp events that overlap with this range
        const blockRaces: Race[] = races
          .filter((e) => activeCategories.includes(e.category))
          .filter((e) => !(e.endDate < start || e.startDate > end))
          .map((e) => ({
            ...e,
            start: clampDate(e.startDate, start, end),
            end: clampDate(e.endDate, start, end),
          }));

        // Layering logic
        const layers: Race[][] = [];
        blockRaces.forEach((race) => {
          let layerIndex = 0;
          while (
            layers[layerIndex]?.some(
              (e) => !(race.endDate < e.startDate || race.startDate > e.endDate)
            )
          ) {
            layerIndex++;
          }
          if (!layers[layerIndex]) layers[layerIndex] = [];
          layers[layerIndex].push(race);
          race.layer = layerIndex;
        });

        return (
          <Box key={Index} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {range.label}
            </Typography>

            {/* Month headers */}
            <Grid container spacing={0}>
              {Array.from({ length: end.getMonth() - start.getMonth() + 1 }).map(
                (_, i) => {
                  const monthIndex = start.getMonth() + i;
                  return (
                    <Grid key={i} size={{ xs: 4 }}>
                      <Typography
                        variant="caption"
                        align="center"
                        display="block"
                      >
                        {format(new Date(2025, monthIndex, 1), "MMM")}
                      </Typography>
                    </Grid>
                  );
                }
              )}
            </Grid>

            {/* Event bar section */}
            <Box
              sx={{
                position: "relative",
                height: `${(layers.length + 1) * 50}px`,
                border: "1px solid #ccc",
                mt: 1,
                borderRadius: 1,
              }}
            >
              {blockRaces.map((race) => {
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
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        position: "absolute",
                        top: (race.layer ?? 0) * 50 + 8,
                        left: `${left}%`,
                        width: `${width}%`,
                        padding: "4px 8px",
                        bgcolor: RACE_CATEGORIES[race.category].color,
                        color: "black",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
