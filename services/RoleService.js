"use client";

import axios from "axios";
import axiosInstance from "@/components/utils/axiosInstance";

export const getRoles = async () => {
    try {
        const res = await axiosInstance.get("/roles");
        return res.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
    }
};

