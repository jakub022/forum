import { useNavigate, useParams } from "react-router";
import { Badge } from "./components/ui/badge";
import { profiles } from "./mock-data/mock-data";
import { Separator } from "@radix-ui/react-separator";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./components/ui/select";
import { Button } from "./components/ui/button";
import { MoveLeft } from "lucide-react";

export default function Profile(){

    let {profileId} = useParams()
    let displayName = "John Doe";
    let isModerator = false;
    let joinDate = "22.1.2024";

    for(let i of profiles){
        if(i.userId === profileId){
            displayName = i.displayName;
            isModerator = i.modProfile;
            joinDate = i.joinDate;
        }
    }

    let navigate = useNavigate();

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col my-5 items-start text-justify w-[80%]">
                <div className="mb-2">
                    <Button onClick={()=>navigate(-1)} variant="ghost" size="icon" className="size-8"><MoveLeft/></Button>
                </div>
                <div className="flex">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mr-3">{displayName}</h4>
                    {isModerator ? <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">Mod</Badge> : <Badge>User</Badge>}
                </div>
                
                <p className="leading-7 [&:not(:first-child)]:my-1">Joined: {joinDate}</p>
                <p className="text-muted-foreground text-sm">ID:{profileId}</p>
            </div>
            <Separator />
            <div className="flex flex-col items-start m-5 gap-3 w-[80%]">
                <div className="flex flex-col items-center">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Display"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="posts">Posts</SelectItem>
                            <SelectItem value="responses">Responses</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
        </div>
    );
}