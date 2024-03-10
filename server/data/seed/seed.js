import { dbConnection, closeConnection } from "../../config/mongoConnection.js";
import { createCollection, getAllCollections, addVideoToGroup } from "../collections.js";
import { addVideo } from "../videos.js";

const db = await dbConnection();
await db.dropDatabase();

const c1 = await createCollection("Attack on Titan", "An apocalytptic thriller", false, ["Season 1", "Season 2", "Season 3", "Season 4 Part 1", "Season 4 Part 2", "The Final Chapters"]);
const v1 = await addVideo("aot finale!", "The final epsidoes of attack on titan","C:/Users/mrcla/Downloads/iconwhite.png", "C:/Users/mrcla/Downloads/aotfinale.mp4", ['en','ja'], ['en'], c1._id)
console.log(v1);
const g1 = await addVideoToGroup(v1._id, c1._id, c1.groups[0]._id.toString());
console.log(await getAllCollections());


closeConnection();