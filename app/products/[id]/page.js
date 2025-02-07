'use client';
import { useRouter } from 'next/navigation'
import {useEffect, useState} from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {useShoppingCartStore} from "@/stores/shoppingcart-store";
import Button from "@mui/material/Button";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {Divider} from "@mui/material";
import Stack from "@mui/material/Stack";
import {getProduct} from "@/services/ProductService";
import {useSession} from "next-auth/react";

export default function Page({params}) {
    const { data: session, status } = useSession();
    const isAdmin = session ? session.user.authorities.map(a=>a.authority).includes("ROLE_ADMIN") : false;

    const router = useRouter();

    const [id, setId] = useState(params.id);
    const [product, setProduct]  = useState(null); // Representa elemento cargado.
    const [isLoading, setIsLoading] = useState(false);
    const [productIsInShoppingCart, setProductIsInShoppingCart]=useState(false);
    // Estado.
    const items = useShoppingCartStore(state => state.items);
    const addItem = useShoppingCartStore(state => state.addItem);
    const deleteItem = useShoppingCartStore(state => state.deleteItem);

    const changeQuantityInShoppingCart = useShoppingCartStore(state => state.changeQuantity);

    // Información.
    const [quantity, setQuantity] = useState(1);

    // Ajusta la cantidad por 1.
    const changeQuantity = (des=false) => {
        const newValue = quantity + (des ? -1 : 1);
        if(newValue > 0){
            setQuantity(newValue);
        }
        // Si el producto está en carro de compras, se ajusta la cantidad en el carro de compras.
        // De lo contrario, se ajusta solo la cantidad (estado) del componente.
        if(productIsInShoppingCart){
            changeQuantityInShoppingCart(product.id, des);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setProduct(await getProduct(id));
                // Si el producto está en carro de compras, sincronizar cantidades.
                const productInShoppingCart = items.find((item)=> item.product.id.toString() === id);
                if(productInShoppingCart){
                    setProductIsInShoppingCart(true);
                    setQuantity(productInShoppingCart.quantity);
                }
                return "Información de producto cargada";
            } catch (error) {
                setProduct(null);
                console.error('Error fetching products:', error);
            }finally{
                setIsLoading(false);
            }
        };

        fetchData().then(res=>console.log(res));

    }, [id]);

    return (
        <>
            {isLoading ? <LoadingSpinner/> : product !== null ?
                <Card>
                    <div className="grid grid-cols-12 px-8 py-4">
                        <div className="col-span-4">
                            <Image src={product.imageUrl}
                                   alt={product.name}
                                   width={0}
                                   height={0}
                                   sizes="100vw"
                                   style={{width: '100%', height: '100%'}}/>
                        </div>
                        <div className="col-span-8">
                            <Stack spacing={2} direction="column"
                                   useFlexGap
                                   sx={{
                                       flexWrap: 'wrap',
                                px: 6,
                                py: 2
                            }}>
                                <Typography variant="h3" component="h1"
                                            sx={{fontWeight: "bold"}}>{product.name}</Typography>
                                {/*Etiquetas*/}
                                <Stack direction="row" spacing={1} useFlexGap>
                                    {
                                        product.tags ?
                                            product.tags.map((tag) => <Chip key={tag.id} label={tag.name}/>)
                                            : (<></>)
                                    }
                                </Stack>

                                <Stack spacing={1} direction="column" useFlexGap>
                                    <Typography variant="h4" component="span"
                                                sx={{fontWeight: "bold"}}>${product.price}</Typography>
                                    <Typography variant="subtitle1" component="p"
                                                sx={{fontWeight: "bold"}}
                                                className={product.quantity > 25 ? '' : 'animate-pulse'}
                                                color={product.quantity > 25 ? "textPrimary" : "error"}>
                                        Cantidad disponible: {product.quantity}
                                    </Typography>
                                </Stack>

                                <Divider/>
                                <Stack spacing={1} direction="row"  sx={{justifyContent: 'space-evenly', alignItems:'center'}} useFlexGap>
                                    <Stack spacing={1} direction="row"  sx={{alignItems: 'center'}} useFlexGap>
                                        <Button variant='contained' color='primary'
                                                onClick={(e) => changeQuantity()}>
                                            <AddIcon/>
                                        </Button>
                                        <Typography variant="span" component="p"
                                                    sx={{fontWeight: 'bold'}}>
                                            {/* Muestra cantidad en carro de compras o por agregar a carro (cantidad en el estado de este componente)*/}
                                            {quantity}
                                        </Typography>
                                        <Button variant='contained' color='secondary'
                                                onClick={(e) => changeQuantity(true)}>
                                            <RemoveIcon/>
                                        </Button>
                                    </Stack>
                                    <Typography variant="subtitle1" component="span">${quantity * product.price} total</Typography>
                                    {
                                        productIsInShoppingCart ?
                                            <Button variant="contained"
                                                    color='primary'
                                                    disabled={!session || isAdmin}
                                                    size="large"
                                                    startIcon={<RemoveShoppingCartIcon/>}
                                                    onClick={(e) => {
                                                        {/* Eliminar item y reiniciar cantidad en componente a 1.*/}
                                                        setProductIsInShoppingCart(false);
                                                        setQuantity(1)
                                                        deleteItem(product.id)
                                                    }}>
                                                {!session || isAdmin ? 'SOLO CLIENTES PUEDEN ORDENAR' : 'Eliminar de pedido'}
                                            </Button> :

                                            <Button variant="contained"
                                                    color='primary'
                                                    disabled={!session || isAdmin}
                                                    size="large"
                                                    startIcon={<AddCircleOutlineIcon/>}
                                                    onClick={(e) => {
                                                        setProductIsInShoppingCart(true);
                                                        setQuantity(quantity)
                                                        addItem({product, quantity})
                                                    }}>
                                                {!session || isAdmin ? 'SOLO CLIENTES PUEDEN ORDENAR' : 'Añadir a pedido'}
                                            </Button>
                                    }
                                </Stack>
                                <Divider/>


                                <Typography variant="h6" component="h3" sx={{fontWeight: "bold"}}>Información
                                    adicional</Typography>
                                <Typography variant="body" component="p"
                                            className="text-wrap">{product.description}</Typography>

                            </Stack>
                        </div>
                    </div>
                </Card>

                : (

                    <span>404</span>
                )
            }
        </>
    )
}