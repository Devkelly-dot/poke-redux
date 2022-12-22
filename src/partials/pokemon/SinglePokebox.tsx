type PokeType = {
    name: string,
    sprite: string,
    type: string[],
}
interface PokeProps {
    pokemon:PokeType
}

const SinglePokebox: React.FC<PokeProps> = ({pokemon}:PokeProps) => {
    return(
        <div>
            {pokemon.name}
            <img src={pokemon.sprite} alt={`${pokemon.name} sprite`}/>
        </div>
    )
}

export default SinglePokebox