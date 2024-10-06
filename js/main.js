document.getElementById('start').hidden = false;
const memory = document.getElementById('memory');
const clock = document.getElementById('timer');
const result = document.getElementById('result');
const gameScore = document.getElementById('score');
const pause = document.getElementById('pause');
const restart = document.getElementById('resetButton');

let card1;
let card2;
let score = 0;
let mins = 10 ;
let time = mins * 60;
let timer;
// Initially, no time has passed, but this will count up
// and subtract from the TIME_LIMIT
let timePassed = 0;
const TIME_LIMIT = 600;
let timeLeft = TIME_LIMIT;

const FULL_DASH_ARRAY = 628;

// Warning occurs at 10s
const WARNING_THRESHOLD = 30;
// Alert occurs at 5s
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
	info: {
		color: "green"
	},
	warning: {
		color: "orange",
		threshold: WARNING_THRESHOLD
	},
	alert: {
		color: "red",
		threshold: ALERT_THRESHOLD
	}
};
let remainingPathColor = COLOR_CODES.info.color;


document.getElementById('start').addEventListener('click', startGame);
async function shuffledDeck(){
	
	try {
		const res = await fetch('https://www.deckofcardsapi.com/api/deck/vrww9w6v6612/shuffle/');
		const data = await res.json();
		return data ;
	}catch(err){
		return err;
	}
}
shuffledDeck()
// "vrww9w6v6612" deckId



async function startGame(){

	document.getElementById('start').hidden = true;

	const url = await fetch(`https://www.deckofcardsapi.com/api/deck/vrww9w6v6612/draw/?count=52`);
		try {
			const res = url;
			const data = await res.json();
			const arrCards = data.cards;

			let unflipped = `https://www.deckofcardsapi.com/static/img/back.png`
			for(let i = 0; i < arrCards.length ; i++) {
				// CREATED IMG TAG WITH ALL IMAGES
				let cardImages = document.createElement('img');
				let li = document.createElement('li');
				li.classList.add('deck');
				cardImages.classList = `card ${arrCards[i].value}`;
				cardImages.classList = `card ${arrCards[i].value}`;
				cardImages.src1Flipped = arrCards[i].image ;
				cardImages.src = arrCards[Math.floor(i)].image;
				cardImages.value = arrCards[i].value;
				cardImages.suit = arrCards[i].suit;
	//APPENDING CARD IMAGES TO ELEMENT
				li.appendChild(cardImages)
				document.querySelector('.cards').appendChild(li);
				cardImages.addEventListener('click', matchCard);
				setTimeout(() =>{
				cardImages.src = unflipped;
				pause.removeAttribute('hidden');
				document.getElementById('start').removeAttribute('hidden');
				gameScore.removeAttribute('hidden');
				gameScore.textContent = `Score:`;
				document.querySelector('.base-timer').removeAttribute('hidden');
				document.querySelector('button').hidden = false;

			},1400)	
		}

			 timer = setInterval((formatTime),1000);

			document.getElementById('start').addEventListener('click',resume);
			pause.addEventListener('click', pauseGame);
			restart.addEventListener('click',resetGame);
			
	} catch(Err) {
		return Err;
	}
}
	

function changeCircleColor(timeLeft) {
	const { alert, warning, info } = COLOR_CODES;

	// If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
	if(timeLeft <= alert.threshold) {
		document.getElementById("base-timer-path-remaining").classList.remove(warning.color);

		document.getElementById("base-timer-path-remaining").classList.add(alert.color);

		clock.style.color = alert.color;
		// If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
	} else if(timeLeft <= warning.threshold) {
			
		document.getElementById("base-timer-path-remaining").classList.remove(info.color);

		document.getElementById("base-timer-path-remaining").classList.add(warning.color);

		clock.style.color = warning.color;
		
	}
}

function calculateTimeFraction() {
	const rawTimeFraction = timeLeft / TIME_LIMIT;
	return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}


function setCircleDasharray() {
	const circleDasharray = `${(
		calculateTimeFraction() * FULL_DASH_ARRAY
	).toFixed(0)} 628`;

	document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function formatTime() {

	let minutes = Math.floor(time / 60 );
	let seconds = time % 60;

	clock.innerText = `${minutes}:${seconds}`;

	 if(seconds < 10){
		clock.innerText = `${minutes}:0${seconds}`;
		seconds =  `0${ seconds }`;
	}

		timePassed = timePassed += 1;
		timeLeft = TIME_LIMIT - timePassed;

		setCircleDasharray();
		changeCircleColor(timeLeft);


	if(timeLeft === 0 -1 ){		
		clearInterval(timer);
		result.innerText = `YOU LOSE!`;
		document.getElementById('start').hidden = true;
		pause.hidden = true;
	}
	
	return time--;
}

//MATCH CARD FUNCTION
function matchCard(){

	if(this.src.includes('back')){
		if(!card1){
			card1 = this;
			card1.src = this.src1Flipped;
	}else if(!card2 && this !== card1){
			card2 = this;
			card2.src = this.src1Flipped;
			setTimeout(update, 1000);
		}
	}
}

//MATCHING OF CARDS AND ADDING TO SCORE
function update(){

	if(Number(cardValue(card1.value)) !== Number(cardValue(card2.value))){

		card1.src = `https://www.deckofcardsapi.com/static/img/back.png`;
		card2.src = `https://www.deckofcardsapi.com/static/img/back.png`;

	}

	if(Number(cardValue(card1.value)) === Number(cardValue(card2.value)) && timeLeft !== -1){
		
		gameScore.innerText = `Score: ${score += 10}`;
		card1.style.display = 'none';
		card2.style.display = 'none';
		
	}else{
		card1.src = `https://www.deckofcardsapi.com/static/img/back.png`;
		card2.src = `https://www.deckofcardsapi.com/static/img/back.png`;
	}

	if(score === 260){
		clearInterval(timer);
		result.innerText = `WINNER WINNER CHICKEN DINNER!!`;
		result.style.color = 'red';
		document.getElementById('start').hidden = true;
		pause.hidden = true;
	}else {
		card1 = null;
		card2 = null;
	}
}

//Convert to switch case
function cardValue(val) {

	switch(val){
		case "JACK":
			return 11;
			break;
		case "QUEEN":
			return 12;
			break;
		case "KING":
			return 13;
			break;
		case "ACE":
			return 14;
			break;
		default: 
			return val;
	}
}
	

function pauseGame() {
	clearInterval(timer);
} 

function resume() {
	document.getElementById('start').hidden = false;

}

function resetGame(){
	location.reload();
	
}

