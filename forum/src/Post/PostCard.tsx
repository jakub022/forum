import { AuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pen, Trash } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router";

interface PostCardProps{
    title: string,
    displayName: string,
    userId: string,
    textContent: string,
    updateDate: string,
    createDate: string,
    id: string,
    edited: boolean,
    editFn: (()=>void) | null,
    lite: boolean
}

export default function PostCard({title, displayName, textContent, updateDate, createDate, userId, id, lite, editFn, edited} : PostCardProps){

    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const isMod = authContext?.isMod;
    const currentUserId = authContext?.id;

    const onDeleteSubmit = async ()=>{
        const token = await authContext?.user?.getIdToken();
        await fetch(`/api/posts/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        navigate("/forum/");
    }

    return (
        <Card>
            
            <CardHeader>
                <CardTitle className="flex flex-row justify-start">{title}
                    <div className="flex flex-row ml-auto">
                        { !lite && (isMod || currentUserId === userId) && <Button variant="secondary" onClick={onDeleteSubmit} className="self-start ml-3"><Trash/></Button>}
                        { !lite && currentUserId == userId && editFn && <Button variant="secondary" onClick={editFn} className="self-start ml-3" ><Pen/></Button>}
                    </div>
                </CardTitle>
                <CardDescription>
                    <Link to={`/forum/profile/${userId}`}>{displayName}</Link>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{textContent}</p>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-sm">Last update: {updateDate}</p>
                    <p className="text-muted-foreground text-sm">Created: {createDate} {edited && "(Edited)"}</p>
                </div>
            </CardFooter>
        </Card>
    );
}