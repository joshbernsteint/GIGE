import express from 'express';
import { getVideoLength } from './utils/videoUtils.js';
import {__dirname} from "./vars.js"
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const app = express();


await getVideoLength("C:/Users/mrcla/Downloads/aotfinale.mp4")
app.use(express.json());
const staticPath = path.resolve(__dirname, '../', 'client', 'dist');
console.log(staticPath);
app.use(express.static(staticPath));

app.get("/", async (req,res) => {
    res.sendFile(staticPath + "/index.html");
});

app.get("/video/:type", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }
    const videoPath = req.params.type === "reg" ? "C:/Users/mrcla/Videos/S4E7-Assault.mp4" : "C:/Users/mrcla/Videos/S4E7-Assault_DUB.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10**6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/x-matroska",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});


app.get('/sub', async (req,res) => {
    const path = "D:/Attack On Titan/Bluray/S4/S4E7.vtt";
    res.sendFile(path);
})

app.listen(PORT, () => {
    console.log(`Server listening at url http://localhost:${PORT}`);
})
