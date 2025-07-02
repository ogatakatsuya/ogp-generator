export type Request = {
    title: string;
    tags: string[];
    theme?: Theme;
}

export type Response = {
    statusCode: number;
    message: string;
}

export type Theme = "blue" | "gray" | "beige" | "green" | "brown";
export type ImagePath = string;
