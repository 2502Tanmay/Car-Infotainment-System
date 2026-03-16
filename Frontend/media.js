// Load YouTube IFrame API dynamically
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

// This function is called automatically by YouTube API
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "450",
        width: "800",
        videoId: "VIDEO_ID_HERE", // 👈 Replace with your YouTube video ID
        playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log("YouTube Player Ready");
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log("Video is playing");
    }
}
