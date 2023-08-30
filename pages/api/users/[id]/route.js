import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const user = await User.find({ _id: params.id })

        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch Posts created by user", { status: 500 })
    }
} 

export const PATCH = async (request, { params }) => {
    console.log("patchh")
    const { name , email, dateOfBirth,image } = await request.json();

    // console.log(username , email, dateOfBirth, interestedCountries, currentCountry,image)
  
    try {   
    //   await connectToDB();
  
    //   // Find the existing Post by ID
    //   const existingUser = await User.findById(params.id);
  
    //   if (!existingUser) {
    //     return new Response("User not found", { status: 404 });
    //   }
      

        existingUser.name = name;
        existingUser.email = email;
        existingUser.dateOfBirth = dateOfBirth;
        existingUser.image = image;
        await existingUser.save();

      // Update the Post with new data
        // existingPost.title = title;
        // existingPost.description = description;
        // existingPost.tags = tags;
        // existingPost.country = country;
        // await existingPost.save();
   
  
      return new Response("Successfully updated the User", { status: 200 });
    } catch (error) {
      return new Response("Error Updating User", { status: 500 });
    }
  };