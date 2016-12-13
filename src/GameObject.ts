class GameObject {
    game: Phaser.Game;
    sprite: Phaser.Sprite;
    
    constructor(game: Phaser.Game, imageName: string, position: Phaser.Point, options?: {"draggable"?: boolean}) {
	this.game = game;
	this.sprite = this.game.add.sprite(position.x, position.y, imageName);

	// Init event handling
	
    }
}
