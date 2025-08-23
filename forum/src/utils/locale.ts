import en from "@/locales/en.json"
import sk from "@/locales/sk.json"

const languages: Record<string, Record<string, string>> = {en, sk}

export default function loc(key : string, lang : string): string{
    return languages[lang]?.[key] ?? key;
}