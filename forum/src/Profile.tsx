import { Link, useNavigate, useParams } from "react-router";
import { Badge } from "./components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./components/ui/select";
import { Button } from "./components/ui/button";
import { MoveLeft } from "lucide-react";
import CommentCard from "./Post/CommentCard";
import type { Comment, Post, Profile } from "./types/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PostCard from "./Post/PostCard";
import ProfilePicture from "./Profile/ProfilePicture";

export default function Profile(){

    let {profileId} = useParams()

    let navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState("posts");

    const fetchProfile = async ()=>{
        const res = await fetch(`/api/profiles/${profileId}`);
        if(!res.ok){
            console.error("Error fetching profile!");
        }
        return res.json();
    }

    const fetchComments = async ()=>{
        const res = await fetch(`/api/profiles/${profileId}/comments`);
        if(!res.ok){
            console.error("Error fetching profile comments!");
        }
        return res.json();
    }

    const fetchPosts = async ()=>{
        const res = await fetch(`/api/profiles/${profileId}/posts`);
        if(!res.ok){
            console.error("Error fetching profile posts!");
        }
        return res.json();
    }

    const {isPending: isProfilePending, isError: isProfileError, data: profileData, error: profileError} = useQuery<Profile>({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });

    const {isPending: isCommentsPending, isError: isCommentsError, data: commentsData, error: commentsError} = useQuery<Comment[]>({
        queryKey: ['comments'],
        queryFn: fetchComments,
    });

    const {isPending: isPostsPending, isError: isPostsError, data: postsData, error: postsError} = useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    

    if(isProfilePending || isCommentsPending || isPostsPending){
        return (<>Pending..</>);
    }

    if(isProfileError){
        return (<>Error: {profileError.message}</>);
    }
    if(isCommentsError){
        return (<>Error: {commentsError.message}</>);
    }
    if(isPostsError){
        return (<>Error: {postsError.message}</>);
    }

    let commentElements = commentsData.map((comm)=>{
            return <Link to={`/forum/post/${comm.postId}`}><CommentCard editFn={null} edited={comm.edited} lite={true} userId={comm.profile.id} id={comm.id.toString()} textContent={comm.textContent} createDate={comm.createdAt} displayName={comm.profile.displayName} parent={null} responseFn={null}/></Link>
    });

    let postElements = postsData.map((post)=>{
        return <Link to={`/forum/post/${post.id}`}><PostCard editFn={null} edited={post.edited} lite={true} title={post.title} displayName={post.profile.displayName} textContent={post.textContent} createDate={post.createdAt} updateDate={post.updatedAt} userId={post.profile.id} id={post.id.toString()}/></Link>
    })

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col my-5 items-start text-justify w-[80%]">
                <div className="mb-2">
                    <Button onClick={()=>navigate(-1)} variant="ghost" size="icon" className="size-8"><MoveLeft/></Button>
                </div>
                <div className="flex">
                    <div className="mr-1">
                        <ProfilePicture id={profileData.id}/>
                    </div>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mr-3">{profileData.displayName}</h4>
                    {profileData.modProfile ? <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">Mod</Badge> : <Badge>User</Badge>}
                </div>
                
                <p className="leading-7 [&:not(:first-child)]:my-1">Joined: {profileData.joinDate}</p>
                <p className="text-muted-foreground text-sm">ID:{profileData.id}</p>
            </div>
            <Separator />
            <div className="flex flex-col items-start w-[80%]">
                <div className="flex flex-col items-start gap-3 ">
                    <Select defaultValue="posts" onValueChange={(value)=>setSelectedTab(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Display"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="posts">Posts</SelectItem>
                            <SelectItem value="responses">Responses</SelectItem>
                        </SelectContent>
                    </Select>
                    { selectedTab === "posts" ? postElements : commentElements}
                </div>
            </div>
            
        </div>
    );
}