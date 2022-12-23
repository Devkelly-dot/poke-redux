import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import { add_pokemon as add_to_all, update_pokemon } from './allPokemonSlice';
import info_axios from '../../lib/api/pokeinfo_api'
import { RootState } from "../../app/store";
import { PokeType } from "./definePokemon";
import DisplayPokeBox from './DisplayPokebox';

export default function RandomPokeContainer()
{
    const poke_count = 12; // show 12 pokemon
    
    const [displayedPokemon,setDisplayedPokemon] = useState<PokeType[]>([])
    const [page, setPage] = useState(0);

    const dispatch = useDispatch()
    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);

    useEffect(()=>{
        async function setAllPokemon()
        {
            const request = await info_axios.get('/generation/generation-i')
            const local_all_pokemon:PokeType[] = [];
            for(let i = 0; i<request.data.pokemon_species.length; i++)
            {
                const pokemon = request.data.pokemon_species[i];
                let name:string = pokemon.name;

                const dispatch_pokemon: PokeType = {
                    name: name
                }

                dispatch(add_to_all(dispatch_pokemon))
                local_all_pokemon.push(dispatch_pokemon)
            }

            return local_all_pokemon;
        }

        async function setDisplayFromArray(pokemon_array:PokeType[])
        {
            for(let i in pokemon_array)
            {
                const target_pokemon = pokemon_array[i];
                // const regex = /pokemon-species\/\d+/;
                // const id = parseInt(pokemon.url.match(regex)[0].replace('pokemon-species/',''));
                let name = target_pokemon.name;
                if(name === 'nidoran-f') // the image url's name is slightly different for some specific cases
                    name = 'nidoran_f'
                if(name === 'nidoran-m')
                    name = 'nidoran_m'
                if(name === 'mr-mime')
                    name = 'mr.mime'

                
                const url = `https://projectpokemon.org/images/normal-sprite/${name}.gif`
                
                const new_pokemon:PokeType = {
                    name: target_pokemon.name,
                    sprite: url,
                }
                dispatch(update_pokemon({name: new_pokemon.name,pokemon: new_pokemon}))
            }   
            
            setDisplayedPokemon(pokemon_array);
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
    },[displayedPokemon, page, dispatch])

    function handlePageSwitch(new_page:number)
    {
        if(new_page<0)
            return false;
        
        if(all_pokemon.slice(new_page*poke_count,(new_page*poke_count)+poke_count).length > 0)
            setPage(new_page)
    }

    return(
        <div>
                {
                    displayedPokemon.map((pokemon,index)=><div key={"randomBox:"+pokemon.name}>
                        <DisplayPokeBox pokemon = {pokemon} index = {index}/>
                    </div>)
                }
                <div className='flex gap-2'>
                    <button onClick={()=>{handlePageSwitch(page-1)}}>Previous</button>
                    <button onClick={()=>{handlePageSwitch(page+1)}}>Next</button>
                </div>
        </div>
    )
}