import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PokeType } from "./definePokemon";

export interface allPokemonState {
    pokemon: PokeType[]
}

const initialState: allPokemonState = {
    pokemon: []
}

export const allPokemonSlice = createSlice(
    {
        name:'allPokemon',
        initialState,
        reducers: {
            add_pokemon: (state, pokemon: PayloadAction<PokeType>) => {
                state.pokemon.push(pokemon.payload)
            },
            update_pokemon: (
                state,
                action: PayloadAction<{name: string, pokemon:PokeType}>
            )=>{
                const {name,pokemon} = action.payload;
                const targetPokemonIndex = state.pokemon.findIndex((p)=>p.name === name);
                if(targetPokemonIndex>=0){
                    state.pokemon[targetPokemonIndex] = {...state.pokemon[targetPokemonIndex],...pokemon};
                }
            }
        }
    }
)

export const {add_pokemon, update_pokemon} = allPokemonSlice.actions;
export default allPokemonSlice.reducer