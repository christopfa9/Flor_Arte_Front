import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
    function middleware(req) {
        console.log("token: ", req.nextauth.token);
        const adminPrivilege = req.nextauth.token?.authorities?.find(auth => auth.authority === 'ROLE_ADMIN');

        if (req.nextUrl.pathname.startsWith("/admin") && adminPrivilege === undefined)
            return NextResponse.rewrite(
                new URL("/auth/login?message=You Are Not Authorized!", req.url)
            );
    },
    {
        callbacks: {
            authorized: ({token}) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};