'use client';
import ProductItem from "@/components/product-item/ProductItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import {getProducts} from "@/services/ProductService";

export default function HomeClient() {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const products = await getProducts({name: 'Orqu'});
            setProducts(products);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching products data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData().then(res => console.log(res));
    }, []);

    return (
        <div className="flex flex-col max-h-[32rem] overflow-auto gap-y-8">
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>Pocas existencias ¡Ordene ahora!</Typography>
            {
                isLoading ? (<LoadingSpinner />) :
                    (
                        <Grid container spacing={2} columns={{ xs: 1, md: 2, lg: 3 }} columnSpacing={{ md: 8 }} justifyContent="between">
                            {
                                products.filter(product => product.quantity <= 25).map((product, index) => (
                                    <Grid key={index} item size={{ xs: 12, md: 6, lg: 4 }} >
                                        <ProductItem product={product} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    )
            }
        </div>
    )
}