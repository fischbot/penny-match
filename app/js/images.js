const images = {
  total : 60,
  pool : [],
  random : [],
  shuffled : [],
  flipped : [],
  flippedCount : 0,
  matched : 0,
  shuffleImgs : function() {
    let imgs = Array.from(this.random);
    this.shuffled = imgs.shuffle();
    this.random = null;
  },
  setTagValues : function() {
    this.shuffled.forEach(function(image, i) {
      $('.image').eq(i).attr({'src': image, 'id' : i});
    });
  },
  getImages() {
    let imageFolder = 'https://robotspacefish.github.io/penny-match/img/';
    let imgsrc = '';

    for (let i = 1; i <= this.total; i++ ) {
      imgsrc = imageFolder + i + '.jpg';
      this.pool.push(imgsrc);
    }
  },
  randomImagesToArray : function() {
    let imgs = [];
    for (let i = 0; i < this.difficulty; i++) {
      let img = this.randomImgFromPool();
      // check to make sure randomImgs doesn't already contain the image
      while (imgs.indexOf(img) !== -1) {
        img = this.randomImgFromPool();
      }
      imgs.push(img);
    }
    this.doubleImagesInArray(imgs);
  },
  doubleImagesInArray : function(imgs) {
    this.random = imgs.concat(imgs);
  },
  randomImgFromPool : function() {
    // get a random image from the image pool
    return this.pool[Math.floor(Math.random() * (this.total - 1) + 1)];
  }
};

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

export default images;
