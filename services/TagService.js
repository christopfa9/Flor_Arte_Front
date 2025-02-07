"use client";

import axiosInstance from "@/components/utils/axiosInstance";

export const getTags = async () => {
    try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/unsecure/tags`);
        return res.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};

export const getTag = async (id) => {
    try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/unsecure/tags/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }
};

export const createTag = async (data) => {
    try {
        const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API}/tags`, data);
        return res.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }
}

export const updateTag = async (id, data) => {
    try {
        const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API}/tags/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }
}

export const deleteTag = async (id) => {
    try {
        const res = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_API}/tags/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }
}