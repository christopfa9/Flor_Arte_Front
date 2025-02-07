'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
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
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {createUser, deleteUser, getUsers, updateUser} from "@/services/UserService";
import {getRoles} from "@/services/RoleService";
import {Chip} from "@mui/material";

export default function Page() {
    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('1');
    const [enabled, setEnabled] = useState(false);
    const [isDataDialogOpen, setDataDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); 
    const [isEnabledDialogOpen, setEnabledDialogOpen] = useState(false); 
    const [element, setElement] = useState(); 

    useEffect(() => {        
        loadUsers().then(res => console.log(res));
        loadRoles().then(res => console.log(res));
    }, []);

    const loadUsers = async () => {
        try {
            const users =  await getUsers();
            setData(users);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const loadRoles = async () => {
        try {
            const roles =  await getRoles();
            setRoles(roles);
            return "Información cargada";
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const { register, handleSubmit, formState, reset, setValue, control } = useForm({});
    const { errors } = formState;
    const openDataDialog = (el) => {
        setDataDialogOpen(true);
        setElement(el);
        if (el) {
            let role = el.roleList[0].id;
            setValue("firstName", el.firstName);
            setValue("lastName", el.lastName);
            setValue("email", el.email);
            setValue("role_id", role);
            setValue("address", el.address);
            setEnabled(el.enabled);
            setValue("enabled", el.enabled);
            setSelectedRole(role.toString());
        }
    };

    const openDeleteDialog = (el) => {
        setDeleteDialogOpen(true);
        setElement(el);
    };

    const closeDialogs = () => {
        setElement();
        reset();
        setDataDialogOpen(false);
        setDeleteDialogOpen(false);
        setEnabledDialogOpen(false);
    };

    const saveChanges = async (data) => {
        data.roles = [roles.find(role => role.id === parseInt(data.role_id))];
        if (element) {
            await updateUser(element.id, data);
        } else {
            await createUser(data);
        }
        loadUsers().then(res => console.log(res));
        closeDialogs();
    };

    const deleteElement = async () => {
        if (element) {
            await deleteUser(element.id);    
        }
        loadUsers().then(res => console.log(res));
        closeDialogs();
    };

    const enabledElement = async () => {
        if (element) {
            if(element.enabled) {
                element.enabled = 0;
            }else{
                element.enabled = 1
            }
            await updateUser(element.id, element);
        }
        loadUsers().then(res => console.log(res));
        closeDialogs();
    };

    const openEnabledDialog = (el) => {
        setEnabledDialogOpen(true);
        setElement(el);
    };

    const handleEnabledChange = (event) => {
        setEnabled(event.target.checked);
        setValue('enabled', event.target.checked); 
    };

    const handleRoleChange = (event) => {
        console.log("Role: ", event.target.value);
        setSelectedRole(event.target.value);
        setValue('role_id', event.target.value);
    };

    return (
        <>
            <div className='flex flex-col gap-y-8'>
                <div className='flex flex-row justify-between items-center'>
                    <Typography variant="h4" component="h1">Usuarios</Typography>
                    {/*<Button variant='contained' color='primary' onClick={() => openDataDialog()} startIcon={<AddIcon />}>Crear nuevo</Button>*/}
                </div>

                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Dirección</TableCell>
                                <TableCell>Activo</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow hover key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.firstName} {row.lastName}</TableCell>
                                    <TableCell>{row.roleList[0].name}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.enabled ? 'Activo': 'Inactivo'}
                                            color={row.enabled ? 'success': 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton aria-label="delete" color="error" onClick={() => openDeleteDialog(row)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="edit" color="warning" onClick={() => openDataDialog(row)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={isDeleteDialogOpen} onClose={closeDialogs}>
                <DialogTitle id="delete-dialog-title">Eliminar usuario</DialogTitle>
                <DialogContent>
                    <span>Está seguro de eliminar el usuario?</span>
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                    <Button type='button' variant='contained' color='primary' onClick={deleteElement}>Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isEnabledDialogOpen} onClose={closeDialogs}>
                <DialogTitle id="enabled-dialog-title">Cambiar estado usuario</DialogTitle>
                <DialogContent>
                    <span>Está seguro de cambiar el estado del usuario?</span>
                </DialogContent>
                <DialogActions>
                    <Button type='button' variant='contained' color='secondary' onClick={closeDialogs}>Cancelar</Button>
                    <Button type='button' variant='contained' color='primary' onClick={enabledElement}>Aceptar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDataDialogOpen} onClose={closeDialogs} scroll={'paper'} fullWidth>
                <DialogTitle id="data-dialog-title">{`${element ? "Actualizar" : "Crear"} usuario`}</DialogTitle>
                <form onSubmit={handleSubmit(saveChanges)} >
                    <DialogContent>
                        <div className='flex flex-col gap-y-3'>
                            <TextField 
                                id="firstName"
                                label="Nombre" 
                                variant="filled" 
                                {...register('firstName', { required: 'Nombre es requerido' })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                            <TextField 
                                id="lastName"
                                label="Apellidos" 
                                variant="filled" 
                                {...register('lastName', { required: 'Apellido es requerido' })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                            <TextField 
                                id="email"
                                type="email"
                                label="Correo" 
                                variant="filled" 
                                {...register('email', { required: 'Correo electrónico es requerido' })}
                                error={!!errors.email} 
                                helperText={errors.email?.message} 
                            />
                            <TextField
                                id="password"
                                type="password"
                                label="Contraseña (opcional)"
                                variant="filled"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <FormControl variant="filled" fullWidth>
                                <InputLabel id="role-select-label">Rol</InputLabel>
                                <Controller
                                    name="role_id"
                                    control={control}
                                    defaultValue={selectedRole}
                                    render={({ field }) => (
                                        <Select
                                            labelId="role-select-label"
                                            id="role_id"
                                            value={field.value}
                                            onChange={(e) => {
                                                field.onChange(e); 
                                                handleRoleChange(e);
                                            }}
                                            error={!!errors.role_id}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.role_id && <p>{errors.role_id.message}</p>}
                            </FormControl>
                            <div className="flex items-center">
                                <label htmlFor="enabled">Estado</label>
                                <Switch 
                                    id="enabled" 
                                    {...register('enabled')} 
                                    checked={enabled}
                                    onChange={handleEnabledChange}
                                    inputProps={{ 'aria-label': 'controlled' }} 
                                />
                                {errors.enabled && <p>{errors.enabled.message}</p>}
                            </div>
                            <TextField 
                                id="address" 
                                label="Dirección" 
                                variant="filled" 
                                multiline  
                                rows={4} 
                                {...register('address', { required: 'Dirección es requerida' })}
                                error={!!errors.address} 
                                helperText={errors.address?.message}
                            />
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
