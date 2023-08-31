const dev = process.env.NODE_ENV !== "production";

export const server = dev
    ? "http://localhost:3000/index-2"
    : "https://nest-nextjs.vercel.app";
