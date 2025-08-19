interface Race {
    id: number;
    race: string;
    shortName: string;
    startDate: Date;
    variant: number;
    category: string;
    endDate: Date;
    numRiders: number;
    block: number;
    subBlock: number;
    layer?: number;
}