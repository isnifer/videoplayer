(function () {

    /*
     * VideoPlayer Constructor
     *
     * @param {object} video - Contain video element and unique ID
     * */
    function Video (video) {

        var el = video.el,
            self = this,
            doc = document,
            tempVolume = el.volume,
            getControl = function (selector) {
                return doc.querySelector(selector + '_' +  video.id);
            };

        this.init = (function () {

            var wrapper = doc.createElement('div'),
                controls = doc.createElement('div');

            wrapper.classList.add('video');

            controls.classList.add('controls');
            controls.innerHTML =
                '<progress class="controls__progress controls__progress_' + video.id + '" max="100" value="0"></progress>' +
                '<div class="controls__elements">' +
                    '<span class="controls__item controls__play controls__play_' + video.id + '">Play/Pause</span>' +
                    '<div class="controls__item controls__audio-block">' +
                        '<span class="controls__mute controls__mute_' + video.id + '">Mute</span>' +
                        '<label class="controls__range-wrapper">' +
                            '<input type="range" class="controls__volume controls__volume_' + video.id + '" max="1" min="0" step="0.01" value="1">' +
                        '</label>' +
                    '</div>' +
                '   <span class="controls__item controls__time controls__time_' + video.id + '"></span>' +
                    '<span class="controls__item controls__fullscreen controls__fullscreen_' + video.id + '"></span>' +
                '</div>';

            wrapper.appendChild(el);
            wrapper.appendChild(controls);

            doc.body.appendChild(wrapper);

        }());

        // Get controls from DOM
        var volume = getControl('.controls__volume'),
            mute = getControl('.controls__mute'),
            play = getControl('.controls__play'),
            progress = getControl('.controls__progress'),
            time = getControl('.controls__time'),
            fullScreen = getControl('.controls__fullscreen');

        /*
         * Function returns People-like video duration
         *
         * @param {number} data - time in seconds
         *
         * @returns {object} - normalized minutes and seconds (minutes: mm, seconds: ss)
         *
         * */
        this.getNormalDuration = function (data) {

            var dirtyTime = data || el.duration,
                seconds = parseInt(dirtyTime),
                minutes = parseInt(seconds / 60);

            return {
                minutes: (function () {
                    if (minutes < 10) {
                        return '0' + minutes;
                    }
                    return minutes;
                }()),
                seconds: (function () {
                    if ((seconds - minutes * 60) < 10) {
                        var t = seconds - minutes * 60;
                        return '0' + t;
                    }
                    return seconds - minutes * 60;
                }())
            };
        };

        // Play or Pause video
        this.playPause = function () {
            var pausedAt;
            if (el.paused) {
                el.play();
                for (var j = 0; j < newArr.length; j++) {
                    if (j !== video.id) {
                        if (!newArr[j].getVideo().paused) {
                            newArr[j].togglePlayClass();
                            newArr[j].getVideo().pause();
                        }
                    }
                }
            } else {
                el.pause();
                pausedAt = this.getNormalDuration(el.currentTime);
                console.log('Video paused at ' + pausedAt.minutes + 'm ' + pausedAt.seconds + 's');
            }
            return this;
        };

        // Video mute or back to previous volume
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

        // Remove element from DOM
        this.remove = function () {
            el.remove();
            this.remove();
            return false;
        };

        this.changeVolume = function (value) {
            el.volume = tempVolume = value;
            return this;
        };

        this.updateProgressbar = function () {
            progress.value = Math.floor((100 / el.duration) * el.currentTime);
            return false;
        };
        this.goToPosition = function (percents) {
            el.currentTime = parseInt((percents / 100) * el.duration);
        };

        this.getVideo = function () {
            return el;
        };

        this.togglePlayClass = function () {
            play.classList.toggle('controls__play_paused');
        };

        this.fullScreen = function () {
            if(el.requestFullscreen) {
                el.requestFullscreen();
            } else if(el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if(el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if(el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
        };

        // Handlers

        volume.addEventListener('change', function () {
            self.changeVolume(this.value);
        }, false);

        mute.addEventListener('click', function () {
            self.mute();
            this.classList.toggle('controls__mute_on');
        }, false);

        play.addEventListener('click', function () {
            self.playPause();
            self.togglePlayClass();
        }, false);

        el.addEventListener('ended', function () {
            self.togglePlayClass();
        });

        el.addEventListener('timeupdate', function () {
            var played = self.getNormalDuration(el.currentTime);

            time.textContent = played.minutes + ':' + played.seconds;
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

        fullScreen.addEventListener('click', function () {
            self.fullScreen();
        }, false);

    }

    var VideoFactory = function () {};

    VideoFactory.prototype.createVideo = function(video) {
        return new Video(video);
    };

    var factory = new VideoFactory(),
        videos = document.querySelectorAll('video'),
        videosLen = videos.length,
        newArr = [];

    for (var i = 0; i < videosLen; i+=1) {
        newArr.push(factory.createVideo({"el": videos[i], "id": i}));
    }

}());