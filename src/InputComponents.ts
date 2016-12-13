///// <reference path="Entity.ts"/>

class SpriteComponent extends Component {
    sprite: Phaser.Sprite;

    constructor(e: Entity, s: Phaser.Sprite) {
	super(e);
	this.sprite = s;
    }

    setImage(imgName: string) {
        this.sprite.loadTexture(imgName);
    }
}

class DragComponent extends Component {
    dragStartHandler: Function;
    dragStopHandler: Function;
    dragUpdateHander: Function;

    constructor(e: Entity, options?: {start?: Function, stop?: Function, update?: Function}) {
	super(e);
	let noop = ()=>{};
	this.dragStartHandler = options && options.start || noop;
	this.dragStopHandler = options && options.start || noop;
	this.dragUpdateHander = options && options.start || noop;

	if (!this.entity.hasComponent("SpriteComponent")) {
	    console.log("Missing SpriteComponent!");
	    return;
	}
	let s = (<SpriteComponent>this.entity.getComponent("SpriteComponent")).sprite;
	this.bindHandlersOntoSprite(s);
    }

    bindHandlersOntoSprite(sprite: Phaser.Sprite) {
	sprite.inputEnabled = true;
	sprite.input.draggable = true;
	sprite.input.dragStopBlocksInputUp = true;
	sprite.input.dragDistanceThreshold = 5;//px

	sprite.events.onDragStart.add(this.dragStartHandler);
	sprite.events.onDragStop.add(this.dragStopHandler);
	sprite.events.onDragUpdate.add(this.dragUpdateHander);
    }
}

class ClickComponent extends Component {
    enabled: boolean;
    onClick: Phaser.Signal;

    constructor(e: Entity, handler?: Function) {
	super(e);
	this.onClick = new Phaser.Signal();

	if (!this.entity.hasComponent("SpriteComponent")) {
	    console.error("Missing SpriteComponent!");
	    return;
	}
	let s = (<SpriteComponent>this.entity.getComponent("SpriteComponent")).sprite;
	this.bindHandlersOntoSprite(s);

	if (handler) {
	    this.onClick.add(handler);
	}
    }

    bindHandlersOntoSprite(sprite: Phaser.Sprite) {
	sprite.inputEnabled = true;
	sprite.events.onInputUp.add(()=>{this.onClick.dispatch();});
    }
}

class OpenableComponent extends Component {
    state: "open" | "closed";
    listener: Phaser.SignalBinding;
    onOpen: Phaser.Signal;
    onClose: Phaser.Signal;
    onStateChange: Phaser.Signal;

    closedImgName: string;
    openImgName: string;

    constructor(e: Entity, closedImgName: string, openImgName: string, state?: "open" | "closed") {
	super(e);
	this.state = state || "closed";
	this.onOpen = new Phaser.Signal();
	this.onClose = new Phaser.Signal();

	this.closedImgName = closedImgName;
	this.openImgName = openImgName;

	// Requires SpriteComponent
	let sc = <SpriteComponent>this.entity.getComponent("SpriteComponent");
	sc.setImage(this.state == "open" ? openImgName : closedImgName);

	// Requires ClickComponent
	let cc = <ClickComponent>e.getComponent("ClickComponent");
	this.listener = cc.onClick.add(this.attemptToggle, this);
    }

    attemptToggle() {
	// The user wants to toggle us
	// This is where one would check for locking
	this.toggle();
    }

    toggle() {
	let sc = <SpriteComponent>this.entity.getComponent("SpriteComponent");
	if (this.state == "closed") {
	    this.state = "open";
	    sc.setImage(this.openImgName);
	    this.onOpen.dispatch();
	} else {
	    this.state = "closed";
	    sc.setImage(this.closedImgName);
	    this.onClose.dispatch();
	}
	this.onStateChange.dispatch(this.state);
    }
}
