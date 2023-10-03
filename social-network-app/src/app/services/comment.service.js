import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/",
        prepareHeaders: (headers, { getState }) => {
          const token = getState().auth.token;
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
      }),
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        getCommentByPostId: builder.query({
            query: ({postId, page, pageSize}) =>  `comment/post/${postId}?page=${page}&pageSize=${pageSize}`,
        }),
        getOwnCommentsByPostId: builder.query({
            query: (postId) => `comment/own-cmt/post/${postId}`,
        }),
        getReplyComments: builder.query({
            query: ({commentId, page, pageSize}) =>  `comment/reply/${commentId}?page=${page}&pageSize=${pageSize}`,
        }),
        getCommentById: builder.query({
            query: (commentId) =>  `comment/detail/${commentId}`,
        }),
        getReplyCommentById: builder.query({
            query: (replyId) =>  `comment/reply/detail/${replyId}`,
        }),
        addComment: builder.mutation({
            query: ({ postId, data }) => ({
                url: `comment/${postId}`,
                method: "POST",
                body: (data)
            }),
        }),
        addReplyComment:  builder.mutation({
            query: ({ commentId, data }) => ({
                url: `comment/reply/${commentId}`,
                method: "POST",
                body: (data)
            }),
        }),
        deleteComment: builder.mutation({
            query: (id) => ({
                url: `comment/${id}`,
                method: "DELETE",
            }),         
        }),
        deleteReplyComment: builder.mutation({
            query: (replyId) => ({
                url: `comment/reply/delete/${replyId}`,
                method: "DELETE",
            }),
        }),
        likeComment: builder.mutation({
            query: (commentId) => ({
                url: `comment/like/${commentId}`,
                method: "POST",
            }),
        }),
        likeReplyComment: builder.mutation({
            query: (replyId) => ({
                url: `comment/reply/like/${replyId}`,
                method: "POST",
            })
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetOwnCommentsByPostIdQuery,
    useLazyGetOwnCommentsByPostIdQuery,
    useGetCommentByPostIdQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useLazyGetCommentByPostIdQuery,
    useLikeCommentMutation,
    useLazyGetReplyCommentsQuery,
    useAddReplyCommentMutation,
    useLikeReplyCommentMutation,
    useDeleteReplyCommentMutation,
    useLazyGetCommentByIdQuery,
    useLazyGetReplyCommentByIdQuery,
} = commentApi;
