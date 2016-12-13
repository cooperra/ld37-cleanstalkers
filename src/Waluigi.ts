/// <reference path="InputComponents.ts"/>

function newWaluigi(game: Phaser.Game, position: Phaser.Point): Entity {
    let sprite = game.add.sprite(position.x, position.y, "waluigi");
    
    let e = new Entity(game);
    e.addComponent(new SpriteComponent(e, sprite));
    e.addComponent(new DragComponent(e));
    e.addComponent(new ClickComponent(e, ()=>{window.alert("WAH")}));
    return e;
}

function newContainer(game: Phaser.Game, position: Phaser.Point, name: string, openname?: string): Entity {
    let sprite = game.add.sprite(position.x, position.y, name);
    
    let e = new Entity(game);
    e.addComponent(new SpriteComponent(e, sprite));
    e.addComponent(new DragComponent(e));
    e.addComponent(new ClickComponent(e/*, ()=>{window.alert("Sprite clicked!"+ " x: " + sprite.x + " y: " + sprite.y)}*/));
    e.addComponent(new OpenableComponent(e, name, openname || (name+"-open")));
    return e;
}

function newFridge(game: Phaser.Game, position: Phaser.Point): Entity {
    return newContainer(game, position, "fridge");
}

function newNightstand(game: Phaser.Game, position: Phaser.Point): Entity {
    return newContainer(game, position, "nightstand");
}

function newTextPane(game: Phaser.Game, x: number, y: number, w: number, h: number, text: string): Phaser.Group {
    return new TextPane(game, x, y, w, h, text);
}

class TextPane extends Phaser.Group {
    bg: Phaser.Sprite;
    text: Phaser.Text;
    portrait: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number, w: number, h: number, text: string) {
	super(game);
	let gfx = new Phaser.Graphics(game);
	gfx.beginFill(0x000000, 0.44);
	gfx.drawRect(0,0,w,h);
	gfx.endFill();
	
	this.bg = new Phaser.Sprite(game, x, y, gfx.generateTexture());
	this.text = new Phaser.Text(game, x, y, text, {font: "30px Arial", fill: "#AAAAFF", align: "left"});

	this.addMultiple([this.bg, this.text]);
    }

    setText(text: string) {
	this.text.text = text;
    }
}
