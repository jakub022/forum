import { Link } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { type Post } from "./types/types";

interface PostRequest{
    post: Post,
    comments: Comment[],
}

export default function Browser(){

    const fetchPosts = async ()=>{
        const res = await fetch("/api/posts");
        if(!res.ok){
            console.error("Error fetching posts!");
        }
        return res.json();
    }

    const {isPending, isError, data, error} = useQuery<PostRequest[]>({
        queryKey: ['newest-posts'],
        queryFn: fetchPosts,
    })

    if(isPending){
        return (<>Pending..</>);
    }
    if(isError){
        return (<>Error: {error.message}</>);
    }

    let postRows = data.map((request)=>
        <TableRow>
            <TableCell>{request.post.createdAt}</TableCell>
            <TableCell>{request.post.updatedAt}</TableCell>
            <Link to={`./post/${request.post.id}`}><TableCell>{request.post.title}</TableCell></Link>
            <TableCell className="text-right">{request.comments.length}</TableCell>
            <TableCell className="text-right"><Link to={`./profile/${request.post.profile.id}`}>{request.post.profile.displayName}</Link></TableCell>
        </TableRow>
    );

    return (
        <div>
            <Table>
                <TableCaption>A list of recent posts</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Created at</TableHead>
                        <TableHead className="w-[100px]">Last update</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Number of Responses</TableHead>
                        <TableHead className="text-right">Posted by</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {postRows}
                </TableBody>
            </Table>
        </div>
    );
}