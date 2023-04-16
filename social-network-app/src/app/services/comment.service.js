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
            query: (postId) =>  `comment/post/${postId}`,
            providesTags: ["Post"],
        }),
        addComment: builder.mutation({
            query: ({ postId, content }) => ({
                url: `comment/${postId}?content=${content}`,
                method: "POST",
            }),
            invalidatesTags: ["Post"],
        }),
        deleteComment: builder.mutation({
            query: (id) => ({
                url: `comment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetCommentByPostIdQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
} = commentApi;
