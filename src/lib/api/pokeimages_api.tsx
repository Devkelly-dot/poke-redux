import axios from 'axios'

const instance = axios.create({
    baseURL:"https://projectpokemon.org/images/sprites-models/"
})

export default instance;