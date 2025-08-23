import { AuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { useLang } from "@/LangContext";
import ProfilePicture from "@/Profile/ProfilePicture";
import type { ParentComment } from "@/types/types";
import { formatDate } from "@/utils/date";
import loc from "@/utils/locale";
import { useQueryClient } from "@tanstack/react-query";
import { CornerDownRight, Pen, Reply, Trash } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";

interface CommentCardProps{
    displayName: string,
    textContent: string,
    createDate: string,
    userId: string,
    id: string,
    edited: boolean,
    responseFn: (()=>void) | null,
    editFn: (()=>void) | null,
    parent: ParentComment | null,
    lite: boolean,
    isModerator: boolean
}

export default function CommentCard({displayName, textContent, createDate, id, userId, responseFn, editFn, parent, lite, edited, isModerator} : CommentCardProps){

    const queryClient = useQueryClient();
    
    const { lang } = useLang();

    const authContext = useContext(AuthContext);
    const isMod = authContext?.isMod;
    const user = authContext?.user;
    const currentUserId = authContext?.id;

    const onDeleteSubmit = async ()=>{
        const token = await authContext?.user?.getIdToken();
        await fetch(`/api/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        await queryClient.invalidateQueries({queryKey: ['post']});
    }

    return (
        <Card>
            
            <CardHeader>
                <CardDescription className="flex flex-row justify-start items-center gap-1">
                    {!lite && <ProfilePicture id={userId}/>}
                    {isModerator ? <Link className="text-blue-500 dark:text-blue-600" to={`/forum/profile/${userId}`}>{displayName}</Link> : <Link to={`/forum/profile/${userId}`}>{displayName}</Link>}
                    <div className="flex flex-row ml-auto">
                        { !lite && (isMod || currentUserId === userId) && <Button variant="secondary" onClick={onDeleteSubmit} className="self-start ml-3" ><Trash/></Button>}
                        { !lite && currentUserId == userId && editFn && <Button variant="secondary" onClick={editFn} className="self-start ml-3" ><Pen/></Button>}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {parent &&
                <Card>
                    <CardContent>
                        <p className="text-muted-foreground text-sm"><CornerDownRight/>{parent.profile.displayName}: {parent.textContent}</p>
                    </CardContent>
                </Card>
                }
                <p className="mt-2">{textContent}</p>
            </CardContent>
            <CardFooter>
                
                <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-sm">{loc("created", lang)}: {formatDate(createDate)} {edited && `(${loc("edited", lang)})`}</p>
                    {responseFn && user && <Button className="text-muted-foreground" variant="link" onClick={responseFn}><Reply/>Reply</Button>}
                </div>
            </CardFooter>
        </Card>
    );
}