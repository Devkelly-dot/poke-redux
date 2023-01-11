import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import { PokeType } from '../partials/pokemon/definePokemon';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PokeMoveContainer from '../partials/moves/PokeMoveContainer';

export default function PartyPokemonInfo()
{
    const [myPokemon, setMyPokemon] = useState<PokeType>()
    const {index}=useParams()
    const party = useSelector((state:RootState)=>state.party.party);

    useEffect(()=>{
        let pokemon;
        
        if(index)
            pokemon = party[parseInt(index)]
        else return;

        setMyPokemon(pokemon);
    },[index, party])

    return(
        <div className=' px-12'>
            {
                myPokemon?<div className='flex flex-col align-center'>
                    <h2 className='text-4xl'>{myPokemon.name.charAt(0).toLocaleUpperCase()+myPokemon.name.slice(1)}</h2>
                    <Link to={`/pokemon/${myPokemon.name}`} className='text-blue-600 font-bold'><button>View Full Pokemon Page To Edit Your {myPokemon.name.charAt(0).toLocaleUpperCase()+myPokemon.name.slice(1)}</button></Link>
                    <img 
                            src={myPokemon.sprite}
                            alt={`${myPokemon.name}`}
                            className = "m-auto w-1/6"
                    />
                    <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            {
                                myPokemon.selectedAbility?<div>
                                    <div className='text-center'><b>Ability: {myPokemon.selectedAbility?.name} </b></div>
                                    <div>{myPokemon.selectedAbility?.description}</div>
                                </div>:(<></>)
                            }
                        </div>
                        
                        <div>
                            <h3 className='text-center'><b>Moves</b></h3>
                            <PokeMoveContainer moves = {myPokemon.selectedMoves}/>
                        </div>
                    </div>
                </div>:<div>No Pokemon Here</div>
            }
        </div>
    )
}
