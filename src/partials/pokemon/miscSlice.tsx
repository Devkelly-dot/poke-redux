import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NatureType = {
    id: number;
    name: string;
    decreased_stat: string | null;
    increased_stat: string | null;
}

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