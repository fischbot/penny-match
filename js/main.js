'use strict';
$(function() {
  var difficulty = 0;
  var cols = 0;
  var rows = 0;
  var imagePool = [];
  var randomImgs = [];
  var shuffledImages = [];
  var totalImages = 27;
  var flippedCount = 0;
  var flippedImages = [];
  var matched = 0;
  var win = false;
  var firstClick = true;
  var $stage = $('#stage');
  var $rules = $('#rules');
  var $difficultyBtn = $('.difficulty-btn');

// note to self: this delegates so images created later with jquery can be clicked
  $stage.on('click', '.image', function(event) {
    // TODO refactor
    event.preventDefault();
    var id = this.id;
    if (firstClick) {
      // start timer
      timer.t = setInterval(timer.start, 100);
      firstClick = false;
    }
    // proceed only if clicked image isn't already matched
    if (!$(`#${id}`).hasClass('matched')) {
      if (flippedCount < 2) {
        $(this).addClass('visible');

        var src = $(this).attr('src');

        // check if user is clicking the same image
        if (flippedImages.length !== 0 && flippedImages[0].id === id) {
          return;
        } else {
          flippedImages.push({id : id, src : src});
          flippedCount++;
        }
      }
    }
    if (flippedCount === 2) {
      checkForMatch();
    }
  });

  var timer = {
    t : null, // stores timer so it can be stopped
    time : 0,
    bestTime : '00:00:00',
    currentTime : '',
    $current : $('#current'),
    start : function() {
        timer.time++;
        var mins = Math.floor(timer.time/10/60);
        var secs = Math.floor(timer.time/10);
        var tenths = timer.time % 10;

        if (mins < 10) {
          mins = '0' + mins;
        }
        if (secs < 10) {
          secs = '0' + secs;
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
      timer.bestTime = '';
      $('#best').text('00:00:00');
    }
  };

  function checkForMatch() {
    // TODO refactor
    var src1 = flippedImages[0].src;
    var src2 = flippedImages[1].src;
    var id1 = flippedImages[0].id;
    var id2 = flippedImages[1].id;

    // if images are not a match
    if (flippedImages[0].src !== flippedImages[1].src) {
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
      matched++;
      if (matched === difficulty) {
        // you win
        timer.stop();
        timer.compare();
        win = true;
        gameOver();
      }
    }

    flippedCount = 0;
    flippedImages = [];
  }

// DIFFICULTY BUTTON
  $('.difficulty-btn').on('click', function(evt) {
    $rules.hide();

    var btnID = evt.target.id;

    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $stage.empty();
    }

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

    // TODO refactor
    $('.difficulty-btn').removeClass('active');
    $(`#${btnID}`).addClass('active');

    setupStageAndValues();
  });

  function setupStageAndValues() {
    setupGrid(cols, rows);
    randomImagesToArray(difficulty);
    setupImagesTagsinStage();
    shuffleImgs();
    setImgTagValues();
  });

  function gameOver() {
    if (win === true) {
      $('.message').text('You Win!');
    }
    $('.difficulty-btn').attr('disabled', 'true');
    $('#play-again').show();
  }

  $('.play-again-btn').on('click', function(evt) {
    var btnID = evt.target.id;

    // TODO refactor removing class
    $('.difficulty-btn').removeClass('active');

    switch (btnID) {
      case 'yes':
        $('.difficulty-btn').removeAttr('disabled');
        $('#play-again').hide();
        resetAll();
        timer.resetCurrent();
        break;
      case 'no':
        $('#play-again').hide();
        $stage.remove();
        $('main .container').append('<p class="message" style="padding-top:0">Thanks for playing!</h2>');
        $('.message').text('Thanks For Playing!');
        break;
    }
  });

  function resetAll() {
    difficulty = 0;
    randomImgs = [];
    shuffledImages = [];
    flippedCount = 0;
    flippedImages = [];
    matched = 0;
    win = false;
    firstClick = true;
    $stage.empty();
  }

  var setting = {
    easy : function() {
      difficulty = 6;
      cols = 4;
      rows = 3;
    },
    medium : function() {
        difficulty = 12;
        cols = 4;
        rows = 6;
    },
    hard : function() {
        difficulty = 20;
        // TODO set cols and rows based on a changing amount of images
        cols = 5;
        rows = 8;
    },
    debug : function() {
        difficulty = 2;
        cols = 2;
        rows = 1;
    }
  };

  function shuffleImgs() {
    var imgs = Array.from(randomImgs);
    shuffledImages = imgs.shuffle();
    randomImgs = null;
  }

  // insert imgs from randomImgs into img tags
  function setImgTagValues() {
    for (var i = 0; i < shuffledImages.length; i++) {
      $('.image').eq(i).attr({'src': shuffledImages[i], 'id' : i});
    }
  }

  function setImgId() {
    for (var i = 0; i < shuffledImages.length; i++) {
      $('.image').eq(i).attr('id', i);
    }
  }

  // set stage grid rows + cols based on difficulty setting
  function setupGrid(cols, rows) {
    $stage.css({
      'grid-template-columns' : 'repeat(' + cols + ', 70px)',
      'grid-template-rows' : 'repeat(' + rows + ', 70px)'
    });
  }

  // get images from folder
  function getImages() {
    var imageFolder = '../img/';
    var imgsrc = '';

    for (var i = 1; i <= totalImages; i++ ) {
      imgsrc = imageFolder + i + '.png';
      imagePool.push(imgsrc);
    }
  }

  // pick amount of random images equal to difficulty from image pool
  // and store them in an array
  function randomImagesToArray(difficulty) {
    var imgs = [];
    for (var i = 0; i < difficulty; i++) {
      var img = randomImgFromPool();
      // check to make sure randomImgs doesn't already contain the image
      while (imgs.indexOf(img) !== -1) {
        img = randomImgFromPool();
      }
      imgs.push(img);
    }
    doubleImagesInArray(imgs);
  }

  // double the images so there's something to match to and store
  // in randomImgs array
  function doubleImagesInArray(imgs) {
    randomImgs = imgs.concat(imgs);
  }

  function setupImagesTagsinStage() {
    for (var i = 0; i < difficulty*2; i++) {
      $stage.append('<div class="img-container"><img class="image"></img></div>');
    }
  }

  function randomImgFromPool() {
    // get a random image from the image pool
    return imagePool[Math.floor(Math.random() * (totalImages - 1) + 1)];
  }

  // Fisher-Yates shuffle
  Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    while (--i > 0) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this[j];
      this[j] = this[i];
      this[i] = temp;
    }
    return this;
  }

getImages();
});
