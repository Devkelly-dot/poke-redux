import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PokeType } from "./definePokemon";

export interface partyState {
    party: PokeType[]
}

const initialState: partyState = {
    party: []
}

export const partySlice = createSlice(
    {
        name:'party',
        initialState,
        reducers: {
            add_pokemon: (state, pokemon: PayloadAction<PokeType>) => {
                if(state.party.length < 6)
                {
                    state.party.push(pokemon.payload)
                }
                else return state;
            },
            remove_pokemon: (state, index: PayloadAction<number>) => {
                state.party.splice(index.payload,1)
            }
        }
    }
)

export const {add_pokemon, remove_pokemon} = partySlice.actions;
export default partySlice.reducer