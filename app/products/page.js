'use client';

import {useEffect, useState} from "react";
import axios from "axios";
import {useForm} from "react-hook-form";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import TextField from "@mui/material/TextField";
import ProductItem from "@/components/product-item/ProductItem";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

import Grid from "@mui/material/Grid";

import Stack from "@mui/material/Stack";
import UploadIcon from '@mui/icons-material/Upload';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import ProductCategorySelect from "@/components/product-category-select/ProductCategorySelect";
import ProductTagsAutocomplete from "@/components/product-tags-autocomplete/ProductTagsAutocomplete";
import {getCategories} from "@/services/CategoryService";
import {getTags} from "@/services/TagService";
import {createProduct, deleteProduct, getProducts, updateProduct} from "@/services/ProductService";
import {useSession} from "next-auth/react";

export default function Page() {

    const { data: session } = useSession();
    const isAdmin = session ? session.user.authorities.map(a=>a.authority).includes("ROLE_ADMIN") : false;

    const [tags, setTags] = useState([]);

    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadProducts = async (data) => {
        try {
            setIsLoading(true);
            const products = await getProducts(data);
            setData(products);
            return "Información de producto cargada";
        } catch (error) {
            console.error('Error fetching products:', error);
        }finally{
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const categories = await getCategories();
            setCategories(categories);
            return "Categorias de producto cargadas";
        } catch (error) {
            setCategories([]);
            console.error('Error fetching categories:', error);
        }finally{
            setIsLoading(false);
        }
    }

    const loadTags = async () => {
        try {
            setIsLoading(true);
            const tags = await getTags();
            setTags(tags);
            return "Etiquetas de producto cargadas";
        } catch (error) {
            console.error('Error fetching tags:', error);
        }finally{
            setIsLoading(false);
        }
    }


    useEffect(() => {
        loadCategories().then(res => console.log(res));
        loadProducts().then(res => console.log(res));
        loadTags().then(res => console.log(res));
    }, []);


    const createForm = (form)=>{
        const { register, handleSubmit, formState, reset, setValue, control, getValues  } = form;
        return { register, handleSubmit, formState, reset, setValue, control, getValues, errors: {...formState} };
    }

    // Formularios.
    const forms = {
        product : createForm(useForm({})),
        search : createForm(useForm({}))
    };

    const handleSearch = async (data) =>{
        console.log({...data, tags: data.tags ?? []});
        await loadProducts({...data, tags: data.tags ?? []});
    };

    // Formulario de producto.

    // Dialogos
    const [isDataDialogOpen, setDataDialogOpen] = useState(false); // ¿Esta el dialogo abierto?
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); // ¿Esta el dialogo abierto?

    const [element, setElement] = useState(); // Elemento a actualizar (si hay alguno).


    const openDataDialog = (el) => {
        // Fijar variables iniciales.
        setDataDialogOpen(true);
        setElement(el);
        // Si es actualización, cargar datos.
        if (el) {
            console.log("Elemento cargado:", el);
            forms.product.setValue("name", el.name);
            forms.product.setValue("price", el.price);
            forms.product.setValue("quantity", el.quantity);
            forms.product.setValue("description", el.description);

            forms.product.setValue("category", el.category.id);
            forms.product.setValue("tags", el.tags);
        }else{
            forms.product.setValue("name", "Producto nuevo");
            forms.product.setValue("price", 10);
            forms.product.setValue("quantity", 50);
            forms.product.setValue("description", "Descripción de prueba");

            forms.product.setValue("category", categories[0].id);
            forms.product.setValue("tags", []);
        }
    };
    const openDeleteDialog = (el) => {
        // Fijar variables iniciales.
        setDeleteDialogOpen(true);
        setElement(el);
        // Si es actualización, cargar datos.
        if (el) {
            console.log("Elemento a eliminar:", el);
        }
    }

    // Cierra todos los dialogos, deselecciona el elemento y reinicia el formulario.
    const closeDialogs = () => {
        setElement();
        forms.product.reset();
        // Cerrar ambos dialogos.
        setDataDialogOpen(false);
        setDeleteDialogOpen(false);
    };

    // Actualiza o crea elemento
    const saveChanges = async (data) => {
        if (element) {
            console.log("Actualizar", { ...element, ...data });
            await updateProduct(element.id, {...element, ...data });
        }
        else {
            // Crear y refrescar.
            console.log("Crear", { ...element, ...data});
            await createProduct({...element, ...data})
        }
        loadProducts().then(res => console.log(res));
        closeDialogs();
    }
    // Elimina elemento.
    const deleteElement = async () => {
        if (element) {
            await deleteProduct(element.id);
            loadProducts().then(res => console.log(res));
        }
        closeDialogs();
    }

    return (
        <>
            <div className='flex flex-col gap-y-2'>
                <div className='flex flex-row justify-between items-center'>
                    <Typography variant="h4" component="h1">Productos</Typography>
                    {isAdmin ?
                        <Button variant='contained' color='primary' onClick={(e) => openDataDialog()}
                                startIcon={<AddIcon/>}>Crear nuevo</Button> : (<></>)
                    }
                </div>
                {/* Formulario de búsqueda */}
                <form onSubmit={forms.search.handleSubmit(handleSearch)}>
                    <Stack
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            py: 4,
                            px: 16
                        }}
                    >
                        <Typography variant="h4" component="h1">Buscar producto</Typography>
                        <TextField id="query" label="Nombre" variant="filled"
                                   inputProps={{type: "text"}}
                                   {...(forms.search.register)('query', {})}
                        />

                        <ProductCategorySelect control={forms.search.control}
                                               categories={[{id: 0, name: 'Cualquiera'}, ...categories]}
                                               defaultValue={0}/>

                        {/* Etiquetas*/}
                        <ProductTagsAutocomplete tags={tags}
                                                 control={forms.search.control}
                                                 value={forms.search.getValues().tags}
                        />

                        <Button type="submit" variant="contained">Buscar</Button>
                    </Stack>
                </form>

                {/* Lista de productos */}
                {
                    isLoading ? (<LoadingSpinner/>) : data.length > 0 ?
                        (
                            <Grid container spacing={2} columns={{xs: 1, md: 2, lg: 3}} columnSpacing={{md: 8}}
                                  justifyContent="center">
                                {
                                    data.map((product, index) => (
                                        <Grid key={index} item size={{xs: 12, md: 6, lg: 4}}>
                                            {isAdmin ?
                                                <Card variant="outlined"
                                                      sx={{
                                                          maxWidth: 300,
                                                          borderBottom: 0
                                                      }}
                                                >
                                                    <Grid container direction="row" sx={{
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>
                                                        <IconButton aria-label="fingerprint" color="error" onClick={
                                                            (e) => openDeleteDialog(product)
                                                        }>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                        <IconButton aria-label="fingerprint" color="warning"
                                                                    onClick={(e) => openDataDialog(product)}>
                                                            <EditIcon/>
                                                        </IconButton>
                                                    </Grid>
                                                </Card> : (<></>)
                                            }

                                            <ProductItem product={product}/>

                                        </Grid>
                                    ))
                                }
                            </Grid>
                        ) : (<span>No hay productos, añade uno :(</span>)
                }
            </div>

            {/*Diálogo de eliminar*/}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={closeDialogs}
            >
                <DialogTitle id="delete-dialog-title">{`Eliminar producto`}</DialogTitle>
                <DialogContent>
                    <span>Está seguro de eliminar el producto?</span>
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                    <Button type='submit' variant='contained' color='primary' onClick={deleteElement}>Eliminar</Button>
                </DialogActions>
            </Dialog>
            {/* Formulario de producto */}
            <Dialog
                fullWidth
                open={isDataDialogOpen}
                onClose={closeDialogs}
                scroll={'paper'}
            >
                <DialogTitle id="data-dialog-title">{`${element ? "Actualizar" : "Crear"} producto`}</DialogTitle>
                <form onSubmit={forms.product.handleSubmit(saveChanges)} >
                    <DialogContent>
                        <div className='flex flex-col gap-y-3'>
                            <TextField id="name" label="Nombre" variant="filled"
                                       inputProps={{type: "name", }}
                                       {...(forms.product.register)('name', {required: 'Se requiere nombre',})}
                                       error={!!forms.product.errors.name}
                                       helperText={forms.product.errors.name?.message} />
                            <TextField id="price" label="Precio" variant="filled"
                                       inputProps={{type: "number", }}
                                       {...(forms.product.register)('price', {required: 'Se requiere precio.',})}
                                       error={!!forms.product.errors.price}
                                       helperText={forms.product.errors.price?.message} />
                            <TextField id="quantity" label="Cantidad" variant="filled"
                                       inputProps={{type: "number", }}
                                       {...(forms.product.register)('quantity', {required: 'Se requiere precio.',})}
                                       error={!!forms.product.errors.quantity}
                                       helperText={forms.product.errors.quantity?.message} />
                            <Typography variant="body2" component="span">Imagen: {element && element.img ? element.img: 'No seleccionada'} </Typography>
                            <TextField
                                id="description"
                                variant="filled"
                                label="Descripción"
                                multiline
                                minRows={3}
                                defaultValue=""
                                {...(forms.product.register)('description')}
                            />
                            <Button
                                type="button"
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<UploadIcon />}
                            >
                                Subir imagen
                                <input
                                    className="hidden"
                                    type="file"
                                    onChange={(event) => setElement({...element, img:event.target.files[0].name})}
                                />
                            </Button>
                            {/* Categoria de producto */}
                            {
                                categories.length > 0 ?
                                    <ProductCategorySelect control={forms.product.control}
                                                           categories={categories}
                                                           defaultValue={element && element.category ? element.category.id : categories[0].id}
                                                           key={element && element.category ? element.category.id : 0}
                                    />: (<></>)
                            }
                            {/* Etiquetas*/}
                            {
                                <ProductTagsAutocomplete tags={tags}
                                                         control={forms.product.control}
                                                         value={element && element.tags ? element.tags : []}/>
                            }

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                        <Button type='submit' variant='contained' color='primary'>{element ? 'Actualizar' : 'Crear'}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}