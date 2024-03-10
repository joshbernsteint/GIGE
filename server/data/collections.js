import { checkObjectId, checkPath, checkString } from '../utils/helpers.js';
import { collections } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';


async function addGroup(collectionId, groupName){
    const id = checkObjectId(collectionId, "collectionId");
    const name = checkString(groupName, "groupName");
    const desc = checkString(description, "description");

    const newGroup = {
        _id: new ObjectId(),
        name: name,
        videos: []
    };

    const collection = await collections();
    const update_result = await collection.findOneAndUpdate({_id: new ObjectId(id)}, {$push: {
        groups: newGroup, groupNames: name
    }}, {returnDocument: "after"});
    if(!update_result) throw "Adding group failed";
    return update_result;
}

async function addVideoToGroup(videoId, collectionId, groupId){
    const video_id = checkObjectId(videoId, "videoId");
    const collection_id = checkObjectId(collectionId, "collectionId");
    const group_id = checkObjectId(groupId, "groupId");
    const collection = await collections();

    const currentCollection = await getCollectionById(collection_id);
    for (let i = 0; i < currentCollection.groups.length; i++) {
        const element = currentCollection.groups[i];
        if(element._id.toString() === group_id){
            element.videos.push(video_id);
        }
    }

    const updateResult = await collection.findOneAndUpdate({_id: new ObjectId(collection_id)}, {$set: {
        "groups": currentCollection.groups,
    }}, {returnDocument: "after"});

    if(!updateResult) throw "Video could not be added to group";
    return updateResult;
}

async function createCollection(collectionName, description, posterImage, groupList=[]){
    const name = checkString(collectionName, "collectionName");
    const desc = checkString(description, "description");
    const imagePath = posterImage ? checkPath(posterImage, "posterImage") : "";
    const presetGroups = groupList.length !== 0 ? groupList.map(g => ({
        _id: new ObjectId(),
        name: g,
        videos: []
    })) : [];
    const newCollection = {
        name: name,
        description: desc,
        posterImage: imagePath,
        groupNames: [],
        groups: presetGroups,
    }

    const collection = await collections();
    const insert_result = await collection.insertOne(newCollection);
    if(!insert_result.acknowledged || !insert_result.insertedId){
        throw "Collection could not be added";
    }
    const insertData = await getCollectionById(insert_result.insertedId.toString());
    return insertData;
}

async function getCollectionById(collectionId){
    const id = checkObjectId(collectionId, "collectionId");
    const collection = await collections();
    const res = await collection.findOne({_id: new ObjectId(id)});
    if(!res) throw "Collection could not be found";

    res._id = res._id.toString();
    return res;
}

async function getAllCollections(){
    const collection = await collections();
    const allCollections = await collection.find({}).toArray();
    return allCollections.map(e => {
        e._id = e._id.toString();
        return e;
    });
}


export{
    createCollection,
    getCollectionById,
    getAllCollections,
    addGroup,
    addVideoToGroup,
}