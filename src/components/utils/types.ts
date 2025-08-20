export interface Race {
    id: number;
    race: string;
    shortName: string;
    startDate: Date;
    endDate: Date;
    variant: number;
    category: RaceCategoryLabel; // use labels directly
    numRiders: number;
    block: number;
    subBlock: number;
    layer?: number;
}

// Match the labels in your JSON instead of keys
export type RaceCategoryLabel =
    | "Grand Tour Race"
    | "World Tour Race"
    | "Pro Tour Race"
    | "Continental Tour Race"
    | "Continental Tour Only";
