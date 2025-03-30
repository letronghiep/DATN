import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const ordersApi = createApi({
  reducerPath: "/ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const client_id = localStorage.getItem("client_id");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (client_id) {
        headers.set("x-client-id", `${client_id}`);
      }
      return headers;
    },
  }),
  tagTypes: ["checkout"],
  endpoints: (builder) => ({
    reviewOrder: builder.mutation({
      query: (data) => ({
        url: "/checkout/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["checkout"],
    }),
    getOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetOrdersQuery,
  useReviewOrderMutation,
} = ordersApi;
export default ordersApi;
