import { Link } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { comments, posts, userProfiles } from "./mock-data/mock-data";

export default function Browser(){

    let postRows = posts.map((post)=>{
        let displayName = "anonymous";
        for(let i of userProfiles){
            if(post.userId === i.userId){
                displayName = i.displayName;
            }
        }
        let responseCount = 0;
        for(let i of comments){
            if(post.id === i.postId){
                responseCount++;
            }
        }
        return (
        <TableRow>
            <TableCell>{post.createdAt}</TableCell>
            <TableCell>{post.updatedAt}</TableCell>
            <Link to={`./post/${post.id}`}><TableCell>{post.title}</TableCell></Link>
            <TableCell className="text-right">{responseCount}</TableCell>
            <TableCell className="text-right"><Link to={`./profile/${post.userId}`}>{displayName}</Link></TableCell>
        </TableRow>
        );
    });

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