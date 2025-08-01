import { MoveLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Link, useNavigate } from "react-router";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "./utils/firebase";
import type { Post } from "./types/types";

const formSchema = z.object({
        title: z.string().min(10, {message: "Title must be at least 10 charactes long."}).max(50, {message: "Title musn't be longer than 50 charactes."}),
        textContent: z.string().min(10, {message: "Post must contain at least 10 charactes."}).max(500, {message: "Post musn't be longer than 500 characters."})
});

export default function Editor(){

    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            textContent: "",
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>){
        if(!auth || !user){
            alert("Authcontext error");
        }
        const {title, textContent} = values;
        try{
            const token = await user?.getIdToken();
            const res = await fetch(`http://localhost:8080/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    textContent: textContent
                })
            });
            if(!res.ok){
                alert("Post submit failed on the backend.");
            }
            const postData : Post = await res.json();
            navigate(`/forum/post/${postData.id}`);
        } catch(err){
            alert("Post submit failed: " + (err as Error).message);
        }
    }

    return user ? 
        <div className="flex flex-col items-center">
            <div className="flex flex-col my-5 text-justify w-[80%]">
                <Link to="/forum/"><Button variant="ghost" size="icon" className="size-8"><MoveLeft/></Button></Link>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Create a new discussion</h4>
                <Form {...form}>
                    <form className="flex flex-col my-5 text-justify gap-3" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="title" render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Title" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="textContent" render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Discussion text" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <Button className="self-start" type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
        :
        <div className="flex flex-col w-[50%]">Create an account or login to post!</div>
    ;
}