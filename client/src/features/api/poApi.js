import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const poApi = createApi({
    reducerPath: 'poApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
    tagTypes: ['PO'], // Added tag for cache invalidation
    endpoints: (builder) => ({
        getClients: builder.query({
            query: () => 'clients',
        }),
        getJobs: builder.query({
            query: (clientName) => `jobs?client=${encodeURIComponent(clientName)}`,
        }),
        getTalents: builder.query({
            query: (jobId) => `talents?jobId=${jobId}`,
        }), 
        getPOById: builder.query({
            query: (id) => `purchase-order/${id}`, 
            providesTags: (result, error, id) => [{ type: 'PO', id }],
        }),
        createPO: builder.mutation({
            query: (poData) => ({
                url: 'purchase-order',
                method: 'POST',
                body: poData,
            }),
            invalidatesTags: ['PO'],
        }),
    }),
});

export const {
    useGetClientsQuery,
    useGetJobsQuery,
    useGetTalentsQuery,
    useCreatePOMutation,
    useGetPOByIdQuery 
} = poApi;