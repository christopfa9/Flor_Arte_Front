'use client';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { createUser } from "@/services/UserService";


export default function Signup({ setLoggedIn, setIsAdmin }) {

    const router = useRouter();
    const form = useForm({});
    const { register, handleSubmit, formState, reset, setValue } = form;
    const { errors } = formState;

    const onSubmitFunction = async (data) => {
        try {
            console.log("DATA FORM: ", data);
            data.enabled = 1;
            data.role_id =  {
                "id": 2,
                "name": "Cliente"
            };
            await createUser(data);
            router.push('/auth/login');
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <main className="grid grid-cols-12">
            <div className="col-span-4 flex flex-col bg-[#EFCFD8] md:min-h-[650px] py-40 gap-y-12 items-center">
                <h1 className='text-5xl'>¡Bienvenido!</h1>
                <img src="/logo.png" alt="logo" width={200} height={200} />
                <Button className='w-1/2' onClick={e => router.push('/auth/login')} variant='contained'>Ingreso</Button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmitFunction)}
                noValidate
                className='col-span-8 flex flex-col gap-y-16 my-32 items-center'
            >
                <h2 className='text-3xl'>Registro</h2>

                <div className='flex flex-col gap-y-4 w-1/2'>
                <TextField id="firstName" label="Nombre" variant="filled" inputProps={{
                        type: "text",
                    }} {...register('firstName', {
                        required: 'Nombre es requerido',
                    })} error={!!errors.firstName} helperText={errors.firstName?.message} />
                    <TextField id="lastName" label="Apellidos" variant="filled" inputProps={{
                        type: "text",
                    }} {...register('lastName', {
                        required: 'Apellido es requerido',
                    })} error={!!errors.lastName} helperText={errors.lastName?.message} />
                    <TextField id="phone" label="Telefono" variant="filled" inputProps={{
                        type: "number",
                    }} {...register('phone', {
                        required: 'Telefono es requerido',
                    })} error={!!errors.phone} helperText={errors.phone?.message} />
                    <TextField id="email" label="Correo" variant="filled" inputProps={{
                        type: "email",
                    }} {...register('email', {
                        required: 'Correo electrónicp es requerido',
                    })} error={!!errors.email} helperText={errors.email?.message} />
                    <TextField id="address" label="Dirección" variant="filled" multiline  rows={4} inputProps={{
                        type: "text",
                    }} {...register('address', {
                        required: 'Dirección es requerido',
                    })} error={!!errors.address} helperText={errors.address?.message}/>
                    <TextField id="password" label="Contraseña" variant="filled" inputProps={{
                        type: "password",
                    }}{...register('password', {
                            required: 'Contraseña es requerida',
                    })} error={!!errors.password} helperText={errors.password?.message} />

                </div>
                <Button className='w-1/2' type='submit' variant='contained'>Registrar</Button>

            </form>
        </main >
    );
}