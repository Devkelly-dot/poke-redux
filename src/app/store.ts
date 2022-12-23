import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import partyReducer from '../partials/pokemon/partySlice'
import allPokemonReducer from '../partials/pokemon/allPokemonSlice'

export const store = configureStore({
  reducer: {
    party: partyReducer,
    allPokemon: allPokemonReducer,
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
