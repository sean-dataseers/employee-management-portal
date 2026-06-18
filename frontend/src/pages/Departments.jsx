import { useState, useEffect } from 'react';
import { Table, message, Button, Modal, Form, Input, Popconfirm } from 'antd';
import api from '../api/axios';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (values) => {
    try {
        if (editingDepartment) {
            await api.put(`/departments/${editingDepartment.id}`, {name: values.name, description: values.description});
            message.success('Department edited');
        } else {
            await api.post('/departments', values);
      message.success('Department created');
        }
      setIsModalOpen(false);
      setEditingDepartment(null);
      form.resetFields();
      fetchDepartments();
    } catch (error) {
      message.error('Failed to create department');
    }
  }; 

 const handleEdit = (record) => {
    setEditingDepartment(record);
    form.setFieldsValue({name: record.name, description: record.description })
    setIsModalOpen(true);
  }

  const handleDelete = async (id) => {
    try {
        await api.delete(`/departments/${id}`);
        message.success('Department deleted');
        fetchDepartments();
    } catch (error) {
      message.error('Failed to delete department'); 
    }

  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Actions', key: 'actions', render: (_,record) => (
      <span style = {{display : 'flex', gap: 8}}>
        <Button type="default" onClick={() => handleEdit(record)}>
          Edit
        </Button>
        <Popconfirm 
    title="Are you sure?" 
    onConfirm={() => handleDelete(record.id)}
    okText="Yes"
    cancelText="No"
    >
      <Button danger>Delete</Button>
       </Popconfirm>
      </span>
    )}
  ];

  const columnsNoActions = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Departments</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          New Department
        </Button>
      </div>

      <Table
        columns={currentUser.permission_level === 'admin' ? columns : columnsNoActions}
        dataSource={departments}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingDepartment ? "Edit Department" : "New Department"}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingDepartment(null); }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Departments;