import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { data } from "jquery";

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
    tagTypes: ["Post"],
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
            }),
            invalidatesTags: ["Post"],
        }),
        searchUser: builder.query({
            query: (term) => `users/search?term=${term}`,
            providesTags: ["Post"],
        }),
        getUserById: builder.query({
            query: (userId) => `users/${userId}`,
            providesTags: ["Post"],
        }),
        deleteAvatar: builder.mutation({
            query: () => ({
                url: `users/avatar`,
                method: "DELETE",
            }),
        }),
        followhUser: builder.mutation({
            query: (id) => ({
                url: `users/follow/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Post"],
        }),
        unfollowhUser: builder.mutation({
            query: (id) => ({
                url: `users/unfollow/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),
        removeFollower: builder.mutation({
            query: (id) => ({
                url: `users/remove-follower/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),
        getUserLikePost: builder.query({
            query: (postId) => `users/likes/post/${postId}`,
            providesTags: ["Post"],
        }),
        getFollower: builder.query({
            query: (userId) => `users/${userId}/follower`,
        }),
        getFollowing: builder.query({
            query: (userId) => `users/${userId}/following`,
        }),
        changePassWord: builder.mutation({
            query: (data) => ({
                url: `users/change-password`,
                method: "PUT",
                body: data
            })
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
    useFollowhUserMutation,
    useUnfollowhUserMutation,
    useGetUserLikePostQuery,
    useGetFollowerQuery,
    useGetFollowingQuery,
    useRemoveFollowerMutation,
    useLazyGetFollowingQuery,
    useLazyGetFollowerQuery,
    useChangePassWordMutation,
} = userApi;
