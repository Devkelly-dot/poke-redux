export type AbilityType = {
    name: string,
    description?: string
}

export type StatType = {
    base_state: number,
    effort: number,
    name: string,
}

export type MoveType = {
    name:string,
    level:number,
    method:string,
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
}