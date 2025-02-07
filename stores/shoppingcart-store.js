import { create } from 'zustand'

/**
 * Maneja el estado y las acciones relacionadas al usuario.
 */
export const useShoppingCartStore = create((set) => ({
    // Estado.
    items: [],

    // Acciones.
    clear: () => set({
        items: []
    }),
    deleteItem: (id) => set((state) => ({
        items: [...state.items.filter((item) => item.product.id !== id)]
    })),
    changeQuantity: (id, des = false) => set((state) => ({
        items: state.items.map((item) => {
            // Suma o resta 1 (si es descendiente),
            // Nueva cantidad tiene que ser mayor a 1.
            const newQuantity = item.quantity  + (des ? -1 : 1);
            if (item.product.id === id && newQuantity > 0) {
                return {
                    ...item,
                    quantity: newQuantity,
                    total: newQuantity * item.product.price
                }
            } return item;
        })
    })),

    addItem: (item) => set((state) => ({
        // No añadir el mismo producto dos veces.
        items: state.items.find(i=> i.product.id === item.product.id) ?
            [...state.items] :
            [...state.items, {
            product: {
            ...item.product,
            },
                quantity: item.quantity,
                total: item.quantity * item.product.price,
            }]
    }))
}))

