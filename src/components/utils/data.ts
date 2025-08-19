import { endOfMonth, format, startOfMonth } from "date-fns";
import data from './csvjson.json';
import { Race } from "./types";

export const races: Race[] = data.map((race): Race => {
    return {
        ...race,
        variant: race.variant as number,
        startDate: new Date(race.startDate),
        endDate: new Date(race.endDate),
    };
});

export const BLOCKS = [
    { label: 'Block 1: 21 Jan – 9 Mar', startDate: new Date(2025, 0, 20), endDate: new Date(2025, 2, 8) },
    { label: 'Block 2: 9 Mar – 27 Apr', startDate: new Date(2025, 2, 8), endDate: new Date(2025, 3, 26) },
    { label: 'Block 3: 24 Apr – 22 Jun', startDate: new Date(2025, 3, 23), endDate: new Date(2025, 5, 21) },
    { label: 'Block 4: 03 Jul – 31 Aug', startDate: new Date(2025, 6, 2), endDate: new Date(2025, 7, 30) },
    { label: 'Block 5: 04 Sep – 19 Oct', startDate: new Date(2025, 8, 4), endDate: new Date(2025, 9, 18) },
];

export const MONTHS = Array.from({ length: 10 }, (_, i) => ({
    label: format(new Date(2025, i, 1), "MMMM"),
    startDate: startOfMonth(new Date(2025, i, 1)),
    endDate: endOfMonth(new Date(2025, i, 1)),
}));

export enum RaceCategory {
    GRAND_TOUR_RACE = 'Grand Tour Race',
    WORLD_TOUR_RACE = 'World Tour Race',
    PRO_TOUR_RACE = 'Pro Tour Race',
    CONTINENTAL_TOUR_RACE = 'Continental Tour Race',
    CONTINENTAL_ONLY_RACE = 'Continental Tour Only'
}

export enum RaceCategoryColor {
    GRAND_TOUR = '#ffff00',
    WORLD_TOUR = '#ff0000',
    PRO_TOUR = '#FFFF',
    CONTINENTAL_TOUR = '#00B0F0',
    CONTINENTAL_ONLY = '#ffc000',
}

// Optional: a mapping from descriptive text to the enum
export const RaceCategoryMap: Record<RaceCategory, RaceCategoryColor> = {
    [RaceCategory.GRAND_TOUR_RACE]: RaceCategoryColor.GRAND_TOUR,
    [RaceCategory.WORLD_TOUR_RACE]: RaceCategoryColor.WORLD_TOUR,
    [RaceCategory.PRO_TOUR_RACE]: RaceCategoryColor.PRO_TOUR,
    [RaceCategory.CONTINENTAL_TOUR_RACE]: RaceCategoryColor.CONTINENTAL_TOUR,
    [RaceCategory.CONTINENTAL_ONLY_RACE]: RaceCategoryColor.CONTINENTAL_ONLY,
};