let setting = {
  easy : function() {
    game.difficulty = 6;
    game.cols = 4;
  },
  medium : function() {
      game.difficulty = 12;
      game.cols = 4;
  },
  hard : function() {
      game.difficulty = 20;
      game.cols = 5;
  },
  debug : function() {
      game.difficulty = 1;
      game.cols = 2;
  }
};
