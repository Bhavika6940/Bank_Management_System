import HomeLayout from "../Layout/HomeLayout";
import Login from "../Login";

const HomePage = () =>{
    return (
        <HomeLayout>
            <h1 className="text-5xl font-bold text-red-500">
                <Login/>
            </h1>
        </HomeLayout>
    );
}
export default HomePage;