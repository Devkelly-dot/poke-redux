import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import { PokeType } from '../partials/pokemon/definePokemon';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { update_pokemon } from '../partials/pokemon/partySlice';
import PokeMoveContainer from '../partials/moves/PokeMoveContainer';

export default function PartyPokemonInfo()
{
    const dispatch = useDispatch();

    const party = useSelector((state:RootState)=>state.party.party);
    const natures = useSelector((state:RootState)=>state.misc.natures);

    const [myPokemon, setMyPokemon] = useState<PokeType>();
    const [selectedNature,setSelectedNature] = useState(natures[0]);
    
    const {index}=useParams();

    useEffect(()=>{
        let pokemon;
        
        if(index)
            pokemon = party[parseInt(index)]
        else return;

        setMyPokemon(pokemon);
        if(pokemon && pokemon.selectedNature)
            setSelectedNature(pokemon.selectedNature)
    },[index, party])

    function handleNatureChange(e:any)
    {
        const new_nature = natures[e.target.value]
        setSelectedNature(new_nature)
        
        if (typeof index === "string" && !isNaN(+index) && +index >= 0 && +index < party.length)
        {
            const cloning_from = party[Number(index)];
            const cloned_pokemon = {...cloning_from, selectedNature:new_nature}
            const action = {
                index: parseInt(index),
                pokemon:cloned_pokemon
            };

            dispatch(update_pokemon(action))
        } 
    }
    
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

                    <div>
                        <h2 className='font-semibold'>Nature</h2>
                        <div>{selectedNature.name}</div>
                        <select onChange={handleNatureChange} defaultValue={selectedNature.index}>
                            {natures.map((nature,indx)=>
                                <option key={nature.name} value={nature.index}>{nature.name} &#40;
                                    {nature.increased_stat&&`+${nature.increased_stat}`} / 
                                    {nature.decreased_stat&&`-${nature.decreased_stat}`}&#41;
                                </option>
                            )}
                        </select>
                    </div>
                </div>:<div>No Pokemon Here</div>
            }
        </div>
    )
}