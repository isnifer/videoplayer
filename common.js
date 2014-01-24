function Video (video) {
	var el = video[0],
		self = this,
		tempVolume = el.volume;

	var getControl = function (selector) {
		return document.querySelector(selector + '_' +  video[1]);	
	},
		volume = getControl('.controls__volume'),
		mute = getControl('.controls__mute'),
		play = getControl('.controls__play'),
		progress = getControl('.controls__progress');

	this.getNormalDuration = function (data) {
		var dirtyTime = data || el.duration,
			seconds = parseInt(dirtyTime),
			minutes = parseInt(seconds / 60);

		return {
			minutes: minutes,
			seconds: seconds - minutes * 60
		}; 
	};
	this.playPause = function () {
		var pausedAt;
		if (el.paused) {
			el.play();
		} else {
			el.pause();
			pausedAt = this.getNormalDuration(el.currentTime);
			console.log('Video paused at ' + pausedAt.minutes + 'm ' + pausedAt.seconds + 's');
		}
		return this;
	};
	this.backToStart = function () {
		el.played.start(1);
		return this;
	};
	this.played = function () {
		return el.played;
	};
	this.mute = function () {
		if (el.volume !== 0) {
			el.volume = 0;
			volume.value = 0;
		} else {
			el.volume = tempVolume;
			volume.value = tempVolume;
		}
		return this;
	};
	this.getHeight = function () {
		return el.offsetHeight;
	};
	this.getWidth = function () {
		return el.offsetWidth;
	};
	this.remove = function () {
		el.remove();
		this.remove();
		return false;
	};
	this.getPoster = function () {
		return el.poster;
	};
	this.changeVolume = function (value) {
		el.volume = tempVolume = value;
		return this;
	};
	this.updateProgressbar = function () {
		var percent = Math.floor((100 / el.duration) * el.currentTime);
		progress.value = percent;
		return false;
	};
	this.goToPosition = function (percents) {
		el.currentTime = parseInt((percents / 100) * el.duration);  
	};

	volume.addEventListener('change', function () {
		self.changeVolume(this.value);
	}, false);

	mute.addEventListener('click', function () {
		self.mute();
	}, false);

	play.addEventListener('click', function () {
		self.playPause();
	}, false);

	el.addEventListener('timeupdate', function () {
		self.updateProgressbar();
	}, false);

	progress.addEventListener('click', function (e) {
		var coords = Math.floor((100 / this.offsetWidth) * e.offsetX);
		self.goToPosition(coords);
		this.value = coords;
		if (el.paused) {
			el.play();
		}
	}, false);

}

var VideoFactory = function () {};

VideoFactory.prototype.createVideo = function(video) {
	return new Video(video);
};

var factory = new VideoFactory();

var videos = document.querySelectorAll('video'),
	videosLen = videos.length,
	newArr = [];

for (var i = 0; i < videosLen; i+=1) {
	newArr.push(factory.createVideo([videos[i], i]))
}

console.log(newArr);
