"use client";

import {signIn} from "next-auth/react";
import axiosInstance from "@/components/utils/axiosInstance";

let ID = 30;

export const getUsers = async () => {
    try {
        const res = await axiosInstance.get(`/users`);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const getUser= async (id) => {
    try {
        const res = await axiosInstance.get(`/users/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};
export const getMyself = async()=>{
    try {
        const res = await axiosInstance.get(`/users/me`);
        return res.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export const createUser = async (data) => {
    try {
        const res = await axiosInstance.post(`/users/signup`, data);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}

export const updateUser = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/users/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}

export const updateOwnUser = async (data) => {
    try {
        const res = await axiosInstance.put(`/users`, data);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}

export const deleteUser = async (id) => {
    try {
        const res = await axiosInstance.delete(`/users/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}

export const login = async (username, password) => {
    try {
        // Credentials belongs to "NextAuth"
        const result = await signIn("credentials", {
            username,
            password,
            redirect: true,
            callbackUrl: "/",
        });
    } catch (error) {
        // Handled
        console.log(error)
    }
}