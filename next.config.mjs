// 'Server actions' por default.

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuración de dominios donde podemos extraer imagenes.
    images: {
        // images.domains is deprecated
        // https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.pixabay.com",
                pathname: "**",
            },
        ],
    }
};

export default nextConfig;
