export interface comment {
    username: string
    comment: string,
    userId: string,
    id?: string 
    replies: reply[]
}

interface reply {
    username: string,
    reply: string,
    userID: string,
}