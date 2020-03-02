import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, message, Popconfirm, Form } from 'antd';
import api from '../api';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        editable: true,
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        editable: true,
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state = {
      dataSource: this.getData(),
      data:[]
    };
  }
  
  getData=()=>{
      
      let data=this.props.data.map((item)=>{
          return {key:item.id,...item};
      });
     return data.length>0?this.setState({dataSource:data}):this.setState({dataSource:[]});
  }
  
static  getDerivedStateFromProps=(props,state)=>{
  
    if(props.data.length!==state.data.length){
  
        return {
            data:props.data
        }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState){
    
      if(this.state.data.length!==prevState.data.length){
          this.getData();
      }
  }

  handleDelete = async rec => {

    let res=await api.deleteContact(rec.id);
    
    if(res){
      message.info(`${res.message}`);
      this.props.getData();
    }
    
  };

//   handleAdd = () => {
//     const { count, dataSource } = this.state;
//     const newData = {
//       key: count,
//       name: `Edward King ${count}`,
//       age: 32,
//       address: `London, Park Lane no. ${count}`,
//     };
//     this.setState({
//       dataSource: [...dataSource, newData],
//       count: count + 1,
//     });
//   };

  handleSave = async row => {
    
    let res=await api.updateContact(row);
    if(res){
      message.info(`${res.message}`);
      this.props.getData();
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      this.setState({
        dataSource: newData,
      });
    }
   
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}



export default TableComponent;