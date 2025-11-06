import { data } from "react-router-dom";
import AdminLayout from "../../Layout/AdminLayout";
import { Card, Form, Input, Button, Table, message, Popconfirm } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined as DeletedOutlined } from '@ant-design/icons';
import { trimData, http } from "../../../modules/module";
import swal from "sweetalert";
import { useState, useEffect } from "react";



const { Item } = Form;
const Branch = () => {

    //states collection
    const [branchForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [messageApi, context] = message.useMessage();
    const [getAllBranch, setAllBranch] = useState([]);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);


    //columns for table
    const columns = [

        {
            title: "Branch Name",
            dataIndex: "branchName",
            key: "branchName"
        },

        {
            title: "Branch Address",
            dataIndex: "branchAddress",
            key: "branchAddress"
        },
        {
            title: "Action",
            dataIndex: "action",
            fixed: "right",
            render: (_, obj) => (
                <div className="flex gap-1">
                    <Popconfirm
                        title="Are you sure?"
                        description="Once you update it , you can also re-update !"
                        onCancel={() => messageApi.warning("No changes occur!")}
                        onConfirm={() => onUpdateBranch(obj)}>
                        <Button
                            className="!bg-green-100 !text-green-500"
                            icon={<EditOutlined />}
                        />

                    </Popconfirm>

                    <Popconfirm
                        title="Are you sure?"
                        description="Once deleted, you cannot restore the data!"
                        onCancel={() => messageApi.warning("Your data is safe!")}
                        onConfirm={() => { onDeleteBranch(obj._id) }}>
                        <Button
                            className="!bg-pink-100 !text-red-500"
                            icon={<DeletedOutlined />} />
                    </Popconfirm>
                </div>
            )
        }

    ]
    
    const onUpdateBranch = (obj) => {
        setEdit(obj);
        branchForm.setFieldsValue(obj);
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);
            const httpReq = http();
            const res = await httpReq.put(`/api/branch/${edit._id}`, finalObj);
            messageApi.success("Branch updated successfully!");
            setNo(no + 1);
            console.log(res);
            branchForm.resetFields();
        }
        catch (err) {
            messageApi.warning("Unable to update branch data!");
            console.log(err);
        }
        finally {
            setLoading(false);
            setEdit(null);
        }
    }

    
    const onDeleteBranch = async (id) => {
        try {
            const httpReq = http();
            const res = await httpReq.delete(`/api/branch/${id}`);
            messageApi.success("Branch deleted successfully!");
            setNo(no + 1);
            console.log(res);


        } catch (err) {
            messageApi.warning("Unable to delete the branch!");
        }
    }


    const fetchData = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get("/api/branch");
            setAllBranch(data.data);
            console.log(data.data)
        } catch (err) {
            messageApi.error("Unable to fetch data!");
        }
    };

    useEffect(() => {

        fetchData();
    }, [no]);


    const onFinish = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);
            finalObj.key = finalObj.branchName;
            const httpReq = http();
            const { data } = await httpReq.post(`/api/branch`, finalObj);
            console.log(data);
            swal("Success", "Branch created successfully!", "success");
            setNo(no + 1);
            branchForm.resetFields();
        }
        catch (err) {
            console.log(err);
            if (err?.response?.data?.error.includes("E11000")) {
                branchForm.setFields([{
                    name: "branchName",
                    errors: ["Branch already exists !"]
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
                    title="Add New Branch">
                    <Form
                        form={branchForm}
                        onFinish={edit ? onUpdate : onFinish}
                        layout="vertical">
                        <Item
                            name="branchName"
                            label="Branch Name:"
                            rules={[{ required: true, message: "Please enter full name!" }]}>
                            <Input></Input>
                        </Item>
                        <Item
                            name="branchAddress"
                            label="Branch Address :"
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
                    title="Branch List"
                    style={{ overflowX: "auto" }}>
                    <Table
                        rowKey="email"
                        columns={columns}
                        dataSource={getAllBranch}
                        scroll={{ x: "max-content" }} />
                </Card>
            </div>
        </AdminLayout>);
}

export default Branch;