import { useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { MoveLeft } from "lucide-react";
import {useQuery, useQueryClient} from "@tanstack/react-query"
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { Profile } from "./types/types";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./utils/firebase";
import { formatDate } from "./utils/date";
import { useLang } from "./LangContext";
import loc from "./utils/locale";

const loginFormSchema = z.object({
    email: z.email(),
    password: z.string()
});

const signUpFormSchema = z.object({
    email: z.email(),
    username: z.string().min(6).max(20),
    password: z.string().min(6)
});

export default function Account(){

    const queryClient = useQueryClient();

    const { lang } = useLang();

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        }
    })

    async function guestLogin(){
        if(!auth){
            alert("Authcontext error");
            return;
        }
        try{
            await signInWithEmailAndPassword(auth, "guest@test.com", "guest123");
        }catch(err){
            alert("Login failed: " + (err as Error).message)
        }
    }

    async function onLoginSubmit(values: z.infer<typeof loginFormSchema>){
        if(!auth){
            alert("Authcontext error");
            return;
        }
        const {email, password} = values;
        try{
            await signInWithEmailAndPassword(auth, email, password);
        }catch(err){
            alert("Login failed: " + (err as Error).message)
        }
    }

    async function onSignUpSubmit(values: z.infer<typeof signUpFormSchema>){
        if(!auth){
            alert("Authcontext error");
            return;
        }
        const {email, username, password} = values;
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const token = await userCredential.user.getIdToken();

            const res = await fetch("/api/profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    displayName: username
                })
            });
            if(!res.ok){
                alert("Sign up failed on the backend.");
            }

            await queryClient.invalidateQueries({queryKey: ['account']});
            
        }catch(err){
            alert("Sign up failed: " + (err as Error).message);
        }
    }

    let navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    const fetchAccount = async ()=>{
        const token = await user?.getIdToken();
        const res = await fetch("/api/profiles/me",{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if(!res.ok){
            console.error("Error fetching account!");
        }
        return res.json();
    }

    const {isPending, isError, data, error } = useQuery<Profile>({
        queryKey: ['account'],
        queryFn: fetchAccount,
        enabled: !!user
    });

    const [wantLogin, setWantLogin] = useState(true);

    if(!user){
        return (
            <div className="flex flex-col items-center">
            <Button onClick={()=>navigate(-1)} variant="ghost" size="icon" className="size-8 mt-5"><MoveLeft/></Button>
            <Card className="w-full max-w-sm mt-3">
                <CardHeader>
                    <CardTitle>{wantLogin? loc("logintext", lang) : loc("signuptext", lang)}</CardTitle>
                    <CardAction>
                        <Button onClick={()=>setWantLogin((prevWantlogin)=>!prevWantlogin)} variant="link">{wantLogin ? loc("signup", lang) : loc("login", lang)}</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    { wantLogin ?
                    <Form key="login" {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                        <div className="flex flex-col gap-6">  
                            <FormField control={loginForm.control} name="email" render={({field})=>(
                                <FormItem>
                                        <FormControl>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" {...field}/>
                                            </div>
                                        </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={loginForm.control} name="password" render={({field})=>(
                                <FormItem>
                                        <FormControl>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">{loc("password", lang)}</Label>
                                                </div>
                                                <Input id="password" type="password" {...field} />
                                            </div>
                                        </FormControl>
                                </FormItem>
                            )}/>
                        </div>
                        <Button type="submit" className="w-full mt-5">{loc("login", lang)}</Button>
                        </form>
                        <Button onClick={guestLogin} variant="secondary" className="w-full mt-5">{loc("guest", lang)}</Button>
                    </Form>
                    :
                    <Form key="signup" {...signUpForm}>
                        <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
                        <div className="flex flex-col gap-6">  
                            <FormField control={signUpForm.control} name="email" render={({field})=>(
                                <FormItem>
                                        <FormControl>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" {...field}/>
                                            </div>
                                        </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={signUpForm.control} name="username" render={({field})=>(
                                <FormItem>
                                        <FormControl>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="username">{loc("username", lang)}</Label>
                                                </div>
                                                <Input id="username" {...field} />
                                            </div>
                                        </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={signUpForm.control} name="password" render={({field})=>(
                                <FormItem>
                                        <FormControl>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">{loc("password", lang)}</Label>
                                                </div>
                                                <Input id="password" type="password" {...field} />
                                            </div>
                                        </FormControl>
                                </FormItem>
                            )}/>
                            
                        </div>
                        <Button type="submit" className="w-full mt-5">{loc("signup", lang)}</Button>
                        </form>
                    </Form>
                    }
                </CardContent>
            </Card>
            </div>
        );
    }

    if(isPending){
        return (<>Pending..</>);
    }
    if(isError){
        return (<>Error: {error.message}</>);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col my-5 items-start text-justify w-[80%] gap-3">
                <Button onClick={()=>navigate(-1)} variant="ghost" size="icon" className="size-8"><MoveLeft/></Button>
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{loc("manage", lang)}</h1>
                <div className="flex flex-col">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">ID: {data.id}</h4>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">{loc("type", lang)}: {data.modProfile ? "Mod" : "User"}</h4>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">{loc("displayname", lang)}: {data.displayName}</h4>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">{loc("joindate", lang)}: {formatDate(data.joinDate)}</h4>
                </div>
                <div className="flex flex-row gap-2">
                    <Button variant="secondary" onClick={()=>navigate(`/forum/profile/${data.id}`)}>{loc("viewprofile", lang)}</Button>
                    <Button variant="outline" onClick={()=>auth.signOut()}>{loc("signout", lang)}</Button>
                </div>
            </div>
        </div>
    );
}