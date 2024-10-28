import axios from "axios"

export const GET = (path = '', data) => {
    axios.get('http://localhost:5000/' + path, data)
        .then(response => {
            return response
        })
        .catch(error => {
            console.error('Hata:', error);
        });
}

export const POST = (path = '', data) => {
    axios.post('http://localhost:5000/' + path, data)
        .then(response => {
            return response
        })
        .catch(error => {
            console.error('Hata:', error);
        });
}

