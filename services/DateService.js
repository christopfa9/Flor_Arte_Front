"use client";
import {format} from "date-fns/format";
import {es} from "date-fns/locale/es";

// Formato a usar para mostrar la fecha.
const timeFormat = ", h:mm:ss a";

export const displayDate = (input, showTime = false) =>{
    const date = (typeof input === "string") ? new Date(input) : input;
    // 15/09/2021 = 15 de septiembre del 2021.
    return format(new Date(date), `d _ MMMM _ y${showTime ? timeFormat : ''}`, { locale: es })
        .replace("_", "de")
        .replace("_", "del");
}