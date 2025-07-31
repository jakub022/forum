export type Profile = {
    displayName: string,
    modProfile: boolean,
    joinDate: string
}

export type Post = {
    id: string,
    title: string,
    textContent: string,
    createdAt: string,
    updatedAt: string
}

export type Comment = {
    id: string,
    textContent: string,
    createdAt: string
}