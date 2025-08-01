import { Link, useParams } from "react-router";
import PostCard from "./Post/PostCard";
import CommentCard from "./Post/CommentCard";
import { MoveLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Comment, Post } from "./types/types";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "./utils/firebase";

const formSchema = z.object({
    textContent: z.string().min(10, {message: "Comment must be at least 10 characters long."}).max(500, {message: "Commment musn't be longer than 500 characters."}),
});

interface PostRequest{
    post: Post,
    comments: Comment[],
}

export default function Post(){

    const queryClient = useQueryClient();

    let {postId} = useParams();

    const fetchPost = async ()=>{
        const res = await fetch(`http://localhost:8080/posts/${postId}`);
        if(!res.ok){
            console.error("Error fetching post!");
        }
        return res.json();
    }

    const {isPending, isError, data, error} = useQuery<PostRequest>({
        queryKey: ['post'],
        queryFn: fetchPost,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textContent: "",
        }
    });

    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    async function onSubmit(values: z.infer<typeof formSchema>){
        if(!auth || !user || !data || !data.post.id){
            alert("Authcontext error");
            return;
        }
        const {textContent} = values;
        try{
            const token = await user.getIdToken();
            const res = await fetch(`http://localhost:8080/posts/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    textContent: textContent
                })
            });
            if(!res.ok){
                alert("Comment submit failed on the backend.");
            }
            await queryClient.invalidateQueries({queryKey: ['post']});

        }catch(err){
            alert("Comment submit failed: " + (err as Error).message);
        }
    }

    if(isPending){
        return (<>Pending..</>);
    }
    if(isError){
        return (<>Error: {error.message}</>);
    }

    const commentElements = data.comments.map((comm)=>{
        return <CommentCard userId={comm.profile.id} id={comm.id.toString()} textContent={comm.textContent} createDate={comm.createdAt} displayName={comm.profile.displayName}/>
    });

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col m-5 gap-3 w-[80%]">
                <div className="self-start">
                    <Link to="../.."><Button variant="ghost" size="icon" className="size-8"><MoveLeft/></Button></Link>
                </div>
                <PostCard id={data.post.id.toString()} title={data.post.title} displayName={data.post.profile.displayName} textContent={data.post.textContent} createDate={data.post.createdAt} updateDate={data.post.updatedAt} userId={data.post.profile.id}/>
                { user ? 
                <div className="flex flex-col w-[50%]">
                    <Form {...form}>
                        <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="textContent" render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Textarea placeholder="Join the discussion!" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <Button className="self-start" type="submit" variant="secondary">Submit</Button>
                        </form>
                    </Form>
                </div>
                :
                <div className="flex flex-col w-[50%]">Create an account or login to comment!</div>
                }
                <Separator />
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{data.comments.length == 1 ? "1 Response" : `${data.comments.length} Responses`}</h4>
                {commentElements}
            </div>
        </div>
    );
}