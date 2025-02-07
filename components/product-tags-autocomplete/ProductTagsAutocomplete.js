import {Controller} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";


export default function ProductTagsAutocomplete({tags, control, value}) {

    return (
        <>
            {(tags && control) ?
                <Controller
                    control={control}
                    name="tags"
                    render={({field}) => (
                        <Autocomplete
                            {...field}
                            options={tags}
                            multiple
                            filterSelectedOptions
                            value={value || []}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.name === value.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Etiquetas"
                                    variant="outlined"
                                />
                            )}
                            onChange={(event, data) => {
                                field.onChange(data);
                                value = [...data];
                            }}
                        />
                    )}
                />
                : (<></>)}
        </>);
}