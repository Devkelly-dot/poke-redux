import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import pokemonTypeStyles  from '../partials/pokemon/pokemonTypeStyles'
import { update_pokemon } from '../partials/pokemon/allPokemonSlice';
import info_axios from '../lib/api/pokeinfo_api'
import { useEffect, useState } from 'react';
import { PokeType } from "../partials/pokemon/definePokemon";

export default function PokemonInfo()
{
    const dispatch = useDispatch()
    const {pokemonName} = useParams();
    let displayName = ""
    if(pokemonName)
        displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);

    const [myPokemon,setMyPokemon] = useState<PokeType>()

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
                const fetch_types = request.data.types;
                let types = []

                for(let i in fetch_types)
                {
                    types.push(fetch_types[i].type.name)
                }

                const new_pokemon:PokeType = {
                    name: pokemon.name,
                    sprite:pokemon.sprite,
                    type:types,
                    hasFetched:true,
                }
                dispatch(update_pokemon({name: new_pokemon.name,pokemon: new_pokemon}))
                setMyPokemon(new_pokemon);

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
    },[all_pokemon])

    return(
        <>
            {
                myPokemon?<div>
                    <div className='flex-coltext-center'>
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
                    </div>
                </div>:<h1>Pokemon not found</h1>
            }
        </>
    )
}