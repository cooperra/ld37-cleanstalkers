class Component {
    entity: Entity;
    constructor(e: Entity) {
	this.entity = e;
    }
}

class Entity {
    componentsMap: {};
    game: Phaser.Game;

    constructor(game: Phaser.Game) {
	this.game = game;
	this.componentsMap = {};
    }

    addComponent(c: Component) {
	
	let componentType: any = c.constructor;
	this.componentsMap[componentType.name] = c;
    }

    getComponent(name: string) : Component {
	return this.componentsMap[name];
    }

    hasComponent(name: string) : boolean {
	return name in this.componentsMap;
    }
}
