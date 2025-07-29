import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

interface PostCardProps{
    title: string,
    displayName: string,
    userId: string,
    textContent: string,
    updateDate: string,
    createDate: string,
    id: string
}

export default function PostCard({title, displayName, textContent, updateDate, createDate, userId, id} : PostCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <Link to={`/forum/profile/${userId}`}><CardDescription>{displayName}</CardDescription></Link>
            </CardHeader>
            <CardContent>
                <p>{textContent}</p>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-sm">Last update: {updateDate}</p>
                    <p className="text-muted-foreground text-sm">Created: {createDate}</p>
                    <p className="text-muted-foreground text-sm">ID: {id}</p>
                </div>
            </CardFooter>
        </Card>
    );
}