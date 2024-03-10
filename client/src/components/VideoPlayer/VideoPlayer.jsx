import React from 'react';
class VideoPlayer extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    /**
     * 
     *         <video id="videoPlayer" width="50%" controls>
            <source src="/video/reg" type="video/mp4" />
            <track src="/sub" kind="subtitles" label="On" default/>
        </video><br>
        <button id="mute-button">Mute Video</button>
        <input type="range" id="volume" name="volume" min="0" max="100"/>
        <button id="switch_button">Switch Language</button>

        <script>
            let currentLanguage = "/video";
            const mB = document.getElementById("mute-button");
            const videoD = document.getElementById("videoPlayer");
            const vo = document.getElementById('volume');
            const sb = document.getElementById('switch_button');

            sb.addEventListener('click', () => {
                videoD.pause();
                currentLanguage = currentLanguage === "/video/reg" ? "/video/dub" : "/video/reg";
                console.log("New language is: ", currentLanguage);
                videoD.firstElementChild.setAttribute('src', currentLanguage);
                videoD.load();
                videoD.currentTime = Number(localStorage.getItem('videoP'));
                videoD.play();
            });

            videoD.currentTime = Number(localStorage.getItem('videoP'));
            videoD.addEventListener('timeupdate', () => {
                localStorage.setItem('videoP', String(videoD.currentTime));
            });

            mB.addEventListener('click', () => {
                videoD.muted = !videoD.muted;
                videoD.play();
            })

            vo.addEventListener('input', e => {
                videoD.volume = e.target.value/100;
            });
            console.log(videoD);
        </script>
     * 
     */

    render(){
        return (
            <div>
            <video id="videoPlayer" width="50%" controls>
                <source src="http://localhost:3000/video/reg" type="video/mp4" />
                <track src="http://localhost:3000/sub" kind="subtitles" label="On" default/>
            </video><br/>
            </div>
        );
    }
}

export default VideoPlayer;