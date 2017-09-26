'use strict';
$(function() {
  var difficulty = 0;
  var imagePool = [];
  var randomImgs = [];
  var stagedImgs = [];
  var shuffledImages = [];
  var totalImages = 27;
  var flippedCount = 0;

// note to self: delegate so images created later with jquery can be clicked
  $('#stage').on('click', '.image', function(event) {
    event.preventDefault();
    console.log($(this)); /* debug */
    // show image when it's clicked
    $(this).css('opacity', 1);

    // after 2 images are flipped check to see if they match
    // if yes, leave them flipped
    // if no, flip them back
  });

  // set difficulty
  $('#easy-btn').click(function() {
    // match 6 images
    difficulty = 6;

    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $('#stage').empty();
    }
    setupGrid(4, 3);
    randomImagesToArray(difficulty);
    // console.log(`randomImgs assigned: ${randomImgs.sort()}`);
    setupImagesTagsinStage();
    shuffleImgs();
    setImgTagValues();
  });

  $('#medium-btn').click(function() {
    // match 12 images
    difficulty = 12;
    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $('#stage').empty();
    }
    setupGrid(4, 6);
    randomImagesToArray(difficulty);
    setupImagesTagsinStage();
    shuffleImgs();
    setImgTagSrcs();
  });

  $('#hard-btn').click(function() {
    // match 24 images
    difficulty = 18;
    // if grid exists, clear stage children before setting new grid
    if (randomImgs !== []) {
      $('#stage').empty();
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
    $('#stage').css({
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
        $('#stage').append('<div class="img-container"><img class="image"></img></div>');
    }
  }

  function randomImgFromPool() {
    // get a random image from the image pool
    return imagePool[Math.floor(Math.random() * (totalImages - 1) + 1)];
  }

  // TODO randomly assign images to grid

getImages();
});
