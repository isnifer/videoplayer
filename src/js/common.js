(function () {

    /*
     * VideoPlayer Constructor
     *
     * @param {object} video - Video element
     * */
    function Video (video) {
        this.elem = video;
        this.volume = this.elem.volume;

        this.init();
    }

    Video.prototype.createControl = function (options) {
        var el = document.createElement(options.tag);

        for (var i = 0; i < options.attrs.length; i++) {
            el.setAttribute(options.attrs[i].name, options.attrs[i].value);
        }

        return el;
    };

    /*
     * Function returns Human Readable video duration
     *
     * @param {number} data - time in seconds
     *
     * @returns {object} - normalized minutes and seconds (minutes: mm, seconds: ss)
     *
     * */
    Video.prototype.getHumanReadableTime = function (time, ctx) {
        var dirtyTime = (time) ? time : ctx.elem.duration,
            minutes = parseInt(dirtyTime / 60),
            seconds = parseInt(dirtyTime - minutes * 60);

        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        return minutes + ':' + seconds;
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

    Video.prototype.init = function () {
        var self = this,
            wrapper = document.createElement('div'),
            controls = document.createElement('div'),
            title = document.createElement('p'),

            // Video Progress element
            progress = this.createControl({
                tag: 'progress',
                attrs: [
                    {'name': 'class', 'value': 'controls__progress'},
                    {'name': 'max', 'value': 100},
                    {'name': 'value', 'value': 0}
                ]
            }),

            // Play-Pause Button
            play = this.createControl({
                tag: 'span',
                attrs: [
                    {'name': 'class', 'value': 'controls__item controls__play'},
                ]
            }),
            audio = this.createControl({
                tag: 'div',
                attrs: [
                    {'name': 'class', 'value': 'controls__item controls__audio-block'}
                ]
            }),

            // Mute Button
            mute = this.createControl({
                tag: 'span',
                attrs: [
                    {'name': 'class', 'value': 'controls__mute'},
                ]
            }),
            rangeWrapper = this.createControl({
                tag: 'label',
                attrs: [
                    {'name': 'class', 'value': 'controls__range-wrapper'}
                ]
            }),

            // Volume control
            volume = this.createControl({
                tag: 'input',
                attrs: [
                    {'name': 'class', 'value': 'controls__volume'},
                    {'name': 'type', 'value': 'range'},
                    {'name': 'min', 'value': 0},
                    {'name': 'max', 'value': 1},
                    {'name': 'step', 'value': 0.01},
                    {'name': 'value', 'value': 1}
                ]
            }),

            // Time indicator
            time = this.createControl({
                tag: 'span',
                attrs: [
                    {'name': 'class', 'value': 'controls__item controls__time'},
                ]
            }),

            // Fullscreen Button
            fullscreen = this.createControl({
                tag: 'span',
                attrs: [
                    {'name': 'class', 'value': 'controls__item controls__fullscreen'},
                ]
            }),
            elements = this.createControl({
                tag: 'div',
                attrs: [
                    {'name': 'class', 'value': 'controls__elements'}
                ]
            });

        title.classList.add('video__title');
        title.textContent = this.elem.title;

        controls.classList.add('controls');

        rangeWrapper.appendChild(volume);

        audio.appendChild(mute);
        audio.appendChild(rangeWrapper);

        elements.appendChild(play);
        elements.appendChild(audio);
        elements.appendChild(time);
        elements.appendChild(fullscreen);

        controls.appendChild(progress);
        controls.appendChild(elements);

        wrapper.appendChild(title);
        wrapper.appendChild(this.elem);
        wrapper.appendChild(controls);

        wrapper.classList.add('video');

        document.body.appendChild(wrapper);

        // Handlers
        // Insert time of video
        this.elem.addEventListener('loadedmetadata', function () {
            time.textContent = self.getHumanReadableTime(null, self);
        }, false);

        // Change volume
        volume.addEventListener('change', function () {
            self.changeVolume(this.value);
        }, false);

        // Mute video
        mute.addEventListener('click', function () {
            self.mute(volume);
            this.classList.toggle('controls__mute_on');
        }, false);

        // Play - Pause
        play.addEventListener('click', function () {
            self.playPause();
            this.classList.toggle('controls__play_paused');
        }, false);

        // Toggle class of Play button
        this.elem.addEventListener('ended', function () {
            self.togglePlayClass(this);
        });

        // Update progress bar
        this.elem.addEventListener('timeupdate', function () {
            time.textContent = self.getHumanReadableTime(self.elem.currentTime, self);
            self.updateProgressbar(progress);
        }, false);

        // Change video position by click on progress bar
        progress.addEventListener('click', function (e) {
            var coords = Math.floor((100 / this.offsetWidth) * e.offsetX);

            self.goToPosition(coords);
            this.value = coords;

            if (self.elem.paused) {
                self.elem.play();
            }
        }, false);

        // Go to Fullscreen view
        fullscreen.addEventListener('click', function () {
            self.fullScreen();
        }, false);
    };

    var videos = document.querySelectorAll('video'),
        videosLen = videos.length,
        newArr = [];

    for (var i = 0; i < videosLen; i+=1) {
        newArr.push(new Video(videos[i]));
    }
}());