// utils/axiosInstance.js
"use client";

import axios from 'axios';
import { getSession } from "next-auth/react";

/**
 * axiosInstance is a pre-configured axios client instance that is ready to make authenticated requests to your API.
 * @type {axios.AxiosInstance}
 */

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API}`, // API base URL
});
// Intercept each request and add the token stored in NextAuth
axiosInstance.interceptors.request.use(async config => {
    const session = await getSession(); // Use getSession on the client-sid
    if (session?.user.token) {
        // console.log("Interceptor", session.user.token);
        config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return config;
});

export default axiosInstance;
