export interface Trip {
    destination: string,
    "fishing-spots": string,
    catches: string,
    "lures-used": string,
    "fishing-shops": string,
    description: string,
    imageUrl: string[] | undefined,
    userID: string | undefined,
    id: string | undefined,
    likes: string[],
}