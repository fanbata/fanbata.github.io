//variables
var bg = [
	"0px 0px",
	"-100px 0px",
	"-200px 0px",
	"-300px 0px",
	"0px -100px",
	"-100px -100px",
	"-200px -100px",
	"-300px, -100px",
	"0px -200px", 
	"-100px -200px",
	"-200px -200px",
	"-300px -200px",
	"0px -300px",
	"-100px -300px",
	"-200px -300px"
];
var squares = [];
var debug = false;
var gameon = false;
var shuffling = false;
var parea, 
	debugarea,
	shufflebutt,
	debugbutt,
	resetbutt, 
	blank;

document.addEventListener('DOMContentLoaded', function() {
	parea = document.getElementById('puzzlearea');
	shufflebutt = document.getElementById('shufflebutton');
	debugarea = document.getElementById('debug');
	debugbutt = document.getElementById('debugbutton');
	resetbutt = document.getElementById('resetbutton');
	initSquares();
	initPuzzle();
	shufflebutt.addEventListener('click', shuffle);
	debugbutt.addEventListener('click', function() {
		debug = !debug;
		availableMoves();
	});
	resetbutt.addEventListener('click', function() {
		window.location.reload();
	});
	availableMoves();
	gameon = true;
});

function Square(position, bgpos, identity) {
	this.position = position;
	this.bgpos = bgpos;
	this.identity = identity;
}

Square.prototype.canMove = function() {
	var bleft = (blank % 4) * 100;
	var btop = Math.floor(blank / 4) * 100;
	var left = (this.position % 4) * 100;
	var top = Math.floor(this.position / 4) * 100;

	if ((bleft - 100) === left && btop === top) {
		return true;
	}

	if ((bleft + 100) === left && btop === top) {
		return true;
	}

	if ((btop + 100) === top && bleft === left) {
		return true;
	}

	if ((btop - 100) === top && bleft === left) {
		return true;
	}

	return false;
};

Square.prototype.move = function() {
	if (gameon || shuffling) {
		var element,
			temppos,
			left,
			top;
		if (this.canMove()) {
			element = document.getElementById('square_' + this.identity);
			temppos = this.position;
			this.position = blank;
			left = (blank % 4) * 100;
			top = Math.floor(blank / 4) * 100;
			element.style.left = left + "px";
			element.style.top = top + "px";
			blank = temppos;
			availableMoves();
			if (didWin()) {
				endGame();
			}
		}
	}
};

function initSquares() {
	squares = [];
	for (var i = 0; i < 15; i++) {
		squares[i] = new Square(i, bg[i], i);
	}
	blank = squares.length;
}

function initPuzzle() {
	var temp;
	var left;
	var top;
	var self;
	for (var i = 0; i < squares.length; i++) {
		self = squares[i];
		if (self) {
			left = (i % 4) * 100;
			top = Math.floor(i / 4) * 100;
			temp = document.createElement("div");
			temp.style.position = "absolute";
			temp.style.backgroundPosition = squares[i].bgpos;
			temp.style.left = left + "px";
			temp.style.top = top + "px";
			temp.className = "tile";
			temp.id = "square_" + squares[i].position;
			temp.addEventListener("click", self.move.bind(self));
			parea.appendChild(temp);
		} else {
			blank = i;
		}
	}
}

function getNeighbors() {
	var neighbors = [];
	for (var i =0; i < squares.length; i++) {
		if (squares[i].canMove()) {
			neighbors.push(squares[i]);
		}
	}
	return neighbors;
}

function shuffle() {
	var neighbors, spot;
	shuffling = true;
	for (var i = 0; i < 1000; i++) {
		neighbors = getNeighbors();
		spot = Math.floor(Math.random() * neighbors.length);
		squares[neighbors[spot].identity].move();
	}
	shuffling = false;
}

//probably better way to do this, but just using it as quick
//debugging mainly.
function availableMoves() {
	debugarea.innerHTML = "";
	if (debug) {
		var neighbors = getNeighbors();
		var self,
			top, 
			left,
			temp;
		for (var i = 0; i < neighbors.length; i++) {
			self = neighbors[i].position;
			left = (self % 4) * 100;
			top = Math.floor(self / 4) * 100;
			temp = document.createElement("div");
			temp.className = "hiddentile";
			temp.style.left = left + "px";
			temp.style.top = top + "px";
			debugarea.appendChild(temp);
		}
	}
}

function didWin() {
	if (!shuffling) {
		for (var i = 0; i < squares.length; i++) {
			if (squares[i].position !== squares[i].identity) {
				return false;
			}
		}
		return true;	
	}
}

function endGame() {
	gameon = false;
	var win = document.getElementById('winner');
	win.innerHTML = "You win!";
	win.style.width = "150px";
	win.style.height = "100%";
	win.style.display = "block";
	win.style.padding = "0.5em";
	win.style.marginTop = "2em";
	win.style.opacity = "1";
}