import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
const api_url = import.meta.env.VITE_API_URL
export const imageApi = createApi({
    reducerPath: "imageApi",
    baseQuery: fetchBaseQuery({
         baseUrl: `${api_url}/api`,
         prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    },
 }),
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (data) => ({
                url: "images",
                method: "POST",
                body: data,
            }),
        }),
        uploadMultiImages: builder.mutation({
            query: (data) => ({
                url: "images/multi-upload",
                method: "POST",
                body: data,
            }),
        })
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useUploadImageMutation,
    useUploadMultiImagesMutation
} = imageApi;
