import axios from 'axios'
export const clienteAxios=axios.create({
    baseURL:'http://localhost:80/api'
})

