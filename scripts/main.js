var canvas;
var stage;
var screen_width;
var screen_height;
var bmpAnimation;
var bmpAnimationIdle;
var numberOfImagesLoaded = 0;
var imgMonsterARun = new Image();
var imgMonsterAIdle = new Image();
var skyImage=new Image();
var KEYCODE_SPACE = 32;
var KEYCODE_UP = 38;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_W = 87;
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var die = false;
var jump = false;
var isGround = true;
var move = false;
var BounceHeight = 0.20;
var BounceRate = 3.0;
var BounceSync = -0.75;
var gem = true;
var points=0;
var text;
var displayPoint;
var move=false;
var brickCloned;
function init() {
    canvas = document.getElementById("testCanvas");
    imgMonsterARun.onload = handleImageLoad;
    imgMonsterARun.onerror = handleImageError;
    imgMonsterARun.src = "img/Player.png";
    skyImage.onload = handleImageLoad;
    skyImage.onerror = handleImageError;
    skyImage.src = "img/MCM_8281.jpg";
    }

function handleImageLoad(e) {
    numberOfImagesLoaded++;
    if (numberOfImagesLoaded == 1) {
        numberOfImagesLoaded = 0;
        startGame();
    }
}

function reset() {
    points=0;
    text.text="Points :"+points;
    die = false;
    isGround = true;
    stage.removeAllChildren();
    createjs.Ticker.removeAllListeners();
    stage.update();
}

function startGame() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    stage = new createjs.Stage(canvas);
    screen_width = canvas.width;
    screen_height = canvas.height;
    var spriteSheet = new createjs.SpriteSheet({
        images: [imgMonsterARun],
        //width, height & registration point of each sprite
        frames: {width: 64, height: 64, regX: 32, regY: 32},
        animations: {
            walk: [0, 9, "walk", 5],
            die: [11, 21, false, 6],
            jump: [22, 28, 10],
            jumpMiddle: [28, 28, 300],
            jumpDown: [28, 33, "walk", 10],
            celebrate: [33, 43],
            idle: [44, 44]
        }
    });
    createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);
    sky = new createjs.Bitmap("img/moofpaper-1600x1200.png");
    sky.regX = sky.frameWidth / 2 | 0;
    sky.regY = sky.frameWidth / 2 | 0;
    stage.addChild(sky);
    bmpAnimation = new createjs.BitmapAnimation(spriteSheet);
    bmpAnimation.regX = 0;
    bmpAnimation.regY = -120;
    bmpAnimation.gotoAndPlay("idle"); //walking from left to right
    bmpAnimation.name = "player1";
    bmpAnimation.direction = 90;
    bmpAnimation.vX = 0;
    bmpAnimation.vY = 0;
    bmpAnimation.x = 16;
    bmpAnimation.y = 32;
    bmpAnimation.currentFrame = 0;
    stage.addChild(bmpAnimation);
    spikeOne = new createjs.Bitmap('img/head.png');
    spikeOne.regX = 0;
    spikeOne.regY = -160;
    spikeOne.x = 182;
    stage.addChild(spikeOne);
    spikeThree = new createjs.Bitmap('img/head.png');
    spikeThree.regX = 0;
    spikeThree.regY = -160;
    spikeThree.x = 680;
    stage.addChild(spikeThree);
    gem = new createjs.Bitmap("img/Gem.png");
    gem.regX = bmpAnimation.regX;
    gem.regY = bmpAnimation.regY + 26;
    gem.x = 82;
    stage.addChild(gem);
    gem1 = new createjs.Bitmap("img/Gem.png");
    gem2 = new createjs.Bitmap("img/Gem.png");
    bmpbrick = new createjs.Bitmap("img/Tiles/BlockA0.png");
    bmpbrick.regX = bmpbrick.frameWidth / 2 | 0;
    bmpbrick.regY = bmpAnimation.regY - 32;
    bmpbrick.vX=1;
    // Taking the same tile all over the width of the game
    for (var i = 0; i < 9; i++) {
        // clone the original tile, so we don't need to set shared properties:
         brickCloned = bmpbrick.clone();
        brickCloned.vX=1;
        // set display properties:
        brickCloned.x = 0 + (i * 40);
        brickCloned.y = bmpAnimation.y;
        // add to the display list:
        stage.addChild(brickCloned);
    }
    bmpbrick1 = new createjs.Bitmap("img/Tiles/BlockA0.png");
    bmpbrick1.regX = bmpbrick.frameWidth / 2 | 0;
    bmpbrick1.regY = bmpAnimation.regY - 32;
    // Taking the same tile all over the width of the game
    for (var i = 0; i < 4; i++) {
        // clone the original tile, so we don't need to set shared properties:
         var brickCloned2 = bmpbrick1.clone();
        // set display properties:
        brickCloned2.x = 390 + (i * 40);
        brickCloned2.y = bmpAnimation.y;
        // add to the display list:
        stage.addChild(brickCloned2);
    }
    bmpbrick2 = new createjs.Bitmap("img/Tiles/BlockA0.png");
    bmpbrick2.regX = bmpbrick.frameWidth / 2 | 0;
    bmpbrick2.regY = bmpAnimation.regY - 32;
    // Taking the same tile all over the width of the game
    for (var i = 0; i < 10; i++) {
        // clone the original tile, so we don't need to set shared properties:
         var brickCloned1 = bmpbrick2.clone();
        // set display properties:
        brickCloned1.x = 570 + (i * 40);
        brickCloned1.y = bmpAnimation.y;
        // add to the display list:
        stage.addChild(brickCloned1);
    }
    text = new createjs.Text("Points: " + points, "20px Arial", "black"); 
    text.x = 0; 
    text.y=0;
    stage.addChild(text);
    createjs.Ticker.addListener(this);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}

