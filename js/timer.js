let timer = {
  t : null, // stores timer so it can be stopped
  time : 0,
  bestTime : '00:00:00',
  currentTime : '',
  $current : $('#current'),
  start : function() {
      timer.time++;
      let mins = Math.floor(timer.time/10/60);
      let secs = Math.floor(timer.time/10);
      let tenths = timer.time % 10;

      if (mins < 10) {
        mins = '0' + mins;
      }
      if (secs < 10) {
        secs = '0' + secs;
      }

      if (secs === 60) {
        secs = '00';
      }

      timer.$current.text(`${mins}:${secs}:0${tenths}`);
  },
  stop : function() {
    clearInterval(timer.t);
    timer.currentTime = timer.$current.text();
  },
  compare : function() {
    if (timer.bestTime === '00:00:00') {
      timer.bestTime = timer.currentTime;
      timer.storeBest();
    } else if (timer.currentTime < timer.bestTime) {
      timer.storeBest();
    }
  },
  storeBest : function() {
    timer.bestTime = timer.currentTime;
    $('#best').text(timer.bestTime);
  },
  resetCurrent : function() {
    timer.time = 0;
    timer.currentTime = '';
    timer.$current.text('00:00:00');
  },
  resetBest : function() {
    timer.bestTime = '00:00:00';
    $('#best').text('00:00:00');
  }
};
