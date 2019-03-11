import images from './images.js';
import timer from './timer.js';

class Game {
  constructor() {
    this.difficulty = 0;
    this.cols = 0;
    this.win = false;
    this.firstClick = true;
    this.stage = $('#stage');
    this.rules = $('#rules');
    this.difficultyBtn = $('.difficulty-btn');
    this.stopResetBtn = $('.stop-reset-btn');
    this.playAgainBtn = $('.play-again-btn');
    this.timerDisplay = $('#timer');
    images.getImages();
    this.timerDisplay.hide();
    this.stopResetBtn.hide();

    this.bindEvents();
    console.log('game starting...');
  }
// ============================================================================
  bindEvents() {
    $('button').off();
    this.stage.off();
    this.stage.on('click', '.image', this.update.bind(this));
    this.difficultyBtn.on('click', this.start.bind(this));
    this.playAgainBtn.on('click', this.playAgain.bind(this));
    this.stopResetBtn.on('click', this.stopReset.bind(this));
  }
// ============================================================================
  checkForMatch() {
    let src1 = images.flipped[0].src;
    let src2 = images.flipped[1].src;
    let id1 = images.flipped[0].id;
    let id2 = images.flipped[1].id;

    // if images are not a match
    if (images.flipped[0].src !== images.flipped[1].src) {
      // disable clicking more images until compared ones flip over
      $('.image').addClass('disabledbutton');
      // give the user a brief chance to see the images before flipping them
      // back over
      setTimeout(function(){
        // re-enable image clicking
        $('.image').removeClass('disabledbutton');
        $(`#${id1}`).removeClass('visible');
        $(`#${id2}`).removeClass('visible');
      }, 500);

    } else {  // if images are a match
              // make them unclickable
      $(`#${id1}`).addClass('matched');
      $(`#${id2}`).addClass('matched');
      images.matched++;
      if (images.matched === this.difficulty) {
        // you win
        timer.stop();
        timer.compare();
        this.win = true;
        this.gameOver();
      }
    }

    images.flippedCount = 0;
    images.flipped = [];
  }
// ============================================================================
  gameOver() {
    if (this.win === true) {
      $('.message').text('You Win!');
      $('#stop-reset-btn').attr('disabled', 'true');
    }
    $('#play-again').show();
  }
// ============================================================================
  playAgain(event) {
    let btnID = event.target.id;
    switch (btnID) {
      case 'yes':
        $('#play-again').hide();
        this.reset();
        this.setupStageAndValues();
        timer.resetCurrent();
        $('#stop-reset-btn').text("Reset");
        $('#stop-reset-btn').removeAttr('disabled');
        break;
      case 'no':
        $('#play-again').hide();
        $('#stop-reset-btn').hide();
        this.stage.remove();
        $('main .container').append('<p class="message" id="thanks" style="padding-top:0">Thanks for  playing!</h2>');
        break;
    }
  }
// reset ======================================================================
  reset() {
    images.random = [];
    images.shuffled = [];
    images.flippedCount = 0;
    images.flipped = [];
    images.matched = 0;
    this.win = false;
    this.firstClick = true;
    this.stage.empty();
  }
// setActiveBtnColor ==========================================================
  setActiveBtnColor(btnID) {
    this.difficultyBtn.removeClass('active');
    $(`#${btnID}`).addClass('active');
  }
// setDifficulty ==============================================================
  setDifficulty(btnID) {
    switch (btnID) {
      case 'easy':
        this.difficulty = 6;
        this.cols = 4;
        break;
      case 'medium':
        this.difficulty = 12;
        this.cols = 4;
        break;
      case 'hard':
        this.difficulty = 20;
        this.cols = 5;
        break;
      // case 'debug':
      //   this.difficulty = 1;
      //   this.cols = 2;
      //   break;
      default :
        console.log('Something went wrong');
    }
  }
// setupGrid ==================================================================
  setupGrid(cols) {
    this.stage.css({
      'grid-template-columns' : 'repeat(' + cols + ', minmax(45px, 100px))',
      'padding': '30px 0 60px'
    });
  }
// setupImageTagsinStage ======================================================
  setupImageTagsinStage() {
    for (let i = 0; i < this.difficulty*2; i++) {
      this.stage.append('<div class="img-container"><img class="image"></img></div>');
    }
  }
// setupStageAndValues ========================================================
  setupStageAndValues() {
    this.setupGrid(this.cols);
    images.randomImagesToArray(this.difficulty);
    this.setupImageTagsinStage();
    images.shuffleImgs();
    images.setTagValues();
    this.timerDisplay.show();
  }
// start ======================================================================
  start(event) {
    debugger;
    this.rules.hide(); // TODO move this to another function or rename this one?

    let btnID = event.target.id;
    // if grid exists, clear stage children before setting new grid
    if (images.random !== []) {
      this.reset();
    }

    this.setDifficulty(btnID);
    this.setActiveBtnColor(btnID);
    this.setupStageAndValues();
    this.stopResetBtn.show();
    this.difficultyBtn.attr('disabled', 'true');
  }
// stopReset ==================================================================
  stopReset() {
    timer.stop();
    if (this.stopResetBtn.text() === "Stop") {
      this.stopResetBtn.text('Reset');
    } else {
      timer.resetBest();
      timer.resetCurrent();
      this.reset();
      this.difficultyBtn.removeAttr('disabled');
    }
  }
// update =====================================================================
  update(event) {
   let id = event.target.id;
   if (this.firstClick) {
    // start timer
    timer.interval = setInterval(timer.start, 10);
    this.firstClick = false;
    if (this.stopResetBtn.text() === 'Stop') {
      this.stopResetBtn.text('Reset');
    } else {
      this.stopResetBtn.text('Stop');
    }
   }
   // proceed only if clicked image isn't already matched
   if (!$(`#${id}`).hasClass('matched')) {
    if (images.flippedCount < 2) {
      $(`#${id}`).addClass('visible');

      let src = $(`#${id}`).attr('src');

      // check if user is clicking the same image
      if (images.flipped.length !== 0 && images.flipped[0].id === id) {
        return;
      } else {
        images.flipped.push({id : id, src : src});
        images.flippedCount++;
      }
     }
    }
    if (images.flippedCount === 2) {
     this.checkForMatch();
    }
  }
}

export default Game;
