let game = {
  difficulty : 0,
  cols : 0,
  win : false,
  firstClick : true,
// ============================================================================
  bindEvents : function() {
    $stage.on('click', '.image', this.update.bind(this));
    $('.difficulty-btn').on('click', this.start.bind(this));
    $('.play-again-btn').on('click', this.playAgain.bind(this));
  },
// ============================================================================
  init : function() {
    this.bindEvents();
    images.getImages();
    $('#timer').hide();
    $('#stop-reset-btn').hide();
  },
// ============================================================================
  checkForMatch : function() { // TODO refactor
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
  },
// ============================================================================
  gameOver : function() {
    if (this.win === true) {
      $('.message').text('You Win!');
      $('#stop-reset-btn').attr('disabled', 'true');
    }
    $('#play-again').show();
  },
// ============================================================================
  playAgain : function(event) {
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
        $stage.remove();
        $('main .container').append('<p class="message" id="thanks" style="padding-top:0">Thanks for  playing!</h2>');
        break;
    }

  },
// ============================================================================
  reset : function() {
    images.random = [];
    images.shuffled = [];
    images.flippedCount = 0;
    images.flipped = [];
    images.matched = 0;
    this.win = false;
    this.firstClick = true;
    $stage.empty();
  },
// ============================================================================
  setActiveBtnColor : function(btnID) {
    $('.difficulty-btn').removeClass('active');
    $(`#${btnID}`).addClass('active');
  },
// ============================================================================
  setDifficulty : function(btnID) {
    switch (btnID) {
      case 'easy':
        setting.easy();
        break;
      case 'medium':
        setting.medium();
        break;
      case 'hard':
        setting.hard();
        break;
      case 'debug':
        setting.debug();
        break;
      default :
        console.log('Something went wrong');
    }
  },
// ============================================================================
  start : function(event) {
    $rules.hide(); // TODO move this to another function or rename this one?

    let btnID = event.target.id;
    // if grid exists, clear stage children before setting new grid
    if (images.random !== []) {
      this.reset();
    }

    this.setDifficulty(btnID);
    this.setActiveBtnColor(btnID);
    this.setupStageAndValues();
    $('#stop-reset-btn').show();
    $('.difficulty-btn').attr('disabled', 'true');
  },
// ============================================================================
  setupGrid : function(cols) {
    $stage.css({
      'grid-template-columns' : 'repeat(' + cols + ', minmax(45px, 100px))',
      'padding': '30px 0 60px'
    });
  },
// ============================================================================
  setupImageTagsinStage : function() {
    for (let i = 0; i < this.difficulty*2; i++) {
      $stage.append('<div class="img-container"><img class="image"></img></div>');
    }
  },
// ============================================================================
  setupStageAndValues : function() {
    this.setupGrid(this.cols);
    images.randomImagesToArray(this.difficulty);
    this.setupImageTagsinStage();
    images.shuffleImgs();
    images.setTagValues();
    $('#timer').show();
  },
// ============================================================================
  update : function(event) {
   let id = event.target.id;
   if (game.firstClick) {
    // start timer
    timer.t = setInterval(timer.start, 100);
    this.firstClick = false;
    if ($('#stop-reset-btn').text() === 'Stop') {
      $('#stop-reset-btn').text('Reset');
    } else {
      $('#stop-reset-btn').text('Stop');
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
     game.checkForMatch();
    }
  },
};
