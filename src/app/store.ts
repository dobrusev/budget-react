import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import budgetReducer from '../features/budget/budgetSlice';

export const store = configureStore({
  reducer: {
    budget: budgetReducer,
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
