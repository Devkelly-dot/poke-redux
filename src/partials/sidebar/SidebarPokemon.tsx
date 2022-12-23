import SinglePokebox from "../pokemon/SinglePokebox";
import { useSelector} from "react-redux";
import { RootState } from "../../app/store";

export default function SidebarPokemon()
{
    const party = useSelector((state:RootState)=>state.party.party);

    return(
        <div>
            <h2>Your Pokemon</h2>
            {
                party.map((pokemon,index)=>
                    <SinglePokebox pokemon={pokemon}  key={pokemon.name+(Math.random().toString())} index={index}/>
                )
            }
        </div>
    )
}