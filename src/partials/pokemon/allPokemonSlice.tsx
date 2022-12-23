import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type PokeType = {
    name: string,
    img_url:string,
}

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
            }
        }
    }
)