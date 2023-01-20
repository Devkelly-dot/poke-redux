import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import { PokeType, StatType } from '../partials/pokemon/definePokemon';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { update_pokemon } from '../partials/pokemon/partySlice';
import PokeMoveContainer from '../partials/moves/PokeMoveContainer';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import info_axios from '../lib/api/pokeinfo_api'

export default function PartyPokemonInfo()
{
    const starting_evs = 510;
    const max_stat_ev = 252;

    const dispatch = useDispatch();

    const party = useSelector((state:RootState)=>state.party.party);
    const natures = useSelector((state:RootState)=>state.misc.natures);

    const [myPokemon, setMyPokemon] = useState<PokeType>();
    const [selectedNature,setSelectedNature] = useState(natures[0]);
    const [evsLeft, setEvsLeft] = useState(starting_evs);

    const [graphData,setGraphData] = useState(
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
                data: [0, 0, 0, 0, 0, 0],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }, {
                label: 'With EV Bonuses',
                data: [0, 0, 0, 0, 0, 0],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        }
    );

    const {index}=useParams();

    useEffect(()=>{
        async function getBaseStats(myPokemon:PokeType)
        {
            if(!index)
                return;

            let request = await info_axios.get(`/pokemon/${myPokemon.name}`);
            if(request.status!==200)
            {
                throw new Error(`Request failed with status code ${request.status}`);
            }
            let stats:StatType[] = []
            const pokemon = request.data;

            for(let i in pokemon.stats)
            {
                let current_stat = pokemon.stats[i];

                let push_stat:StatType = {
                    base_stat:0,
                    effort_value:0,
                    name:"none"
                };

                push_stat.base_stat = current_stat.base_stat;
                push_stat.name = current_stat.stat.name;

                stats.push(push_stat);
            }

            const cloning_from = party[Number(index)];
            const cloned_pokemon = {...cloning_from, stat:stats}
            const action = {
                index: parseInt(index),
                pokemon:cloned_pokemon
            };

            dispatch(update_pokemon(action))
        }

        function createData(pokemon:PokeType)
        {
            if(!pokemon.stat)
                return graphData;

            let new_data = {
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
                    data: [
                        pokemon.stat[0].base_stat,
                        pokemon.stat[1].base_stat,
                        pokemon.stat[2].base_stat,
                        pokemon.stat[3].base_stat,
                        pokemon.stat[4].base_stat,
                        pokemon.stat[5].base_stat],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: 'With EV Bonuses',
                    data: [
                        pokemon.stat[0].base_stat +  Math.floor(pokemon.stat[0].effort_value / 4),
                        pokemon.stat[1].base_stat +  Math.floor(pokemon.stat[1].effort_value / 4),
                        pokemon.stat[2].base_stat +  Math.floor(pokemon.stat[2].effort_value / 4),
                        pokemon.stat[3].base_stat +  Math.floor(pokemon.stat[3].effort_value / 4),
                        pokemon.stat[4].base_stat +  Math.floor(pokemon.stat[4].effort_value / 4),
                        pokemon.stat[5].base_stat +  Math.floor(pokemon.stat[5].effort_value / 4)
                    ],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            }

            return new_data;
        }

        function getInitialEvs(pokemon:PokeType)
        {
            let evs = starting_evs;
            if(!pokemon.stat)
                return evs;

            for(let i in pokemon.stat)
            {
                evs -= pokemon.stat[i].effort_value;
            }
            
            return evs;
        }

        let pokemon;
        
        if(index)
            pokemon = party[parseInt(index)]
        else return;

        setMyPokemon(pokemon);
        if(pokemon && pokemon.selectedNature)
            setSelectedNature(pokemon.selectedNature);
        
        if(pokemon && pokemon.stat)
        {
            setEvsLeft(getInitialEvs(pokemon));
            setGraphData(createData(pokemon));
        }
        else if(pokemon && !pokemon.stat)
        {
            getBaseStats(pokemon);
            setEvsLeft(getInitialEvs(pokemon));
            setGraphData(createData(pokemon));
        }
    },[index, party])

    function handleNatureChange(e:any)
    {
        const new_nature = natures[e.target.value]
        setSelectedNature(new_nature)
        
        if (typeof index === "string" && !isNaN(+index) && +index >= 0 && +index < party.length)
        {
            const cloning_from = party[Number(index)];
            const cloned_pokemon = {...cloning_from, selectedNature:new_nature}
            const action = {
                index: parseInt(index),
                pokemon:cloned_pokemon
            };

            dispatch(update_pokemon(action))
        } 
    }
    
    function changeEv(new_value:any, stat:any)
    {
        if(!index)
            return;

        if(new_value > max_stat_ev)
            new_value = max_stat_ev;

        const stat_clone = {...stat, effort_value:new_value}
        const cloning_from = party[Number(index)];
        if(!cloning_from.stat)
            return;
        
        let new_stats = [];

        for(let i in cloning_from.stat)
        {
            if(cloning_from.stat[i].name !== stat_clone.name)
            {
                new_stats.push(cloning_from.stat[i])
                continue;
            }
            new_stats.push(stat_clone);
        }

        const cloned_pokemon = {...cloning_from, stat:new_stats}
        const action = {
            index: parseInt(index),
            pokemon:cloned_pokemon
        };
        dispatch(update_pokemon(action))
    }

    return(
        <div className=''>
            {
                myPokemon?<div className='flex flex-col align-center'>
                    <h2 className='text-4xl'>{myPokemon.name.charAt(0).toLocaleUpperCase()+myPokemon.name.slice(1)}</h2>
                    <Link to={`/pokemon/${myPokemon.name}`} className='text-blue-600 font-bold'><button>View Full Pokemon Page To Edit Your {myPokemon.name.charAt(0).toLocaleUpperCase()+myPokemon.name.slice(1)}</button></Link>
                    <img 
                            src={myPokemon.sprite}
                            alt={`${myPokemon.name}`}
                            className = "m-auto w-1/6"
                    />
                    <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            {
                                myPokemon.selectedAbility?<div>
                                    <div className='text-center'><b>Ability: {myPokemon.selectedAbility?.name} </b></div>
                                    <div>{myPokemon.selectedAbility?.description}</div>
                                </div>:(<></>)
                            }
                        </div>
                        
                        <div>
                            <h3 className='text-center'><b>Moves</b></h3>
                            <PokeMoveContainer moves = {myPokemon.selectedMoves}/>
                        </div>
                    </div>

                    <div className='grid grid-cols-1'>
                        <h2 className='font-semibold'>Nature</h2>
                        <div>{selectedNature.name}</div>
                        <select onChange={handleNatureChange} defaultValue={selectedNature.index}>
                            {natures.map((nature,indx)=>
                                <option key={nature.name} value={nature.index}>{nature.name} &#40;
                                    {nature.increased_stat&&`+${nature.increased_stat}`} / 
                                    {nature.decreased_stat&&`-${nature.decreased_stat}`}&#41;
                                </option>
                            )}
                        </select>
                    </div>

                    <div className='grid lg:grid-cols-2 md:grid-cols-1 my-4 '>
                        <div> 
                            <div className='flex justify-between'>
                                <h2 className='font-bold'>Stats</h2>
                                <h2 className='font-bold'>EVs Left: <span className={`${(evsLeft<0&&'text-red-600')||'text-green-600'}`}>{evsLeft}</span></h2>
                            </div>
                            <hr className="h-px bg-black border-0"></hr>
                            <div className='flex flex-col justify-between'> 
                            {
                                myPokemon.stat?.map((stat,indx)=>{
                                    return <div key={`evPlanner:${stat.name}`}>
                                        <div className='font-bold'>{stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}</div>
                                        <div>Base: {stat.base_stat}</div>
                                        <div className='flex justify-between'>
                                            <div>EVs: {stat.effort_value} </div>
                                            <input 
                                                type='number'
                                                defaultValue={stat.effort_value} 
                                                className='w-1/2 bg-white'
                                                onBlur={(e)=>{
                                                    if (e.target.value.match(/^[0-9]+$/)) {
                                                        changeEv(e.target.value, stat);
                                                    }
                                                    if(e.target.value==='')
                                                    {
                                                        changeEv(0, stat);
                                                        e.target.value='0';
                                                    }

                                                    if(parseInt(e.target.value)>max_stat_ev)
                                                        e.target.value=String(max_stat_ev);
                                                }}
                                            />
                                        </div>
                                        <div>Total: {stat.base_stat+Math.floor(stat.effort_value/4)}</div>
                                    </div>
                                })
                            }
                            </div>
                        </div>
                        <div className='w-full'>
                            <Chart type='radar' data={graphData}/>
                        </div>
                    </div>
                    
                </div>:<div>No Pokemon Here</div>
            }
        </div>
    )
}