import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import pokemonTypeStyles  from '../partials/pokemon/pokemonTypeStyles'
import { update_pokemon } from '../partials/pokemon/allPokemonSlice';
import { add_pokemon as add_to_party, update_pokemon as update_party_pokemon } from '../partials/pokemon/partySlice';
import info_axios from '../lib/api/pokeinfo_api'
import { useEffect, useState } from 'react';
import { AbilityType, MoveType, PokeType } from "../partials/pokemon/definePokemon";
import { Chart } from 'react-chartjs-2';
import { getTypeChart } from '../lib/getWeaknesses';

export default function PokemonInfo()
{
    const dispatch = useDispatch()
    const {pokemonName} = useParams();
    let displayName = ""
    if(pokemonName)
        displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);
    let party_pokemon = useSelector((state:RootState)=>state.party.party);

    
    const [myPokemon,setMyPokemon] = useState<PokeType>()
    const [SelectedPartyPokemon,setSelectedPartyPokemon] = useState(
        {
            pokemon: null as PokeType | null,
            index: 0
        }
        ) // the pokemon in our party that we add moves or abilities to
    const [selectedMove,setSelectedMove] = useState({name:'',desc:''})
    const [selectedAbility,setSelectedAbility] = useState({name:'',desc:''})
    const [same_party_pokemon,setSamePartyPokemon] = useState<{pokemon:PokeType, index:number}[]>([])
    const [partyPokemonMoves,setPartyPokemonMoves] = useState<MoveType[]>([])
    
    const [showAbilities, setShowAbilities] = useState(false);
    const [showMoves,setShowMoves] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showResistances, setShowResistances] = useState(false);

    const [resistances,setResistances] = useState(
        {
            "weak":[],
            "super_weak":[],
            "resistant":[],
            "super_resistant":[],
            "immune":[]
        }
    )

    const [statGraphData,setStatGraphData] = useState(
        {
            labels: [
                'HP',
                'Attack',
                'Defense',
                'Special Attack',
                'Special Defense',
                'Speed'
            ],
            datasets: [{
                label: 'Base Stats',
                data: [1, 1, 1, 1, 1, 1],
                fill: true,
                backgroundColor: [
                    'rgba(227, 87, 90, 1)',
                    'rgba(227, 149, 90, 1)',
                    'rgba(234, 220, 99, 1)',
                    'rgba(63, 171, 218, 1)',
                    'rgba(63, 187, 104, 1)',
                    'rgba(233, 122, 225, 1)'
                ],
                hoverOffset: 4
            }]
        }
    );

    useEffect(()=>{
        async function fetch_pokeInfo(pokemon:PokeType)
        {
            try{
                const name = pokemon.name;
                let request = await info_axios.get(`/pokemon/${name}`);
                if(request.status!==200)
                {
                    throw new Error(`Request failed with status code ${request.status}`);
                }

                // get the types
                const fetch_types = request.data.types;
                let types = []

                for(let i in fetch_types)
                {
                    types.push(fetch_types[i].type.name)
                }
                
                // get the moves
                const fetch_moves = request.data.moves;
                let moves = []
                for(let i in fetch_moves)
                {
                    const new_move:MoveType = {
                        name:fetch_moves[i].move.name,
                        level:fetch_moves[i].version_group_details[0].level_learned_at,
                        method:fetch_moves[i].version_group_details[0].move_learn_method.name
                    }
                    moves.push(new_move);
                }

                // get the abilities
                const fetch_abilities = request.data.abilities;
                let abilities = []
                for(let i in fetch_abilities)
                {
                    const name = fetch_abilities[i].ability.name;
                    const fetch_description = await info_axios.get(`/ability/${name}`)

                    let english_index = 0;

                    for(let j in fetch_description.data.effect_entries)
                    {
                        if(fetch_description.data.effect_entries[j].language.name === 'en')
                        {
                            english_index = parseInt(j);
                            break;
                        }
                    }

                    const description = fetch_description.data.effect_entries[english_index].effect

                    const new_ability:AbilityType = {
                        name: name,
                        description:description,
                    }

                    abilities.push(new_ability);
                }

                const stats = request.data.stats;
                let poke_stats = [];

                let data = [];
                for(let i in stats)
                {
                    data.push(stats[i].base_stat);
                    poke_stats.push(
                        {
                            base_stat: stats[i].base_stat,
                            effort_value: 0,
                            name: stats[i].stat.name
                        }
                    )
                }

                let dataSet = {...statGraphData.datasets[0], data:data};
                let dataSets = [];
                dataSets.push(dataSet);
                let graphData = {...statGraphData, datasets:dataSets}

                setStatGraphData(graphData);

                const new_pokemon:PokeType = {
                    name: pokemon.name,
                    sprite:pokemon.sprite,
                    type:types,
                    move:moves,
                    ability:abilities,
                    hasFetched:true,
                    stat:poke_stats,
                }

                dispatch(update_pokemon({name: new_pokemon.name,pokemon: new_pokemon}))
                setMyPokemon(new_pokemon);
                let typeChart = getTypeChart(types);
                let new_resistances = {
                    "weak":[],
                    "super_weak":[],
                    "resistant":[],
                    "super_resistant":[],
                    "immune":[]
                }

                new_resistances.weak = typeChart.weaknesses;
                new_resistances.super_weak = typeChart.super_weaknesses;
                new_resistances.resistant = typeChart.strengths;
                new_resistances.super_resistant = typeChart.super_strengths;
                new_resistances.immune = typeChart.immunes;

                setResistances(new_resistances);
            } catch (error) {
                console.error(error);
            }
        }

        const target_pokemon = all_pokemon.find((p)=>p.name===pokemonName);
        setMyPokemon(target_pokemon)
        if(!target_pokemon?.hasFetched)
        {
            if(target_pokemon)
                fetch_pokeInfo(target_pokemon)
        }
        else if(target_pokemon)
        {
            const stats = target_pokemon.stat;
            if(stats!== undefined)
            {
                let data = [];

                for(let i in stats)
                {
                    data.push(stats[i].base_stat);
                }

                let dataSet = {...statGraphData.datasets[0], data:data};
                let dataSets = [];
                dataSets.push(dataSet);
                let graphData = {...statGraphData, datasets:dataSets}

                setStatGraphData(graphData);
            }

            const types = target_pokemon.type;

            if(types !== undefined)
            {
                let typeChart = getTypeChart(types);
                let new_resistances = {
                    "weak":[],
                    "super_weak":[],
                    "resistant":[],
                    "super_resistant":[],
                    "immune":[]
                }

                new_resistances.weak = typeChart.weaknesses;
                new_resistances.super_weak = typeChart.super_weaknesses;
                new_resistances.resistant = typeChart.strengths;
                new_resistances.super_resistant = typeChart.super_strengths;
                new_resistances.immune = typeChart.immunes;

                setResistances(new_resistances);
            }
        }
    },[all_pokemon, myPokemon])


    useEffect(()=>{
        async function fetch_move_desc()
        {
            if(selectedMove.name === '')
                return;

            try{
                let request = await info_axios.get(`/move/${selectedMove.name}`);
                if(request.status!==200)
                {
                    throw new Error(`Request failed with status code ${request.status}`);
                }
                
                const move = request.data;
                for(let i in move.flavor_text_entries)
                {
                    const desc = move.flavor_text_entries[i];
                    if(desc.language.name === 'en')
                    {
                        setSelectedMove({name:selectedMove.name,desc:desc.flavor_text})
                        break;
                    }
                }
            }catch(error)
            {
                console.log(error)
            }
        }
        fetch_move_desc();
    },[selectedMove.name])

    function add_pokemon_to_party(pokemon: PokeType)
    {
        dispatch(add_to_party(pokemon))
        return true; 
    }
    
    function change_party_poke_ability(party_pokemon:any)
    {
        if(!pokemonName)
            return false;

        if(SelectedPartyPokemon.pokemon === null)
            return false;

        const cloning_from = SelectedPartyPokemon.pokemon;

        if(cloning_from === undefined)
            return false;
        
        const new_ability:AbilityType = {
            name:selectedAbility.name,
            description:selectedAbility.desc,
        } 

        const cloned_pokemon = {...cloning_from, selectedAbility:new_ability}
        const action = {
            index: parseInt(party_pokemon.index),
            pokemon:cloned_pokemon
        };
        dispatch(update_party_pokemon(action));
    };
    
    function change_party_poke_move(party_pokemon:any)
    {
        if(!pokemonName)
            return false;

        if(SelectedPartyPokemon.pokemon === null)
            return false;

        const cloning_from = SelectedPartyPokemon.pokemon;
        if(cloning_from === undefined)
            return false;
        
        if(SelectedPartyPokemon?.pokemon?.selectedMoves)
        {
            for(let i in SelectedPartyPokemon?.pokemon?.selectedMoves)
            {
                let move = SelectedPartyPokemon?.pokemon?.selectedMoves[i]
                if(move.name === selectedMove.name)
                    return false;
            }
        }
        
        const new_move:MoveType = {
            name:selectedMove.name,
            description:selectedMove.desc,
        } 

        let old_moves = SelectedPartyPokemon?.pokemon.selectedMoves;
        if(old_moves && old_moves?.length > 3)
            return false;
        
        if(typeof old_moves === "undefined")
            old_moves = []
        
        old_moves = [...old_moves,new_move]

        const cloned_pokemon = {...cloning_from, selectedMoves:old_moves}
        const action = {
            index: parseInt(party_pokemon.index),
            pokemon:cloned_pokemon
        };
        setSelectedPartyPokemon(
            {
                pokemon:cloned_pokemon,
                index:SelectedPartyPokemon.index
            });
        setPartyPokemonMoves(old_moves);
        dispatch(update_party_pokemon(action));
    };

    useEffect(()=>{
        let new_party_pokemon = []

        for(let i in party_pokemon)
        {
            if(party_pokemon[i].name === pokemonName)
            {
                new_party_pokemon.push(
                    {
                        pokemon: party_pokemon[i],
                        index: parseInt(i)
                    }
                );
            }
        }

        setSamePartyPokemon(new_party_pokemon)
        setSelectedPartyPokemon(new_party_pokemon[0])
        if(new_party_pokemon[0])
        {
            let moves = new_party_pokemon[0].pokemon.selectedMoves || []
            setPartyPokemonMoves(moves)
        }
    },[party_pokemon.length])

    function changeSelectedPartyPokemon(e:any)
    {
        let name = e.target.value.split(' ');
        let index = parseInt(name[name.length-1]);
        setSelectedPartyPokemon(same_party_pokemon[index])
        let moves = same_party_pokemon[index].pokemon.selectedMoves || []
        setPartyPokemonMoves(moves)
    }

    useEffect(()=>{
        if(SelectedPartyPokemon)
        {
            let index = SelectedPartyPokemon.index;
            let pokemon = party_pokemon[index]
            if(!pokemon?.selectedMoves)
            {
                setPartyPokemonMoves([])
                return;
            }
            
            setPartyPokemonMoves(pokemon?.selectedMoves)
        }
    },[SelectedPartyPokemon, party_pokemon])

    return(
        <div>
            {
                myPokemon?<div>
                    <div className='flex-col text-center'>
                        <h1>{displayName}</h1>
                        <img 
                            src={myPokemon.sprite}
                            alt={`${myPokemon.name}`}
                            className = "m-auto w-1/6"
                        />
                        <div className='flex justify-center'>
                            {
                                myPokemon.type?.map((type)=>
                                    <div className={`${pokemonTypeStyles[type]} font-semibold p-1 rounded text-sm my-1`} key={`class:${type}`}>{type}</div>
                                )
                            }
                        </div>
                        <button
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 border border-blue-500 hover:border-transparent rounded text-sm px-1'
                            onClick={()=>{add_pokemon_to_party(myPokemon)}}
                        >Add to party</button>
                    </div>
                    
                    <div className='bg-blue-50 text-center'>
                        {
                            same_party_pokemon.length>0?<div>
                            <div className=' font-semibold'>Select A {myPokemon.name} From Your Party</div>
                            <select className=' w-full'
                                onChange={(e)=>changeSelectedPartyPokemon(e)}
                            >
                                {same_party_pokemon.map((pokemon:any,index:number)=>(
                                    <option key={`selector:${index}`} value={`${pokemon.pokemon.name} ${index}`}>
                                        {pokemon.pokemon.name} {index+1}
                                    </option>
                                ))}
                            </select></div>:<></>
                        }
                        <hr></hr>
                    </div>

                    {
                        showResistances?<div>
                            <button 
                                onClick={()=>{setShowResistances(false)}} 
                                className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                    Hide Resistances
                            </button>
                            <div>
                            {
                                resistances.weak.length>0?<div className='flex flex-col gap-3 mb-4'>
                                    <h3 className='text-lg font-semibold'>Weak To:</h3>
                                    <div className='flex gap-4 flex-wrap'>
                                    {
                                        resistances.weak.map((type,index)=>{
                                            return <div className={`${pokemonTypeStyles[type]} p-1  rounded-md font-bold`} key={`weak${type}`}>
                                                {type}
                                            </div>
                                        })
                                    }
                                    </div>
                                </div>:<></>
                            }
                            </div>
                            <div>
                            {
                                resistances.super_weak.length>0?<div className='flex flex-col gap-3 mb-4'>
                                <h3 className='text-lg font-semibold'>Super Weak To:</h3>
                                <div className='flex gap-4 flex-wrap'>
                                {
                                    resistances.super_weak.map((type,index)=>{
                                        return <div className={`${pokemonTypeStyles[type]} p-1  rounded-md font-bold`} key={`super_weak${type}`}>
                                            {type}
                                        </div>
                                    })
                                }
                                </div>
                            </div>:<></>
                            }
                            </div>
                            <div>
                            {
                                resistances.resistant.length>0?<div className='flex flex-col gap-3 mb-4'>
                                <h3 className='text-lg font-semibold'>Resistant To:</h3>
                                <div className='flex gap-4 flex-wrap'>
                                {
                                    resistances.resistant.map((type,index)=>{
                                        return <div className={`${pokemonTypeStyles[type]} p-1  rounded-md font-bold`} key={`resist${type}`}>
                                            {type}
                                        </div>
                                    })
                                }
                                </div>
                            </div>:<></>
                            }
                            </div>

                            <div>
                            {
                                resistances.super_resistant.length>0?<div className='flex flex-col gap-3 mb-4'>
                                <h3 className='text-lg font-semibold'>Super Resistant To:</h3>
                                <div className='flex gap-4 flex-wrap'>
                                {
                                    resistances.super_resistant.map((type,index)=>{
                                        return <div className={`${pokemonTypeStyles[type]} p-1  rounded-md font-bold`} key={`super_resist${type}`}>
                                            {type}
                                        </div>
                                    })
                                }
                                </div>
                            </div>:<></>
                            }
                            </div>

                            <div>
                            {
                                resistances.immune.length>0?<div className='flex flex-col gap-3 mb-4'>
                                <h3 className='text-lg font-semibold'>Immune To:</h3>
                                <div className='flex gap-4 flex-wrap'>
                                {
                                    resistances.immune.map((type,index)=>{
                                        return <div className={`${pokemonTypeStyles[type]} p-1  rounded-md font-bold`} key={`immune${type}`}>
                                            {type}
                                        </div>
                                    })
                                }
                                </div>
                            </div>:<></>
                            }
                            </div>
                        </div>:<button 
                            onClick={()=>{setShowResistances(true);}} 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                Show Resistances
                        </button>
                    }

                    {showAbilities?<div>
                        <button 
                            onClick={()=>{setShowAbilities(false)}} 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                Hide Abilities
                        </button>
                        <div className='grid grid-cols-2'>
                            <div>
                                <h3 className='text-center h-8 bg-blue-50'>Abilities</h3>
                                <ul className='overflow-y-scroll h-64'>
                                {
                                    myPokemon.ability?.map((ability)=>
                                        <li 
                                            onClick={()=>{selectedAbility.name===ability.name?setSelectedAbility({name:'',desc:''}):setSelectedAbility({name:ability.name,desc:ability.description||''})}} 
                                            className={`${selectedAbility.name===ability.name?"bg-blue-50":""} cursor-pointer`}
                                            key={ability.name}>
                                                {ability.name}
                                            </li>
                                    )
                                }
                                </ul>
                            </div>
                            <div>
                                <h3 className='text-center h-8 bg-blue-50'>{selectedAbility.name}</h3>
                                <div>{selectedAbility.desc}</div>
                                {
                                    same_party_pokemon.length>0&&selectedAbility.name!==''?<div>
                                        <button onClick={()=>change_party_poke_ability(SelectedPartyPokemon)} className='font-semibold'>Use This Ability On Selected Pokemon</button>
                                    </div>:<></>
                                }
                                
                            </div>
                        </div>
                    </div>:<button 
                            onClick={()=>{setShowAbilities(true)}} 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                Show Abilities
                        </button>}
                    
                    {showMoves?<div>
                        <button 
                            onClick={()=>{setShowMoves(false)}} 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                Hide Moves
                        </button>
                        <div className='grid grid-cols-2'>
                            <div>
                                <h3 className='text-center bg-blue-50 h-8'>Moves</h3>
                                <ul className='overflow-y-scroll h-64'>
                                {
                                    myPokemon.move?.map((move)=>
                                        <li 
                                            onClick={()=>{selectedMove.name===move.name?setSelectedMove({name:'',desc:''}):setSelectedMove({name:move.name,desc:''})}} 
                                            className={
                                                `${selectedMove.name===move.name?"bg-blue-50":""} 
                                                ${partyPokemonMoves.some(partyMove => move.name === partyMove.name) ? "bg-red-200" : ""}
                                                cursor-pointer` }
                                            key={move.name}>
                                                {move.name}
                                            </li>
                                    )
                                }
                                </ul>
                            </div>
                            <div>
                                <h3 className='text-center h-8 bg-blue-50'>{selectedMove.name}</h3>
                                <div className='mb-2'>{selectedMove.desc}</div>
                                {
                                    same_party_pokemon.length>0&&selectedMove.name!==''?<div>
                                        <button onClick={()=>change_party_poke_move(SelectedPartyPokemon)} className='font-semibold'>Add This Move To Selected Pokemon</button>
                                    </div>:<></>
                                }
                            </div>
                        </div>
                    </div>:<button 
                            onClick={()=>{setShowMoves(true)}} 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                Show Moves
                        </button>}

                {showStats?<div>
                <button 
                    onClick={()=>{setShowStats(false)}} 
                    className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                        Hide Stats
                </button>
                <div className='flex justify-center'>
                    <div className='lg:w-1/2'>
                        <Chart type='doughnut' data={statGraphData}/>
                    </div>
                </div>
                </div>:<button 
                            onClick={()=>{setShowStats(true)}} 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full'>
                                Show Stats
                        </button>
                }
                </div>:<h1>Pokemon not found</h1>
            }
        </div>
    )
}