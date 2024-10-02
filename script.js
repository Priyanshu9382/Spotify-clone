console.log("let's write Js");
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) console.log("Invalid Input");

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if(!pause){
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function main() {
  let songs = await getSongs();

  let songsUl = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songsUl.innerHTML += `<li>
              <img class="invert" src="music.svg" alt="" />
              <div class="info">
                <div>${song
                  .replaceAll("%20", " ")
                  .replaceAll("%5B", " ")
                  .replaceAll("%5D", " ")} </div>
                <div>Song Artist</div>
              </div>
              <div class="play">
                <span>Play now</span>
                <button class="play-now-button">
                  <img  class="invert" style="width: 24px;" src="play-playbar.svg" alt="">
                </button>
              </div>
             </li>`;
  }
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  playMusic(songs[0], true);
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play-playbar.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    document.querySelector(".seekbar").style.width = (currentSong.currentTime/currentSong.duration)*100 + "%"
  });

  document.querySelector(".seekbarContainer").addEventListener("click", e =>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".seekbar").style.width = percent + "%";
    currentSong.currentTime = (currentSong.duration) * percent / 100;
  })


  let cross = document.querySelector(".cross");
  let hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-2" +"%";
    hamburger.style.visibility = "hidden";
    cross.style.visibility = "visible";
    document.querySelector(".left").style.transform.scale = "0.5" +  "%"
  })

  cross.addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-150" +"%";
    cross.style.visibility = "hidden";
    hamburger.style.visibility = "visible";
  })
}

main();
