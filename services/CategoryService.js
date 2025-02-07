"use client";

import axiosInstance from "@/components/utils/axiosInstance";

export const getCategories = async () => {
    try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/unsecure/categories`);
        return res.data;
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
};

export const getCategory= async (id) => {
    try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/categories/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error getting categories:', error);
        return null;
    }
};

export const createCategory = async (data) => {
    try {
        const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API}/categories`, data);
        return res.data;
    } catch (error) {
        console.error('Error creating categories:', error);
        return null;
    }
}

export const updateCategory = async (id, data) => {
    try {
        const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API}/categories/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Error updating categories:', error);
        return null;
    }
}

export const deleteCategory = async (id) => {
    try {
        const res = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_API}/categories/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting categories:', error);
        return null;
    }
}