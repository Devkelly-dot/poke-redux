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

export type PokeType = {
    name: string,
    sprite?: string,
    type?: string[],
    ability?:AbilityType[],
    height?:string,
    weight?:string,
    move?:MoveType[],
    stat?:StatType[],
    hasFetched?:boolean,
}