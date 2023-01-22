export const weakness_chart:any = {
    'normal':['fighting'],
    'fire':['water','ground','rock'],
    'water':['grass','electric'],
    'grass':['fire','ice','poison','flying','bug'],
    'electric':['ground'],
    'ice':['fire','fighting','rock','steel'],
    'fighting':['flying','psychic','fairy'],
    'poison':['ground','psychic'],
    'ground':['water','grass','ice'],
    'flying':['electric','ice','rock'],
    'psychic':['bug','ghost','dark'],
    'bug':['fire','flying','rock'],
    'rock':['water','grass','fighting','ground','steel'],
    'ghost':['ghost','dark'],
    'dragon':['ice','dragon','fairy'],
    'dark':['fighting','bug','fairy'],
    'steel':['fire','fighting','ground'],
    'fairy':['poison','steel']
}
export const strong_chart:any = {
    'normal':[],
    'fire':['fire','grass','ice','bug','steel','fairy'],
    'water':['fire','water','ice','steel'],
    'grass':['water','grass','electric'],
    'electric':['electric','flying','steel'],
    'ice':['ice'],
    'fighting':['bug','rock','dark'],
    'poison':['grass','fighting','poison','bug','fairy'],
    'ground':['poison','rock'],
    'flying':['grass','fighting','bug'],
    'psychic':['fighting','psychic'],
    'bug':['grass','fighting','ground'],
    'rock':['normal','fire','poison','flying'],
    'ghost':['poison','bug'],
    'dragon':['fire','water','grass','electric'],
    'dark':['ghost','dark'],
    'steel':['normal','grass','ice','flying','psychic','bug','rock','dragon','steel','fairy'],
    'fairy':['fighting','bug','dark']
}

export const immune_chart:any = {
    'normal':['ghost'],
    'fire':[],
    'water':[],
    'grass':[],
    'electric':[],
    'ice':[],
    'fighting':[],
    'poison':[],
    'ground':['electric'],
    'flying':['ground'],
    'psychic':[],
    'bug':[],
    'rock':[],
    'ghost':['normal','fighting'],
    'dragon':[],
    'dark':['psychic'],
    'steel':['poison'],
    'fairy':['dragon']
}

export function getTypeChart(types:string[])
{
    let type_chart:any = {
        weaknesses:[],
        super_weaknesses:[],
        strengths:[],
        super_strengths:[],
        immunes:[]
    };

    for(let i in types)
    {
        for(let j in weakness_chart[types[i]])
        {
            if (!type_chart.weaknesses.includes(weakness_chart[types[i]][j])) {
                type_chart.weaknesses.push(weakness_chart[types[i]][j])
            }            
            else{
                type_chart.super_weaknesses.push(weakness_chart[types[i]][j])
                type_chart.weaknesses = type_chart.weaknesses.filter((type:string)=>type!==weakness_chart[types[i]][j])
            }
        }
        for(let j in strong_chart[types[i]])
        {
            if (!type_chart.strengths.includes(strong_chart[types[i]][j])) {
                type_chart.strengths.push(strong_chart[types[i]][j])
            }
            else{
                type_chart.super_strengths.push(strong_chart[types[i]][j])
                type_chart.strengths = type_chart.strengths.filter((type:string)=>type!==strong_chart[types[i]][j])

            }
        }
        for(let j in immune_chart[types[i]])
        {
            if (!type_chart.immunes.includes(immune_chart[types[i]][j])) {
                type_chart.immunes.push(immune_chart[types[i]][j])
            }
        }
    }


    return type_chart;
}