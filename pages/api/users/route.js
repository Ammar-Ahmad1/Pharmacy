// import {connectToDB} from '../../../config/database.js'
import {connectToDB} from '@config/database.js'
// import User from '../../../../models/user.js'
import User from '@models/user.js'

export const POST = async (req, res) => {
    const {email,password} = await req.json();
    if(req.method === 'POST') {
        try {
            await connectToDB();

            const user = await User.findOne({email});
            if(!user) {
                return new Response("User not found", {status: 404});
            }
            if(user.password !== password) {
                return new Response("Incorrect password", {status: 401});
            }
            return new Response("User logged in successfully", {status: 200});
        } catch (error) {
            return new Response("An error occurred while logging in the user", {status: 500});
        }
    } else {
        return new Response("Method not allowed", {status: 405});
    }
}

