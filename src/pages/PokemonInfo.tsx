import { useParams } from 'react-router-dom';

export default function PokemonInfo()
{
    const {pokemonName} = useParams();
    return(
        <>
            {pokemonName}
        </>
    )
}