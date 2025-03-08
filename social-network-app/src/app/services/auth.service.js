import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
const api_url = import.meta.env.VITE_API_URL

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery(
        { baseUrl: `${api_url}/api/auth` }
    ),
    endpoints: (builder) => ({
        loginWithGg: builder.mutation({
            query: (code) => ({
                url: `outbound/gg?code=${code}`,
                method: "POST",
            }),
        }),
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
        checkEmailExist: builder.mutation({
            query: (data) => ({
                url: `check-email`,
                method: "POST",
                body: data
            })
        }),
        resendEmailActivation: builder.mutation({
            query: (data) => ({
                url: `resend-email`,
                method: "PUT",
                body: data,
            })
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "forgot-password",
                method: "POST",
                body: data,
            })
        }),
        refreshToken: builder.mutation({
            query: (data) => ({
                url: "refresh-token",
                method: "POST",
                body: data,
            })
        }),
        logOut: builder.mutation({
            query: (data) => ({
                url: "log-out",
                method: "POST",
                body: data,
            })
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useLoginMutation, useRegisterMutation,useCheckEmailExistMutation, useResendEmailActivationMutation,
    useForgotPasswordMutation, useRefreshTokenMutation, useLogOutMutation,useLoginWithGgMutation,
} = authApi;
