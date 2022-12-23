import { useDispatch } from "react-redux"
import { remove_pokemon } from "./partySlice"
import { PokeType } from "./definePokemon";

interface PokeProps {
    pokemon:PokeType,
    index: number
}

const SinglePokebox: React.FC<PokeProps> = ({pokemon, index}:PokeProps) => {
    const dispatch = useDispatch();

    function removePokemon()
    {
        dispatch(remove_pokemon(index))
    }

    return(
        <div className="bg-red-200 flex-col text-center">
            {pokemon.name}
            <img src={pokemon.sprite} alt={`${pokemon.name} sprite`} className="w-24 m-auto" />
            <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 border border-blue-500 hover:border-transparent rounded text-sm px-1" 
                onClick={removePokemon}>
                Remove from party
            </button>
        </div>
    )
}

export default SinglePokebox