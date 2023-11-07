import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// import User from "../../../models/user";
import User from "@models/user";
import { connectToDB } from "@config/database.js";
// import { connectToDB } from "../../../config/database";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      authorize: async (credentials) => {
        try {
          await connectToDB();
          console.log(credentials);
          const user = await User.findOne({
            phone: credentials.phone,
            password: credentials.password,
          });
          console.log(user)
          if (user) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              image: user.image,
              role: user.role,
            };
          } else {
            throw new Error("Invalid email/password combination");
          }
        } catch (error) {
          console.log("Error logging in user: ", error.message);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try{
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.role = sessionUser.role;
        } else {
          // Handle the case where the user is not found in the database
          // You can choose to log the error, redirect the user, or take appropriate action
        }
        return session;
      }catch (error) {
        // Handle any errors that occur during the session modification
        console.error("Error modifying session: ", error);
        return session; // You can return the session with no changes or take other actions based on the error
      }
      // store the user id from MongoDB to session
     
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        
        await connectToDB();

        if (account.provider === "google") {
          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.picture,
            });
          }
        } else if (account.provider === "credentials") {
          // Handle credentials logic if needed, otherwise leave it as it's already handled in the provider
        }

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export default handler;