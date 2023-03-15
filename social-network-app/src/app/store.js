import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth.service";
import authReducer from "./slices/auth.slice";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware
        ),
});

export default store;