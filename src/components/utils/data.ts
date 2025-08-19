import { endOfMonth, format, startOfMonth } from "date-fns";
import data from './csvjson.json';

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
    { label: 'Block 2: 15 Mar – 30 Jun', startDate: new Date(2025, 2, 8), endDate: new Date(2025, 3, 26) },
    { label: 'Block 3: 1 Jul – 20 Sep', startDate: new Date(2025, 3, 23), endDate: new Date(2025, 5, 21) },
    { label: 'Block 4: 21 Sep – 31 Dec', startDate: new Date(2025, 6, 2), endDate: new Date(2025, 7, 30) },
    { label: 'Block 5: 21 Sep – 31 Dec', startDate: new Date(2025, 8, 4), endDate: new Date(2025, 9, 18) },
];

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    label: format(new Date(2025, i, 1), "MMMM"),
    startDate: startOfMonth(new Date(2025, i, 1)),
    endDate: endOfMonth(new Date(2025, i, 1)),
}));

export const WORLD_TOUR_RACE = 'World Tour Race';
export const PRO_TOUR_RACE = 'Pro Tour Race';
export const CONTINENTAL_TOUR_RACE = 'Continental Tour Race';
export const CONTINENTAL_ONLY_RACE = 'Continental Tour Only';

export enum RaceCategoryColor {
    WORLD_TOUR = '#ff0000',
    PRO_TOUR = '#FFFF',
    CONTINENTAL_TOUR = '#00B0F0',
    CONTINENTAL_ONLY = '#ffc000',
}

// Optional: a mapping from descriptive text to the enum
export const RaceCategoryMap: Record<string, RaceCategoryColor> = {
    'World Tour Race': RaceCategoryColor.WORLD_TOUR,
    'Pro Tour Race': RaceCategoryColor.PRO_TOUR,
    'Continental Tour Race': RaceCategoryColor.CONTINENTAL_TOUR,
    'Continental Tour Only': RaceCategoryColor.CONTINENTAL_ONLY,
};

// export const races: Race[] = [
//   { id: 1, title: 'Tour down under', startDa: new Date(2025, 0, 20), end: new Date(2025, 0, 25), category: RaceCategoryMap[WORLD_TOUR_RACE] },
//   { id: 2, title: 'Cadel Evans', start: new Date(2025, 1, 1), end: new Date(2025, 1, 1), category: RaceCategoryMap[WORLD_TOUR_RACE] },
//   { id: 3, title: 'UAE Tour', start: new Date(2025, 1, 16), end: new Date(2025, 1, 22), category: RaceCategoryMap[WORLD_TOUR_RACE] },
//   { id: 4, title: 'Valencia', start: new Date(2025, 1, 5), end: new Date(2025, 1, 8), category: RaceCategoryMap[PRO_TOUR_RACE] },
//   { id: 5, title: 'Tour of Oman', start: new Date(2025, 1, 7), end: new Date(2025, 1, 11), category: RaceCategoryMap[PRO_TOUR_RACE] },
//   { id: 6, title: 'GP Val', start: new Date(2025, 1, 25), end: new Date(2025, 1, 25), category: RaceCategoryMap[CONTINENTAL_TOUR_RACE] },
//   { id: 7, title: 'Etoile de Besegies', start: new Date(2025, 1, 5), end: new Date(2025, 1, 8), category: RaceCategoryMap[CONTINENTAL_TOUR_RACE] },
//   { id: 8, title: 'Morv', start: new Date(2025, 0, 23), end: new Date(2025, 0, 23), category: RaceCategoryMap[CONTINENTAL_ONLY_RACE] },
//   { id: 9, title: 'Rwanda', start: new Date(2025, 1, 22), end: new Date(2025, 1, 29), category: RaceCategoryMap[CONTINENTAL_ONLY_RACE] },
// ];