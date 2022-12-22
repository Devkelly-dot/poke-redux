import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import partyReducer from '../partials/pokemon/partySlice'

export const store = configureStore({
  reducer: {
    party: partyReducer,
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
