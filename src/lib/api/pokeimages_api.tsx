import axios from 'axios'

const instance = axios.create({
    baseURL:"https://projectpokemon.org/images/normal-sprite"
})

export default instance;