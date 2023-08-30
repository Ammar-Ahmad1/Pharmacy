// import Post from "@models/post";
// import { connectToDB } from "@utils/database";

// export const GET = async (request, { params }) => {
//     try {
//         await connectToDB()

//         const Posts = await Post.find({ createdBy: params.id }).populate("createdBy")

//         return new Response(JSON.stringify(Posts), { status: 200 })
//     } catch (error) {
//         return new Response("Failed to fetch Posts created by user", { status: 500 })
//     }
// } 