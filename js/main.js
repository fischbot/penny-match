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
  if ($stopResetBtn.text() === "Stop") {
    timer.stop();
    $stopResetBtn.text('Reset');
  } else {
    game.resetAll();
    timer.resetCurrent();
    timer.resetBest();
    $('.difficulty-btn').removeAttr('disabled');
  }

  e.preventDefault();
});

game.init();
