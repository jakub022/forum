import { Link, Outlet } from "react-router";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { HouseIcon, PenIcon, UserIcon } from "lucide-react";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export default function Forum(){

    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    return (
        <div>
            <div className="flex m-4 justify-between">
                <Link to="/forum/"><h4 className="scroll-m-20 text-xl font-semibold tracking-tight">The Fullstack Forum</h4></Link>
                <div className="flex gap-2">
                    {user && <Link to="./create"><Button><PenIcon/> New Discussion</Button></Link>}
                    <Link to="/"><Button variant="secondary" size="icon"><HouseIcon/></Button></Link>
                    <Link to="/account"><Button variant="secondary" size="icon"><UserIcon/></Button></Link>
                </div>
            </div>
            <Separator className="my-4"/>
            <Outlet/>
        </div>
    );
}