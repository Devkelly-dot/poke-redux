import { useEffect, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import { add_pokemon as add_to_all, update_pokemon } from './allPokemonSlice';
import info_axios from '../../lib/api/pokeinfo_api'
import { RootState } from "../../app/store";
import { PokeType, StatType } from "./definePokemon";
import DisplayPokeBox from './DisplayPokebox';
import { useLocation } from 'react-router-dom';

export default function RandomPokeContainer()
{
    const location = useLocation();
    const page_numbers_shown = [1,2,3]; // numbers at the bottom of the page that you click on to go to that specific page

    const [displayedPokemon,setDisplayedPokemon] = useState<PokeType[]>([])
    const [page, setPage] = useState(0);
    const [poke_count,setPokeCount] = useState(12); // show 12 pokemon

    const dispatch = useDispatch()
    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);
    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name')?.toLowerCase();

    let filteredPokemon:PokeType[]; 

    if(name)
    {
        filteredPokemon = all_pokemon.filter(pokemon=>pokemon.name.includes(name));
    }
    else
    {
        filteredPokemon = all_pokemon;
    }

    useEffect(()=>{ // initial setup
        function initial_setup()
        {
            setDisplayFromArray(filteredPokemon.slice(page*poke_count,(page*poke_count)+poke_count));
        }

        initial_setup();
    },[filteredPokemon.length,location])

    function handlePageSwitch(new_page:number)
    {
        if(new_page<0)
            return false;
        
        if(filteredPokemon.slice(new_page*poke_count,(new_page*poke_count)+poke_count).length > 0)
        {
            setPage(new_page)
            // set the display as soon as the page changes, this array will not have the extra information about the pokemon YET 
            // that will be set in the useEffect further down. Do this so that the page loads faster because all we need to show the user is the name and image
            // then when the types and other info load we will tag those on. 
            setDisplayedPokemon(filteredPokemon.slice(new_page*poke_count,(new_page*poke_count)+poke_count))
        }     
    }

    async function setDisplayFromArray(pokemon_array:PokeType[])
    {
        // fetches extra info on pokemon so we don't have to hit 300+ endpoints on immediate load. Instead we fetch as we need per page / search / filter
        for(let i in pokemon_array) 
        {
            const target_pokemon = pokemon_array[i];
            let name = target_pokemon.name;
            if(target_pokemon.type) // if we already have the pokemon's types / info we don't need to fetch it again
            {
                continue
            }

            try{
                let request = await info_axios.get(`/pokemon/${name}`);
                if(request.status!==200)
                {
                    throw new Error(`Request failed with status code ${request.status}`);
                }
                const fetch_types = request.data.types;
                let types = []

                for(let i in fetch_types)
                {
                    types.push(fetch_types[i].type.name)
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

                const new_pokemon:PokeType = {
                    name: target_pokemon.name,
                    sprite:pokemon_array[i].sprite,
                    type:types,
                    stat:stats,
                }

                pokemon_array[i] = new_pokemon;
                dispatch(update_pokemon({name: new_pokemon.name,pokemon: new_pokemon}))
            } catch (error) {
                console.error(error);
                continue;
            }
        }   
        
        setDisplayedPokemon(pokemon_array);
    }

    function handleCountChange(event:any)
    {
        const new_count = parseInt(event.target.value)
        setPokeCount(new_count);
        setDisplayedPokemon(filteredPokemon.slice(page*new_count,(page*new_count)+new_count))
    }

    useEffect(()=>{
        setDisplayFromArray(filteredPokemon.slice(page*poke_count,(page*poke_count)+poke_count));
    },[page, poke_count])

    return(
        <div>
                <label>
                    Choose the number of Pokemon:
                <select value={poke_count} onChange={handleCountChange}>
                    <option value={12}>12</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>
                </label>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-y-2'>
            {
                displayedPokemon.map((pokemon,index)=><div key={"randomBox:"+pokemon.name}>
                    <DisplayPokeBox pokemon = {pokemon} index = {index}/>
                </div>)
            }
            </div>
            <div className='flex gap-2'>
                {
                    page!==0?<button onClick={()=>{handlePageSwitch(page-1)}}>Previous</button>:<></>
                }

                {
                    page<page_numbers_shown.length?
                    page_numbers_shown.map((element, index)=>
                        <button onClick={()=>{handlePageSwitch(index)}} className={index===page?"text-blue-500":""} key={`button:${Math.random()}${index}`}>{index+1}</button>):(
                    <>
                    <button onClick={()=>{handlePageSwitch(0)}}>{1}</button>
                    <div>...</div>
                    <button onClick={()=>{handlePageSwitch(page-1)}}>{page}</button>
                    <div className='text-blue-500'>{page+1}</div>
                    
                    {
                        page!==Math.ceil(filteredPokemon.length / poke_count) - 1?
                            <button onClick={()=>{handlePageSwitch(page+1)}}>{page+2}</button>:(<></>)
                    }
                    </>
                    )
                }

                {
                    (page!==Math.ceil(filteredPokemon.length / poke_count) - 1 && page!==Math.ceil(filteredPokemon.length / poke_count)-2)?<>
                        <div>...</div>
                        <button onClick={()=>{handlePageSwitch(Math.ceil(filteredPokemon.length / poke_count) - 1)}}>{Math.ceil(filteredPokemon.length / poke_count)}</button>
                    </>:(<></>)
                }

                {
                    (page!==Math.ceil(filteredPokemon.length / poke_count) - 1)?
                        <button onClick={()=>{handlePageSwitch(page+1)}}>Next</button>:(<></>)
                }
                
            </div>
        </div>
    )
}