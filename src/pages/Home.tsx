import PageLayout from "../layouts/PageLayout"
import getStyles from "../lib/getStyles"
import RandomPokeContainer from "../partials/pokemon/RandomPokeContainer";

export default function Home()
{
    const globalStyles = getStyles()

    return(
        <>
            <PageLayout>
                <h1 className={globalStyles.pageHeader}>Home</h1>
                <RandomPokeContainer/>
            </PageLayout>
        </>
    )
    
}