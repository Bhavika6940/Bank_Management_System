import { data } from "react-router-dom";
import AdminLayout from "../../Layout/AdminLayout";
import { Card, Form, Input, Button, Table, message, Popconfirm } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined as DeletedOutlined } from '@ant-design/icons';
import { trimData, http } from "../../../modules/module";
import swal from "sweetalert";
import { useState, useEffect } from "react";



const { Item } = Form;
const Currency = () => {

    //states collection
    const [currencyForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, context] = message.useMessage();
    const [getAllCurrency, setAllCurrency] = useState([]);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);


    //columns for table
    const columns = [

        {
            title: "Currency Name",
            dataIndex: "currencyName",
            key: "currencyName"
        },

        {
            title: "Currency Description",
            dataIndex: "currencyDesc",
            key: "currencyDesc"
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
                        onConfirm={() => onUpdateCurrency(obj)}>
                        <Button
                            className="!bg-green-100 !text-green-500"
                            icon={<EditOutlined />}
                        />

                    </Popconfirm>

                    <Popconfirm
                        title="Are you sure?"
                        description="Once deleted, you cannot restore the data!"
                        onCancel={() => messageApi.warning("Your data is safe!")}
                        onConfirm={() => { onDeleteCurrency(obj._id) }}>
                        <Button
                            className="!bg-pink-100 !text-red-500"
                            icon={<DeletedOutlined />} />
                    </Popconfirm>
                </div>
            )
        }

    ]

    const onUpdateCurrency = (obj) => {
        setEdit(obj);
        currencyForm.setFieldsValue(obj);
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);
            const httpReq = http();
            const res = await httpReq.put(`/api/currency/${edit._id}`, finalObj);
            messageApi.success("Currency updated successfully!");
            setNo(no + 1);
            console.log(res);
            currencyForm.resetFields();
        }
        catch (err) {
            messageApi.warning("Unable to update currency!");
            console.log(err);
        }
        finally {
            setLoading(false);
            setEdit(null);
        }
    }


    const onDeleteCurrency = async (id) => {
        try {
            const httpReq = http();
            const res = await httpReq.delete(`/api/currency/${id}`);
            messageApi.success("Currency deleted successfully!");
            setNo(no + 1);
            console.log(res);
        } catch (err) {
            messageApi.warning("Unable to delete the currency!");
        }
    }


    const fetchData = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get("/api/currency");
            setAllCurrency(data.data);
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
            finalObj.key = finalObj.currencyName;
            const httpReq = http();
            const { data } = await httpReq.post(`/api/currency`, finalObj);
            console.log(data);
            swal("Success", "Currency created!", "success");
            setNo(no + 1);
            currencyForm.resetFields();
        }
        catch (err) {
            console.log(err);
            if (err?.response?.data?.error.includes("E11000")) {
                currencyForm.setFields([{
                    name: "currencyName",
                    errors: ["Currency already exists!"]
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
                    title="Add New Currency">
                    <Form
                        form={currencyForm}
                        onFinish={edit ? onUpdate : onFinish}
                        layout="vertical">
                        <Item
                            name="currencyName"
                            label="Currency Name:"
                            rules={[{ required: true, message: "Please enter full name!" }]}>
                            <Input></Input>
                        </Item>
                        <Item
                            name="currencyDesc"
                            label="Currency Description:"
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
                    title="Currency List"
                    style={{ overflowX: "auto" }}>
                    <Table
                        rowKey="email"
                        columns={columns}
                        dataSource={getAllCurrency}
                        scroll={{ x: "max-content" }} />
                </Card>
            </div>
        </AdminLayout>);
}

export default Currency;