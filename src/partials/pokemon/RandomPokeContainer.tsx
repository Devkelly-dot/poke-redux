import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import { add_pokemon as add_to_all, update_pokemon } from './allPokemonSlice';
import info_axios from '../../lib/api/pokeinfo_api'
import { RootState } from "../../app/store";
import { PokeType } from "./definePokemon";
import DisplayPokeBox from './DisplayPokebox';

export default function RandomPokeContainer()
{
    const poke_count = 18; // show 12 pokemon
    const page_numbers_shown = [1,2,3]; // numbers at the bottom of the page that you click on to go to that specific page

    const [displayedPokemon,setDisplayedPokemon] = useState<PokeType[]>([])
    const [page, setPage] = useState(0);

    const dispatch = useDispatch()
    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);

    useEffect(()=>{ // initial setup
        async function setAllPokemon()
        {
            let request = await info_axios.get('/generation/generation-i')
            const local_all_pokemon:PokeType[] = [];
            for(let i = 0; i<request.data.pokemon_species.length; i++)
            {
                const pokemon = request.data.pokemon_species[i];
                const name:string = pokemon.name;
                let image_url_name = name;

                if(name === 'nidoran-f') // the image url's name is slightly different for some specific cases
                    image_url_name = 'nidoran_f'
                if(name === 'nidoran-m')
                    image_url_name = 'nidoran_m'
                if(name === 'mr-mime')
                    image_url_name = 'mr.mime'

                const url = `https://projectpokemon.org/images/normal-sprite/${image_url_name}.gif`

                const dispatch_pokemon: PokeType = {
                    name: name,
                    sprite: url,
                }

                dispatch(add_to_all(dispatch_pokemon))
                local_all_pokemon.push(dispatch_pokemon)
            }

            request = await info_axios.get('/generation/generation-ii')
            for(let i = 0; i<request.data.pokemon_species.length; i++)
            {
                const pokemon = request.data.pokemon_species[i];
                let name:string = pokemon.name;
                const url = `https://projectpokemon.org/images/normal-sprite/${name}.gif`

                const dispatch_pokemon: PokeType = {
                    name: name,
                    sprite: url,
                }

                dispatch(add_to_all(dispatch_pokemon))
                local_all_pokemon.push(dispatch_pokemon)
            }

            request = await info_axios.get('/generation/generation-iii')
            for(let i = 0; i<request.data.pokemon_species.length; i++)
            {
                const pokemon = request.data.pokemon_species[i];
                let name:string = pokemon.name;
                const url = `https://projectpokemon.org/images/normal-sprite/${name}.gif`

                const dispatch_pokemon: PokeType = {
                    name: name,
                    sprite: url,
                }

                dispatch(add_to_all(dispatch_pokemon))
                local_all_pokemon.push(dispatch_pokemon)
            }

            return local_all_pokemon;
        }

        async function initial_setup()
        {
            if(all_pokemon.length < 1)
            {
                let local_all_pokemon = await setAllPokemon();
                setDisplayFromArray(local_all_pokemon.slice(page*poke_count,(page*poke_count)+poke_count))
            }
            else
            {
                setDisplayFromArray(all_pokemon.slice(page*poke_count,(page*poke_count)+poke_count));
            }
        }

        initial_setup();
    },[])

    function handlePageSwitch(new_page:number)
    {
        if(new_page<0)
            return false;
        
        if(all_pokemon.slice(new_page*poke_count,(new_page*poke_count)+poke_count).length > 0)
            setPage(new_page)
    }

    async function setDisplayFromArray(pokemon_array:PokeType[])
    {
        // fetches extra info on pokemon so we don't have to hit 300+ endpoints on immediate load. Instead we fetch as we need per page / search / filter
        for(let i in pokemon_array) 
        {
            const target_pokemon = pokemon_array[i];
            let name = target_pokemon.name;
            let request = await info_axios.get(`/pokemon/${name}`);
            const fetch_types = request.data.types;
            let types = []

            for(let i in fetch_types)
            {
                types.push(fetch_types[i].type.name)
            }

            const new_pokemon:PokeType = {
                name: target_pokemon.name,
                sprite:pokemon_array[i].sprite,
                type:types,
            }

            pokemon_array[i] = new_pokemon;
            dispatch(update_pokemon({name: new_pokemon.name,pokemon: new_pokemon}))
        }   
        
        setDisplayedPokemon(pokemon_array);
    }

    useEffect(()=>{
        setDisplayFromArray(all_pokemon.slice(page*poke_count,(page*poke_count)+poke_count));
    },[page])

    return(
        <div>
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
                        page!==Math.ceil(all_pokemon.length / poke_count) - 1?
                            <button onClick={()=>{handlePageSwitch(page+1)}}>{page+2}</button>:(<></>)
                    }
                    </>
                    )
                }

                {
                    (page!==Math.ceil(all_pokemon.length / poke_count) - 1 && page!==Math.ceil(all_pokemon.length / poke_count)-2)?<>
                        <div>...</div>
                        <button onClick={()=>{handlePageSwitch(Math.ceil(all_pokemon.length / poke_count) - 1)}}>{Math.ceil(all_pokemon.length / poke_count)}</button>
                    </>:(<></>)
                }

                {
                    (page!==Math.ceil(all_pokemon.length / poke_count) - 1)?
                        <button onClick={()=>{handlePageSwitch(page+1)}}>Next</button>:(<></>)
                }
                
            </div>
        </div>
    )
}