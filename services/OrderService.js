"use client";

import axiosInstance from "@/components/utils/axiosInstance";

export const getOrders = async (isAdmin= false) => {
    try {
        // Llama a todas las ordenes (/order) si es administrador o staff,
        // De lo contrario, llama a solo las ordenes del usuario (user/order).
        const url = process.env.NEXT_PUBLIC_API + `${isAdmin === false ? '/users/orders' : '/order'}`
        const res = await axiosInstance.get(url);
        return res.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const getOrder= async (id) => {
    try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API}/order/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
};

export const createOrder = async (order) => {
    try {
        const data = {
            deliveryDate: order.delivery_date,
            additionalInformation : order.additional_information,
            orderDetails : order.orderDetails,
            client: order.client,
            total: order.total,
            date: order.date,
            orderStatus: {id: 1}
        }

        const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API}/order`, data);
        return res.data;

    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
}

export const updateOrder = async (id, data) => {
    try {
        const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API}/order/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
}
