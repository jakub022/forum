import { MoveLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Link } from "react-router";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";

const formSchema = z.object({
        title: z.string().min(10, {message: "Title must be at least 10 charactes long."}).max(50, {message: "Title musn't be longer than 50 charactes."}),
        textContent: z.string().min(10, {message: "Post must contain at least 10 charactes."}).max(500, {message: "Post musn't be longer than 500 characters."})
});

export default function Editor(){

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            textContent: "",
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>){
        console.log(values);
    }

    return (
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
    );
}