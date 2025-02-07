import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function LoadingSpinner({message}) {
    return (
        <div className="self-center">
            <Box
                display="flex"
                sx={{flexDirection:"column", alignItems:"center", py: 12, rowGap:2}}
            >
                <CircularProgress color="primary" size={80}  />
                <Typography className="animate-pulse" variant="h5" sx={{fontWeight: 'bold'}} component="span" color="text.primary">{message ?? 'Cargando...'}</Typography>
            </Box>
        </div>
    );
}