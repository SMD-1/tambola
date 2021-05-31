'use strict'
import { gamesStatus } from './api.config.js'

const DaysEl = document.getElementById("days");
const HoursEl = document.getElementById("hours");
const MinutesEl = document.getElementById("minutes");
const SecondsEl = document.getElementById("seconds");
const gameDateEl = document.getElementById("game-date");
const gameTimeEl = document.getElementById("game-time");

var gameTime = ''
axios.get(gamesStatus)
    .then(res => {
        gameTime = Date.parse(res.data.start_time)
        setDateAndTime(gameTime)

        countDown()
    })

function setDateAndTime(time) {
    if (gameDateEl)
        gameDateEl.innerHTML = `${new Date(time).getDate()}/${new Date(time).getMonth() + 1}/${new Date(time).getFullYear()}`

    let hoursRemaining = new Date(time).getHours()
    let minsRemaining = new Date(time).getMinutes()
    if (gameTimeEl) {
        if (hoursRemaining <= 12)
            gameTimeEl.innerHTML = `${format(hoursRemaining)}:${format(minsRemaining)} AM`
        else
            gameTimeEl.innerHTML = `${format(hoursRemaining - 12)}:${format(minsRemaining)} PM`
    }
}
function countDown() {
    const currentDate = new Date();
    const totalSeconds = Math.floor((gameTime - currentDate) / 1000);
    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = Math.floor(totalSeconds % 60);

    //return if time out
    if(totalSeconds<0) return

    DaysEl.innerHTML = format(days);
    HoursEl.innerHTML = format(hours);
    MinutesEl.innerHTML = format(minutes);
    SecondsEl.innerHTML = format(seconds);
}

function format(time) {
    if (time >= 0) {
        return time < 10 ? `0${time}` : time;
    }
}
setInterval(countDown, 1000);
