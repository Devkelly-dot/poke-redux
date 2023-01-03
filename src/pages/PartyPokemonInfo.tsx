import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import { PokeType } from '../partials/pokemon/definePokemon';
import { useEffect, useState } from 'react';

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
        <div>
            {
                myPokemon?<div>
                    
                    {myPokemon.name}
                    {myPokemon.selectedAbility?.description}
                </div>:<div>No Pokemon Here</div>
            }
        </div>
    )
}
