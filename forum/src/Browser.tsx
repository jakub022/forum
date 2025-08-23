import { Link } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { type Category, type Post } from "./types/types";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Label } from "./components/ui/label";
import { formatDate } from "./utils/date";
import { useLang } from "./LangContext";
import loc from "./utils/locale";
import ProfilePicture from "./Profile/ProfilePicture";
import { Badge } from "./components/ui/badge";

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

    const { lang } = useLang();

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
            <TableCell>{formatDate(request.post.createdAt)}</TableCell>
            <TableCell>{formatDate(request.post.updatedAt)}</TableCell>
            <TableCell>
                <div className="flex flex-row items-center gap-1">
                    <Badge variant="secondary">{request.post.category}</Badge>
                    <Link to={`./post/${request.post.id}`}>{request.post.title}</Link>
                </div>
            </TableCell>
            <TableCell className="text-right">{request.comments.length}</TableCell>
            <TableCell className="text-right">
                <div className="flex flex-row justify-end gap-1 items-center">
                    {request.post.profile.modProfile ? <Link className="text-blue-500 dark:text-blue-600" to={`./profile/${request.post.profile.id}`}>{request.post.profile.displayName}</Link> : <Link to={`./profile/${request.post.profile.id}`}>{request.post.profile.displayName}</Link>}
                    <ProfilePicture id={request.post.profile.id}/>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div>
            <div className="ml-2 mb-2 flex flex-row">
                <Label htmlFor="categorySelector" className="mr-2 text-muted-foreground">{loc("category", lang)}</Label>
                <Select  defaultValue="" onValueChange={(value)=>setCategory(value as Category)}>
                    <SelectTrigger className="w-[180px]" id="categorySelector">
                        <SelectValue placeholder={loc("selectcategory", lang)}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">{loc("all", lang)}</SelectItem>
                        <SelectItem value="GENERAL">{loc("general", lang)}</SelectItem>
                        <SelectItem value="FRONTEND">Frontend</SelectItem>
                        <SelectItem value="BACKEND">Backend</SelectItem>
                        <SelectItem value="DEVOPS">DevOps</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableCaption>{loc("list", lang)}
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={()=>setPage(page=>Math.max(page-1, 0))} />
                            </PaginationItem>
                            {data?.number !== 0 && <PaginationItem>
                                <PaginationLink onClick={()=>setPage(0)}>1</PaginationLink>
                            </PaginationItem>}
                            <PaginationItem>
                                <PaginationLink>{(data?.number ?? 0)+1}</PaginationLink>
                            </PaginationItem>
                            {data?.totalPages > 1 && data.number !== data.totalPages - 1 && (
                                <>
                                    {data?.totalPages > 2 &&
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    }
                                    <PaginationItem>
                                        <PaginationLink onClick={()=>setPage(data.totalPages - 1)}>{data.totalPages}</PaginationLink>
                                    </PaginationItem>
                                </>
                            )}
                            <PaginationItem>
                                <PaginationNext onClick={()=>setPage(page=>Math.min(page+1,data.totalPages-1))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">{loc("created", lang)}</TableHead>
                        <TableHead className="w-[100px]">{loc("lastupdate", lang)}</TableHead>
                        <TableHead>{loc("title", lang)}</TableHead>
                        <TableHead className="text-right">{loc("responses", lang)}</TableHead>
                        <TableHead className="text-right">{loc("postedby", lang)}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {postRows}
                </TableBody>
            </Table>
        </div>
    );
}