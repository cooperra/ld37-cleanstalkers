/// <reference path="phaser.comments.d.ts"/>
/// <reference path="Entity.ts"/>
/// <reference path="Waluigi.ts"/>
/// <reference path="DialogController.ts"/>

// Demonstrate the use of arrow keys in a Phaser app
// This application demonstrates creation of a Cursor and polling for input
class SimpleGame {
    game: Phaser.Game;
    cursors: Phaser.CursorKeys;

    // Sprites
    bgSprite: Phaser.Sprite;
    waluigi: Entity;
    fridge: Entity;
    nightstand: Entity;
    windowSprite: Phaser.Sprite;
    fullscreenGroup: Phaser.Group;
    fullscreenSprite: Phaser.Sprite;
    fullscreenText: Phaser.Text;

    constructor() {
        this.game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'content', {
            create: this.create, preload: this.preload,
        update: this.update});
    }

    preload() {
        var loader = this.game.load.image("bgroom", "assets/bg.jpg");
	var loader = this.game.load.image("waluigi", "assets/waluigi.png");
	var loader = this.game.load.image("fridge", "assets/fridge.png");
	var loader = this.game.load.image("fridge-open", "assets/fridge-open.png");
	var loader = this.game.load.image("nightstand", "assets/nightstand.png");
	var loader = this.game.load.image("nightstand-open", "assets/nightstand-open.png");
	var loader = this.game.load.image("bookcase1", "assets/bookcase1.png");
	function l(thiss:any, name: string) {
	    var loader = thiss.game.load.image(name, "assets/"+name+".png");
	}
	l(this,"bookcase2");
	l(this,"bookcase3");
	l(this,"dadsheet");
	l(this,"gregsheet");
	l(this,"momsheet");
	l(this,"phone");
	l(this,"phone-ring");
	l(this,"cat");
	l(this,"cat-sleep");
	l(this,"changing");
	l(this,"changing-open");
	l(this,"drip1");
	l(this,"drip2");
	l(this,"drip3");
	l(this,"laundry");
	l(this,"mop");
	l(this,"puddle1");
	l(this,"puddle2");
	l(this,"puddle3");
	l(this,"puddle4");
	l(this,"safe");
	l(this,"safe-open");
	l(this,"switches");
	l(this,"trash");
	l(this,"bee");
	l(this,"bed-case");
	l(this,"bed-case-open");
	l(this,"logo");
	
	var loader = this.game.load.image("window", "assets/window.png");
	var loader = this.game.load.image("fullscreen", "assets/fullscreen.png");
	var loader = this.game.load.text("script", "dialog/LudumDare37.txt");
	var loader = this.game.load.text("script-annotations", "dialog/key.txt");
    }

    create() {
        var image = this.game.cache.getImage("bgroom");
        this.bgSprite = this.game.add.sprite(
            this.game.width / 2 - image.width / 2,
            this.game.height / 2 - image.height / 2,
            "bgroom");
	
        // var image = this.game.cache.getImage("waluigi");
	// this.waluigi = newWaluigi(this.game, new Phaser.Point(
	//      this.game.width / 2 - image.width / 2,
        //      this.game.height / 2 - image.height / 2));
	
        var image = this.game.cache.getImage("fridge");
	this.fridge = newFridge(this.game, new Phaser.Point(
	     1180, 397));
	
        var image = this.game.cache.getImage("nightstand");
	this.nightstand = newNightstand(this.game, new Phaser.Point(
	    479, 329));
	
        var image = this.game.cache.getImage("window");
        this.windowSprite = this.game.add.sprite(
            756.5, 171.5,
            "window");

	function l(thiss:any, name: string, x?: number, y?: number, alt?: string) : Phaser.Sprite {
	    if (alt) {
		newContainer(thiss.game, new Phaser.Point(x, y), name, alt);
		return;
	    }
	    var image = thiss.game.cache.getImage(name);
	    var s = thiss.game.add.sprite(x || thiss.game.width / 2 - image.width / 2,
            y || thiss.game.height / 2 - image.height / 2,
					  name);
	    
	    draggify(s);
	    return s;
	}
	l(this,"laundry", 811.5, 725);
	l(this,"bookcase1", 1371.5, 335, "bookcase3");
	////l(this,"bookcase2", 1371.5, 335);
	//////l(this,"bookcase3", 1371.5, 335);
	////// l(this,"dadsheet");
	/////// l(this,"gregsheet");
	////// l(this,"momsheet");
	l(this,"phone", 616.5, 439, "phone-ring");
	//l(this,"phone-ring", 616.5, 409);
	l(this,"bed-case", 613.5, 404, "bed-case-open");
	//////l(this,"bed-case-open");
	//////l(this,"cat", 161.5, 409);
	l(this,"cat-sleep", 761.5, 459);
	l(this,"changing", 202.5, 387, "changing-open");
	//////l(this,"changing-open");
	//l(this,"drip1", 747, 88);//large
	//l(this,"drip2", 632, 92.5);//small
	//l(this,"drip3", 1285, 96);//medium
	l(this,"mop", 67.5, 746);
	//l(this,"puddle1", 1198, 785);// biggest
	//l(this,"puddle2", 576, 773.5);
	//l(this,"puddle3", 464.5, 917);
	//l(this,"puddle4", 7995, 916);//smallest
	l(this,"safe", 1504, 669.5, "safe-open");//1373, 611.5);
	///////l(this,"safe-open");
	l(this,"switches", 105, 641.5);
	l(this,"trash", 205.5, 750.5);
	l(this,"bee", 927, 357);

	var image = this.game.cache.getImage("fullscreen");
        this.fullscreenSprite = this.game.add.sprite(
            0,//this.game.width / 2 - image.width / 2,
            0,//this.game.height / 2 - image.height / 2,
            /*TODO"fullscreen"*/"bee");

	this.fullscreenText = this.game.add.text(40, 0, "toggle fullscreen", {font: "30px Arial", fill: "#777777", align: "left"});

	this.fullscreenGroup = this.game.add.group();
	this.fullscreenGroup.addMultiple([this.fullscreenSprite, this.fullscreenText]);

	let d = new DialogController(this.game);
	let blackbg = (()=>{
	    let gfx = new Phaser.Graphics(this.game);
	    gfx.beginFill(0x000000, 0.44);
	    gfx.drawRect(0,0,1920,1080);
	    gfx.endFill();
	    return new Phaser.Sprite(this.game, 0, 0, gfx.generateTexture());
	})();
	this.game.world.add(blackbg);
	let logo = l(this,"logo");
	this.game.input.onDown.addOnce(()=>{
	    blackbg.visible = false;
	    logo.visible = false;
	    d.beginSequence("START");
	});
	
	console.log(d);
	
        // create the cursor key object
        this.cursors = this.game.input.keyboard.createCursorKeys();
	
        // Add a function that will get called when the game goes fullscreen
        this.game.scale.onFullScreenChange.add(SimpleGame.prototype.onFullScreenChange, this);

        // Now add a function that will get called when user taps screen.
        // Function declared inline using arrow (=>) function expression
        // Simply calls startFullScreen().  True specifies you want anti aliasing.
	this.fullscreenGroup.setAll("inputEnabled", true);
        this.fullscreenGroup.forEach((e)=>{e.events.onInputDown.add(
	    // Toggle fullscreen
            () => {
                if (this.game.scale.isFullScreen) {
                    this.game.scale.stopFullScreen();
		} else {
                    this.game.scale.startFullScreen(true);
                }
            },
            this);}, this);

	//draggify(this.waluigi.sprite);//, ()=>{}, ()=>{});
	//draggify(this.fridgeSprite);
	draggify(this.windowSprite);// TODO dem imports of "fridge"
    }

    update() {
        // Update input state
        this.game.input.update();

        // Check each of the arrow keys and move accordingly
        // If the Ctrl Key + Left or Right arrow are pressed, move at a greater rate
        /*if (this.cursors.down.isDown)
            this.waluigi.sprite.position.y++;
        if (this.cursors.up.isDown)
            this.waluigi.sprite.position.y--;
        if (this.cursors.left.isDown) {
            if (this.cursors.left.ctrlKey)
                this.waluigi.sprite.position.x -= 10;
            else
                this.waluigi.sprite.position.x--;
        }
        if (this.cursors.right.isDown) {
            if (this.cursors.right.ctrlKey)
                this.waluigi.sprite.position.x += 10;
            else
                this.waluigi.sprite.position.x++;
        }*/
	
    }

    // This function is called when a full screen request comes in
    onFullScreenChange() {
        // tell Phaser how you want it to handle scaling when you go full screen
	// Choices: EXACT_FIT, NO_SCALE, SHOW_ALL
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        // and this causes it to actually do it
        this.game.scale.refresh();
    }
}

window.onload = () => {
    var game = new SimpleGame();
};

function draggify(sprite: Phaser.Sprite) {//, onGrab: any, onRelease: any) {
    // First enable the sprite to receive input
    sprite.inputEnabled = true;
    
    sprite.input.draggable = true;
    sprite.input.dragStopBlocksInputUp = true;

    sprite.input.dragDistanceThreshold = 5;//px
    //sprite.input.dragTimeThreshold = 100;//ms

    sprite.events.onInputUp.add(() => {
	//alert("Sprite clicked!"+ " x: " + sprite.x + " y: " + sprite.y);
    });

    sprite.events.onDragStop.add(() => {
	//alert("Sprite drag released!");
    });
}
