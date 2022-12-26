import { useDispatch } from "react-redux"
import { add_pokemon as add_to_party } from "./partySlice"
import { PokeType } from "./definePokemon";

interface PokeProps {
    pokemon:PokeType,
    index: number
}

const DisplayPokeBox: React.FC<PokeProps> = ({pokemon, index}:PokeProps) => {
    const dispatch = useDispatch();

    function add_pokemon_to_party(pokemon: PokeType)
    {
        dispatch(add_to_party(pokemon))
        return true; 
    }

    return(
        <div className="flex-col text-center">
            <img src={pokemon.sprite} alt={`${pokemon.name} sprite`} className="m-auto h-16 md:h-16"/>
            <div className="flex gap-2 justify-center">
                {
                    pokemon.type?.map((pokemonType,index)=>{
                        return(
                            <div>{pokemonType}</div>
                        )
                    })
                }
            </div>
            <div><b>{pokemon.name}</b></div>
            <button
                className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 border border-blue-500 hover:border-transparent rounded text-sm px-1'
                onClick={()=>{add_pokemon_to_party(pokemon)}}
            >Add to party</button>
        </div>
    )
}

export default DisplayPokeBox;