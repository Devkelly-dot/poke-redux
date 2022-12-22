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
            }
        }
    }
)

export const {add_pokemon} = partySlice.actions;
export default partySlice.reducer