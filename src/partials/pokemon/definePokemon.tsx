type AbilityType = {
    name: string,
    description?: string,
    url?:string,
}

type StatType = {
    base_state: number,
    effort: number,
    name: string,
}

export type PokeType = {
    name: string,
    sprite?: string,
    type?: string[],
    ability?:AbilityType[],
    height?:string,
    weight?:string,
    move?:string[],
    stat?:StatType[],
    hasFetched?:boolean,
}