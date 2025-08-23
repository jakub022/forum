export function formatDate(string : string) : string{
    const date = new Date(string);
    return date.toLocaleString();
}