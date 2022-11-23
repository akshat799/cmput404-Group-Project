import * as api from "./index"

export const registerCall = async(data) => {
    try{
        let response = await api.register(data);
        localStorage.setItem({'token' : response.access})
        return response;
    }
    catch(e){
        console.log(e);
    }
}