function handleImageError(e) {
    console.log("Error Loading Image : " + e.target.src);
}

function tick(e) {
   if ( bmpAnimation.x > canvas.width*.3 && !move) {
        sky.x = -bmpAnimation.x + canvas.width*.3;
    }
//    if ( bmpAnimation.x > canvas.width*.3 && !move) {
//        sky.x -= 1;
//        sky.vX=1;
//        bmpAnimation.vX=0;
//        spikeThree.x-=1;
//        spikeThree.vX=1;
//        if(spikeThree.x<16){
//            spikeThree.x=800;
//            spikeThree.vX=1;
//        }
//        console.log(sky.x);
//        if(sky.x==-800){
//           sky.x=-400; 
//           
//        }
//    }
    if(bmpAnimation.x > 0 && move){
        sky.x = -bmpAnimation.x + 0;
        stage.removeChild(spikeThree);
    }
    if (bmpAnimation.x >= screen_width - 16) {
        stage.removeChild(spikeThree);
        gem=false;
        gem2.regX = bmpAnimation.regX;
        gem2.regY = bmpAnimation.regY + 26;
        gem2.x += Math.floor((Math.random() * 200) + 50);
        spikeOne.x+=Math.floor((Math.random() * 200) + 100);
        if(spikeOne.x >=380 && spikeOne.x<=395 || spikeOne.x >=550 && spikeOne.x<=585 ){
           spikeOne.x+=Math.floor((Math.random() * 200) + 150); 
        }
        if(spikeOne.x>=screen_width - 16){
            spikeOne.x=52;
        }
        if(gem2.x>=screen_width - 16){
            gem2.x=25;
        }
        spikeThree.x=890;
        spikeOne.y=-2;
        stage.addChild(gem2);
        stage.addChild(spikeOne);
        stage.removeChild(spikeThree);
        // We've reached the right side of our screen
        // We need to walk left now to go back to our initial position
        bmpAnimation.x = 0;
        move=true;
        bmpAnimation.gotoAndPlay("walk")
    }
    if (bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        bmpAnimation.direction = 90;
        bmpAnimation.gotoAndPlay("walk_h");
    }
    if (bmpAnimation.direction == 90) {
        bmpAnimation.x += bmpAnimation.vX;
        bmpAnimation.y += bmpAnimation.vY;
    }
    else {
        bmpAnimation.x -= bmpAnimation.vX;
        bmpAnimation.y -= bmpAnimation.vY;
    }
    if (bmpAnimation.x > 380 && bmpAnimation.x < 390 && !die && isGround || bmpAnimation.x > 550 && bmpAnimation.x < 565 && !die && isGround) {
        die = true;
        bmpAnimation.gotoAndStop("walk_h");
        bmpAnimation.vX = 0;
        bmpAnimation.gotoAndStop("walk");
        if (bmpAnimation.direction == 90) {
            bmpAnimation.gotoAndPlay("die");
            bmpAnimation.vY = 1;
            setTimeout(function() {
            bmpAnimation.gotoAndPlay("die");
            reset();
        }, 1000);
        }
        if (bmpAnimation.direction == -90) {
            bmpAnimation.gotoAndPlay("die");
            bmpAnimation.vY = -1;
            setTimeout(function() {
            bmpAnimation.gotoAndPlay("die");
            reset();
        }, 1000);
    }

}
    if (bmpAnimation.x > (spikeOne.x+5) && bmpAnimation.x < (spikeOne.x + 20) && !die && isGround || bmpAnimation.x > (spikeThree.x +5) && bmpAnimation.x < (spikeThree.x + 20) && !die && isGround) {
            die = true;
//        bmpAnimation.gotoAndStop("walk_h");
//        bmpAnimation.vX = 0;
//        bmpAnimation.gotoAndStop("walk");
        if (bmpAnimation.direction == 90) {
            bmpAnimation.vX = 0;
            bmpAnimation.gotoAndPlay("die_h");
            bmpAnimation.vY = 0;
        }
        if (bmpAnimation.direction == -90) {
            bmpAnimation.vX = 0;
            bmpAnimation.gotoAndPlay("die");
            bmpAnimation.vY = 0;
        }

        setTimeout(function() {
//            stage.removeChild(bmpAnimation);
//            bmpAnimation.gotoAndPlay("die");
            reset();
        }, 1000);
    }

    isGround = true;
    if (!gem) {
        points+=30;
        gem = true;
        gem1.regX = bmpAnimation.regX;
        gem1.regY = bmpAnimation.regY + 26;
        gem1.x += Math.floor((Math.random() * 200) + 50);
        text.text="Points :"+(points);
        stage.addChild(gem1);
    }
    if(bmpAnimation.x >(spikeOne.x+30) && bmpAnimation.x <(spikeOne.x+32) || bmpAnimation.x >(spikeThree.x+30) && bmpAnimation.x <(spikeThree.x+32)  ){
    isGround=true;
    points+=20;
    text.text="Points :"+(points); 
    }
    stage.update(e);
}

