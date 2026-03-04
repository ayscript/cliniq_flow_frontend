import { getToken } from "./uitils"

const apiUrl = "http://127.0.0.1:8000"

const api = {
    post: async function(endpoint, payload){
        // const auth_token = getToken()
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${await getToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        return data
    },
    get: async function(endpoint){
        // const auth_token = await getToken()
        // console.log(auth_token)
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getToken()}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data;
    }
}

export { api }