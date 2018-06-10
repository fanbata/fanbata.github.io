var Snake,
	Food,
	Obstacles,
	Velocity,
	initSpeed,
	Speed,
	Direction,
	Size,
	Border,
	GameState,
	canvas,
	ctx,
	width,
	height,
	score,
	xOffset,
	yOffset,
	LastTime,
	fpsStep
	
function init() {
	//canvas parts
	canvas = document.getElementById('snakeBody');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#FFFFFF';
	width = canvas.width;
	height = canvas.height;
	//game variables
	Snake = new LinkedList(new Node(300, 200, '#FFFFFF'));
	Obstacles = [];
	GameState = false;
	Velocity = new Velocity(0, 0);
	Size = 12;
	initSpeed = -1;
	Speed = initSpeed;
	Border = Size / 2;
	Food = makeFood();
	score = 0;
	xOffset = 0;
	yOffset = 0;
	LastTime = 0;
	//frame rate and game speed
	fpsStep = 1000/30;
	//switch to true if you want rainbow seizure-inducing colors
	colormode = false;
	
	
	//setup start/play again buttons
	document.getElementById("start").onclick = function() {
		if (document.getElementById("start").className === 'again') {
			score = 0;
			document.getElementById('score').innerHTML = 'Score: ' + score;
			Snake = new LinkedList(new Node(300, 200, '#FFFFFF'));
			Velocity.xvel = 0;
			Velocity.yvel = 0;
			Direction = '';
			Food = makeFood();
			Obstacles = [];
		}
		GameState = true;
		document.getElementById("start").className = 'playing';
		document.getElementById("start").innerHTML = 'Playing...';
		loop();
	};
	
	document.getElementById('colormode').addEventListener('change', function() {
		colormode = !colormode;
	});
	
	//setting up directional keys
	window.onkeydown = function(e) {
		var kc = e.keyCode;
		e.preventDefault();
		if (kc === 37 && Direction != 'right') {
					Velocity.xvel = -Size;
					Velocity.yvel = 0;
					Direction = 'left';
					xOffset = -Size;
					yOffset = 0;
		} else if (kc === 38 && Direction != 'down') {
					Velocity.xvel = 0;
					Velocity.yvel = -Size;
					Direction = 'up';
					yOffset = -Size;
					xOffset = 0;
		} else if (kc === 39 && Direction != 'left') {
					Velocity.xvel = Size;
					Velocity.yvel = 0;
					Direction = 'right';
					xOffset = Size;
					yOffset = 0;
		} else if (kc === 40 && Direction != 'up') {
					Velocity.xvel = 0;
					Velocity.yvel = Size;
					Direction = 'down';
					yOffset = Size;
					xOffset = 0;
		} else if (kc === 32) {
			cutOff();
		}
	};
}

function loop(timestamp) {
	if (GameState) {
		if (timestamp - LastTime > fpsStep) {
			update();
			draw();
			LastTime = timestamp;
		}
		window.requestAnimationFrame(loop);
	} else {
		document.getElementById('score').innerHTML = 'You got ' + score + ' points!';
		document.getElementById('start').className = 'again';
		document.getElementById('start').innerHTML = 'Play Again?';
	}
}

function update() {
	if (Speed < 0) {
		Snake.move(Snake.head.xpos + Velocity.xvel, Snake.head.ypos + Velocity.yvel);
		//if Snake has collided with borders.
		if (Snake.head.xpos < Size || Snake.head.xpos > width - Size || Snake.head.ypos < Size || Snake.head.ypos > height - Size) {
			GameState = false;
		}
		for (var i = 0; i < Obstacles.length; i++) {
			if (checkColl(Snake.head, Obstacles[i])) {
				GameState = false;
			}
		}
		//if Snake has eaten a food
		if (checkColl(Snake.head, Food)) {
			Snake.add(Snake.tail.xpos + xOffset, Snake.tail.ypos + yOffset, '#ffffff');
			score++;
			document.getElementById('score').innerHTML = 'Score: ' + score;
			Food = makeFood();
		}
		Speed = initSpeed;
	} else {
		Speed--;
	}
	
}

