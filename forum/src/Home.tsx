import { Link } from "react-router";
import { Button } from "./components/ui/button";

export default function Home(){
    return (
        <div className="text-center flex flex-col items-center">
            <h1 className="my-10 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Welcome to the fullstack forum!</h1>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Discuss fullstack development topics & connect with other developers.
            </h4>
            <div className="flex flex-wrap items-center gap-2 md:flex-row my-15">
                <Link to="/forum"><Button>Browse Forum</Button></Link>
                <Link to="/account"><Button variant="outline">My Account</Button></Link>
            </div>
        </div>
    );
}