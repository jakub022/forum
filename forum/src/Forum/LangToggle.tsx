import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLang } from "@/LangContext"
import skFlag from "@/assets/flags/sk.svg"
import enFlag from "@/assets/flags/us.svg"
import loc from "@/utils/locale"
 
export default function LangToggle() {

    const { lang, setLang } = useLang()
    
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
            {lang === "en" ? <img className="rounded w-8 h-8" src={enFlag} alt="en"/> : <img className="rounded w-8 h-8" src={skFlag} alt="sk"/>}
            <span className="sr-only">Change language</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLang("en")}>
            {loc("en", lang)}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang("sk")}>
            {loc("sk", lang)}
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
  )
}