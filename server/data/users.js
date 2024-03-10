import { users } from "../config/mongoCollections";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';
import { checkObjectId, checkString } from "../utils/helpers";

const saltRounds = 5;

async function createUser(user_name, password){
    const username = checkString(user_name, "username").toLowerCase();
    if(await doesUsernameExist(username)) throw `Username '${username}' is already in use.`;

    const passwrd = checkString(password, "password");

    const newUser = {
        username: username,
        password: await bcrypt.hash(passwrd, saltRounds),
        videosInProgress: [], //Object Ids of videos in progress with timestamp
        preferences: {

        },
        favorites: [], //ObjectId of videos
    };

    const collection = await users();
    const insert_result = await collection.insertOne(newUser);
    if(!insert_result.acknowledged || !insert_result.insertedId){
        throw "User could not be created.";
    }
    const insertData = await getUserById(insert_result.insertedId.toString());
    return insertData;
}

async function getUserById(_id){
    const id = checkObjectId(_id);
    const collection = await users();

    const res = await collection.findOne({_id: new ObjectId(id)});
    if(!res) throw "User could not be found.";
    return res;
}

async function getAllUsers(){
    const usersCollection = await users();
    const allUsers = await usersCollection.find({}).toArray();
    return allUsers;
}

async function doesUsernameExist(username){
    username = checkString(username, "username");
    const allUsernames = (await getAllUsers()).map(e => e.username);

    return (allUsernames.includes(username));
}

export{
    createUser,
    getAllUsers,
    getUserById,
    doesUsernameExist,

}