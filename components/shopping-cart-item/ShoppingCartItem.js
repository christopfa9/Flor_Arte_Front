import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useShoppingCartStore } from "@/stores/shoppingcart-store";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from "next/link";


export default function ShoppingCartItem({
    item
}) {
    // Estado.
    const deleteItem = useShoppingCartStore((state) => state.deleteItem);
    const changeQuantity = useShoppingCartStore((state) => state.changeQuantity);

    return (
        <>
            <Card variant="outlined"
                sx={{minHeight: 250}}
            >
                    <CardContent>
                        <Link href={`/products/${item.product.id}`}>
                        <div className="flex flex-row gap-x-2 items-center">
                            <Image src={item.product.imageUrl} alt={item.product.name} width={100} height={100}></Image>
                            <div className="flex flex-col ps-8 gap-y-2">
                                <Typography variant="h6" sx={{fontWeight: 'bold'}} component="h2">{item.product.name}</Typography>
                                <Typography variant="body2" component="p">Cantidad: {item.quantity} </Typography>
                                <Typography variant="body2" component="p">Precio: {item.product.price} </Typography>
                                <Typography variant="body2" sx={{fontWeight: 'bold'}} component="p">Total:
                                    ${item.total} </Typography>
                            </div>
                        </div>
                        </Link>
                    </CardContent>
                <CardActions
                    sx={{justifyContent: "end"}}
                >
                    <div className="flex flex-row gap-x-4 items-center">
                        <Button variant='contained' color='error' onClick={(e) => deleteItem(item.product.id)}>Eliminar</Button>
                        <Button variant='contained' color='primary' onClick={(e) => changeQuantity(item.product.id)}>
                            <AddIcon />
                        </Button>
                        <Typography variant="span" component="p" sx={{ fontWeight: 'bold' }} >{item.quantity}</Typography>
                        <Button variant='contained' color='secondary' onClick={(e) => changeQuantity(item.product.id, true)}>
                            <RemoveIcon/>
                        </Button>
                    </div>
                </CardActions>
            </Card>
        </>
    );
} 