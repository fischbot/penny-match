let game = {
  difficulty : 0,
  cols : 0,
  win : false,
  firstClick : true,
  setupGrid : function(cols) {
   $stage.css({
     'grid-template-columns' : 'repeat(' + cols + ', minmax(45px, 100px))',
   });
 },
 setupImageTagsinStage : function() {
   for (let i = 0; i < this.difficulty*2; i++) {
     $stage.append('<div class="img-container"><img class="image"></img></div>');
   }
 },
 setupStageAndValues : function() {
   this.setupGrid(this.cols);
   images.randomImagesToArray(this.difficulty);
   this.setupImageTagsinStage();
   images.shuffleImgs();
   images.setTagValues();
 },
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
 gameOver : function() {
   if (this.win === true) {
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
   this.win = false;
   this.firstClick = true;
   $stage.empty();
 },
 bindEvents : function() {
   $stage.on('click', '.image', this.start.bind(this));
   $('.difficulty-btn').on('click', this.setDifficulty.bind(this));
   $('.play-again-btn').on('click', this.playAgain.bind(this));
 },
 init : function() {
   // TODO
   this.bindEvents();
   images.getImages();
 },
 start : function(event) {
  //  debugger;
  event.preventDefault();
  let id = event.target.id;
  if (game.firstClick) {
   // start timer
   timer.t = setInterval(timer.start, 100);
   game.firstClick = false;
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
setDifficulty : function(event) { // TODO break up this function
  $rules.hide(); // TODO move this to another function or rename this one?
  let btnID = event.target.id;

  // if grid exists, clear stage children before setting new grid
  if (images.random !== []) {
    this.resetAll();
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

  game.setupStageAndValues(); // TODO move out of this function
},
playAgain : function(event) {
  let btnID = event.target.id;
  switch (btnID) {
    case 'yes':
      $('.difficulty-btn').removeAttr('disabled');
      $('#play-again').hide();
      this.resetAll();
      this.setupStageAndValues();
      timer.resetCurrent();
      break;
    case 'no':
      $('#play-again').hide();
      $stage.remove();
      $('main .container').append('<p class="message" style="padding-top:0">Thanks for playing!</h2>');
      $('.message').text('Thanks For Playing!');
      break;
  }
}
};
