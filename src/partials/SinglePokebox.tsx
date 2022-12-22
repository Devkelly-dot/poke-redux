type PokeType = {
    name: string
}
interface PokeProps {
    pokemon:PokeType
}

const SinglePokebox: React.FC<PokeProps> = ({pokemon}:PokeProps) => {
    return(
        <div>
            {pokemon.name}
        </div>
    )
}

export default SinglePokebox