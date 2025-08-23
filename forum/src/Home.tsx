import { Link } from "react-router";
import { Button } from "./components/ui/button";
import { useLang } from "./LangContext";
import loc from "./utils/locale";

export default function Home(){

    const { lang } = useLang();

    return (
        <div className="text-center flex flex-col items-center">
            <h1 className="my-10 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">{loc("welcome", lang)}</h1>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {loc("discuss", lang)}
            </h4>
            <div className="flex flex-wrap items-center gap-2 md:flex-row my-15">
                <Link to="/forum"><Button>{loc("browse", lang)}</Button></Link>
                <Link to="/account"><Button variant="outline">{loc("account", lang)}</Button></Link>
            </div>
        </div>
    );
}