import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { RootState } from "../app/store";
import pokemonTypeStyles  from '../partials/pokemon/pokemonTypeStyles'
import { update_pokemon } from '../partials/pokemon/allPokemonSlice';
import { add_pokemon as add_to_party, update_pokemon as update_party_pokemon } from '../partials/pokemon/partySlice';
import info_axios from '../lib/api/pokeinfo_api'
import { useEffect, useState } from 'react';
import { AbilityType, MoveType, PokeType } from "../partials/pokemon/definePokemon";

export default function PokemonInfo()
{
    const dispatch = useDispatch()
    const {pokemonName} = useParams();
    let displayName = ""
    if(pokemonName)
        displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    const all_pokemon = useSelector((state:RootState)=>state.allPokemon.pokemon);
    let party_pokemon = useSelector((state:RootState)=>state.party.party);

    
    const [myPokemon,setMyPokemon] = useState<PokeType>()
    const [SelectedPartyPokemon,setSelectedPartyPokemon] = useState(
        {
            pokemon: null as PokeType | null,
            index: 0
        }
        ) // the pokemon in our party that we add moves or abilities to
    const [selectedMove,setSelectedMove] = useState({name:'',desc:''})
    const [selectedAbility,setSelectedAbility] = useState({name:'',desc:''})
    const [same_party_pokemon,setSamePartyPokemon] = useState<{pokemon:PokeType, index:number}[]>([])
    const [partyPokemonMoves,setPartyPokemonMoves] = useState<MoveType[]>([])

    useEffect(()=>{
        async function fetch_pokeInfo(pokemon:PokeType)
        {
            try{
                const name = pokemon.name;
                let request = await info_axios.get(`/pokemon/${name}`);
                if(request.status!==200)
                {
                    throw new Error(`Request failed with status code ${request.status}`);
                }

                // get the types
                const fetch_types = request.data.types;
                let types = []

                for(let i in fetch_types)
                {
                    types.push(fetch_types[i].type.name)
                }
                
                // get the moves
                const fetch_moves = request.data.moves;
                let moves = []
                for(let i in fetch_moves)
                {
                    const new_move:MoveType = {
                        name:fetch_moves[i].move.name,
                        level:fetch_moves[i].version_group_details[0].level_learned_at,
                        method:fetch_moves[i].version_group_details[0].move_learn_method.name
                    }
                    moves.push(new_move);
                }

                // get the abilities
                const fetch_abilities = request.data.abilities;
                let abilities = []
                for(let i in fetch_abilities)
                {
                    const name = fetch_abilities[i].ability.name;
                    const fetch_description = await info_axios.get(`/ability/${name}`)

                    let english_index = 0;

                    for(let j in fetch_description.data.effect_entries)
                    {
                        if(fetch_description.data.effect_entries[j].language.name === 'en')
                        {
                            english_index = parseInt(j);
                            break;
                        }
                    }

                    const description = fetch_description.data.effect_entries[english_index].effect

                    const new_ability:AbilityType = {
                        name: name,
                        description:description,
                    }

                    abilities.push(new_ability);
                }

                const new_pokemon:PokeType = {
                    name: pokemon.name,
                    sprite:pokemon.sprite,
                    type:types,
                    move:moves,
                    ability:abilities,
                    hasFetched:true,
                }
                dispatch(update_pokemon({name: new_pokemon.name,pokemon: new_pokemon}))
                setMyPokemon(new_pokemon);
            } catch (error) {
                console.error(error);
            }
        }

        const target_pokemon = all_pokemon.find((p)=>p.name===pokemonName);
        setMyPokemon(target_pokemon)
        if(!target_pokemon?.hasFetched)
        {
            if(target_pokemon)
                fetch_pokeInfo(target_pokemon)
        }
    },[all_pokemon, myPokemon])


    useEffect(()=>{
        async function fetch_move_desc()
        {
            if(selectedMove.name === '')
                return;

            try{
                let request = await info_axios.get(`/move/${selectedMove.name}`);
                if(request.status!==200)
                {
                    throw new Error(`Request failed with status code ${request.status}`);
                }
                
                const move = request.data;
                for(let i in move.flavor_text_entries)
                {
                    const desc = move.flavor_text_entries[i];
                    if(desc.language.name === 'en')
                    {
                        setSelectedMove({name:selectedMove.name,desc:desc.flavor_text})
                        break;
                    }
                }
            }catch(error)
            {
                console.log(error)
            }
        }
        fetch_move_desc();
    },[selectedMove.name])

    function add_pokemon_to_party(pokemon: PokeType)
    {
        dispatch(add_to_party(pokemon))
        return true; 
    }
    
    function change_party_poke_ability(party_pokemon:any)
    {
        if(!pokemonName)
            return false;

        if(SelectedPartyPokemon.pokemon === null)
            return false;

        const cloning_from = SelectedPartyPokemon.pokemon;

        if(cloning_from === undefined)
            return false;
        
        const new_ability:AbilityType = {
            name:selectedAbility.name,
            description:selectedAbility.desc,
        } 

        const cloned_pokemon = {...cloning_from, selectedAbility:new_ability}
        const action = {
            index: parseInt(party_pokemon.index),
            pokemon:cloned_pokemon
        };
        dispatch(update_party_pokemon(action));
    };
    
    function change_party_poke_move(party_pokemon:any)
    {
        if(!pokemonName)
            return false;

        if(SelectedPartyPokemon.pokemon === null)
            return false;

        const cloning_from = SelectedPartyPokemon.pokemon;
        if(cloning_from === undefined)
            return false;
        
        const new_move:MoveType = {
            name:selectedMove.name,
            description:selectedMove.desc,
        } 

        let old_moves = SelectedPartyPokemon?.pokemon.selectedMoves;
        if(old_moves && old_moves?.length > 3)
            return false;
        
        if(typeof old_moves === "undefined")
            old_moves = []
        
        old_moves = [...old_moves,new_move]

        const cloned_pokemon = {...cloning_from, selectedMoves:old_moves}
        const action = {
            index: parseInt(party_pokemon.index),
            pokemon:cloned_pokemon
        };
        setSelectedPartyPokemon(
            {
                pokemon:cloned_pokemon,
                index:SelectedPartyPokemon.index
            });
        setPartyPokemonMoves(old_moves);
        dispatch(update_party_pokemon(action));
    };

    useEffect(()=>{
        let new_party_pokemon = []

        for(let i in party_pokemon)
        {
            if(party_pokemon[i].name === pokemonName)
            {
                new_party_pokemon.push(
                    {
                        pokemon: party_pokemon[i],
                        index: parseInt(i)
                    }
                );
            }
        }

        setSamePartyPokemon(new_party_pokemon)
        setSelectedPartyPokemon(new_party_pokemon[0])
        if(new_party_pokemon[0])
        {
            let moves = new_party_pokemon[0].pokemon.selectedMoves || []
            setPartyPokemonMoves(moves)
        }
    },[party_pokemon.length])

    function changeSelectedPartyPokemon(e:any)
    {
        let name = e.target.value.split(' ');
        let index = parseInt(name[name.length-1]);
        setSelectedPartyPokemon(same_party_pokemon[index])
        let moves = same_party_pokemon[index].pokemon.selectedMoves || []
        setPartyPokemonMoves(moves)
    }

    useEffect(()=>{
        if(SelectedPartyPokemon)
        {
            let index = SelectedPartyPokemon.index;
            let pokemon = party_pokemon[index]
            if(!pokemon?.selectedMoves)
            {
                setPartyPokemonMoves([])
                return;
            }
            
            setPartyPokemonMoves(pokemon?.selectedMoves)
        }
    },[SelectedPartyPokemon, party_pokemon])

    return(
        <div>
            {
                myPokemon?<div>
                    <div className='flex-col text-center'>
                        <h1>{displayName}</h1>
                        <img 
                            src={myPokemon.sprite}
                            alt={`${myPokemon.name}`}
                            className = "m-auto w-1/6"
                        />
                        <div className='flex justify-center'>
                            {
                                myPokemon.type?.map((type)=>
                                    <div className={`${pokemonTypeStyles[type]} font-semibold p-1 rounded text-sm my-1`} key={`class:${type}`}>{type}</div>
                                )
                            }
                        </div>
                        <button
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 border border-blue-500 hover:border-transparent rounded text-sm px-1'
                            onClick={()=>{add_pokemon_to_party(myPokemon)}}
                        >Add to party</button>
                    </div>
                    
                    <div className='bg-blue-50 text-center'>
                    <div className=' font-semibold'>Select A {myPokemon.name} From Your Party</div>
                        {
                            same_party_pokemon.length>0?<select className=' w-full'
                                onChange={(e)=>changeSelectedPartyPokemon(e)}
                            >
                                {same_party_pokemon.map((pokemon:any,index:number)=>(
                                    <option key={`selector:${index}`} value={`${pokemon.pokemon.name} ${index}`}>
                                        {pokemon.pokemon.name} {index+1}
                                    </option>
                                ))}
                            </select>:<></>
                        }
                        <hr></hr>
                    </div>

                    <div className='grid grid-cols-2'>
                        <div>
                            <h3 className='text-center h-8 bg-blue-50'>Abilities</h3>
                            <ul className='overflow-y-scroll h-64'>
                            {
                                myPokemon.ability?.map((ability)=>
                                    <li 
                                        onClick={()=>{selectedAbility.name===ability.name?setSelectedAbility({name:'',desc:''}):setSelectedAbility({name:ability.name,desc:ability.description||''})}} 
                                        className={`${selectedAbility.name===ability.name?"bg-blue-50":""} cursor-pointer`}
                                        key={ability.name}>
                                            {ability.name}
                                        </li>
                                )
                            }
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-center h-8 bg-blue-50'>{selectedAbility.name}</h3>
                            <div>{selectedAbility.desc}</div>
                            {
                                same_party_pokemon.length>0&&selectedAbility.name!==''?<div>
                                    <button onClick={()=>change_party_poke_ability(SelectedPartyPokemon)} className='font-semibold'>Use This Ability On Selected Pokemon</button>
                                </div>:<></>
                            }
                            
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <div>
                            <h3 className='text-center bg-blue-50 h-8'>Moves</h3>
                            <ul className='overflow-y-scroll h-64'>
                            {
                                myPokemon.move?.map((move)=>
                                    <li 
                                        onClick={()=>{selectedMove.name===move.name?setSelectedMove({name:'',desc:''}):setSelectedMove({name:move.name,desc:''})}} 
                                        className={
                                            `${selectedMove.name===move.name?"bg-blue-50":""} 
                                            ${partyPokemonMoves.some(partyMove => move.name === partyMove.name) ? "bg-red-200" : ""}
                                            cursor-pointer` }
                                        key={move.name}>
                                            {move.name}
                                        </li>
                                )
                            }
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-center h-8 bg-blue-50'>{selectedMove.name}</h3>
                            <div className='mb-2'>{selectedMove.desc}</div>
                            {
                                same_party_pokemon.length>0&&selectedMove.name!==''?<div>
                                    <button onClick={()=>change_party_poke_move(SelectedPartyPokemon)} className='font-semibold'>Add This Move To Selected Pokemon</button>
                                </div>:<></>
                            }
                        </div>
                    </div>


                </div>:<h1>Pokemon not found</h1>
            }
        </div>
    )
}