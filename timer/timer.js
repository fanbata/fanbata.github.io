// Let's build a timer //
document.addEventListener('DOMContentLoaded', function() {
	var timer = null;

	// button actions //
	document.getElementById('start').addEventListener('click', function() {
		selectThisButton(this);
		if (timer !== null) {
			timer.start();
		} else {
			timer = new Timer();
			timer.begin();
		}
	});

	document.getElementById('stop').addEventListener('click', function() {
		selectThisButton(this);
		if (timer !== null) {
			timer.stop();
		} else {
			return;
		}
	});

	document.getElementById('clear').addEventListener('click', function() {
		removeSelects();
		if (timer !== null) {
			timer.clear();
			timer = null;
		} else {
			return;
		}
	});

	// helper functions for button styling //
	function selectThisButton(ele) {
		removeSelects();
		ele.classList += " selected";
	}

	function removeSelects() {
		const selected = document.getElementsByClassName('selected');
		if (selected.length > 0) {
			selected[0].className = "button";
		}
	}

	// Timer object //
	function Timer() {
		this.interval = null;
		this.init = Date.now();
		this.delta = 0;
		this.old = 0;
		this.offset = 0;
		this.paused = 1;

		this.hEle = document.getElementById('hours');
		this.mEle = document.getElementById('minutes');
		this.sEle = document.getElementById('seconds');
	}

	Timer.prototype.begin = function() {
		this.start();
		this.interval = setInterval(this.update.bind(this), 1000);
	};

	Timer.prototype.update = function() {
		if (this.paused) return;

		//get how much time has passed
		const now = Date.now();
		this.delta = now - this.init - this.offset;

		//convert to seconds
		const s = Math.floor((this.delta % 60000) / 1000);
		if (s < 10) {
			this.sEle.innerHTML = "0" + s;
		} else {
			this.sEle.innerHTML = s;
		}

		//convert to minutes
		const m = Math.floor(this.delta / 60000) % 60;
		if (m < 10) {
			this.mEle.innerHTML = "0" + m;
		} else {
			this.mEle.innerHTML = m;
		}

		//convert to hours
		const h = Math.floor(this.delta / 3600000);
		this.hEle.innerHTML = h;
	}

	Timer.prototype.start = function () {
		if (this.paused < 1) return;

		//set how much time to offset since
		//timer was paused.
		if (this.interval !== null) {
			this.offset += Date.now() - this.old;
		}
		this.paused = 0;
	};

	Timer.prototype.stop = function() {
		if (this.paused > 0) return;
		this.paused = 1;

		//keep track of paused time for offset.
		this.old = Date.now();
	};

	Timer.prototype.clear = function() {
		clearInterval(this.interval);
		this.hEle.innerHTML = "0";
		this.mEle.innerHTML = "00";
		this.sEle.innerHTML = "00";
	};
});