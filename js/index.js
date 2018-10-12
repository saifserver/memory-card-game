let symbols = ["chess-rook", "chess-queen", "chess-pawn", "chess-knight", "chess-king", "chess-bishop", "code", "gem"];
symbols = symbols.concat(symbols);

let opened = [],
	match = 0,
	moveCount = 0,
	clicks = 0,
	$deck = $(".deck"),
	$scorePanel = $("#score-panel"),
	$moveNum = $(".moveCount"),
	$ratingStars = $("i.points"),
	$restart = $(".restart"),
	timer;

let gameTimer = () => {
	let startTime = new Date().getTime();

	timer = setInterval(() => {
		let now = new Date().getTime();
		let elapsed = now - startTime;

		// Calculate minutes and seconds
		let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

		// Add starting 0 if seconds < 10
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		let currentTime = minutes + ":" + seconds;

		// Update clock on game screen
		$(".clock").text(currentTime);
	}, 1000);
};

// Initialize Memory Game
let init = () => {
	let cards = shuffle(symbols);
	$deck.empty();
	match = 0;
	opened = [];
	moveCount = 0;
	$moveNum.text("0");
	$ratingStars.removeClass("far fa-star").addClass("fas fa-star");

	for (let i = 0; i < cards.length; i++) {
		$deck.append($(`<li class="card"><i class="fas fa-${cards[i]}"></i></li>`));
	}

	clickEventListener();
	$(".clock").text("0:00");
};

// Shuffle Cards
let shuffle = array => {
	let index = array.length,
		temp,
		randomIndex;
	while (0 !== index) {
		randomIndex = Math.floor(Math.random() * index);
		index -= 1;
		temp = array[index];
		array[index] = array[randomIndex];
		array[randomIndex] = temp;
	}
	return array;
};

// Set Rating and final Score
let setRating = moveCount => {
	let score = 3;
	if (moveCount <= 12) {
		$ratingStars
			.eq(3)
			.removeClass("fas fa-star")
			.addClass("far fa-star");
		score = 3;
	} else if (moveCount > 10 && moveCount <= 16) {
		$ratingStars
			.eq(2)
			.removeClass("fas fa-star")
			.addClass("far fa-star");
		score = 2;
	} else if (moveCount > 16) {
		$ratingStars
			.eq(1)
			.removeClass("fas fa-star")
			.addClass("far fa-star");
		score = 1;
	}
	return { score };
};

// End The Memory Game
// Open Popup for showing required details
let endGame = (moveCount, score) => {
	let msg = score == 1 ? score + " Star" : score + " Stars";
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: "Congratulations! You Won!",
		text: `With ${moveCount} moves and ${msg}\n Woooooo!`,
		type: "success",
		confirmButtonColor: "#02ccba",
		confirmButtonText: "Play again!",
	}).then(isConfirm => {
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			init();
		}
	});
};

// Handle click listener events for every card and display appropriate results
let clickEventListener = () => {
	$deck.find('.card:not(".match, .open")').on("click", function() {
		clicks++;
		clicks == 1 ? gameTimer() : "";

		if ($(".show").length > 1) {
			return true;
		}

		let $this = $(this);
		let card = $this.context.innerHTML;

		// Check if the player has clicked the same card
		if ($this.hasClass("open")) {
			return true;
		}

		$this.addClass("open show");
		opened.push(card);

		// Check with opened card
		// Add view changes in cards
		// Remove css animation classes
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find(".open").addClass("match animated infinite pulse");
				setTimeout(() => {
					$deck.find(".match").removeClass("open show animated infinite pulse");
				}, 800);
				match++;
			} else {
				$deck.find(".open").addClass("mismatch animated infinite tada");
				setTimeout(() => {
					$deck.find(".open").removeClass("animated infinite tada");
				}, 800 / 1.5);
				setTimeout(() => {
					$deck.find(".open").removeClass("open show mismatch animated infinite tada");
				}, 800);
			}
			opened = [];
			moveCount++;
			setRating(moveCount);
			$moveNum.html(moveCount);
		}

		// End Memory Game if all cards matched
		if (match === 8) {
			setRating(moveCount);
			let score = setRating(moveCount).score;
			setTimeout(() => {
				endGame(moveCount, score);
			}, 500);
		}
	});
};

// Restart the Memory Game
$restart.bind("click", () => {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: "Are you sure?",
		text: "Your progress will be Lost!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#02ccba",
		cancelButtonColor: "#f95c3c",
		confirmButtonText: "Yes, Restart Game!",
	}).then(isConfirm => {
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			init();
		}
	});
});

// Initialize the Memory Game
$(() => {
	init();
});
