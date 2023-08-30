import {connectToDB} from '../../../config/database.js'
import User from '../../../../models/user.js'

export const POST = async (req, res) => {

    if(req.method === 'POST') {
        try {
            await connectToDB();

            const {name, email, password, dateOfBirth,role} = await req.json();

            const newUser = User.create({
                name: name,
                email,
                password,
                dateOfBirth,
                role
            });
            if(!newUser) {
                return new Response("An error occurred while adding the user", {status: 500});
            }
            return new Response("User added successfully", {status: 201});
        } catch (error) {
            return new Response("An error occurred while adding the user", {status: 500});
        }
    } else {
        return new Response("Method not allowed", {status: 405});
    }
}
