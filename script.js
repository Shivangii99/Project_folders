console.log("let's get started !!");

let currentSong = new Audio();
let currFolder;
let songUL;
let songs;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    // Add leading zero if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for(const song of songs)
    {
        songUL.innerHTML = songUL.innerHTML + `
                        <li>
                            <img src="music.svg" alt="music icon">
                            <div class="songInfo">
                                <p>${song.replaceAll("%20", " ")}</p>
                                <p>artist name</p>
                            </div>
                            <img src="play.svg">
                        </li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", async element=>{
            console.log(e.querySelector(".songInfo").firstElementChild.innerHTML);
            await playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML)
        })
        
    })

    // console.log(songs);
    // return songs;
}

const playMusic = (track)=>
{
    // let audio = new Audio("/songs/"+track);
    currentSong.src = `/${currFolder}/`+track;
    // console.log(/songs/+track);
    currentSong.play();
    play.src = "pause.svg";
    document.querySelector(".song-name").innerHTML= `${track}`;
}


async function main() {
    await getSongs("songs/ClassicEvergreen");
    // playMusic(songs[0]);
    // console.log(songs);

    
    // var myAudio = new Audio(songs[0]);
    // myAudio.play();

    // myAudio.addEventListener("loadeddata", () => {
    //     const dur = myAudio.duration;
    //     console.log(dur);
    // });

    

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log(item.currentTarget);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

    // Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
    //     e.addEventListener("click", element=>{
    //         console.log(e.querySelector(".songInfo").firstElementChild.innerHTML);
    //         playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML)
    //     })
        
    // })

    play.addEventListener("click", ()=>
    {
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    prev.addEventListener("click", ()=>{
        currentSong.pause();
        console.log("Previous clicked")
        // console.log(currentSong.src)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(currentSong.src.split("/").slice(-1));
        if(index - 1 >= 0){
            playMusic(songs[index-1]);
        }
    })

    next.addEventListener("click", ()=>{
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index+1 == songs.length)
        {
            playMusic(songs[0]);

        }
        if(index+1 < songs.length)
        {
            playMusic(songs[index+1]);
        }
    })

    document.querySelector(".scroll-bar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent  + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    currentSong.addEventListener("timeupdate", ()=>
    {
        document.querySelector(".song-time").innerHTML= `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left= (currentSong.currentTime)/(currentSong.duration)*100 + "%";
    })

    document.querySelector(".ham").addEventListener("click", ()=>
    {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", ()=>
    {
        document.querySelector(".left").style.left= "-360px";
    })



}


main();