function draw() {
	//clear canvas
	ctx.clearRect(0, 0, width, height);
	//draw Snake
	var current = Snake.head;
	var color = '#FF0089';
	if (colormode) {
		color = randColor();
	}
	while (current != null) {
		if (current === Snake.head) {
			ctx.fillStyle = current.color;
		} else {
			ctx.fillStyle = color;
		}
		ctx.fillRect(current.xpos - Border, current.ypos - Border, Size, Size);
		current = current.next;
	}
	
	//draw Obstacle pieces
	ctx.fillStyle = '#ffffff';
	for (var i = 0; i < Obstacles.length; i++) {
		ctx.fillRect(Obstacles[i].xpos - Border, Obstacles[i].ypos - Border, Size, Size);
	}
	//draw Food
	ctx.fillStyle = color;
	ctx.fillRect(Food.xpos - Border, Food.ypos - Border, Size, Size);
}

function checkColl(node1, node2) {
	if (node1.xpos < node2.xpos + Size && node1.xpos + Size > node2.xpos &&
		node1.ypos < node2.ypos + Size && node1.ypos + Size > node2.ypos) {
		return true;
	} else {
		return false;
	}
}

function randColor() {
	var colors = [
		"#FF0000",
		"#FF0089",
		"#8900FF",
		"#0080FF",
		"#00FFD5",
		"#3CFF00",
		"#FFF700",
		"#FF7700"
	]
	return colors[Math.floor(Math.random() * colors.length)];
}

function makeFood() {
	var node = new Node(Math.floor(Math.random() * (width - Size)) + Size, Math.floor(Math.random() * (height - Size)) + Size, '#D7AA6E');
	for (var i = 0; i < Obstacles.length; i++) {
		if (checkColl(node, Obstacles[i])) {
			node = new Node(Math.floor(Math.random() * (width - Size)) + Size + 5, Math.floor(Math.random() * (height - Size)) + Size + 5, '#D7AA6E');
		}
	}
	return node;
}

function cutOff() {
	var current = Snake.head.next;
	while (current != null) {
		Obstacles.push(current);
		current = current.next;
	}
	Snake.head.next = null;
	Snake.tail = Snake.head;
}

function Velocity(xvel, yvel) {
	this.xvel = xvel;
	this.yvel = yvel;
}

function Node(xpos, ypos, color) {
	this.xpos = xpos;
	this.ypos = ypos;
	this.prevx = null;
	this.prevy = null;
	this.color = color;
	this.next = null;
}

function LinkedList(node) {
	this.head = node;
	this.tail = node;
	this._length = 1;
	
	this.add = function(xpos, ypos, color) {
		var node = new Node(xpos, ypos, color);
		this.tail.next = node;
		this.tail = node;
		this._length++;
	}
	
	this.move = function(xpos, ypos) {
		var current;
		var prev;
		//update head position
		this.head.prevx = this.head.xpos;
		this.head.prevy = this.head.ypos;
		this.head.xpos = xpos;
		this.head.ypos = ypos;
		
		//update rest of the list
		current = this.head.next;
		prev = this.head;
		while (current != null) {
			current.prevx = current.xpos;
			current.prevy = current.ypos;
			current.xpos = prev.prevx;
			current.ypos = prev.prevy;
			if (checkColl(current, this.head)) {
				GameState = false;
			}
			current = current.next;
			prev = prev.next;
		}
	}
}
/*
LinkedList.prototype.add = function(xpos, ypos, color) {
	var node = new Node(xpos, ypos, color);
	this.tail.next = node;
	this.tail = node;
	this._length++;
};

LinkedList.prototype.move = function(xpos, ypos) {
	var current;
	var prev;
	//update head position
	this.head.prevx = this.head.xpos;
	this.head.prevy = this.head.ypos;
	this.head.xpos = xpos;
	this.head.ypos = ypos;
	
	//update rest of the list
	current = this.head.next;
	prev = this.head;
	while (current != null) {
		current.prevx = current.xpos;
		current.prevy = current.ypos;
		current.xpos = prev.prevx;
		current.ypos = prev.prevy;
		if (checkColl(current, this.head)) {
			GameState = false;
		}
		current = current.next;
		prev = prev.next;
	}
}*/

init();