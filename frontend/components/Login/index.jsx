import { Card, Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { trimData, http } from "../../modules/module";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const { Item } = Form;

const Login = () => {
    const cookies = new Cookies();
    const expires = new Date();
    expires.setDate(expires.getDate() + 3);
    const navigate = useNavigate();

    const [messageApi, context] = message.useMessage();

    const onFinish = async (values) => {
        try {
            const finalObj = trimData(values);
            const httpReq = http();
            const { data } = await httpReq.post("/api/login", finalObj);

            if (data?.isLogged && data?.userType) {
                const { token, userType } = data;
                cookies.set("authToken", token, { path: "/", expires });

                messageApi.success("Login success!");
                navigate(`/${userType}`);
            } else {
                messageApi.warning("Wrong credentials!");
            }
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Login failed!");
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
            {context}

            {/* Left Side Image */}
            <div className="w-1/2 hidden md:flex items-center justify-center bg-blue-900">
                <img
                    src="public/bank-img.jpg"
                    alt="Bank"
                    className="w-4/5 object-contain rounded-xl shadow-2xl"
                />
            </div>

            {/* Right Side Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
                <Card
                    className="w-full max-w-sm shadow-2xl rounded-xl border border-gray-100"
                    style={{ background: "linear-gradient(135deg, #ffffff 0%, #f0f6ff 100%)" }}
                >
                    <h2 className="text-3xl font-bold text-center text-blue-800 tracking-wide mb-4">
                        COOPERATIVE BANK
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        Securely login to your account
                    </p>

                    <Form name="login" onFinish={onFinish} layout="vertical">
                        <Item
                            className="mt-4"
                            name="email"
                            label={<span className="font-semibold text-gray-600">Username</span>}
                            rules={[{ required: true, message: "Please enter your username" }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your username"
                                size="large"
                                className="rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-600 transition"
                            />
                        </Item>

                        <Item
                            name="password"
                            label={<span className="font-semibold text-gray-600">Password</span>}
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter your password"
                                size="large"
                                className="rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-600 transition"
                            />
                        </Item>

                        <Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                className="!bg-blue-600 hover:!bg-blue-700 !font-semibold !text-white rounded-lg mt-3 shadow-md"
                            >
                                Login
                            </Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
