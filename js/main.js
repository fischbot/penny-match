'use strict';
$(function() {
  var difficulty = 0;
  var imagePool = [];
  var randomImgs = [];
  var stagedImgs = [];
  var shuffledImages = [];
  var totalImages = 27;
  var flippedCount = 0;
  var flippedImages = [];
  var $stage = $('#stage');
  var matched = 0;

// note to self: this delegates so images created later with jquery can be clicked
  $stage.on('click', '.image', function(event) {
    event.preventDefault();

    if (flippedCount < 2) {
      $(this).addClass('visible');
      var id = this.id;
      var src = $(this).attr('src');
      flippedImages.push({id : id, src : src});
      flippedCount++;
    }

    if (flippedCount === 2) {
      checkForMatch();
    }
    // after 2 images are flipped check to see if they match
    // if yes, leave them flipped
    // if no, flip them back
  });

  function checkForMatch() {
    // TODO refactor
    var src1 = flippedImages[0].src;
    var src2 = flippedImages[1].src;
    var id1 = flippedImages[0].id.toString();
    var id2 = flippedImages[1].id;

    // if images are not a match
    if (flippedImages[0].src !== flippedImages[1].src) {

      // give the user a brief chance to see the images before flipping them
      // back over
      setTimeout(function(){
        // TODO animate this action
        $(`#${id1}`).removeClass('visible');
        $(`#${id2}`).removeClass('visible');
      }, 1000);

    } else {  // if images are a match
        // leave images flipped over
        matched++;
        if (matched === difficulty) {
          // game over - you win
        }

    flippedCount = 0;
    flippedImages = [];
  }

  // set difficulty
  $('#easy-btn').on('click', function() {
    // match 6 images
    difficulty = 6;

    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $stage.empty();
    }
    setupGrid(4, 3);
    randomImagesToArray(difficulty);
    // console.log(`randomImgs assigned: ${randomImgs.sort()}`);
    setupImagesTagsinStage();
    shuffleImgs();
    setImgTagValues();
  });

  $('#medium-btn').on('click', function() {
    // match 12 images
    difficulty = 12;
    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $stage.empty();
    }
    setupGrid(4, 6);
    randomImagesToArray(difficulty);
    setupImagesTagsinStage();
    shuffleImgs();
    setImgTagSrcs();
  });

  $('#hard-btn').on('click', function() {
    // match 24 images
    difficulty = 18;
    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $stage.empty();
    }
    setupGrid(6, 6);
    randomImagesToArray(difficulty);
    setupImagesTagsinStage();
    shuffleImgs();
    setImgTagSrcs();
  });

  function shuffleImgs() {
    var imgs = Array.from(randomImgs);
    shuffledImages = imgs.shuffle();
  }

  // insert imgs from randomImgs into img tags
  function setImgTagValues() {
    for (var i = 0; i < shuffledImages.length; i++) {
      // $('.image').eq(i).attr('src', shuffledImages[i]);
      $('.image').eq(i).attr({'src': shuffledImages[i], 'id' : i});
    }
  }

  function setImgId() {
    for (var i = 0; i < shuffledImages.length; i++) {
      $('.image').eq(i).attr('id', i);
    }
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

// set stage grid rows + cols based on difficulty setting
  function setupGrid(cols, rows) {
    $stage.css({
      'grid-template-columns' : 'repeat(' + cols + ', 1fr)',
      'grid-template-rows' : 'repeat(' + rows + ', 1fr)'
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