function handleKeyDown(e) {
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_A:
        case KEYCODE_LEFT:
            bmpAnimation.gotoAndPlay("walk");
            bmpAnimation.direction = -90;
            bmpAnimation.vX = 1;
            bmpAnimation.vY = 0;
            bmpAnimation.x -= bmpAnimation.vX;
            bmpAnimation.y -= bmpAnimation.vY;
            break;
        case KEYCODE_D:
        case KEYCODE_RIGHT:
            bmpAnimation.gotoAndPlay("walk_h");
            bmpAnimation.direction = 90;
            bmpAnimation.vX = 1;
            bmpAnimation.vY = 0;
            bmpAnimation.x += bmpAnimation.vX;
            bmpAnimation.y += bmpAnimation.vY;
            bmpAnimation.isInIdleMode = false;
            break;
    }
}

function handleKeyUp(e) {
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case  KEYCODE_SPACE:
        case KEYCODE_W:
            isGround = false;
            if (bmpAnimation.direction === 90) {
                bmpAnimation.gotoAndStop("walk_h");
                bmpAnimation.gotoAndPlay("jump_h");
                bmpAnimation.gotoAndPlay("jumpDown_h");
                bmpAnimation.direction = 90;
                bmpAnimation.vX = 1;
                bmpAnimation.vY = 0;
                bmpAnimation.x += 30;
                bmpAnimation.y -= 0;
               
                if ((bmpAnimation.x +30) > 380 && (bmpAnimation.x +30) < 390 || bmpAnimation.x +30 > 565 && (bmpAnimation.x+30) < 570) {
                    isGround = true;
                    tick();
                }

                if (bmpAnimation.x > gem.x && bmpAnimation.x < (gem.x + 34) || bmpAnimation.x +30 > gem1.x && bmpAnimation.x < (gem1.x + 34) || bmpAnimation.x +30 > gem2.x && bmpAnimation.x < (gem2.x + 34)) {
                    stage.removeChild(gem);
                    stage.removeChild(gem2);
                    gem = false;
                    tick();
                }
                if ((bmpAnimation.x +30) > (spikeOne.x+5) && (bmpAnimation.x+30) < (spikeOne.x + 20) || bmpAnimation.x +30 > (spikeThree.x+5) && (bmpAnimation.x+30) < (spikeThree.x + 20)) {
                    isGround = true;
                    tick();
                }
                
            }
            else {
                bmpAnimation.gotoAndStop("walk");
                bmpAnimation.gotoAndPlay("jump");
                bmpAnimation.gotoAndPlay("jumpDown");
                bmpAnimation.direction = -90;
                bmpAnimation.vX = 1;
                bmpAnimation.vY = 0;
                bmpAnimation.x -= 30;
                bmpAnimation.y -= 0;
                if ((bmpAnimation.x+30) > 380 && (bmpAnimation.x+30) < 389 || (bmpAnimation.x+30) > 562 && (bmpAnimation.x+30) < 570) {
                    isGround = true;
                    tick();
                }
               if (bmpAnimation.x > gem.x && (bmpAnimation.x+30) < (gem.x + 32) || bmpAnimation.x > gem1.x && (bmpAnimation.x+30) < (gem1.x + 34)|| bmpAnimation.x +30 > gem2.x && bmpAnimation.x < (gem2.x + 34)) {
                    stage.removeChild(gem);
                    gem = false;
                    tick();
                }
                if ((bmpAnimation.x+30) > spikeOne.x && (bmpAnimation.x+30) < (spikeOne.x + 28) || (bmpAnimation.x+30) > spikeThree.x && (bmpAnimation.x+30) < (spikeThree.x + 28)) {
                    isGround = true;
                    tick();
                }
            }
            tick();
    }
}

 