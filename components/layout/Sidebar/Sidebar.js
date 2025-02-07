import React from "react";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CategoryIcon from '@mui/icons-material/Category';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HelpIcon from '@mui/icons-material/Help';

import { Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const ADMIN_LINKS = [
    { text: 'Pedidos', href: '/orders/3', icon: ShoppingCartIcon },
    { text: 'Productos', href: '/products', icon: LocalFloristIcon },
    { text: 'Categorías', href: '/categories', icon: CategoryIcon },
    { text: 'Clientes', href: '/users', icon: PeopleAltIcon },
    { text: 'Etiquetas', href: '/tags', icon: LocalOfferIcon },
];

const CUSTOMER_LINKS = [
    { text: 'Pedidos', href: '/orders/client', icon: ShoppingCartIcon },
    { text: 'Productos', href: '/products', icon: LocalFloristIcon },
    { text: '¿Necesito ayuda?', href: '/chat', icon: HelpIcon },
];

export default function Sidebar() {
    // Obtener sesión
    const { data: session, status } = useSession();
    
    // Verificar si está autenticado
    const isAuthenticated = session && status === "authenticated";
    if (!isAuthenticated) {
      // Si NO está autenticado, no mostramos nada
      return null;
    }

    // Verificar si el usuario es administrador
    const isAdmin = session.user.authorities
      .map(a => a.authority)
      .includes("ROLE_ADMIN");
    
    // Obtener email del usuario (opcional)
    const email = session.user.username;

    return (
        <div className="sticky top-0 overflow-auto px-4 pt-16 col-span-2 bg-[#EFCFD8] flex flex-col gap-y-8 items-center">
            <Link href="/">
                <span className="text-center">
                  Bienvenido {email} ({isAdmin ? 'administrador' : 'cliente'})
                </span>
            </Link>
            
            {isAdmin ? (
                ADMIN_LINKS.map(({ text, href, icon: Icon }, index) => (
                    <Button
                        className="w-full text-center"
                        LinkComponent={Link}
                        color="black"
                        key={index}
                        variant="text"
                        size="large"
                        startIcon={<Icon />}
                        href={href}
                    >
                        {text}
                    </Button>
                ))
            ) : (
                CUSTOMER_LINKS.map(({ text, href, icon: Icon }, index) => (
                    <Button
                        className="w-full text-center"
                        LinkComponent={Link}
                        color="black"
                        key={index}
                        variant="text"
                        size="large"
                        startIcon={<Icon />}
                        href={href}
                    >
                        {text}
                    </Button>
                ))
            )}
            
            <Link href="/">
                <Image alt="Logo" src="/logo.png" width={200} height={200} />
            </Link>
        </div>
    );
}
