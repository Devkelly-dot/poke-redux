import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NatureType } from "./definePokemon";

export interface miscState {
    natures: NatureType[]
}

const initialState: miscState = {
    natures: []
}

export const miscSlice = createSlice(
    {
        name:'party',
        initialState,
        reducers: {
            add_nature: (state,action:PayloadAction<NatureType>) => {
                return {...state, natures: [...state.natures, action.payload]};
            }
        }
    }
)

export const {add_nature} = miscSlice.actions;
export default miscSlice.reducer