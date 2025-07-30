import { useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { MoveLeft } from "lucide-react";
import { useAuth } from "./AuthContext";
import { accounts, userProfiles } from "./mock-data/mock-data";

export default function Account(){

    let navigate = useNavigate();
    let accountId = useAuth()?.accountId;
    if(!accountId){
        console.error("Error fetching account id!");
    }

    let account = accounts.find((acc)=>acc.id===accountId);
    if(!account){
        console.error("Error fetching account!");
    }

    let userProfile = userProfiles.find((prof)=>prof.userId===account?.userId);

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col my-5 items-start text-justify w-[80%] gap-3">
                <Button onClick={()=>navigate(-1)} variant="ghost" size="icon" className="size-8"><MoveLeft/></Button>
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Manage your account & profile</h1>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Account</h4>
                <div className="flex flex-col">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">ID: {account?.id}</h4>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">Type: {account?.isModerator ? "Mod" : "User"}</h4>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">Associated Profile: {account?.userId}</h4>
                </div>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Profile</h4>
                <div className="flex flex-col">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">Display name: {userProfile?.displayName}</h4>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">Join date: {userProfile?.joinDate}</h4>
                </div>
            </div>
        </div>
    )
}