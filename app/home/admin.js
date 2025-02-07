import Card from '@mui/material/Card';
import axios from 'axios';
import { useEffect, useState } from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from '@mui/material/Typography';
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import CardContent from '@mui/material/CardContent';
import Link from "next/link";
import Paper from "@mui/material/Paper";
import {Chip} from "@mui/material";
import Box from '@mui/material/Box';
import {useSession} from "next-auth/react";
import {getProducts} from "@/services/ProductService";
import {getOrders} from "@/services/OrderService";

export default function HomeAdmin() {

    const [data, setData] = useState([]);
    const [pendientes, setDataPendientes] = useState([]);
    const [completos, setDataCompletos] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const ordersRes = await getOrders(true)
                const products = await getProducts({query: 'Orqu'});
                setProducts(products);
            
                const completedOrders = ordersRes.filter(order => order.orderStatus.id === 2);
                const pendingOrders = ordersRes.filter(order => order.orderStatus.id === 1);

                setDataPendientes(pendingOrders);
                setDataCompletos(completedOrders);
                setData(ordersRes);

                return "Información cargada";
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData().then(res => console.log(res));
    }, []);

 
  return (
    <>
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            gap: '20px', 
            padding: '20px' 
        }}>
            <Link href="/orders/3">
                <Card 
                    sx={{ 
                        maxWidth: 200, 
                        margin: '0 auto', 
                        padding: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <ShoppingCartIcon sx={{ color: '#C4476B', fontSize: 30 }} />                        
                    <Typography 
                        variant="h5" 
                        sx={{ fontWeight: 'bold' }}
                    >
                        {data.length}
                    </Typography>
                    <p>Cantidad de pedidos</p>

                </Card>
            </Link>
            <Link href="/orders/2">
                <Card 
                    sx={{ 
                        maxWidth: 200, 
                        margin: '0 auto', 
                        padding: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <TaskAltIcon sx={{ color: 'green', fontSize: 30 }} />                        
                    <Typography 
                        variant="h5" 
                        sx={{ fontWeight: 'bold' }}
                    >
                        {completos.length}
                    </Typography>
                    <p>Pedidos completos</p>
                </Card>
            </Link>
            

            <Link href="/orders/1"> 
                <Card 
                    sx={{ 
                        maxWidth: 200, 
                        margin: '0 auto', 
                        padding: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <AutorenewIcon sx={{ color: '#fbc02d', fontSize: 30 }} />                        
                    <Typography 
                        variant="h5" 
                        sx={{ fontWeight: 'bold' }}
                    >
                        {pendientes.length}
                    </Typography>
                    <p>Pedidos pendientes</p>
                </Card>     
            </Link>
                  
        </div>
        <div className="flex flex-col max-h-[32rem] overflow-auto gap-y-8">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '20px' }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
                ¡Atención! Estos productos están por acabarse.
            </Typography>
        </Box>
            {
                isLoading ? (<LoadingSpinner />) :
                    (
                        <Grid container spacing={2} columns={{ xs: 1, md: 2, lg: 3 }} columnSpacing={{ md: 8 }} justifyContent="center">
                            {
                                products.filter(product => product.quantity <= 25).map((product, index) => (
                                    <Grid key={index} item size={{ xs: 12, md: 6, lg: 4 }} >
                                       <Card variant="outlined"
                                            sx={{
                                                minHeight: 250,
                                                maxWidth: 300
                                            }}
                                        >
                                            <CardContent>
                                                <Grid display="flex" flexDirection="column" container columns={1} rowSpacing={1}>
                                                    <Link href={`/products/${product.id}`}>
                                                        {/*Imagen*/}
                                                        <Grid item>
                                                            <Image src={product.imageUrl}
                                                                alt={product.name}
                                                                width={0}
                                                                height={0}
                                                                sizes="100vw"
                                                                style={{ width: '100%', height: '12rem' }} />
                                                        </Grid>
                                                        {/*Nombre y categoria*/}
                                                        <Grid container item display="flex" flexDirection="column">
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} component="h2">{product.name}</Typography>
                                                            <Typography variant="caption" component="span"> {product.category.name} </Typography>
                                                        </Grid>
                                                    </Link>
                                                    {/*Precio, cantidad y botón*/}
                                                    <Grid container item sx={{
                                                        alignItems:"center"
                                                    }}>
                                                        <Grid container item xs={10} display="flex" flexDirection="column">
                                                            <Typography className={product.quantity > 25 ? '' : 'animate-pulse'}
                                                                        variant="body2" component="p"
                                                                        color={product.quantity > 25 ? "textPrimary" : "error"}
                                                                        sx={{ fontWeight: 'bold' }}>
                                                                Cantidad disponible: {product.quantity}
                                                            </Typography>
                                                            <Typography variant="body2" component="p" sx={{ fontWeight: 'bold' }}></Typography>
                                                        </Grid>                                
                                                    </Grid>

                                                    {/*Descripción*/}
                                                    <Grid item>
                                                        <Typography variant="body2" component="p" sx={{ fontWeight: 300 }}>{product.description.length > 75 ? `${product.description.slice(0, 75)}...` : product.description} </Typography>
                                                    </Grid>

                                                    {/*Etiquetas*/}
                                                    <Grid item>
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                listStyle: 'none',
                                                                gap: .5
                                                            }}
                                                            component="ul"
                                                        >
                                                            {product.tags.map(
                                                                (tag, index) => (<Chip key={index} size="small" label={tag.name}/>)
                                                            )}
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    )
            }
        </div>        
   
    </>
   
  );
}
 