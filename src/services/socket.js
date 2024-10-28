import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://192.168.1.17:5000'; //TATEK
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://192.168.1.101:5000'; //LCK
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://192.168.122.171:5000';
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://172.20.10.2:5000';

export const socket = io(URL);