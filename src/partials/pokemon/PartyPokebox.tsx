import { useDispatch } from "react-redux"
import { remove_pokemon } from "./partySlice"
import { PokeType } from "./definePokemon";
import { Link } from "react-router-dom";

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
        <div className="flex-col text-center p-4">
            <Link to={`/party/${index}`}>
                <img src={pokemon.sprite} alt={`${pokemon.name} sprite`} className="m-auto h-16" />
                <div><b>{pokemon.name}</b></div>
            </Link>
            <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 border border-blue-500 hover:border-transparent rounded text-sm px-1" 
                onClick={removePokemon}>
                Remove from party
            </button>
        </div>
    )
}

export default SinglePokebox