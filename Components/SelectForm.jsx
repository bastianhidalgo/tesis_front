import React from "react"
import { FormControl, FormLabel, Select } from '@chakra-ui/react'


const SelectForm = ({ label, handleChange, placeholder, type, name, value }) => {
    return (
        <FormControl id={name}>
            <FormLabel>{label}</FormLabel>
            <Select placeholder={placeholder} type={type} onChange={handleChange} name={name} value={value} />
        </FormControl>
    )
}

export default SelectForm