import { Link, useParams } from "react-router";
import PostCard from "./Post/PostCard";
import CommentCard from "./Post/CommentCard";
import { MoveLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import { comments, posts, profiles } from "./mock-data/mock-data";

export default function Post(){

    let {postId} = useParams()

    let title = "React Hook Form vs Formik?";
    let displayName = "John Doe";
    let userId = "default";
    let textContent = "Which one do you prefer for larger apps?";
    let createDate = "2025-07-22T15:00:00Z";
    let updateDate = "2025-07-22T15:00:00Z";

    for(let i of posts){
        if(i.id === postId){
            title = i.title;
            textContent = i.textContent;
            createDate = i.createdAt;
            updateDate = i.updatedAt;
            userId = i.userId;

            for(let j of profiles){
                if(i.userId === j.userId){
                    displayName = j.displayName;
                }
            }
        }
    }

    let filteredComments = comments.filter((comm)=>comm.postId === postId);
    let commentElements = filteredComments.map((comm)=>{
        let commentDisplayName = "John Doe"
        for(let i of profiles){
            if(i.userId === comm.userId){
                commentDisplayName = i.displayName;
            }
        }
        return <CommentCard userId={comm.userId} id={comm.id} textContent={comm.textContent} createDate={comm.createdAt} displayName={commentDisplayName}/>
    });

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col m-5 gap-3 w-[80%]">
                <div className="self-start">
                    <Link to="../.."><Button variant="ghost" size="icon" className="size-8"><MoveLeft/></Button></Link>
                </div>
                <PostCard id={postId ? postId : ""} title={title} displayName={displayName} textContent={textContent} createDate={createDate} updateDate={updateDate} userId={userId}/>
                <div className="flex flex-col items-start gap-2 w-[50%] self-start">
                    <Textarea placeholder="Join the discussion!" />
                    <Button variant="secondary">Submit</Button>
                </div>
                <Separator />
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{filteredComments.length == 1 ? "1 Response" : `${filteredComments.length} Responses`}</h4>
                {commentElements}
            </div>
        </div>
    );
}