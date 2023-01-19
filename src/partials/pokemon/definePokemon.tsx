export type AbilityType = {
    name: string,
    description?: string
}

export type StatType = {
    base_stat: number,
    effort_value: number,
    name: string,
}

export type MoveType = {
    name:string,
    description?: string,
    level?:number,
    method?:string,
}

export type NatureType = {
    id: number;
    name: string;
    decreased_stat: string | null;
    increased_stat: string | null;
    index:number;
}

export type PokeType = { //pokemon that are in the all_pokemon state
    name: string,
    sprite?: string,
    type?: string[],
    ability?:AbilityType[],
    height?:string,
    weight?:string,
    move?:MoveType[],
    stat?:StatType[],
    hasFetched?:boolean,
    selectedAbility?:AbilityType,
    selectedMoves?:MoveType[],
    selectedNature?:NatureType,
}