import PageLayout from "../layouts/PageLayout"
import getStyles from "../lib/getStyles"
import { useEffect } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import { add_pokemon } from '../partials/pokemon/allPokemonSlice';
import info_axios from '../lib/api/pokeinfo_api'
import image_axios from '../lib/api/pokeimages_api'
import { RootState } from "../app/store";

export default function Home()
{
    type PokeType = {
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
                const dispatch_pokemon: PokeType = {
                    name: name,
                    search_image: search_image
                }

                dispatch(add_pokemon(dispatch_pokemon))
            }
        }

        if(all_pokemon.length < 1)
            setAllPokemon();
    },[])


    return(
        <>
            <PageLayout>
                <h1 className={globalStyles.pageHeader}>Home</h1>
                {
                    all_pokemon.map((pokemon)=><div key={pokemon.name}>
                        <img src = {pokemon.search_image} alt = {`${pokemon.name}`}/>
                        <b>{pokemon.name}</b>
                    </div>)
                }
            </PageLayout>
        </>
    )
    
}