'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {createTag, deleteTag, getTags, updateTag} from "@/services/TagService";

export default function Page() {

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const tags = await getTags();
            setData(tags);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    useEffect(() => {
        fetchData().then(res => console.log(res));
    }, []);

    // Formulario.
    const form = useForm({});
    const { register, handleSubmit, formState, reset, setValue } = form;
    const { errors } = formState;

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
            setValue("name", el.name);
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
        form.reset();
        // Cerrar ambos dialogos.
        setDataDialogOpen(false);
        setDeleteDialogOpen(false);
    };

    // Actualiza o crea elemento
    const saveChanges = async (data) => {
        if (element) {
            // Sobrescribe todo menos ID.
            console.log("Actualizar", { ...element, ...data });
            await updateTag(element.id, { ...element, ...data });
        }
        else {
            // Crear.
            await createTag({ ...element, ...data });
            console.log("Crear", { ...element, ...data });
        }
        fetchData().then(res => console.log(res));
        closeDialogs();
    }
    // Elimina elemento.
    const deleteElement = async () => {
        if (element) {
            console.log('Elemento eliminado: ', element);
            await deleteTag(element.id);
            fetchData().then(res => console.log(res));
        }
        closeDialogs();
    }

    return (
        <>
            <div className='flex flex-col gap-y-8'>
                <div className='flex flex-row justify-between items-center'>
                    <Typography variant="h4" component="h1">Etiquetas de producto</Typography>
                    <Button variant='contained' color='primary' onClick={(e) => openDataDialog()} startIcon={<AddIcon />}>Crear nuevo</Button>
                </div>

                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
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
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        <IconButton aria-label="fingerprint" color="error" onClick={
                                            (e) => openDeleteDialog(row)
                                        }>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="fingerprint" color="warning" onClick={(e) => openDataDialog(row)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <Dialog
                open={isDeleteDialogOpen}
                onClose={closeDialogs}
            >
                <DialogTitle id="delete-dialog-title">{`Eliminar etiqueta`}</DialogTitle>
                <DialogContent>
                    <span>Está seguro de eliminar la etiqueta?</span>
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                    <Button type='submit' variant='contained' color='primary' onClick={deleteElement}>Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isDataDialogOpen}
                onClose={closeDialogs}
                scroll={'paper'}
            >
                <DialogTitle id="data-dialog-title">{`${element ? "Actualizar" : "Crear"} etiqueta`}</DialogTitle>
                <form onSubmit={handleSubmit(saveChanges)} >
                    <DialogContent>
                        <div className='flex flex-col gap-y-3'>
                            <TextField id="name" label="Nombre" variant="filled" inputProps={{
                                type: "name",
                            }} {...register('name', {
                                required: 'Name is required',
                            })} error={!!errors.name} helperText={errors.name?.message} />

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