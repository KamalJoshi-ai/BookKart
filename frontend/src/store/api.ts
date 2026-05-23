import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useRouter } from "next/navigation"
const BASE_URL: string =process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const API_URLS = {
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
  VERIFY_AUTH: `${BASE_URL}/auth/verify-auth`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  UPDATE_USER_PROFILE:(userId: string) => `${BASE_URL}/user/profile/update/${userId}`,
  ALLPRODUCTS: `${BASE_URL}/products/`,
  PRODUCTS: `${BASE_URL}/products/create`,
  PRODUCT_BY_ID: (id: string) => `${BASE_URL}/products/${id}`,
  GET_PRODUCT_BY_SELLER_ID: (sellerId: string) => `${BASE_URL}/products/seller/${sellerId}`,
  DELETE_PRODUCT_BY_SELLER_ID: (productId: string) => `${BASE_URL}/products/seller/${productId}`,
  CART: (userId: string) => `${BASE_URL}/cart/${userId}`,
  ADD_TO_CART: `${BASE_URL}/cart/add`,
  REMOVE_FROM_CART: (productId: string) => `${BASE_URL}/cart/remove/${productId}`,
  WISHLIST: `${BASE_URL}/wishlist/`,
  ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add`,
  REMOVE_FROM_WISHLIST: (productId: string) => `${BASE_URL}/wishlist/remove/${productId}`,
  ORDERS: `${BASE_URL}/order`,
  ORDER_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,
  CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/order/payment-razorpay`,
  GET_ADDRESS: `${BASE_URL}/address`,
  ADD_OR_UPDATE_ADDRESS: `${BASE_URL}/address/create-or-update`,
  UPDATE_PRODUCT: (productId: string) => `${BASE_URL}/products/update/${productId}`,
  SELLER_STATS: `${BASE_URL}/seller/stats`,
  SELLER_ORDERS: `${BASE_URL}/seller/orders`,
  SELLER_LISTINGS: `${BASE_URL}/seller/listings`,
  SELLER_UPDATE_ORDER_STATUS: (orderId: string) => `${BASE_URL}/seller/orders/${orderId}/status`,
BECOME_SELLER: `${BASE_URL}/user/become-seller`,

};

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  credentials: "include", // cookies send karega
});
const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  try {

    // Original request
    let result = await baseQuery(
      args,
      api,
      extraOptions
    );

    // Access token expired
    if (result?.error?.status === 401) {

      // console.log("Access token expired");

      // Refresh token call
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions
      );

      // Refresh success
      if (refreshResult?.data) {

        // console.log("Token refreshed");

        // Retry original request
        result = await baseQuery(
          args,
          api,
          extraOptions
        );

      } else {

        // console.log("Refresh failed");

       
      }
    }

    return result;

  } catch (error) {

    console.log("Unexpected Error:", error);

    return {
      error: {
        status: "CUSTOM_ERROR",
        error: "Something went wrong",
      },
    };
  }
};
export const api = createApi({
  reducerPath: "api",

  tagTypes: ["User", "Product", "Cart", "Wishlist", "Order", "Address", "Seller"], 
  
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData,
      }),
      
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: { newPassword },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    verifyAuth: builder.query<any, void>({
      query: () => API_URLS.VERIFY_AUTH,
      providesTags: ["User"],
    }),
    //query tags gets invalidated that's why logout is done mutation 
    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER_PROFILE(userId),
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    addProducts: builder.mutation({
      query: (productData) => ({
        url: API_URLS.PRODUCTS,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    
    getProducts: builder.query({

  query: ({
    page = 1,
    limit = 9,
    search = "",
    condition = [],
    classType = [],
    category = [],
    sort = "newest",
  }) => {

    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (search) {
      params.append("search", search);
    }

    condition.forEach((c:string) =>
      params.append("condition", c)
    );

    classType.forEach((t:string) =>
      params.append("classType", t)
    );

    category.forEach((cat:string) =>
      params.append("category", cat)
    );

    params.append("sort", sort);

    console.log(params.toString());

    return {

      url: `/products?${params.toString()}`,

      method: "GET",

    };

  },

}),
    getProductById: builder.query({
      query: (id: string) => API_URLS.PRODUCT_BY_ID(id),
      providesTags: ["Product"],
    }),
    getProductsBySellerId: builder.query({
      query: (sellerId: string) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
      providesTags: ["Product"],
    }),
    deleteProductBySellerId: builder.mutation({
      query: (productId: string) => ({
        url: API_URLS.DELETE_PRODUCT_BY_SELLER_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getCart: builder.query({
      query: (userId: string) => API_URLS.CART(userId),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId: string) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    getWishlist: builder.query({
      query: () => API_URLS.WISHLIST,
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: { productId },
      }),
    }),
    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getOrders: builder.query<any, void>({
      query: () => API_URLS.ORDERS,
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (orderId: string) => API_URLS.ORDER_BY_ID(orderId),
      providesTags: ["Order"],
    }),
    createOrUpdateOrder: builder.mutation({
      query: (data) => ({
        url: API_URLS.ORDERS,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
    createRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: data,
      }),
    }),
    getAddress: builder.query({
      query: () => API_URLS.GET_ADDRESS,
      providesTags: ["Address"],
    }),
    addOrUpdateAddress: builder.mutation({
      query: (data) => ({
        url: API_URLS.ADD_OR_UPDATE_ADDRESS,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    getSellerStats: builder.query<any, void>({
      query: () => API_URLS.SELLER_STATS,
      providesTags: ["Seller"],
    }),
    getSellerOrders: builder.query<any, void>({
      query: () => API_URLS.SELLER_ORDERS,
      providesTags: ["Seller", "Order"],
    }),
    getSellerListings: builder.query<any, void>({
      query: () => API_URLS.SELLER_LISTINGS,
      providesTags: ["Seller", "Product"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, ...data }) => ({
        url: API_URLS.SELLER_UPDATE_ORDER_STATUS(orderId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Seller", "Order"],
    }),
    
    updateProduct: builder.mutation({
  query: ({ productId, formData }) => ({
    url: API_URLS.UPDATE_PRODUCT(productId),
    method: "PUT",
    body: formData,
  }),
  invalidatesTags: ["Product", "Seller"],
}),


becomeSeller: builder.mutation({
  query: () => ({
    url: API_URLS.BECOME_SELLER,
    method: "PATCH",
  }),
  invalidatesTags: ["User"],
}),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthQuery,
  useLogoutMutation,
  useUpdateUserMutation,
  useAddProductsMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsBySellerIdQuery,
  useDeleteProductBySellerIdMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useGetAddressQuery,
  useAddOrUpdateAddressMutation,
  useGetSellerStatsQuery,
  useGetSellerOrdersQuery,
  useGetSellerListingsQuery,
  useUpdateOrderStatusMutation,
  useUpdateProductMutation,
  useBecomeSellerMutation
} = api;