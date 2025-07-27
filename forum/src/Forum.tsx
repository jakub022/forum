import { Outlet } from "react-router";

export default function Forum(){
    return (
        <div>
            <h1>The Fullstack Forum</h1>
            <hr />
            <Outlet/>
        </div>
    );
}