import { data } from "react-router-dom";
import AdminLayout from "../../Layout/AdminLayout";
import { Card, Form, Input, Button, Table, message, Popconfirm } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined as DeletedOutlined } from '@ant-design/icons';
import { trimData, http } from "../../../modules/module";
import swal from "sweetalert";
import { useState, useEffect } from "react";



const { Item } = Form;
const NewEmployee = () => {

    //states collection
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [messageApi, context] = message.useMessage();
    const [getAllEmployees, setAllEmployees] = useState([]);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);


    //columns for table
    const columns = [
        {
            title: "Profile",
            key: "profile",
            render: (_, obj) => {

                return (
                    <img
                        src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
                        alt="profile"
                        className="rounded-full"
                        width={40}
                        height={40}
                    />
                );

            }
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname"
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address"
        },
        {
            title: "Action",
            dataIndex: "action",
            fixed: "right",
            render: (_, obj) => (
                <div className="flex gap-1">

                    <Popconfirm
                        title="Are you sure?"
                        description="Once you update it, you revert it back!"
                        onConfirm={() => UpdateIsActive(obj._id, obj.isActive)}
                        onCancel={() => messageApi.warning("Your operation is cancelled !")}>
                        <Button
                            className={`${obj.isActive ? "!bg-blue-100 !text-blue-500" : "!bg-red-100 !text-red-500"}`}
                            icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}

                        />
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure?"
                        description="Once you update it , you can also re-update !"
                        onCancel={() => messageApi.warning("No changes occur!")}
                        onConfirm={() => onUpdateUser(obj)}>
                        <Button
                            className="!bg-green-100 !text-green-500"
                            icon={<EditOutlined />}
                        />

                    </Popconfirm>

                    <Popconfirm
                        title="Are you sure?"
                        description="Once deleted, you cannot restore the data!"
                        onCancel={() => messageApi.warning("Your data is safe!")}
                        onConfirm={() => { DeleteUser(obj._id) }}>
                        <Button
                            className="!bg-pink-100 !text-red-500"
                            icon={<DeletedOutlined />} />
                    </Popconfirm>
                </div>
            )
        }

    ]
    //update employee
    const onUpdateUser = (obj) => {
        setEdit(obj);
        const { profile, ...rest } = obj;
        form.setFieldsValue(rest);
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);
            if (photo) {
                finalObj.profile = photo;
            }
            const httpReq = http();
            const res = await httpReq.put(`/api/users/${edit._id}`, finalObj);
            messageApi.success("Employee updated successfully!");
            setNo(no + 1);
            console.log(res);
            form.resetFields();
        }
        catch (err) {
            messageApi.warning("Unable to update data!");
            console.log(err);
        }
        finally {
            setLoading(false);
            setEdit(null);
        }
    }

    //delete employee
    const DeleteUser = async (id) => {
        try {
            const httpReq = http();
            const res = await httpReq.delete(`/api/users/${id}`);
            messageApi.success("Record deleted successfully!");
            setNo(no + 1);
            console.log(res);


        } catch (err) {
            messageApi.warning("Unable to delete the record!");
        }
    }
    //update active status of a employee
    const UpdateIsActive = async (id, isActive) => {
        try {
            const httpReq = http();
            const obj = {
                isActive: !isActive
            }

            const res = await httpReq.put(`/api/users/${id}`, obj);
            messageApi.success("Status updated successfully!");
            setNo(no + 1);


        }
        catch (err) {
            messageApi.warning("Unable to update status!");
        }

    }
    const fetchEmployees = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get("/api/users");
            setAllEmployees(data.data);
            console.log(data.data)
        } catch (err) {
            messageApi.warning("Unable to fetch employees!");
        }
    };

    useEffect(() => {

        fetchEmployees();
    }, [no]);

    const handleUpload = async (e) => {
        try {
            let file = e.target.files[0];
            const formData = new FormData();
            console.log(file);
            formData.append("photo", file);
            const httpReq = http();
            const { data } = await httpReq.post("/api/uploads", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            messageApi.success("Photo uploaded successfully!");
            setPhoto(data.filePath);
        } catch (err) {
            messageApi("Unable to upload!");
        }
    }


    const onFinish = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);
            finalObj.profile = photo ? photo : "bankImages/dummy.jpeg";
            finalObj.key = finalObj.email;
            console.log(finalObj);
            const httpReq = http();
            const { data } = await httpReq.post(`/api/users`, finalObj);

            const obj = {
                email: finalObj.email,
                password: finalObj.password
            }

            const res = await httpReq.post('/api/send-email', obj, await httpReq.post("/api/send-email", obj, {
                headers: { "Content-Type": "application/json" }
            }));
            console.log(res);

            console.log(data);
            swal("Success", "Employee added successfully!", "success");
            setNo(no + 1);
            setEdit(null);
            form.resetFields();
        }
        catch (err) {
            console.log(err);
            if (err?.response?.data?.error.includes("E11000")) {
                form.setFields([{
                    name: "email",
                    errors: ["Email already exists"]
                }])
            }
            else {
                messageApi.warning("Try again later!");
            }
        }
        finally {
            setLoading(false);
        }

    }
    return (
        <AdminLayout>
            {context}
            <div className="grid md:grid-cols-3 gap-3">
                <Card
                    title="Add New  Employee">
                    <Form
                        form={form}
                        onFinish={edit ? onUpdate : onFinish}
                        layout="vertical">
                        <Item
                            label="Profile :"
                            name="profile">
                            <Input type="file" onChange={handleUpload}></Input>
                        </Item>
                        <div className="grid md: grid-cols-2 gap-x-2">
                            <Item
                                name="fullname"
                                label="FullName :"
                                rules={[{ required: true, message: "Please enter full name!" }]}>
                                <Input></Input>
                            </Item>
                            <Item
                                name="mobile"
                                label="Mobile :"
                                rules={[{ required: true, message: "Please enter  mobile number!" }]}>
                                <Input type="number"></Input>
                            </Item>

                        </div>
                        <div className="grid md: grid-cols-2 gap-x-2">
                            <Item
                                name="email"
                                label="Email :"
                                rules={[{ required: true, message: "Please enter email!" }]}>
                                <Input></Input>
                            </Item>
                            <Item
                                name="password"
                                label="Password :"
                                rules={[{ required: true, message: "Please enter password!" }]}>
                                <Input type="password" disabled={edit ? true : false}></Input>
                            </Item>

                        </div>
                        <Item
                            name="address"
                            label="Address :"
                            rules={[{ required: true, message: "Please enter address!" }]}>
                            <Input.TextArea />
                        </Item>
                        <Item>
                            {
                                edit ? <Button
                                    loading={loading}
                                    htmlType="submit"
                                    className="!bg-rose-500 !text-white !font-bold !w-full">
                                    Update
                                </Button> :
                                    <Button
                                        loading={loading}
                                        htmlType="submit"
                                        className="!bg-blue-500 !text-white !font-bold !w-full">
                                        Submit
                                    </Button>
                            }
                        </Item>
                    </Form>
                </Card>
                <Card
                    className="md:col-span-2"
                    title="Employee List"
                    style={{ overflowX: "auto" }}>
                    <Table
                        rowKey="email"
                        columns={columns}
                        dataSource={getAllEmployees}
                        scroll={{ x: "max-content" }} />
                </Card>
            </div>
        </AdminLayout>);
}

export default NewEmployee;