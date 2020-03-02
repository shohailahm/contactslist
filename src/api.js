import axios from "axios";

const getContacts=()=>{
    return axios.get('http://localhost:5000/contacts');
}

const submitContact=(data)=>{
    return axios.post('http://localhost:5000/contacts',JSON.stringify(data),{headers:{'Content-Type': 'application/json'}})
           .then((res)=>res.data)
           .catch((err)=>err)
}

const deleteContact=(id)=>{
    
    return axios.delete(`http://localhost:5000/contacts/${id}`,{headers:{'Content-Type': 'application/json'}})
    .then((res)=>res.data)
    .catch((err)=>err)
}

const updateContact=(data)=>{
    
    return axios.put(`http://localhost:5000/contacts/${data.id}`,JSON.stringify(data),{headers:{'Content-Type': 'application/json'}})
    .then((res)=>res.data)
    .catch((err)=>err)
}

const search=(data)=>{
    
    return axios.get(`http://localhost:5000/search?value=${data}`,{headers:{'Content-Type': 'application/json'}})
    .then((res)=>res.data)
    .catch((err)=>err)
}

export default {
    getContacts,
    submitContact,
    deleteContact,
    updateContact,
    search
    


}