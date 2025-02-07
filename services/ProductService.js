"use client";

import axiosInstance from "@/components/utils/axiosInstance";

const IMG_URL = "https://cdn.pixabay.com/photo/2020/07/10/13/40/flower-5390711_1280.jpg";

const parseSearchRequestParams = (data) =>{
    // Determinar si hay etiquetas o categorias seleccionadas.
    let hasQuery = data && data.query && data.query.trim() !== "",
        hasTags = data && data.tags && data.tags.length > 0,
        hasCategory = data && data.category && data.category !== 0;

    let query = "";

    // Agregar parametros de búsqueda.
    if(hasQuery)
        query += `name=${data.query}&`;
    if(hasCategory)
        query += `category=${data.category}&`;
    if(hasTags){
        query += "tags="
        // Concatenar todas los ID's de las etiquetas seleccionadas.
        query = data.tags.reduce((result, tag) => result.concat(`${tag.id},`), query);
    }

    // Eliminar ultimo coma o &.
    query = query.slice(0,query.length - 1);

    return (hasQuery || hasCategory || hasTags) ? `?${query}` : '';
}

export const getProducts = async (data) => {
    try {
        // Añade parametros de búsqueda.
        let url = `/unsecure/products${parseSearchRequestParams(data)}`;
        const res = await axiosInstance.get(url);
        return res.data;

    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
};

export const getProduct = async (id) => {
    try {
        const res = await axiosInstance.get(`/unsecure/products/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error getting products:', error);
        return null;
    }
};

export const createProduct = async (data) => {
    try {
        data = {
            ...data,
            category : {
                id: data.category
            },
            imageUrl : IMG_URL
        };
        const res = await axiosInstance.post(`/products`, data);
        return res.data;
    } catch (error) {
        console.error('Error creating categories:', error);
        return null;
    }
}

export const updateProduct = async (id, data) => {
    try {
        data.category = {
            id: data.category
        };
        const res = await axiosInstance.put(`/products/${id}`, {...data, img: IMG_URL});
        return res.data;
    } catch (error) {
        console.error('Error updating categories:', error);
        return null;
    }
}

export const deleteProduct = async (id) => {
    try {
        const res = await axiosInstance.delete(`/products/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting categories:', error);
        return null;
    }
}