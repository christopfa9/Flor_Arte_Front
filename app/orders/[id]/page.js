'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { set, useForm } from 'react-hook-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {createOrder, getOrders, updateOrder} from "@/services/OrderService";
import {getUsers} from "@/services/UserService";
import {getProducts} from "@/services/ProductService";
import {displayDate} from "@/services/DateService";
import {useSession} from "next-auth/react";
import {Chip} from "@mui/material";

export default function Page({params}) {

    const [data, setData] = useState([]);
    const [selectedClient, setSelectedClient] = useState('1');
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [id, setId] = useState(params.id);

    // Estado y autenticación
    const { data: session } = useSession();
    const isAdmin = session ?
        (session.user.authorities.map(a=>a.authority).includes("ROLE_ADMIN") ||
        session.user.authorities.map(a=>a.authority).includes("ROLE_STAFF"))
        : false;


    useEffect(() => {
        loadOrders().then(res => console.log(res));
        loadUser().then(res => console.log(res));
        loadProducts().then(res => console.log(res));
    }, [id]);


    const loadOrders = async () => {
        try {
            const orders =  await getOrders(isAdmin);
            if(id == 1){
                const pendingOrders = orders.filter(order => order.orderStatus.id === 1);
                setData(pendingOrders);
            } else if(id == 2){
                const completedOrders = orders.filter(order => order.orderStatus.id === 2);
                setData(completedOrders);
            }else{
                setData(orders);
            }
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const loadUser = async () => {
        try {
            const users =  await getUsers();
            setClients(users);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching users:', error);
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

    const form = useForm({});
    const { register, handleSubmit, formState, reset, setValue } = form;
    const { errors } = formState;

    const [isDataDialogOpen, setDataDialogOpen] = useState(false);
    const [isCancelDialogOpen, setCancelDialogOpen] = useState(false); 
    const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false); 
    const [isOrderDetailsDialogOpen, setOrderDetailsDialogOpen] = useState(false); 

    const [element, setElement] = useState(); 

    
    const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
        setValue('client_id', event.target.value); 
    };

    const openDataDialog = (el) => { //LOS ADMIN PUEDEN REGISTRAR PEDIDOS?
        setDataDialogOpen(true);
        setElement(el);
        if (el) {
            console.log("Elemento cargado:", el);
            setValue("name", el.name);
        }
    };

    const openOrderDetailsDialog = (el) => {
        setOrderDetailsDialogOpen(true);
        setElement(el);
    }

    const openCancelDialog = (el) => {
        setCancelDialogOpen(true);
        setElement(el);
        if (el) {
            console.log("Pedido a cancelar:", el);
        }
    }

    const openCompleteDialog = (el) => {
        setCompleteDialogOpen(true);
        setElement(el);
        if (el) {
            console.log("Pedido a completo:", el);
        }
    }

    const getClient = (clientId) => {
        const client= clients.find((client) => client.id === clientId);
        return client ? `${client.firstName} ${client.lastName}` : 'Desconocido';
    };

    const closeDialogs = () => {
        setElement();
        form.reset();
        setDataDialogOpen(false);
        setCancelDialogOpen(false);
        setCompleteDialogOpen(false);
        setOrderDetailsDialogOpen(false);
    };
    const saveChanges = async (data) => {
        if (element) {
            console.log("Actualizar", { ...element, ...data });
        }
        else {
            data.id = 99;
            console.log("Crear", data);
        }
        closeDialogs();
    }
    const cancelElement = async () => {
        if (element) {
            console.log('pedido cancelado: ', element);
            element.orderStatus = {
                "id": 3,
                "name": "Cancelado"
            };
            await updateOrder(element.id, element);
        }
        loadOrders().then(res => console.log(res));
        closeDialogs();
    }

    const completeElement = async () => {
        if (element) {
            console.log('pedido completo: ', element);
            element.orderStatus =  {
                "id": 2,
                "name": "Completo"
            };
            await updateOrder(element.id, element);
        }
        loadOrders().then(res => console.log(res));
        closeDialogs();
    }

    return (
        <>
            <div className='flex flex-col gap-y-8'>
                <div className='flex flex-row justify-between items-center'>
                    <Typography variant="h4" component="h1">Pedidos</Typography>
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
                                    <TableCell>{displayDate(row.date, true)}</TableCell>
                                    <TableCell>
                                        <Chip label={row.orderStatus.name} color={
                                            row.orderStatus.id === 1 ? 'warning' :
                                                row.orderStatus.id === 2 ? 'info' :
                                                    row.orderStatus.id === 3 ? 'error' : 'primary'
                                        } />
                                    </TableCell>
                                    <TableCell>${row.total}</TableCell>
                                    <TableCell>                                       
                                        <IconButton aria-label="fingerprint" color="primary" onClick={(e) => openOrderDetailsDialog(row)}>
                                            <RemoveRedEyeIcon />
                                        </IconButton>
                                        {row.orderStatus && row.orderStatus.id === 1 && (
                                            <>
                                                <IconButton aria-label="fingerprint" color="success" onClick={(e) => openCompleteDialog(row)}>
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton aria-label="fingerprint" color="error" onClick={(e) => openCancelDialog(row)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </>
                                        )}                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <Dialog
                open={isCancelDialogOpen}
                onClose={closeDialogs}
            >
                <DialogTitle id="delete-dialog-title">{`Cancelar pedido`}</DialogTitle>
                <DialogContent>
                    <span>¿Está seguro de cancelar el pedido?</span>
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>No</Button>
                    <Button type='submit' variant='contained' color='primary' onClick={cancelElement}>Si</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isCompleteDialogOpen}
                onClose={closeDialogs}
            >
                <DialogTitle id="delete-dialog-title">{`Completar pedido`}</DialogTitle>
                <DialogContent>
                    <span>¿Está seguro de modificar el estado del pedido a completado?</span>
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>No</Button>
                    <Button type='submit' variant='contained' color='primary' onClick={completeElement}>Si</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog
                open={isDataDialogOpen}
                onClose={closeDialogs}
                scroll={'paper'}
                fullWidth={true}
            >
                <DialogTitle id="data-dialog-title">{`Crear pedido`}</DialogTitle>
                <form onSubmit={handleSubmit(saveChanges)} >
                    <DialogContent>
                        <div className='flex flex-col gap-y-3'> 
                            <FormControl variant="filled" fullWidth>
                                <InputLabel id="role-select-label">Cliente</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    id="client_id"
                                    value={selectedClient}
                                    onChange={handleClientChange}
                                    {...register('client_id', { required: 'Cliente es requerido' })}
                                    error={!!errors.client_id}
                                >
                                    {clients.map((client) => (
                                        <MenuItem key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.client_id && <p>{errors.client_id.message}</p>}
                            </FormControl>

                            <TextField
                                id="delivery_date"
                                label="Fecha de entrega"
                                variant="filled"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('delivery_date', {
                                    required: 'Fecha es requerida',
                                })}
                                error={!!errors.delivery_date}
                                helperText={errors.delivery_date?.message}
                            />

                            {/* Agregar detalles de la orden */}
                          
                            <TextField id="additional_information" label="Información adicional" variant="filled" multiline  rows={4} inputProps={{
                                type: "text",
                            }} {...register('additional_information', {
                                required: 'Información adicional es requerida',
                            })} error={!!errors.additional_information} helperText={errors.additional_information?.message}/>
                            

                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                        <Button type='submit' variant='contained' color='primary'>{element ? 'Actualizar' : 'Crear'}</Button>
                    </DialogActions>
                </form>
            </Dialog>

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
                        <span><strong>Cliente:</strong> {getClient(element.client.id)}</span><br />
                        <span><strong>Fecha de creación:</strong> {displayDate(element.date, true)}</span><br />
                        <span><strong>Fecha de Entrega:</strong> {displayDate(element.deliveryDate)}</span><br />
                        <span><strong>Total:</strong> ${element.total}</span><br />
                        {element.additionalInformation && (
                            <span><strong>Información Adicional:</strong> {element.additionalInformation}</span>
                        )}
                    </div>
                )}

                <div className="order-products"  style={{ paddingTop: '10px' }}>
                    {/* <h4 style={{ textAlign: 'center' }}><strong>Productos de la orden</strong></h4> */}
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
                                {element && element.orderDetails && element.orderDetails.map((detail) => (
                                    <TableRow
                                        hover
                                        key={detail.product.id}
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
                </DialogActions>
            </Dialog>
        </>
    );
}

