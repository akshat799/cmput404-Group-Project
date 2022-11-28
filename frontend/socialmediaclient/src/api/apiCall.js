import * as api from "./index"

export const registerCall = async(data) => {
    try{
        response = await api.register(data);
        localStorage.setItem({'token' : data.access})
        return data;
    }
    catch(e){
        console.log(e);
    }
}