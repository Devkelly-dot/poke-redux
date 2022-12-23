import SinglePokebox from "../pokemon/SinglePokebox";
import { useSelector, useDispatch } from "react-redux";
import { add_pokemon } from "../pokemon/partySlice";
import { RootState } from "../../app/store";

export default function SidebarPokemon()
{
    const dispatch = useDispatch();
    const party = useSelector((state:RootState)=>state.party.party);
    const bulbasaur = {
        name: "Bulbasaur",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        type: ["Grass","Poison"]
    }

    function add_bulbasaur()
    {
        dispatch(add_pokemon(bulbasaur))
        return true; 
    }
    return(
        <div>
            <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded" 
                onClick={add_bulbasaur}>
                add a bulbasaur
            </button>
            <h2>Your Pokemon</h2>
            {
                party.map((pokemon,index)=>
                    <SinglePokebox pokemon={pokemon}  key={pokemon.name+(Math.random().toString())} index={index}/>
                )
            }
        </div>
    )
}