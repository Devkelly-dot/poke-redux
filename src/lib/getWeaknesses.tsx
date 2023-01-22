export default function getWeaknesses(types:string[])
{
    const weakness_chart = {
        'normal':['fighting'],
        'fire':['water','ground','rock'],
        'water':['grass','electric'],
        'grass':['fire','ice','poison','flying','bug'],
        'electric':[],
        'ice':[],
        'fighting':[],
        'poison':[],
        'ground':[],
        'flying':[],
        'psychic':[],
        'bug':[],
        'rock':[],
        'ghost':[],
        'dragon':[],
        'dark':[],
        'steel':[],
        'fairy':[]
    }
    const strong_chart = {
        'normal':[],
        'fire':[],
        'water':[],
        'grass':[],
        'electric':[],
        'ice':[],
        'fighting':[],
        'poison':[],
        'ground':[],
        'flying':[],
        'psychic':[],
        'bug':[],
        'rock':[],
        'ghost':[],
        'dragon':[],
        'dark':[],
        'steel':[],
        'fairy':[]
    }


    let type_chart:any[] = [];
    
    return type_chart;
}