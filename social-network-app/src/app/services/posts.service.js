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
      query: () => "post",
      providesTags: ["Post"],
    }),
    getPostById: builder.query({
      query: (id) => `post/${id}`,
      providesTags: ["Post"],
    }),
    getPostByUserId: builder.query({
      query: (userId) => `post/user-post/${userId}`,
      providesTags: ["Post"],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: "post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    createPostWithImages: builder.mutation({
      query: ({content, data}) => ({
        url: `post/create?content=${content}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }) => {
        console.log({ id, data });
        return {
          url: `post/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Post"],
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
    dislikePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}/dislike`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGetPostsQuery,
  useUpdatePostMutation,
  useGetAllMyPostsQuery,
  useCreatePostWithImagesMutation,
  useGetPostByUserIdQuery,
  useLikePostMutation,
  useDislikePostMutation,
} = postApi;
