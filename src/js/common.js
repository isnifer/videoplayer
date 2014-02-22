(function (doc) {

    /*
     * VideoPlayer Constructor
     *
     * @param {object} video - Video element
     * */
    function Video (video) {
        var currentSkin;
        
        this.elem = video;
        this.volume = this.elem.volume;
        this.skin = video.getAttribute('data-skin');

        currentSkin = (this.skin && this.skins[this.skin]) ? this.skins[this.skin] : this.skins.default;

        this.init(currentSkin);
    }

    Video.prototype.skins = {
        'skin_1': ['progress', 'play', 'mute', 'volume', 'time', 'allTime', 'fullscreen'],
        'skin_2': ['play', 'time', 'allTime', 'progress', 'mute', 'volume', 'fullscreen'],
        'skin_3': ['progress', 'play', 'mute', 'volume', 'time', 'allTime', 'fullscreen'],
        'skin_4': ['play', 'progress', 'time', 'mute'],
        'skin_5': ['play', 'progress',  'volume', 'mute'],
        'skin_6': ['play', 'mute', 'progress', 'time', 'fullscreen'],
        'skin_7': ['progress', 'play', 'mute', 'volume', 'time', 'allTime', 'fullscreen'],
        'skin_8': ['progress', 'play', 'mute', 'volume', 'time', 'allTime', 'fullscreen'],
        'skin_9': ['progress', 'play', 'mute', 'volume', 'time', 'allTime', 'fullscreen'],
        'default': ['progress', 'play', 'mute', 'volume', 'time', 'allTime', 'fullscreen']
    };

    Video.prototype.playerControls = {
        'progress': {
            'tag': 'progress',
            'attrs': [
                {'name': 'class', 'value': 'controls__progress'},
                {'name': 'max', 'value': 100},
                {'name': 'value', 'value': 0}
            ]
        },
        'play': {
            'tag': 'span',
            'attrs': [{'name': 'class', 'value': 'controls__item controls__play'}]
        },
        'mute': {
            'tag': 'span',
            'attrs': [{'name': 'class', 'value': 'controls__item controls__mute'}]
        },
        'volume': {
            'tag': 'input',
            'attrs': [
                {'name': 'class', 'value': 'controls__item controls__volume'},
                {'name': 'type', 'value': 'range'},
                {'name': 'min', 'value': 0},
                {'name': 'max', 'value': 1},
                {'name': 'step', 'value': 0.01},
                {'name': 'value', 'value': 1}
            ]
        },
        'time': {
            'tag': 'span',
            'attrs': [{'name': 'class', 'value': 'controls__item controls__time'}]
        },
        'allTime': {
            'tag': 'span',
            'attrs': [{'name': 'class', 'value': 'controls__item controls__time controls__time-overall'}]
        },
        'fullscreen': {
            'tag': 'span',
            'attrs': [{'name': 'class', 'value': 'controls__item controls__fullscreen'}]
        },
        'elements': {
            'tag': 'div',
            'attrs': [{'name': 'class', 'value': 'controls__elements'}]
        }
    };

    Video.prototype.createControl = function (options) {
        var el = doc.createElement(options.tag);

        for (var i = 0; i < options.attrs.length; i++) {
            el.setAttribute(options.attrs[i].name, options.attrs[i].value);
        }

        return el;
    };

    /*
     * Function returns Human Readable video duration
     *
     * @param {number} time - time in seconds
     *
     * @returns {object} - Human Readable time format mm:ss
     * */
    Video.prototype.getHumanReadableTime = function (time) {
        var dirtyTime = (time) ? time : this.elem.duration,
            hours = parseInt(dirtyTime / 3600),
            minutes = (hours > 0) ? parseInt((dirtyTime - hours * 3600) / 60) : parseInt(dirtyTime / 60),
            seconds = (hours > 0) ? parseInt(dirtyTime - hours * 3600 - minutes * 60) : parseInt(dirtyTime - minutes * 60);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
    };

    // Play or Pause video
    Video.prototype.playPause = function () {
        if (this.elem.paused) {
            this.elem.play();
        } else {
            this.elem.pause();
        }
        return this;
    };

    // Video mute or back to previous volume
    Video.prototype.mute = function (volumeButton) {
        if (this.elem.volume !== 0) {
            this.elem.volume = 0;
            volumeButton.value = 0;
        } else {
            this.elem.volume = volumeButton.value = this.volume;
        }
        return this;
    };

    Video.prototype.changeVolume = function (value) {
        this.elem.volume = this.volume = value;
        return this;
    };

    Video.prototype.updateProgressbar = function (progress) {
        progress.value = Math.floor((100 / this.elem.duration) * this.elem.currentTime);
        return false;
    };

    Video.prototype.goToPosition = function (percents) {
        this.elem.currentTime = parseInt((percents / 100) * this.elem.duration);
    };

    Video.prototype.fullScreen = function () {
        if(this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if(this.elem.mozRequestFullScreen) {
            this.elem.mozRequestFullScreen();
        } else if(this.elem.webkitRequestFullscreen) {
            this.elem.webkitRequestFullscreen();
        } else if(this.elem.msRequestFullscreen) {
            this.elem.msRequestFullscreen();
        }
    };

    Video.prototype.init = function (currentSkin) {
        var self = this,
            videoParent = self.elem.parentNode,
            wrapper = doc.createElement('div'),
            controls = doc.createElement('div'),
            title = doc.createElement('p'),

            elements = {
                progress: this.createControl(this.playerControls.progress),
                play: this.createControl(this.playerControls.play),
                mute: this.createControl(this.playerControls.mute),
                volume: this.createControl(this.playerControls.volume),
                time: this.createControl(this.playerControls.time),
                allTime: this.createControl(this.playerControls.allTime),
                fullscreen: this.createControl(this.playerControls.fullscreen),
                elements: this.createControl(this.playerControls.elements)
            };

        title.classList.add('video__title');
        title.textContent = this.elem.title;

        controls.classList.add('controls');

        if (this.skin) {
            controls.classList.add('controls-' + this.skin); 
        } else {
            controls.classList.add('controls-skin_default');
        }

        for (var i = 0; i < currentSkin.length; i++) {
            controls.appendChild(elements[currentSkin[i]]);
        }

        wrapper.classList.add('video');

        wrapper.appendChild(title);
        videoParent.insertBefore(wrapper, this.elem);
        wrapper.appendChild(this.elem);
        wrapper.appendChild(controls);

        wrapper.style.width = controls.offsetWidth + 'px';

        // Handlers
        // Insert time of video
        this.elem.addEventListener('loadedmetadata', function () {
            elements.allTime.textContent = ' / ' + self.getHumanReadableTime();
        }, false);

        // Change volume
        elements.volume.addEventListener('change', function () {
            self.changeVolume(this.value);
        }, false);

        // Mute video
        elements.mute.addEventListener('click', function () {
            self.mute(elements.volume);
            this.classList.toggle('controls__mute_on');
        }, false);

        // Play - Pause
        elements.play.addEventListener('click', function () {
            self.playPause();
            this.classList.toggle('controls__play_paused');
        }, false);

        // Toggle class of Play button
        this.elem.addEventListener('ended', function () {
            elements.play.classList.toggle('controls__play_paused');
        });

        // Update progress bar
        this.elem.addEventListener('timeupdate', function () {
            elements.time.textContent = self.getHumanReadableTime(this.currentTime);
            self.updateProgressbar(elements.progress);
        }, false);

        // Change video position by click on progress bar
        elements.progress.addEventListener('click', function (e) {
            var coords = Math.floor((100 / this.offsetWidth) * e.offsetX);

            self.goToPosition(coords);
            this.value = coords;

            if (self.elem.paused) {
                self.elem.play();
                elements.play.classList.remove('controls__play_paused');
            } else {
                elements.play.classList.add('controls__play_paused');
            }
        }, false);

        // Go to Fullscreen view
        elements.fullscreen.addEventListener('click', function () {
            self.fullScreen();
        }, false);
    };

    var videos = doc.querySelectorAll('video'),
        videosLen = videos.length,
        newArr = [];

    for (var i = 0; i < videosLen; i+=1) {
        newArr.push(new Video(videos[i]));
    }
}(document));