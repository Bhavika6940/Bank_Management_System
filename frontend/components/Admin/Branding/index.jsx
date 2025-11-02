import { Card, Button, Form, Input, message } from "antd";
import AdminLayout from "../../Layout/AdminLayout";
import { EditFilled } from "@ant-design/icons";
import { trimData, http } from "../../../modules/module";
import { useState, useEffect } from "react";
const { Item } = Form;
const Branding = () => {

    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [bankForm] = Form.useForm();
    const [messageApi, context] = message.useMessage();
    const [brandings, setBrandings] = useState([]);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(false);

    //get app branding data
    const fetchData = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get("api/branding");
            const record = data?.data[0] || {};
            setBrandings(record);

            bankForm.setFieldsValue(record);
            console.log(data);


        }
        catch (err) {
            messageApi.success("Unable to fetch the employees data!");

        }
    }

    useEffect(() => {
        fetchData();
    }, [no])

    const handleUpload = async (e) => {
        try {
            let file = e.target.files[0];
            const formData = new FormData();
            formData.append("photo", file);
            const httpReq = http();
            const { data } = await httpReq.post("/api/upload", formData);
            setPhoto(data.filePath);
            setNo(no + 1);

        }
        catch (err) {
            messageApi.error("Unable to upload!")

        }

    }
    //store bank details in database
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const finalObj = trimData(values);
            finalObj.bankLogo = photo ? photo : "bankImages/dummy.jpeg";
            let userInfo = {
                email: finalObj.email,
                fullname: finalObj.fullname,
                password: finalObj.password,
                userType: "admin",
                isActive: true,
                profile: "bankImages/dummy.jpeg"
            }
            const httpReq = http();
            await httpReq.post("/api/branding", finalObj);
            await httpReq.post("/api/users", userInfo);
            messageApi.success("Branding created successfully!");
            setNo(no + 1);
            bankForm.resetFields();


        } catch (err) {
            messageApi.error("Unable to store branding!");
            console.log(err);
        }
        finally {
            setLoading(false);
        }

    }
    return (
        < AdminLayout>
            {context}
            <Card
                title="Bank Details"
                extra={<Button icon={<EditFilled />} > Edit </Button>}>
                <Form
                    form={bankForm}
                    layout="vertical"
                    onFinish={onFinish}>
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Bank Name"
                            name="bankName"
                            rules={[{ required: true }]}>
                            <Input />
                        </Item>
                        <Item
                            label="Bank Tagline"
                            name="bankTagline"
                            rules={[{ required: true }]}>
                            <Input />
                        </Item>
                        <Item
                            label="Logo"
                            name="xyz"
                        >
                            <Input type="file" onChange={handleUpload} />
                        </Item>
                        <Item
                            label="Bank Account No."
                            name="bankAccountNo"
                            rules={[{ required: true }]}>
                            <Input />
                        </Item>
                        <Item
                            label="Bank Account Transaction Id"
                            name="bankTransactionId"
                            rules={[{ required: true }]}>
                            <Input />
                        </Item>
                        <Item
                            label="Bank Address"
                            name="bankAddress"
                            rules={[{ required: true }]}>
                            <Input />
                        </Item>
                        {!edit &&
                            <>
                                <Item
                                    label="Admin Fullname"
                                    name="fullname"
                                    rules={[{ required: true }]}>
                                    <Input />
                                </Item>
                                <Item
                                    label="Admin Email"
                                    name="email"
                                    rules={[{ required: true }]}>
                                    <Input />
                                </Item>
                                <Item
                                    label="Admin Password"
                                    name="password"
                                    rules={[{ required: true }]}>
                                    <Input type="password" />
                                </Item>
                            </>
                        }
                        <Item
                            label="Bank LinkedIn"
                            name="bankLinkedIn">
                            <Input type="url" />
                        </Item>
                        <Item
                            label="Bank Twitter"
                            name="bankTwitter">
                            <Input type="url" />
                        </Item>
                        <Item
                            label="Bank Facebook"
                            name="bankFacebook">
                            <Input type="url" />
                        </Item>
                    </div>
                    <Item
                        label="Bank Description"
                        name="bankDesc">
                        <Input.TextArea />
                    </Item>
                    <Item className="flex justify-end  items-center">
                        <Button
                            loading={loading}
                            type="text"
                            htmlType="submit"
                            className="!bg-blue-500 !text-white !font-bold">
                            Submit
                        </Button>
                    </Item>


                </Form>
            </Card>
        </AdminLayout >

    )

}

export default Branding;