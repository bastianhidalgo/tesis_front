import React from "react"
import { FormControl,Text, FormLabel, Input, Textarea,InputGroup,InputLeftAddon } from '@chakra-ui/react'

const InputForm = ({ errors,isInvalid,label, handleChange, placeholder, type, name, value, handleBlur }) => {
    return (
        <FormControl isInvalid={isInvalid} id={name}>
            <FormLabel>{label}</FormLabel>
            <Input  placeholder={placeholder} type={type} onChange={handleChange} onBlur={handleBlur} name={name} value={value} />
            <Text color="red" fontSize="sm">
    {errors}
  </Text>
        </FormControl>
    )
}
const TextForm = ({ errors,isInvalid,label, handleChange, placeholder, type, name, value }) => {
    return (
        <FormControl isInvalid={isInvalid} id={name}>
            <FormLabel>{label}</FormLabel>
            <Textarea placeholder={placeholder} type={type} onChange={handleChange} name={name} value={value} />
            <Text color="red" fontSize="sm">
    {errors}
  </Text>
        </FormControl>
    )
}

const TelForm = ({ errors,isInvalid,label, handleChange, placeholder, type, name, value }) => {
                return (

        <FormControl isInvalid={isInvalid} id={name}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>

            <InputLeftAddon  children='+569' />
            <Input placeholder={placeholder} type={type} onChange={handleChange} name={name} value={value} />
            </InputGroup>
            <Text color="red" fontSize="sm">
    {errors}
  </Text>

        </FormControl>

    )
                }
module.exports={
    InputForm,
    TextForm,
    TelForm
}