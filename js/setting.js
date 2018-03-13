let setting = {
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
