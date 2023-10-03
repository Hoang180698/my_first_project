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
        // update user
        updateUser: builder.mutation({
            query: (data) => ({
                url: "users",
                method: "PUT",
                body: data,
            }),
        }),
        // update avatar
        uploadAvatar: builder.mutation({
            query: (data) => ({
                url: "users/avatar",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Post"],
        }),
        // search user
        searchUser: builder.query({
            query: ({term, page, pageSize}) => `users/search?term=${term}&page=${page}&pageSize=${pageSize}`,
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
        // get users like 1 post
        getUserLikePost: builder.query({
            query: ({postId, page, pageSize}) => `users/likes/post/${postId}?page=${page}&pageSize=${pageSize}`,
        }),
           // get users like 1 comment
        getUserLikeComment: builder.query({
            query: ({commentId, page, pageSize}) => `users/likes/comment/${commentId}?page=${page}&pageSize=${pageSize}`,
        }),
        // get users like 1 comment
        getUserLikeReplyComment: builder.query({
            query: ({replyId, page, pageSize}) => `users/likes/reply-comment/${replyId}?page=${page}&pageSize=${pageSize}`,
        }),
        getFollower: builder.query({
            query: ({userId, page, pageSize}) => `users/${userId}/follower?page=${page}&pageSize=${pageSize}`,
        }),
        getFollowing: builder.query({
            query: ({userId, page, pageSize}) => `users/${userId}/following?page=${page}&pageSize=${pageSize}`,
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
    useLazyGetUserLikePostQuery,
    useLazyGetUserLikeCommentQuery,
    useLazyGetUserLikeReplyCommentQuery,
} = userApi;
