import { useState, useEffect } from 'react';
import { Table, message, Button, Modal, Form, Input, Popconfirm, Tag, Select } from 'antd';
import api from '../api/axios';

function Employees () {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [page, setPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [search,setSearch] = useState('');
  const [form] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem('user'));
  
const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      message.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

 const fetchRoles = async () => {
        try {
            const response = await api.get('/roles')
            setRoles(response.data);
        } catch (error) {
            message.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

const fetchEmployees = async () => {
    try {
      const response = await api.get(`/employees?page=${page}&limit=10&search=${search}`);
      setEmployees(response.data.employees);
      setTotalEmployees(response.data.total);
    } catch (error) {
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }
     useEffect(() => {
    fetchEmployees();
  }, [page,search]);

useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleCreate = async (values) => {
    try {
        if (editingEmployee) {
            await api.put(`/employees/${editingEmployee.id}`, values);
            message.success('Employee edited');
        } else {
            await api.post('/employees', values);
      message.success('Employee created');
        }
      setIsModalOpen(false);
      setEditingEmployee(null);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      message.error('Failed to create employee');
    }
  }; 

const handleEdit = (record) => {
    setEditingEmployee(record);
    form.setFieldsValue({ 
    first_name: record.first_name,
  last_name: record.last_name,
  email: record.email,
  job_title: record.job_title,
  department_id: record.department_id,
  role_id: record.role_id,
  status: record.status})
  setIsModalOpen(true);
}
  
const handleDelete = async (record) => {
      if (record.status === 'Inactive') {
        try {
         await api.put(`/employees/${record.id}`, { status: 'Active' });
        message.success('employee reactivated');
        fetchEmployees();
        } catch (error) {
          message.error('Failed to reactivate employee');
        }
      } else {
        try { await api.put(`/employees/${record.id}/deactivate`);
        message.success('employee deactivated');
        fetchEmployees();
    } catch (error) {
        message.error('Failed to deactivate employee');
    }
      }
};

const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name'},
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name'},
    { title: 'Email', dataIndex: 'email', key: 'email'},
    { title: 'Job Title', dataIndex: 'job_title', key: 'job_title'},
    { title: 'Department', key: 'department', render:(_, record) => (record.Department?.name) },
    { title: 'Role', key: 'role', render: (_,record) => (record.Role?.name)},
    { title: 'Status', key: 'status', render: (_,record) => (<Tag color = {record.status === 'Active' ? "green" : "red" }>{record.status}</Tag>)},
    {title: 'Actions', key:'actions', render: (_,record) => (
      <span style = {{display : 'flex', gap: 8}}>
        <Button type="default" onClick={() => handleEdit(record)}>
          Edit
        </Button>
        <Popconfirm 
    title="Are you sure?" 
    onConfirm={() => handleDelete(record)}
    okText="Yes"
    cancelText="No"
    >
      {record.status === 'Active' ? ( <Button danger>Deactivate</Button> ) : (<Button>Reactivate</Button>)}
       </Popconfirm>
      </span>)}
    
    ]

    const employeeColumns = [
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name'},
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name'},
    { title: 'Email', dataIndex: 'email', key: 'email'},
    { title: 'Job Title', dataIndex: 'job_title', key: 'job_title'},
    { title: 'Department', key: 'department', render:(_, record) => (record.Department?.name) },
    { title: 'Role', key: 'role', render: (_,record) => (record.Role?.name)},
    { title: 'Status', key: 'status', render: (_,record) => (<Tag color = {record.status === 'Active' ? "green" : "red" }>{record.status}</Tag>)},
    ]
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:16, gap:100}}>
          <h1>Employees</h1>
          <Input.Search style= {{width: 400, height: 32, marginTop:30, }} placeholder="Search employees by first name, last name, or email" onSearch={(value) => setSearch(value)}>
          </Input.Search>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            New Employee
          </Button>
        </div>

        <Table
        columns = {currentUser.permission_level === 'employee' ? employeeColumns : columns}
        dataSource = {employees}
        rowKey="id"
        loading={loading}
        pagination={{
          current:page,
          total: totalEmployees,
          pageSize: 10,
          onChange: (newPage) => setPage(newPage),
        }}
        />

         <Modal
          title={editingEmployee ? "Edit Employee" : "New Employee"}
          open={isModalOpen}
          onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingEmployee(null); }}
          onOk={() => form.submit()}
          >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
              <Form.Item 
                label="First name"
                name="first_name"
                rules={[{ required: true, message: 'Please enter a First name'}]}
                >
                  <Input />
                </Form.Item>
               <Form.Item 
                label="Last name"
                name="last_name"
                rules={[{ required: true, message: 'Please enter a Last name'}]}
                >
                  <Input />
                </Form.Item>
                 <Form.Item 
                label="Email"
                name="email"
                >
                  <Input />
                </Form.Item>
                 <Form.Item 
                label="Job Title"
                name="job_title"
                >
                  <Input />
                </Form.Item>
                <Form.Item 
                label="Department"
                name="department_id"
                >
                <Select>
                {departments.map(dept => (
                  <Select.Option key={dept.id} value = {dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
                </Select>
                </Form.Item>
                {currentUser.permission_level === 'admin' && (
                   <Form.Item 
                label="Roles"
                name="role_id"
                >
                <Select>
                {roles.map(dept => (
                  <Select.Option key={dept.id} value = {dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
                </Select>
                </Form.Item>
                )}
            </Form>
          </Modal>
      </div>
    );

}


  export default Employees;