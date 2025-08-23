import { AuthContext } from "@/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/LangContext";
import ProfilePicture from "@/Profile/ProfilePicture";
import { formatDate } from "@/utils/date";
import loc from "@/utils/locale";
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
    lite: boolean,
    category: string,
    isModerator: boolean
}

export default function PostCard({title, displayName, textContent, updateDate, createDate, userId, id, lite, editFn, edited, category, isModerator} : PostCardProps){

    const navigate = useNavigate();

    const { lang } = useLang();

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
                <CardTitle className="flex flex-row justify-start">
                    {lite ? title : <div className="flex flex-row items-center gap-1">
                        <Badge variant="secondary">{category}</Badge>
                        {title}
                    </div>}
                    <div className="flex flex-row ml-auto">
                        { !lite && (isMod || currentUserId === userId) && <Button variant="secondary" onClick={onDeleteSubmit} className="self-start ml-3"><Trash/></Button>}
                        { !lite && currentUserId == userId && editFn && <Button variant="secondary" onClick={editFn} className="self-start ml-3" ><Pen/></Button>}
                    </div>
                </CardTitle>
                <CardDescription className="flex flex-row items-center gap-1">
                    {!lite && <ProfilePicture id={userId} />}
                    {isModerator ? <Link className="text-blue-500 dark:text-blue-600" to={`/forum/profile/${userId}`}>{displayName}</Link> : <Link to={`/forum/profile/${userId}`}>{displayName}</Link>}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{textContent}</p>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-sm">{loc("lastupdate", lang)}: {formatDate(updateDate)}</p>
                    <p className="text-muted-foreground text-sm">{loc("edited", lang)}: {formatDate(createDate)} {edited && `(${loc("edited", lang)})`}</p>
                </div>
            </CardFooter>
        </Card>
    );
}