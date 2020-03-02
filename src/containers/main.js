import React,{useState,useEffect} from 'react';
import CollapseComponent from '../components/collapse';
import { Input,Button,message } from 'antd';
import './main.css';
import api from '../api';
import TableComponent from '../components/TableComponent';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';



    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
  
  }


  const  ConvertToCSV=(objArray)=> {
    // var array = objArray;
    // var str = '';

    // for (var i = 0; i < array.length; i++) {
    //     var line = '';
    //     for (var index in array[i]) {
    //         if (line != '') line += ','

    //         line += array[i][index];
    //     }

    //     str += line + '\r\n';
    // }

    exportToCSV(objArray,"contacts");

}


function Main() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [phone,setPhone]=useState("");
    const [contacts,setContacts]=useState([]);

    useEffect( ()=>{
        fetchContancts();
    },[]);
    
  const  fetchContancts= async ()=>{
    let contacts=await api.getContacts();
    setContacts(contacts.data);
    }

    const exportcs =()=>{
      ConvertToCSV(contacts);
    }

    const submit=async ()=>{
        if(!name||!email||!phone)
        return message.error('Feilds missing! Plese Enter all the feilds!');
        
        let obj={
            name,
            email,
            phone
        }
        let contacts=await api.submitContact(obj);
        if(contacts.success){
            fetchContancts();
            message.info(`${contacts.message}`);
            setName("");
            setEmail("");
            setPhone("");
            return;
        }
         else{
            return message.error(`${contacts.message}`);
         }
        
    }

  return (
    <>
    <div className="main">
     <CollapseComponent>
      <div>
        <Input placeholder="Full Name" style={{padding:8,margin:8}} value={name} onChange={(e)=>setName(e.target.value)} />
        <Input placeholder="Phone" style={{padding:8,margin:8}} value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <Input placeholder="Email" style={{padding:8,margin:8}} value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Button type="primary" onClick={submit}>Submit</Button>
      </div>
      
     </CollapseComponent>
     <div>
         <Button type="primary" onClick={exportcs}>Export to excel</Button>
      </div>
    </div>

    <div className="table">
        <TableComponent data={contacts} getData={fetchContancts}/>
    </div>
    </>
  );
}

export default Main;
