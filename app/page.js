'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import HomeAdmin from './home/admin';
import HomeClient from './home/Client';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Cargando...</div>;
  }
  const isAdmin = session?.user.authorities
    .map(a => a.authority)
    .includes("ROLE_ADMIN");

  return (
    <main>
      {isAdmin ? <HomeAdmin /> : <HomeClient />}
    </main>
  );
}
