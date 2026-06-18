import { useState, useEffect } from 'react';
import { Table, message, Button, Modal, Form, Input, Popconfirm, Select } from 'antd';
import api from '../api/axios';

function Roles () {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [form] = Form.useForm();

    const currentUser = JSON.parse(localStorage.getItem('user'));

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

    useEffect (() => { 
        fetchRoles ();
    }, []);

    const handleCreate = async (values) => {
        try {
            if (editingRole) {
                await api.put(`/roles/${editingRole.id}`, values);
                message.success('Role edited');
            } else {
                await api.post('/roles', values);
                message.success('Role created');
            }
        setIsModalOpen(false);
        setEditingRole(null);
        form.resetFields();
        fetchRoles();
        } catch (error) {
            message.error('failed to create role');
        }
    };

    const handleEdit = (record) => {
        setEditingRole(record);
        form.setFieldsValue({name: record.name, permission_level: currentUser.permission_level})
        setIsModalOpen(true);
    };

    const handleDelete = async(id) => {
        try {
            await api.delete (`/roles/${id}`);
            message.success('Role deleted');
            fetchRoles();
        } catch (error) {
            message.error('Failed to delete Role');
        }

    };
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name'},
        {title: 'Permission Level', dataIndex: 'permission_level', key: 'permission_level'},
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
        { title: 'Name', dataIndex: 'name', key: 'name'}
    ];
    
    return (
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h1>Roles</h1>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
            New Role
        </Button>
      </div>

      <Table
        columns={currentUser.permission_level === 'admin' ? columns : columnsNoActions}
        dataSource={roles}
        rowKey="id"
        loading={loading}
      />

       <Modal
        title={editingRole ? "Edit Role" : "New Role"}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingRole(null); }}
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
          <Form.Item
            label="Permissions"
            name="permission_level"
          >
            <Select>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="employee">Employee</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    );

}
export default Roles;