import ffmpeg from 'fluent-ffmpeg';
import { path } from '@ffprobe-installer/ffprobe';

ffmpeg.setFfprobePath(path);

async function getVideoData(filePath, projections=[]){
    let videoData = {};
    await new Promise((res) => {
        ffmpeg.ffprobe(filePath, function(err, metadata) {
            if(projections.length > 0){
                for (const item of projections) {
                    const splitted = item.split('.');
                    if(splitted.length === 1)
                        videoData[splitted] = metadata[splitted];
                    else{
                        let cur = videoData;
                        let curMetadata = metadata;
                        for (let i = 0; i < splitted.length-1; i++) {
                            const el = splitted[i];
                            cur[el] = {};
                            cur = cur[el]; 
                            curMetadata = curMetadata[el];           
                        }
                        cur[splitted[splitted.length - 1]] = curMetadata[splitted[splitted.length - 1]];
                    }
                }
            }
            else
                videoData = {...metadata};
            res();
          });
    });
    return videoData;
}

async function getVideoLength(filePath){
    const data = await getVideoData(filePath, ["format.duration"]);
    return data.format.duration;
}



export{
    getVideoLength
}