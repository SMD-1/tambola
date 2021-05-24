//const { gamesStatus } = require('./api.config.js')
import { gamesStatus } from './api.config.js'

const DaysEl = document.getElementById("days");
const HoursEl = document.getElementById("hours");
const MinutesEl = document.getElementById("minutes");
const SecondsEl = document.getElementById("seconds");


var gameTime = ''
axios.get(gamesStatus)
  .then(res => {
    gameTime = Date.parse(res.data.start_time)
    countDown()
  })
function countDown() {
  const currentDate = new Date();
  const totalSeconds = Math.floor((gameTime - currentDate) / 1000);
  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor((totalSeconds / 3600) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = Math.floor(totalSeconds % 60);

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
