import SinglePokebox from "../SinglePokebox";

export default function SidebarPokemon()
{
    const bulbasaur = {
        name: "Bulbasaur"
    }
    return(
        <div>
            <h2>Your Pokemon</h2>
            <SinglePokebox pokemon = {bulbasaur}/>
        </div>
    )
}