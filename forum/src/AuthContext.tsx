import { createContext, useContext } from "react"

export interface AuthContextInterface{
    isAuthenticated: boolean,
    accountId: string
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx){
        return;
    }
    return ctx;
}