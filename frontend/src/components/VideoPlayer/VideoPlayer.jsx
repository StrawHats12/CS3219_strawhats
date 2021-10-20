import React from "react";
import ReactPlayer from "react-player/lazy"

const dashConfig = {
    file: {
        forceDASH: true
    }
}

const VideoPlayer = () => {
    let ref = React.createRef();
    const [VidQuality, setVidQuality] = React.useState(null);
    const getDashData = dash => {
        console.log(dash);
        setVidQuality(dash);
    };

    const updateQuality = e => {
        VidQuality?.getBitrateInfoListFor('video')?.forEach(quality => {
            if (quality.height === +e.target.innerHTML) {
                console.log(quality.height, quality.qualityIndex, +e.target.innerHTML);
                ref.current.player.getInternalPlayer('dash').updateSettings({
                    streaming: {abr: {autoSwitchBitrate: {video: false}}}
                });
                ref.current.player
                    .getInternalPlayer('dash')
                    .setQualityFor('video', quality.qualityIndex);
            }
        });
    };

    let stream_url = "http://ec2-18-138-252-92.ap-southeast-1.compute.amazonaws.com/dash/obs-stream.mpd"


    let urls = ["https://www.youtube.com/watch?v=ysz5S6PUM-U", "https://www.youtube.com/watch?v=qnC8fYwem2o&t=319s"]

    return <div>
        <p> I is video player</p>
        {/*{urls.map((myUrl, idx) => {*/}
        {/*    console.log("url idx" + idx + " is " + myUrl );*/}
        {/*    <ReactPlayer*/}
        {/*        url={myUrl}*/}
        {/*    />*/}
        {/*})}*/}
        {/*<ReactPlayer*/}
        {/*    playing={true}*/}
        {/*    url={urls[0]}*/}
        {/*/>*/}
        <ReactPlayer
            playing={true}
            ref={ref}
            controls
            width={"100%"}
            height={"100%"}
            onReady={() => {
                getDashData(ref?.current?.player?.player?.dash);
            }
            }
            url={stream_url}
        />

        <div>
            <h2>video qualities</h2>
            {VidQuality?.getBitrateInfoListFor('video')?.map(qualities => (
                <button className="primary radius" onClick={updateQuality}>
                    {qualities.height}
                </button>
            ))}
        </div>


    </div>
}

export default VideoPlayer;