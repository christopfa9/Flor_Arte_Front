import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Controller} from "react-hook-form";


export default function ProductCategorySelect({categories, control, defaultValue}) {

    return (<>
        {categories.length > 0 ?
        <Controller
            control={control}
            defaultValue={defaultValue}
            name="category"
            label="Categoría de producto"

            render={({field})=>(
                <Select
                    variant="outlined"
                    {...field}>
                    {
                        categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            )}
        /> : (<></>)}
    </>);
}