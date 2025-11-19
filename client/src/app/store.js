import { configureStore } from '@reduxjs/toolkit';
import { poApi } from '../features/api/poApi';
import poReducer from '../features/po/poSlice';

export const store = configureStore({
    reducer: {
        [poApi.reducerPath]: poApi.reducer,
        po: poReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(poApi.middleware),
});