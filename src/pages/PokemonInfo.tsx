import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import pokemonTypeStyles  from '../partials/pokemon/pokemonTypeStyles'

export default function PokemonInfo()
{
    const {pokemonName} = useParams();
    let displayName = ""
    if(pokemonName)
        displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);
    const myPokemon = all_pokemon.find((p)=>p.name===pokemonName)

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
                                    <div className={`${pokemonTypeStyles[type]} font-semibold p-1 rounded text-sm my-1`}>{type}</div>
                                )
                            }
                        </div>
                    </div>
                </div>:<h1>Pokemon not found</h1>
            }
        </>
    )
}