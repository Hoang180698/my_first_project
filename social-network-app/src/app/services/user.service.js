import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (data) => ({
                url: "users",
                method: "PUT",
                body: data,
            }),
        }),
        uploadAvatar: builder.mutation({
            query: (data) => ({
                url: "users/avatar",
                method: "POST",
                body: data,
            })
        }),
        searchUser: builder.query({
            query: (term) => `users/search?term=${term}`
        }),
        getUserById: builder.query({
            query: (userId) => `users/${userId}`
        }),
        deleteAvatar: builder.mutation({
            query: (id) => ({
                url: `users/avatar`,
                method: "DELETE",
            }),
        })
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useUpdateUserMutation,
    useUploadAvatarMutation,
    useLazySearchUserQuery,
    useGetUserByIdQuery,
    useDeleteAvatarMutation,
} = userApi;
