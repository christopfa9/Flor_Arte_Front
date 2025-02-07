"use client";
import * as React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import { Inter } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "./globals.css";
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { useUserStore } from '@/stores/user-store';
import Image from "next/image";
import Link from "next/link";
import {SessionProvider, useSession} from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>
      <SessionProvider>
        <ThemeRegistry>
          <div className='grid grid-cols-12 min-h-full'>
            <Sidebar />
            <div className="col-span-10 flex md:min-h-[650px] flex-col gap-y-4 m-8">
              <Header />
              <main className='min-h-[100svh]'>
                {children}
              </main>
              <Link href="https://t.me/UNAEIF511TangoBot">
                <Image className="fixed bottom-5 right-5" alt="" src="/telegram.png" width={75} height={75} />
              </Link>
              <Footer />
            </div>
          </div>
        </ThemeRegistry>
      </SessionProvider>
      </body>
    </html>
  );
}
