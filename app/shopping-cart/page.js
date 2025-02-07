'use client';
import ShoppingCartItem from "@/components/shopping-cart-item/ShoppingCartItem";
import { useShoppingCartStore } from "@/stores/shoppingcart-store";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
import { createOrder } from "@/services/OrderService";
import { useRouter } from 'next/navigation'

export default function Page() {
    const items = useShoppingCartStore((state) => state.items);
    // Formulario.
    const form = useForm({});
    const { register, handleSubmit, formState, reset, setValue } = form;
    const { errors } = formState;
    const router = useRouter();
    // Actualiza o crea elemento
    const formatWithLeadingZeros = (value) => {
        return value.toString().padStart(2, '0');
    };
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${formatWithLeadingZeros(currentDate.getMonth() + 1)}-${formatWithLeadingZeros(currentDate.getDate())}`;
    
    const saveChanges = async (data) => {
        const status = { // inicia en pendiente, ajustar a que inicie en 1 (BACKEND)
            id: 1,
            name: "Pendiente"
        };
    
        if (data.delivery_date) { // Fecha de entrega
            const [year, month, day] = data.delivery_date.split('-'); // Separar año, mes, día
            data.delivery_date = `${year}-${formatWithLeadingZeros(month)}-${formatWithLeadingZeros(day)}`;
        }
    
        const total = items.reduce((result, item) => item.total + result, 0);
    
        await createOrder({
            ...data, 
            orderDetails: items,
            // TODO: REMOVE AND REPLACE IN BACKEND.
            client: {
                id: 101
            },
            // TODO: REMOVE AND REPLACE IN BACKEND.
            date: formattedDate, 
            orderStatus: { ...status },
            total: total
        });
    
        useShoppingCartStore.setState({ items: [] });
        router.push('/orders/client');
    };
    

    return (
        <>
            <form
                onSubmit={handleSubmit(saveChanges)}
                className="flex flex-col gap-y-8 pt-2">

                <Typography variant="h4" component="h1">Carrito de compras</Typography>
                <div className="flex flex-row items-start justify-around gap-x-24 flex-wrap-reverse lg:flex-nowrap">

                    <div className="flex flex-col pe-4 gap-y-8 overflow-auto max-h-[32rem] flex-grow">
                        {
                            items.length > 0 ?
                            items.map((item, index) => (
                                <ShoppingCartItem key={index} item={{ ...item, index }} />
                            )) :
                                <Card variant="outlined"
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap:12,
                                    p:4
                                }}>
                                    <CardContent sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap:4,
                                    }}>
                                       
                                        <Typography variant="h5" component="p">No hay productos</Typography>
                                        <Link href="/products">
                                            <Button  type='button' variant="contained" color="primary" >Agregar productos</Button>
                                        </Link>

                                    </CardContent>
                                </Card>
                        }
                    </div>

                    <Card
                        variant="outlined"
                        sx={{
                            minHeight: "500px",
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                        }}
                    >
                        <CardContent sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap:4
                        }}>
                        <Typography variant="h4" component="h2" sx={{fontWeight: 'bold'}}>Información del pedido</Typography>
                            {/* <TextField id="name" label="Nombre de quien retira" variant="filled" inputProps={{
                                type: "name",
                            }} {...register('name', {
                                required: 'Se requiere un nombre',
                            })} error={!!errors.name} helperText={errors.name?.message} /> */}

                            <TextField 
                                id="delivery_date"
                                label="Fecha de entrega"
                                variant="filled"
                                inputProps={{
                                    type: "date",
                                }}
                                InputLabelProps={{
                                    shrink: true, 
                                }}
                                {...register('delivery_date', {
                                    required: 'Se requiere una fecha de entrega',
                                })}
                                error={!!errors.delivery_date}
                                helperText={errors.delivery_date?.message}
                            />

                            <TextField id="additional_information" label="Información adicional" variant="filled" multiline maxRows={4} inputProps={{
                                type: "additional_information",
                            }} {...register('additional_information', {})} />
                        </CardContent>
                        <CardActions
                            sx={{display: "flex",
                            flexDirection: "column",
                                justifyContent: "start",
                            gap:4}}
                        >
                            <Typography variant="h6" component="p" sx={{fontWeight: 'bold', alignSelf:'start'}}>Total: ${items.reduce((result, item) => item.total + result, 0)}
                            </Typography>
                            <Button sx={{
                                width: "100%",
                            }} type='submit' variant='contained' color='primary'>Confirmar pedido</Button>
                        </CardActions>
                    </Card>
                </div>
            </form>
        </>
    );

}