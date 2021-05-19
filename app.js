const DaysEl = document.getElementById('days');
const HoursEl = document.getElementById('hours');
const MinutesEl = document.getElementById('minutes');
const SecondsEl = document.getElementById('seconds');


const birthDay = '24 May 2021 9:00 PM';

function countDown(){
	const birthDayDate = new Date(birthDay);
	const currentDate = new Date();
	const totalSeconds =Math.floor( (birthDayDate - currentDate) / 1000);
	const days = Math.floor(totalSeconds / 3600 / 24);
	const hours = Math.floor((totalSeconds / 3600) %24 );
	const minutes = Math.floor((totalSeconds / 60) % 60);
	const seconds = Math.floor((totalSeconds) % 60);

	DaysEl.innerText = format(days);
	HoursEl.innerText = format(hours);
	MinutesEl.innerText = format(minutes);
	SecondsEl.innerText = format(seconds);
}


function format(time){
	if(time>=0){
	return time < 10 ? `0${time}` : time;
	}
}

countDown(); 

setInterval(countDown,1000);