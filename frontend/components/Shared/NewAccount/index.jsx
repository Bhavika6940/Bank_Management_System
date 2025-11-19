import { SearchOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Modal, Image, Popconfirm, Button, Card, Input, Table, Form, DatePicker, Select, message } from "antd";
import { useState, useEffect } from "react";
import { http, uploadFile, fetchData, trimData } from "../../../modules/module";
import useSWR, { mutate } from "swr";
const { Item } = Form;
const NewAccount = () => {

    //get userInfo from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    //states collections
    const [accountForm] = Form.useForm();
    const [messageApi, context] = message.useMessage();
    const [brandingId, setBrandingId] = useState(null);
    const [bankAccountNo, setBankAccountNo] = useState(null);
    const [accountModal, setAccountModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [document, setDocument] = useState(null);
    const [signature, setSignature] = useState(null);
    const [no, setNo] = useState(0);
    const [allCustomer, setAllCustomer] = useState(null);
    const [finalCustomer, setFinalCustomer] = useState(null);
    const [edit, setEdit] = useState(null);


    // get branding details
    const { data: brandings, error: bError } = useSWR(
        "/api/branding",
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000

        }
    );


    //table columns
    const columns = [
        {
            title: "Photo",
            key: "photo",
            render: (_, obj) => {

                return (
                    <img
                        src={`${import.meta.env.VITE_BASEURL}/${obj?.profile}`}
                        alt="profile"
                        className="rounded-full"
                        width={60}
                        height={40}
                    />
                );

            }
        },
        {
            title: "Signature",
            key: "signature",
            render: (_, obj) => {

                return (
                    <img
                        src={`${import.meta.env.VITE_BASEURL}/${obj?.signature}`}
                        alt="profile"
                        className="object-contain rounded-md border border-gray-300"
                        width={90}
                        height={105}
                    />
                );

            }
        },
        {
            title: "Document",
            key: "document",
            render: (_, obj) => (
                <Button
                    type="text"
                    shape="circle"
                    className="!bg-blue-100 !text-blue-500"
                    icon={<DownloadOutlined />} />
            )
        },
        {
            title: "Branch",
            dataIndex: "branch",
            key: "branch"
        },
        {
            title: "User Type",
            dataIndex: "userType",
            key: "userType",
            render: (text) => {
                if (text === "admin") {
                    return <span className="!capitalize !text-indigo-500">{text}</span>
                }
                else if (text === "employee") {
                    return <span className="!capitalize !text-green-500">{text}</span>
                }
                else {
                    return <span className="!capitalize !text-red-500">{text}</span>
                }
            }

        },
        {
            title: "Account No",
            dataIndex: "accountNo",
            key: "accountNo"
        },
        {
            title: "Balance",
            dataIndex: "finalBalance",
            key: "finalBalance"
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname"
        },
        {
            title: "DOB",
            dataIndex: "dob",
            key: "dob"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile"
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address"
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy"
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
                        onConfirm={() => UpdateIsActive(obj._id, obj.isActive, obj.customerLoginId)}
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
                        onConfirm={() => onEditCustomer(obj)}>
                        <Button
                            className="!bg-green-100 !text-green-500"
                            icon={<EditOutlined />}
                        />

                    </Popconfirm>

                    <Popconfirm
                        title="Are you sure?"
                        description="Once deleted, you cannot restore the data!"
                        onCancel={() => messageApi.warning("Your data is safe!")}
                        onConfirm={() => { onDeleteCustomer(obj._id, obj.customerLoginId) }}>
                        <Button
                            className="!bg-pink-100 !text-red-500"
                            icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        }
    ]


    //update employee
    const onEditCustomer = (obj) => {
        setEdit(obj);
        setAccountModal(true);
        accountForm.setFieldsValue(obj);
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);
            delete finalObj.password;
            delete finalObj.email;
            delete finalObj.accountNo;
            if (photo) {
                finalObj.profile = photo;
            }
            if (signature) {
                finalObj.signature = signature;
            }
            if (document) {
                finalObj.profile = document;
            }
            const httpReq = http();
            const res = await httpReq.put(`/api/customer/${edit._id}`, finalObj);
            messageApi.success("Employee updated successfully!");
            setNo(no + 1);
            console.log(res);
            setPhoto(null);
            setSignature(null);
            setDocument(null);
            accountForm.resetFields();
            setAccountModal(false)

        }
        catch (err) {
            messageApi.warning("Unable to update customer!");
            console.log(err);
        }
        finally {
            setLoading(false);
            setEdit(null);
        }
    }

    //delete employee
    const onDeleteCustomer = async (id, loginId) => {
        try {
            const httpReq = http();
            await httpReq.delete(`/api/users/${loginId}`);
            await httpReq.delete(`/api/customer/${id}`);
            messageApi.success("Customer deleted successfully!");
            setNo(no + 1);
            console.log(res);


        } catch (err) {
            messageApi.warning("Unable to delete the record!");
        }
    }


    //update active status of a customer
    const UpdateIsActive = async (id, isActive, loginId) => {
        try {
            const httpReq = http();
            const obj = {
                isActive: !isActive
            }
            await httpReq.put(`/api/users/${loginId}`, obj);
            await httpReq.put(`/api/customer/${id}`, obj);
            messageApi.success("Status updated successfully!");
            setNo(no + 1);


        }
        catch (err) {
            messageApi.warning("Unable to update status!");
        }

    }

    // search coding
    const onSearch = (e) => {
        let value = e.target.value.trim().toLowerCase();
        let filter = finalCustomer && finalCustomer.filter(cust => {
            if (cust?.fullname.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.branch.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.userType.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.email.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.address.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.accountNo.toString().toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.finalBalance.toString().toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.createdBy.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
            else if (cust?.mobile.toLowerCase().indexOf(value) != -1) {
                return cust;
            }
        });
        setAllCustomer(filter);
    }


    // get customer data
    const fetchEmployees = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get("/api/customer");
            setAllCustomer(
                data?.data?.filter((item) => item.branch == userInfo.branch)
            );   //show in table
            setFinalCustomer(
                data?.data?.filter((item) => item.branch == userInfo.branch)
            );   //keep the full backup
            console.log(data.data)
            setAccountModal(false);
        } catch (err) {
            messageApi.warning("Unable to fetch employees!");
        }
    };

    useEffect(() => {

        fetchEmployees();
    }, [no]);

    useEffect(() => {
        if (brandings && brandings.data && brandings.data.length > 0) {
            const newAccountNo = Number(brandings.data[0].bankAccountNo) + 1;
            const brandingid = brandings && brandings?.data[0]?._id;
            setBankAccountNo(newAccountNo)
            setBrandingId(brandingid)
            accountForm.setFieldValue("accountNo", newAccountNo);
        }
    }, [brandings, accountForm]);


    const onFinish = async (values) => {
        try {
            setLoading(true);
            let finalObj = trimData(values);

            finalObj.profile = photo ? photo : "bankImages/dummy.jpeg";
            finalObj.signature = signature ? signature : "bankImages/dummy.jpeg";
            finalObj.document = document ? document : "bankImages/dummy.jpeg";
            finalObj.userType = "customer";
            finalObj.key = finalObj.email;
            finalObj.branch = userInfo?.branch;
            finalObj.createdBy = userInfo?.email;
            console.log(finalObj);
            const httpReq = http();
            const { data } = await httpReq.post(`/api/users`, finalObj);
            finalObj.customerLoginId = data?.data._id;

            const obj = {
                email: finalObj.email,
                password: finalObj.password
            }

            await httpReq.post("/api/customer", finalObj);

            await httpReq.post('/api/send-email', obj, {
                headers: { "Content-Type": "application/json" }
            });
            await httpReq.put(`/api/branding/${brandingId}`, { bankAccountNo }, {
                headers: { "Content-Type": "application/json" }
            });
            // console.log(res);
            accountForm.resetFields();
            mutate("/api/branding");
            // console.log(data);
            setPhoto(null);
            setSignature(null);
            setDocument(null);

            setNo(no + 1);

            messageApi.success("Account created !");

        }
        catch (err) {
            console.log(err);
            if (err?.response?.data?.error.includes("E11000")) {
                accountForm.setFields([{
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

    // handle photo
    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        const folderName = "customerPhoto";

        try {
            const result = await uploadFile(file, folderName);
            setPhoto(result.filePath);
        }
        catch (err) {
            messageApi.error("Upload failed!")
        }
    }

    // handle signature
    const handleSignature = async (e) => {
        const file = e.target.files[0];
        const folderName = "customerSignature";

        try {
            const result = await uploadFile(file, folderName);
            setSignature(result.filePath);
        }
        catch (err) {
            messageApi.error("Upload failed!")
        }
    }

    // handle document
    const handleDocument = async (e) => {
        const file = e.target.files[0];
        const folderName = "customerDocument";

        try {
            const result = await uploadFile(file, folderName);
            setDocument(result.filePath);
        }
        catch (err) {
            messageApi.error("Upload failed!")
        }
    }

    const onCloseModal = () => {
        setAccountModal(false);
        setEdit(null);
        accountForm.resetFields();
    }
    return (
        <div>
            {context}
            <Card
                title="Account List"
                // style={{ overflowX: "auto" }}
                extra={
                    <div className="flex gap-x-3">
                        <Input
                            placeholder="Search by all"
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                            onChange={onSearch}
                        />
                        <Button
                            onClick={() => setAccountModal(true)}
                            type="text"
                            className="!font-bold !bg-blue-500 !text-white">
                            Add New Account
                        </Button>

                    </div>

                }
            >

                <Table
                    columns={columns}
                    dataSource={allCustomer}
                    scroll={{ x: "max-content" }} />
            </Card>
            <Modal
                open={accountModal}
                onCancel={onCloseModal}
                width={820}
                footer={null}
                title="Open New Account">
                <Form
                    layout="vertical"
                    onFinish={edit ? onUpdate : onFinish}
                    form={accountForm}>

                    {
                        !edit &&
                        <div className="grid md:grid-cols-3 gap-x-3">
                            <Item
                                label="Account No"
                                name="accountNo"
                                rules={[{ required: true }]}>
                                <Input disabled placeholder="Account no" />
                            </Item>
                            <Item
                                label="Email"
                                name="email"
                                rules={[{ required: true }]}>
                                <Input placeholder="Enter email" disabled={edit ? true : false} />
                            </Item>
                            <Item
                                label="Password"
                                name="password"
                                rules={[{ required: edit ? false : true }]}>
                                <Input.Password placeholder="Enter password" disabled={edit ? true : false} />
                            </Item>
                        </div>
                    }
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Fullname"
                            name="fullname"
                            rules={[{ required: true }]}>
                            <Input placeholder="Enter fullname" />
                        </Item>
                        <Item
                            label="Mobile"
                            name="mobile"
                            rules={[{ required: true }]}>
                            <Input placeholder="Enter mobile" />
                        </Item>
                        <Item
                            label="Father Name"
                            name="fatherName"
                            rules={[{ required: true }]}>
                            <Input placeholder="Enter father name" />
                        </Item>
                        <Item
                            label="DOB"
                            name="dob"
                            rules={[{ required: true }]}>
                            <Input type="date" />
                        </Item>

                        <Item
                            label="Gender"
                            name="gender"
                            rules={[{ required: true }]}>
                            <Select
                                placeholder="Select gender"
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" }
                                ]}
                            />

                        </Item>
                        <Item
                            label="Currency"
                            name="currency"
                            rules={[{ required: true }]}>
                            <Select
                                placeholder="Select currecy"
                                options={[
                                    { label: "INR", value: "inr" },
                                    { label: "USD", value: "usd" }
                                ]}>

                            </Select>
                        </Item>
                        <Item
                            label="Photo"
                            name="xyz"
                        // rules={[{ required: true }]}
                        >
                            <Input type="file" onChange={handlePhoto} />

                        </Item>
                        <Item
                            label="Signature"
                            name="abc"
                        // rules={[{ required: true }]}
                        >
                            <Input type="file" onChange={handleSignature} />

                        </Item>
                        <Item
                            label="Document"
                            name="pqr"
                        // rules={[{ required: true }]}
                        >
                            <Input type="file" onChange={handleDocument} />
                        </Item>

                    </div>
                    <Item
                        label="Address"
                        name="address"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />

                    </Item>
                    <Item
                        className="flex justify-end items-center">
                        <Button
                            loading={loading}
                            type="text"
                            htmlType="submit"
                            className="!font-semibold !text-white !bg-blue-500">
                            Submit
                        </Button>
                    </Item>

                </Form>

            </Modal>

        </div>
    )
}
export default NewAccount;