export interface comment {
    comment: string,
    username: string
    userId: string,
    userPhoto?: string | null,
    id?: string,
    replies: reply[]
}

export interface reply {
    reply: string,
    username: string,
    userId: string,
    userPhoto?: string | null,
    id?: string,
}