'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'
import { getOrders } from "@/services/OrderService";
import { getProducts } from "@/services/ProductService";
import { useShoppingCartStore } from "@/stores/shoppingcart-store";
import {displayDate} from "@/services/DateService";
import {useSession} from "next-auth/react";
import {Chip} from "@mui/material";

export default function Page() {

    // Estado de componente
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    // EsFtado y autenticación
    const { data: session } = useSession();
    const isAdmin = session ?
        (session.user.authorities.map(a=>a.authority).includes("ROLE_ADMIN") ||
            session.user.authorities.map(a=>a.authority).includes("ROLE_STAFF"))
        : false;
    // Estado (carro de compras)
    const addItem = useShoppingCartStore(state => state.addItem);

    useEffect(() => {
        loadOrders().then(res => console.log(res));
        loadProducts().then(res => console.log(res));
    }, []);

    
    const loadOrders = async () => { //Filtrar segun usuario que ingrese
        try {
            // Si es administrador o staff, obtiene todas las ordenes.
            // De lo contrario solo obtiene las ordenes del usuario
            const orders =  await getOrders(isAdmin);
            setData(orders);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const loadProducts = async () => {
        try {
            const products =  await getProducts();
            setProducts(products);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const router = useRouter();
    const [isOrderDetailsDialogOpen, setOrderDetailsDialogOpen] = useState(false);
    const [element, setElement] = useState(); 

 
    const openOrderDetailsDialog = (el) => {
        setOrderDetailsDialogOpen(true);
        setElement(el);
    }
    
    const createElement = () => {       
        useShoppingCartStore.setState({ items: [] }); //Limpiar carrito
        
        element.orderDetails.forEach((detail) => { // Asignar productos al carrito
            const product = products.find(product => product.id === detail.product.id);

            if (product) { 
                const item = {
                    product:{
                        id: product.id,
                        name: product.name,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        category: product.category,
                        tags: product.tags
                    },
                    quantity: detail.quantity,
                    total: detail.quantity * product.price,
                };

                addItem(item);
            }
        });
      
       router.push('/shopping-cart');
    }

    const closeDialogs = () => {
        setElement();
        setOrderDetailsDialogOpen(false);
    };
 
    const newOrder = () => {
        router.push('/products');
    }

    return (
        <>
            <div className='flex flex-col gap-y-8'>
                <div className='flex flex-row justify-between items-center'>
                    <Typography variant="h4" component="h1">Pedidos</Typography>
                    <Button variant='contained' color='primary' onClick={newOrder} startIcon={<AddIcon />}>Realizar nuevo pedido</Button>
                </div>

                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    hover
                                    key={row.id}
                                >
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{displayDate(row.date,true)}</TableCell>
                                    <TableCell>
                                        <Chip label={row.orderStatus.name} color={
                                            row.orderStatus.id === 1 ? 'warning' :
                                                row.orderStatus.id === 2 ? 'info' :
                                                    row.orderStatus.id === 3 ? 'error' : 'primary'
                                        } />
                                    </TableCell>
                                    <TableCell>${row.total}</TableCell>
                                    <TableCell>                                       
                                        <IconButton aria-label="fingerprint" color="success" onClick={(e) => openOrderDetailsDialog(row)}>
                                            <RemoveRedEyeIcon />
                                        </IconButton>                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

            <Dialog
                open={isOrderDetailsDialogOpen}
                onClose={closeDialogs}
            >
                <DialogTitle id="delete-dialog-title">{`Información de pedido`}</DialogTitle>
                <DialogContent>
                {element && (
                    <div>
                        <span><strong>ID:</strong> {element.id}</span><br />
                        <span><strong>Estado de la Orden:</strong> {element.orderStatus.name}</span><br />
                        <span><strong>Fecha de creación:</strong> {displayDate(element.date, true)}</span><br />
                        <span><strong>Fecha de Entrega:</strong> {displayDate(element.deliveryDate)}</span><br />
                        <span><strong>Total:</strong> ${element.total}</span><br />
                        {element.additionalInformation && (
                            <span><strong>Información Adicional:</strong> {element.additionalInformation}</span>
                        )}
                    </div>
                )}

                <div className="order-products"  style={{ paddingTop: '10px' }}>
                    <br /> 
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Producto</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Precio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { element && element.orderDetails.map((detail) => (
                                    <TableRow
                                        hover
                                        key={detail.id}
                                    >
                                        <TableCell>{detail.product.name}</TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                        <TableCell>${detail.price}</TableCell>
                                        
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                  
                </div> 
                    
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cerrar</Button>
                    <Button type='submit' variant='contained'  color='primary' onClick={createElement}>Repetir pedido</Button>              
                </DialogActions>
            </Dialog>
        </>
    );
}

