import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react"
import { auth } from "./utils/firebase";

interface AuthContextType {
    user: User | null,
    auth: Auth | null,
    isMod: boolean,
    id: string
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [isMod, setIsMod] = useState(false);
    const [id, setId] = useState("");

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (currentUser)=>{
            setUser(currentUser);
            const token = await currentUser?.getIdToken();
            if(currentUser){
                const res = await fetch("/api/profiles/me",{
                headers: {
                    "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setIsMod(data.modProfile == true);
                setId(data.id);
            }
            else{
                setIsMod(false);
            }
        });
        return ()=>unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user, auth, isMod, id}}>
            {children}
        </AuthContext.Provider>
    );
}