let timer = {
  interval : null, // stores timer so it can be stopped
  time : 0,
  mins : 0,
  secs : 0,
  cents : 0,
  bestTime : '00:00:00',
  currentTime : '',
  $current : $('#current'),
  start : function() {
    if (timer.time === 100) {
      timer.time = 0;
      timer.secs++;
    }

    if (timer.secs === 60) {
      timer.mins++;
      timer.secs = 0;
    }

    if (timer.mins === 10) {
      timer.stop();
    }

    timer.cents = timer.time;

    timer.$current.text(`${timer.pad(timer.mins)}:${timer.pad(timer.secs)}:${timer.pad(timer.cents)}`);

    timer.time++;
  },
  pad : function(n) {
    return ('00' + n).substr(-2);
  },
  stop : function() {
    clearInterval(timer.interval);
    timer.currentTime = timer.$current.text();
    timer.mins = 0;
    timer.secs = 0;
    timer.cents = 0;
    timer.time = 0;
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
