export type Request = {
    title: string;
    tags: string[];
    theme?: Theme;
}

export type Response = {
    statusCode: number;
    message: string;
}

export type Theme = "tech" | "idea" | "diary" | "info" | "default";
export type ImagePath = string;
