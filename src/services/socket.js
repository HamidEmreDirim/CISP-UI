import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? undefined
    : `http://${window.location.hostname}:4000`;

export const socket = io(URL);
