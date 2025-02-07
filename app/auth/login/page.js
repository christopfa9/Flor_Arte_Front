'use client';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/user-store';
import {login} from "@/services/UserService";
import {useSession} from "next-auth/react";
import {useEffect} from "react";


export default function Login() {

    // Estado (user)
    const { data: session, status } = useSession();
    // Router
    const router = useRouter();
    // Formulario.
    const form = useForm({});
    const { register, handleSubmit, formState, reset, setValue } = form;
    const { errors } = formState;

    const onSubmitFunction = async (data) => {
        try {
            await login(data.username, data.password);

        } catch (error) {
            console.log(error)
        }
    };

    const handleClick =  async () => {
        router.push('/auth/signup');
    };

    useEffect(() => {
        // Redirigir si no está no autenticado.
        if(status !== "unauthenticated")
            router.push('/');
    }, []);


    return (
        <main className="grid grid-cols-1 md:grid-cols-2 h-screen">
            {/* Columna izquierda */}
            <div className="bg-[#EFCFD8] flex flex-col items-center justify-center gap-y-8">
                <h1 className="text-5xl font-bold">¡Bienvenido!</h1>
                <img src="/logo.png" alt="logo" width={200} height={200} />
                <Button
                    className="w-1/2"
                    onClick={handleClick}
                    variant="contained"
                >
                    Registro
                </Button>
            </div>

            {/* Columna derecha */}
            <form
                onSubmit={handleSubmit(onSubmitFunction)}
                noValidate
                className="flex flex-col items-center justify-center gap-y-8 px-8"
            >
                <h2 className="text-3xl font-bold">Iniciar sesión</h2>
                <div className="flex flex-col gap-y-4 w-full max-w-md">
                    <TextField
                        id="username"
                        label="Correo"
                        defaultValue="admin@mail.com"
                        variant="filled"
                        inputProps={{
                            type: "email",
                        }}
                        {...register("username", {
                            required: "Username is required",
                        })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        id="password"
                        label="Contraseña"
                        defaultValue="12345"
                        variant="filled"
                        inputProps={{
                            type: "password",
                        }}
                        {...register("password", {
                            required: "Password is required",
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </div>
                <Button
                    className="w-full max-w-md"
                    type="submit"
                    variant="contained"
                >
                    Iniciar sesión
                </Button>
            </form>
        </main>
    );
}