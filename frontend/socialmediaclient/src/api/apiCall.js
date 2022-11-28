import * as api from "./index"

export const registerCall = async(data) => {
    try{
        let response = await api.register(data);
        // localStorage.setItem({'token' : data.access})
        // return data;
        console.log(response);
        return response;
    }
    catch(e){
        console.log(e);
    }
}