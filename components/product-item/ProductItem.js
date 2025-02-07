import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Image from "next/image";
import CardContent from '@mui/material/CardContent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from "@mui/material/IconButton";
import { useShoppingCartStore } from "@/stores/shoppingcart-store";
import Grid from "@mui/material/Grid";
import {Chip} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Link from "next/link";
import {useSession} from "next-auth/react";

export default function ProductItem({product}) {
    const { data: session, status } = useSession();
    const isAdmin = session ? session.user.authorities.map(a=>a.authority).includes("ROLE_ADMIN") : false;
    // Estado.
    const items = useShoppingCartStore(state => state.items);
    const addItem = useShoppingCartStore(state => state.addItem);
    const deleteItem = useShoppingCartStore(state => state.deleteItem);
    return (
        <>
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
                                <Typography variant="body2" component="p" sx={{ fontWeight: 'bold' }}>Precio: ${product.price} </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {
                                    session && !isAdmin ?
                                        (
                                            items.find(item => item.product.id === product.id) ?
                                            <Button color='primary' size="large" onClick={(e) => deleteItem(product.id)}>
                                                <RemoveShoppingCartIcon />
                                            </Button> :

                                                <IconButton color="primary" size="large" onClick={(e) => addItem({ product, quantity: 1 })}>
                                                    <AddCircleOutlineIcon fontSize="inherit" />
                                                </IconButton>
                                        ) : (<></>)
                                }
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
                                {product.tags && product.tags.map(
                                    (tag, index) => (<Chip key={index} size="small" label={tag.name}/>)
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}