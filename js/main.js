'use strict';
let $stage = $('#stage');
let $rules = $('#rules');
let $difficultyBtn = $('.difficulty-btn');
let $stopResetBtn = $('#stop-reset-btn');

// Fisher-Yates shuffle
Array.prototype.shuffle = function() {
  let i = this.length, j, temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[j];
    this[j] = this[i];
    this[i] = temp;
  }
  return this;
}

$stopResetBtn.on('click', () => {
  timer.stop();
  if ($stopResetBtn.text() === "Stop") {
    $stopResetBtn.text('Reset');
  } else {
    timer.resetBest();
    timer.resetCurrent();
    game.reset();
    $('.difficulty-btn').removeAttr('disabled');
  }

});

game.init();
