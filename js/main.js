'use strict';
$(function() {
  var $stage = $('#stage');
  var $rules = $('#rules');
  var $difficultyBtn = $('.difficulty-btn');

  var images = {
    total : 27,
    pool : [],
    random : [],
    shuffled : [],
    flipped : [],
    flippedCount : 0,
    matched : 0,
    shuffleImgs : function() {
      var imgs = Array.from(images.random);
      images.shuffled = imgs.shuffle();
      images.random = null;
    },
    setTagValues : function() {
      for (var i = 0; i < images.shuffled.length; i++) {
        $('.image').eq(i).attr({'src': images.shuffled[i], 'id' : i});
      }
    },
    setId : function() {
      for (var i = 0; i < images.shuffled.length; i++) {
        $('.image').eq(i).attr('id', i);
      }
    },
    getImages() {
      var imageFolder = '../img/';
      var imgsrc = '';

      for (var i = 1; i <= images.total; i++ ) {
        imgsrc = imageFolder + i + '.png';
        images.pool.push(imgsrc);
      }
    },
    randomImagesToArray : function(difficulty) {
      var imgs = [];
      for (var i = 0; i < difficulty; i++) {
        var img = images.randomImgFromPool();
        // check to make sure randomImgs doesn't already contain the image
        while (imgs.indexOf(img) !== -1) {
          img = images.randomImgFromPool();
        }
        imgs.push(img);
      }
      images.doubleImagesInArray(imgs);
    },
    doubleImagesInArray : function(imgs) {
      images.random = imgs.concat(imgs);
    },
    randomImgFromPool : function() {
      // get a random image from the image pool
      return images.pool[Math.floor(Math.random() * (images.total - 1) + 1)];
    }
  };

  var game = {
    difficulty : 0,
    cols : 0,
    rows : 0,
    win : false,
    firstClick : true,
    setupGrid : function(cols, rows) {
     if ( $(window).width() < 500) {
       if (difficulty === 20) {
         cols -= 2;
         rows += 2;
       } else {
         cols--;
         rows++;
       }
     }
     $stage.css({
       'grid-template-columns' : 'repeat(' + cols + ', minmax(40px, 70px))',
       'grid-template-rows' : 'repeat(' + rows + ', minmax(40px, 70px))'
     });
   },
   setupImageTagsinStage : function() {
     for (var i = 0; i < game.difficulty*2; i++) {
       $stage.append('<div class="img-container"><img class="image"></img></div>');
     }
   },
   setupStageAndValues : function() {
     game.setupGrid(game.cols, game.rows);
     images.randomImagesToArray(game.difficulty);
     game.setupImageTagsinStage();
     images.shuffleImgs();
     images.setTagValues();
   },
   checkForMatch : function() {
     // TODO refactor
     var src1 = images.flipped[0].src;
     var src2 = images.flipped[1].src;
     var id1 = images.flipped[0].id;
     var id2 = images.flipped[1].id;

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
       if (images.matched === game.difficulty) {
         // you win
         timer.stop();
         timer.compare();
         game.win = true;
         game.gameOver();
       }
     }

     images.flippedCount = 0;
     images.flipped = [];
   },
   gameOver : function() {
     if (game.win === true) {
       $('.message').text('You Win!');
     }
     $('.difficulty-btn').attr('disabled', 'true');
     $('#play-again').show();
   },
   resetAll : function() {
     images.random = [];
     images.shuffled = [];
     images.flippedCount = 0;
     images.flipped = [];
     images.matched = 0;
     game.win = false;
     game.firstClick = true;
     $stage.empty();
   },
   bindEvents : function() {
     $stage.on('click', '.image', this.test.bind(this));

   },
   init : function() {
     // TODO
     this.bindEvents();
     images.getImages();
   },
   test : function(event) {
    event.preventDefault();
    let id = this.id;
    if (game.firstClick) {
     // start timer
     timer.t = setInterval(timer.start, 100);
     game.firstClick = false;
    }
    // proceed only if clicked image isn't already matched
    if (!$(`#${id}`).hasClass('matched')) {
     if (images.flippedCount < 2) {
       $(this).addClass('visible');

       let src = $(this).attr('src');

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
   }
  };

  var setting = {
    easy : function() {
      game.difficulty = 6;
      game.cols = 4;
      game.rows = 3;
    },
    medium : function() {
        game.difficulty = 12;
        game.cols = 4;
        game.rows = 6;
    },
    hard : function() {
        game.difficulty = 20;
        // TODO set cols and rows based on a changing amount of images
        game.cols = 5;
        game.rows = 8;
    },
    debug : function() {
        game.difficulty = 1;
        game.cols = 2;
        game.rows = 1;
    }
  };

  var timer = {
    t : null, // stores timer so it can be stopped
    time : 0,
    bestTime : '00:00:00',
    currentTime : '',
    $current : $('#current'),
    $best : $('#best'), // TODO not working
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

// note to self: this delegates so images created later with jquery can be clicked
  $stage.on('click', '.image', function(event) {
    event.preventDefault();
    var id = this.id;
    if (game.firstClick) {
      // start timer
      timer.t = setInterval(timer.start, 100);
      game.firstClick = false;
    }
    // proceed only if clicked image isn't already matched
    if (!$(`#${id}`).hasClass('matched')) {
      if (images.flippedCount < 2) {
        $(this).addClass('visible');

        var src = $(this).attr('src');

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
  });

// DIFFICULTY BUTTON
  $('.difficulty-btn').on('click', function(evt) {
    $rules.hide();

    var btnID = evt.target.id;

    // if grid exists, clear stage children before setting new grid
    if (images.random !== []) {
      game.resetAll();
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

    game.setupStageAndValues();
  });

  $('.play-again-btn').on('click', function(evt) {
    var btnID = evt.target.id;
    switch (btnID) {
      case 'yes':
        $('.difficulty-btn').removeAttr('disabled');
        $('#play-again').hide();
        game.resetAll();
        game.setupStageAndValues();
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

  game.init();
  // images.getImages();
});
