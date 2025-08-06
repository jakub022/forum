import { AuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { CornerDownRight } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";

interface CommentCardProps{
    displayName: string,
    textContent: string,
    createDate: string,
    userId: string
    id: string
}

export default function CommentCard({displayName, textContent, createDate, id, userId} : CommentCardProps){

    const authContext = useContext(AuthContext);
    const isMod = authContext?.isMod;

    const onDeleteSubmit = async ()=>{
        const token = await authContext?.user?.getIdToken();
        await fetch(`/api/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    }

    return (
        <Card>
            { isMod && <Button variant="destructive" onClick={onDeleteSubmit} className="self-start ml-3" >Delete</Button>}
            <CardHeader>
                <CardDescription><CornerDownRight/><Link to={`/forum/profile/${userId}`}>{displayName}</Link></CardDescription>
            </CardHeader>
            <CardContent>
                <p>{textContent}</p>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-sm">Created: {createDate}</p>
                    <p className="text-muted-foreground text-sm">ID: {id}</p>
                </div>
            </CardFooter>
        </Card>
    );
}