import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import partyReducer from '../partials/pokemon/partySlice'
import allPokemonReducer from '../partials/pokemon/allPokemonSlice'
import miscSliceReducer from '../partials/pokemon/miscSlice';

export const store = configureStore({
  reducer: {
    party: partyReducer,
    allPokemon: allPokemonReducer,
    misc: miscSliceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
