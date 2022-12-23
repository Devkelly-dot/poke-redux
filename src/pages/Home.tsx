import PageLayout from "../layouts/PageLayout"
import getStyles from "../lib/getStyles"
import { useEffect } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import { add_pokemon as add_to_all } from '../partials/pokemon/allPokemonSlice';
import { add_pokemon as add_to_party } from "../partials/pokemon/partySlice";
import info_axios from '../lib/api/pokeinfo_api'
import image_axios from '../lib/api/pokeimages_api'
import { RootState } from "../app/store";
import { PokeType } from "../partials/pokemon/definePokemon";

export default function Home()
{
    type AllPokeType = { // AllPokeType and PokeType have differnet values because AllPokeType is more general (just name and image url)
        name: string,
        search_image:string,
    }
    
    const globalStyles = getStyles()
    const dispatch = useDispatch()
    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);
    

    useEffect(()=>{
        async function setAllPokemon()
        {
            const request = await info_axios.get('/generation/generation-i')
            for(let i in request.data.pokemon_species)
            {
                const pokemon = request.data.pokemon_species[i];
                const name:string = pokemon.name;
                // const regex = /pokemon-species\/\d+/;
                // const id = parseInt(pokemon.url.match(regex)[0].replace('pokemon-species/',''));
                const search_image:string = `https://projectpokemon.org/images/normal-sprite/${name}.gif`
                const dispatch_pokemon: AllPokeType = {
                    name: name,
                    search_image: search_image
                }

                dispatch(add_to_all(dispatch_pokemon))
            }
        }

        if(all_pokemon.length < 1)
            setAllPokemon();
    },[])

    function add_pokemon_to_party(pokemon: AllPokeType)
    {
        const new_member: PokeType  = {
            name: pokemon.name,
            sprite: pokemon.search_image
        }

        dispatch(add_to_party(new_member))
        return true; 
    }

    return(
        <>
            <PageLayout>
                <h1 className={globalStyles.pageHeader}>Home</h1>
                {
                    all_pokemon.map((pokemon)=><div key={pokemon.name}>
                        <img src = {pokemon.search_image} alt = {`${pokemon.name}`}/>
                        <div className="flex gap-2">
                            <b>{pokemon.name}</b>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white p-1 text-sm rounded-full" onClick={()=>{add_pokemon_to_party(pokemon)}}>Add to party</button>
                        </div>
                    </div>)
                }
            </PageLayout>
        </>
    )
    
}