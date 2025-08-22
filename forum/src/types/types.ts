export type Profile = {
    id: string,
    displayName: string,
    modProfile: boolean,
    joinDate: string
}

export type Post = {
    id: number,
    title: string,
    textContent: string,
    createdAt: string,
    updatedAt: string,
    profile: Profile,
    edited: boolean,
    category: Category
}

export type Comment = {
    id: number,
    textContent: string,
    createdAt: string,
    profile: Profile,
    postId: number,
    parent: ParentComment | null,
    edited: boolean
}

export type ParentComment = {
    id: number,
    textContent: string,
    profile: Profile
}

export type Category = "FRONTEND" | "GENERAL" | "BACKEND" | "DEVOPS" | "ALL";