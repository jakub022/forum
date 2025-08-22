import { Link } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { type Category, type Post } from "./types/types";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Label } from "./components/ui/label";

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
    const [category, setCategory] = useState<Category>("ALL");

    const fetchPosts = async (page: number, category: Category)=>{
        if(category == "ALL"){
            const res = await fetch(`/api/posts?page=${page}&size=10`);
            if(!res.ok){
                console.error("Error fetching posts!");
            }
            return res.json();
        }
        else{
            const res = await fetch(`/api/posts?page=${page}&size=10&category=${category}`);
            if(!res.ok){
                console.error("Error fetching posts!");
            }
            return res.json();
        }
    }

    const {isPending, isError, data, error} = useQuery<PostsPage>({
        queryKey: ['newest-posts', page, category],
        queryFn: ()=>fetchPosts(page, category),
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
            <div className="ml-2 mb-2 flex flex-row">
                <Label htmlFor="categorySelector" className="mr-2 text-muted-foreground">Browsing Category</Label>
                <Select  defaultValue="" onValueChange={(value)=>setCategory(value as Category)}>
                    <SelectTrigger className="w-[180px]" id="categorySelector">
                        <SelectValue placeholder="Select a category"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="FRONTEND">Frontend</SelectItem>
                        <SelectItem value="BACKEND">Backend</SelectItem>
                        <SelectItem value="DEVOPS">DevOps</SelectItem>
                    </SelectContent>
                </Select>
            </div>
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