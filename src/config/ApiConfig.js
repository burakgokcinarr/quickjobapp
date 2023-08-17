import axios from "axios";

const POSITION_STACK_API_KEY = 'd2a50ba36fadd6c1946abb2ba3da88d5';
const COUNTRY_USE_MODULE     = 1;

const instance = axios.create({
    baseURL: 'http://api.positionstack.com',
    timeout: 3000,
    params: {
        access_key: POSITION_STACK_API_KEY,
        country_module: COUNTRY_USE_MODULE
    }
});

export default instance;