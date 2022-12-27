import getStyles from "../lib/getStyles"
import RandomPokeContainer from "../partials/pokemon/RandomPokeContainer";
import PokeSearchBar from "../partials/PokeSearchBar";

export default function Home()
{
    const globalStyles = getStyles()

    return(
        <>
            <h1 className={globalStyles.pageHeader}>Home</h1>
            <PokeSearchBar/>
            <RandomPokeContainer/>
        </>
    )
    
}