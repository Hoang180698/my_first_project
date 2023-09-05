import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const postApi = createApi({
  reducerPath: "postApi",
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
    getPosts: builder.query({
      query: ({page, pageSize}) => `post?page=${page}&pageSize=${pageSize}`,
    }),
    getPostById: builder.query({
      query: (id) => `post/${id}`,
      providesTags: ["Post"],
    }),
    getAllSavedPost: builder.query({
      query: () => `post/save`,
      providesTags: ["Post"],
    }),
    getPostByUserId: builder.query({
      query: ({userId, page, pageSize}) => `post/user-post/${userId}?page=${page}&pageSize=${pageSize}`,
    }),
    // Tạo post
    createPost: builder.mutation({
      query: (data) => ({
        url: `post/create-post`,
        method: "POST",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    getAllMyPosts: builder.query({
      query: () => "post/user-post",
      providesTags: ["Post"],
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),
    unlikePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}/dislike`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    savePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}/save`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),
    unSavePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}/un-save`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGetPostsQuery,
  useGetAllMyPostsQuery,
  useGetPostByUserIdQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
  useGetAllSavedPostQuery,
  useLazyGetPostByUserIdQuery,
  useLazyGetPostsQuery,
} = postApi;
