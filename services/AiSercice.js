"use client";

import axiosInstance from "@/components/utils/axiosInstance";

export const consultAI = async (question) => {
    try {
        let provider = 'openaiservice';
        //const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/unsecure/ia/ask?provider=${provider}&question=${question}`);
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/unsecure/ia/ask?provider=${provider}&question=${encodeURIComponent(question)}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};