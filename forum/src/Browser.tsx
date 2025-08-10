import { Link } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { type Post } from "./types/types";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./components/ui/pagination";

interface PostRequest{
    post: Post,
    comments: Comment[],
}

interface PostsPage{
    content: PostRequest[],
    totalPages: number,
    number: number
}

export default function Browser(){

    const [page, setPage] = useState(0);

    const fetchPosts = async (page: number)=>{
        const res = await fetch(`/api/posts?page=${page}&size=10`);
        if(!res.ok){
            console.error("Error fetching posts!");
        }
        return res.json();
    }

    const {isPending, isError, data, error} = useQuery<PostsPage>({
        queryKey: ['newest-posts', page],
        queryFn: ()=>fetchPosts(page),
    })

    if(isPending){
        return (<>Pending..</>);
    }
    if(isError){
        return (<>Error: {error.message}</>);
    }

    let postRows = data?.content?.map((request)=>
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
                <TableCaption>A list of recent posts
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={()=>setPage(page=>Math.max(page-1, 0))} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink>{(data?.number ?? 0)+1}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext onClick={()=>setPage(page=>Math.min(page+1,data.totalPages-1))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </TableCaption>
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