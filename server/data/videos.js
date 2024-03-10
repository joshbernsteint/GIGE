import { checkObjectId, checkPath, checkString, checkStringArray } from '../utils/helpers.js';
import { videos } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { getVideoLength } from '../utils/videoUtils.js';
import ISO6391 from 'iso-639-1';


async function addVideo(videoName, description, thumbnail, video, languages=["en"], subtitles=["en"], collectionId){
    const name = checkString(videoName, "videoName");
    const desc = checkString(description, "description");
    const videoPath = checkPath(video, "video",["mkv","mp4"]);
    const id = collectionId ? checkObjectId(collectionId, "collectionId") : false;
    const imagePath = checkPath(thumbnail, "thumbnail");

    const videoLangs = checkStringArray(languages, "languages",[(s) => {
        return ISO6391.getName(s).length !== 0;
    },"not a valid language. Please make sure they are in ISO-639-1 format"]);

    const subtitleLangs = checkStringArray(subtitles, "subtitles",[(s) => {
        return ISO6391.getName(s).length !== 0;
    },"not a valid language. Please make sure they are in ISO-639-1 format"]);


    const newVideo = {
        name: name,
        description: desc,
        filePath: videoPath,
        thumbnail: imagePath,
        length: await getVideoLength(videoPath),
        languages: videoLangs,
        subtitles: subtitleLangs,
        videoCollections: id ? [id] : [],
    };

    const collection = await videos();
    const insert_result = await collection.insertOne(newVideo);
    if(!insert_result.acknowledged || !insert_result.insertedId){
        throw "Video could not be added";
    }
    const insertData = await getVideo(insert_result.insertedId.toString());
    return insertData;
}

async function getVideo(_id){
    const id = checkObjectId(_id);
    const collection = await videos();
    const res = await collection.findOne({_id: new ObjectId(id)});
    if(!res) throw "Video could not be found";
    res._id = res._id.toString();
    return res;
}



export{
    addVideo,
    getVideo,
}