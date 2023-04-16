import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth.service";
import { imageApi } from "./services/images.service";
import { postApi } from "./services/posts.service";
import { userApi } from "./services/user.service";
import authReducer from "./slices/auth.slice";
import { commentApi } from "./services/comment.service";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [imageApi.reducerPath]: imageApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            imageApi.middleware,
            postApi.middleware,
            userApi.middleware,
            commentApi.middleware,
        ),
});

export default store;