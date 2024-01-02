import React from "react"
import { FormControl, FormLabel, Input, Textarea,InputGroup,InputLeftAddon } from '@chakra-ui/react'

const InputForm = ({ label, handleChange, placeholder, type, name, value, handleBlur }) => {
    return (
        <FormControl id={name}>
            <FormLabel>{label}</FormLabel>
            <Input placeholder={placeholder} type={type} onChange={handleChange} onBlur={handleBlur} name={name} value={value} />
        </FormControl>
    )
}
const TextForm = ({ label, handleChange, placeholder, type, name, value }) => {
    return (
        <FormControl id={name}>
            <FormLabel>{label}</FormLabel>
            <Textarea placeholder={placeholder} type={type} onChange={handleChange} name={name} value={value} />
        </FormControl>
    )
}

const TelForm = ({ label, handleChange, placeholder, type, name, value }) => {
                return (

        <FormControl id={name}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>

            <InputLeftAddon  children='+569' />
            <Input placeholder={placeholder} type={type} onChange={handleChange} name={name} value={value} />
            </InputGroup>

        </FormControl>

    )
                }
module.exports={
    InputForm,
    TextForm,
    TelForm
}