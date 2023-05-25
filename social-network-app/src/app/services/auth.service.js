import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery(
        { baseUrl: "http://localhost:8080/api/auth" }
    ),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "login",
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: "register",
                method: "POST",
                body: data,
            }),
        }),
        checkEmailExist: builder.query({
            query: (email) => `check-email?email=${email}`
        })
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useLoginMutation, useRegisterMutation, useLazyCheckEmailExistQuery,
} = authApi;
