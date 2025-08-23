import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "en" | "sk";

type LangContextType = {
    lang: Lang,
    setLang: (lang: Lang) => void
}

const langContext = createContext<LangContextType | undefined>(undefined);

export function LangContext({children} : {children: ReactNode}){
    const [lang, setLang] = useState<Lang>("en");

    return (
        <langContext.Provider value={{lang, setLang}}>
            {children}
        </langContext.Provider>
    );
}

export function useLang(){
    const context = useContext(langContext);
    if(context === undefined){
        throw new Error("useLang must be used within a LangContext provider");
    }
    return context;
}