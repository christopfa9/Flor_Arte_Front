import { create } from 'zustand'

/**
 * Maneja el estado y las acciones relacionadas al usuario.
 */
export const useUserStore = create((set) => ({
    // Estado.
    isLoggedIn: false,
    isAdmin: false,
    email: '',
    // Acciones.
    setLoggedIn: (val) => set((state) => ({
        isLoggedIn: val
    })),
    setAdmin: (val) => set((state) => ({
        isAdmin: val
    })),
    setEmail: (val) => set((state) => ({
        email: val
    })),

}))