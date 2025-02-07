"use client";
import React from "react";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import {useState } from "react";
import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {signOut, useSession} from "next-auth/react";
import {getMyself, updateOwnUser, updateUser} from "@/services/UserService";


const CLIENT_LINKS = [
    { href: '/shopping-cart', icon: ShoppingCartIcon },
]

export default function Header() {
    // Sesión
    const { data: session } = useSession();
    const isAdmin = session ? session.user.authorities.map(a=>a.authority).includes("ROLE_ADMIN") : false;
    // Router
    const router = useRouter();
    const LINKS = !isAdmin ? CLIENT_LINKS : [] ;
    const [isDataDialogOpen, setDataDialogOpen] = useState(false);
    const { register, handleSubmit, formState, reset, setValue} = useForm({});
    const { errors } = formState;
    const [element, setElement] = useState(); 
    /**
     * Cierra sesión del usuario.
     */
    const logout = async () => {
        await signOut({callbackUrl: "/", redirect: true})
    }
    const login = () =>{
        router.push("/auth/login");
    }

    const openDataDialog = async (data) => {
        setDataDialogOpen(true);
        const user = await getMyself();

        setElement(user);
        setValue("firstName", user.firstName);
        setValue("lastName", user.lastName);
        setValue("email", user.email);
        setValue("address", user.address);
        
    };

    
    const saveChanges = async (data) => {
        if (element) {
            // console.log("Actualizar", { ...element, ...data  });
            await updateOwnUser(data)
            // Forzar inicio de sesión si se cambia el correo (token previamente dado, no funciona más si se cambia correo).
            if(data.email !== element.email){
                await signOut({callbackUrl: "/", redirect: true})
            }
        }
        closeDialogs();
    };


    const closeDialogs = () => {
        setElement();
        reset();
        setDataDialogOpen(false);
    };

    if (!session) {
        return null;
    }
    


    return (
        <>
            <header className="flex flex-row justify-end px-4 py-1 bg-[#D7849B]">

                {
                    session ? (LINKS.map(({ href, icon: Icon }, index) => (
                        <Link key={index} href={href}>
                            <IconButton >
                                <Icon fontSize="large" />
                            </IconButton>
                        </Link>
                    ))) : (<></>)
                }
                {/*No mostrar diálogo de cambiar información si no se está autenticado*/}
                {
                    session ? (
                        <IconButton onClick={openDataDialog}>
                            <EmojiPeopleIcon fontSize="large" />
                        </IconButton>
                    ) : (<></>)
                }


                {session === null ? (
                    <IconButton onClick={login}>
                        <LoginOutlinedIcon fontSize="large" />
                    </IconButton>
                ): (
                    <IconButton onClick={logout}>
                        <LogoutOutlinedIcon fontSize="large" />
                    </IconButton>
                    )
                }

            </header>

            <Dialog open={isDataDialogOpen} onClose={closeDialogs} scroll={'paper'} fullWidth>
                <DialogTitle id="data-dialog-title">Actualizar mi información</DialogTitle>
                <form onSubmit={handleSubmit(saveChanges)} >
                    <DialogContent>
                        <div className='flex flex-col gap-y-3'>
                            <TextField 
                                id="firstName"
                                label="Nombre" 
                                variant="filled" 
                                {...register('firstName', { required: 'Nombre es requerido' })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                            <TextField 
                                id="lastName"
                                label="Apellidos" 
                                variant="filled" 
                                {...register('lastName', { required: 'Apellido es requerido' })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                            <TextField 
                                id="email"
                                type="email"
                                label="Correo" 
                                variant="filled" 
                                {...register('email', { required: 'Correo electrónico es requerido' })}
                                error={!!errors.email} 
                                helperText={errors.email?.message} 
                            />
                            <TextField
                                id="password"
                                type="password"
                                label="Contraseña (opcional)"
                                variant="filled"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <TextField 
                                id="address" 
                                label="Dirección" 
                                variant="filled" 
                                multiline  
                                rows={4} 
                                {...register('address', { required: 'Dirección es requerida' })}
                                error={!!errors.address} 
                                helperText={errors.address?.message}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                        <Button type='submit' variant='contained' color='primary'>Actualizar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};