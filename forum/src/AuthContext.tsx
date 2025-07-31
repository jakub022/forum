import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react"
import { auth } from "./utils/firebase";

interface AuthContextType {
    user: User | null,
    auth: Auth | null
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
        });

        return ()=>unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user, auth}}>
            {children}
        </AuthContext.Provider>
    );
}