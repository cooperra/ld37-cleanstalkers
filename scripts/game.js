var Component = (function () {
    function Component(e) {
        this.entity = e;
    }
    return Component;
}());
var Entity = (function () {
    function Entity(game) {
        this.game = game;
        this.componentsMap = {};
    }
    Entity.prototype.addComponent = function (c) {
        var componentType = c.constructor;
        this.componentsMap[componentType.name] = c;
    };
    Entity.prototype.getComponent = function (name) {
        return this.componentsMap[name];
    };
    Entity.prototype.hasComponent = function (name) {
        return name in this.componentsMap;
    };
    return Entity;
}());
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpriteComponent = (function (_super) {
    __extends(SpriteComponent, _super);
    function SpriteComponent(e, s) {
        var _this = _super.call(this, e) || this;
        _this.sprite = s;
        return _this;
    }
    SpriteComponent.prototype.setImage = function (imgName) {
        this.sprite.loadTexture(imgName);
    };
    return SpriteComponent;
}(Component));
var DragComponent = (function (_super) {
    __extends(DragComponent, _super);
    function DragComponent(e, options) {
        var _this = _super.call(this, e) || this;
        var noop = function () { };
        _this.dragStartHandler = options && options.start || noop;
        _this.dragStopHandler = options && options.start || noop;
        _this.dragUpdateHander = options && options.start || noop;
        if (!_this.entity.hasComponent("SpriteComponent")) {
            console.log("Missing SpriteComponent!");
            return _this;
        }
        var s = _this.entity.getComponent("SpriteComponent").sprite;
        _this.bindHandlersOntoSprite(s);
        return _this;
    }
    DragComponent.prototype.bindHandlersOntoSprite = function (sprite) {
        sprite.inputEnabled = true;
        sprite.input.draggable = true;
        sprite.input.dragStopBlocksInputUp = true;
        sprite.input.dragDistanceThreshold = 5;
        sprite.events.onDragStart.add(this.dragStartHandler);
        sprite.events.onDragStop.add(this.dragStopHandler);
        sprite.events.onDragUpdate.add(this.dragUpdateHander);
    };
    return DragComponent;
}(Component));
var ClickComponent = (function (_super) {
    __extends(ClickComponent, _super);
    function ClickComponent(e, handler) {
        var _this = _super.call(this, e) || this;
        _this.onClick = new Phaser.Signal();
        if (!_this.entity.hasComponent("SpriteComponent")) {
            console.error("Missing SpriteComponent!");
            return _this;
        }
        var s = _this.entity.getComponent("SpriteComponent").sprite;
        _this.bindHandlersOntoSprite(s);
        if (handler) {
            _this.onClick.add(handler);
        }
        return _this;
    }
    ClickComponent.prototype.bindHandlersOntoSprite = function (sprite) {
        var _this = this;
        sprite.inputEnabled = true;
        sprite.events.onInputUp.add(function () { _this.onClick.dispatch(); });
    };
    return ClickComponent;
}(Component));
var OpenableComponent = (function (_super) {
    __extends(OpenableComponent, _super);
    function OpenableComponent(e, closedImgName, openImgName, state) {
        var _this = _super.call(this, e) || this;
        _this.state = state || "closed";
        _this.onOpen = new Phaser.Signal();
        _this.onClose = new Phaser.Signal();
        _this.closedImgName = closedImgName;
        _this.openImgName = openImgName;
        var sc = _this.entity.getComponent("SpriteComponent");
        sc.setImage(_this.state == "open" ? openImgName : closedImgName);
        var cc = e.getComponent("ClickComponent");
        _this.listener = cc.onClick.add(_this.attemptToggle, _this);
        return _this;
    }
    OpenableComponent.prototype.attemptToggle = function () {
        this.toggle();
    };
    OpenableComponent.prototype.toggle = function () {
        var sc = this.entity.getComponent("SpriteComponent");
        if (this.state == "closed") {
            this.state = "open";
            sc.setImage(this.openImgName);
            this.onOpen.dispatch();
        }
        else {
            this.state = "closed";
            sc.setImage(this.closedImgName);
            this.onClose.dispatch();
        }
        this.onStateChange.dispatch(this.state);
    };
    return OpenableComponent;
}(Component));
function newWaluigi(game, position) {
    var sprite = game.add.sprite(position.x, position.y, "waluigi");
    var e = new Entity(game);
    e.addComponent(new SpriteComponent(e, sprite));
    e.addComponent(new DragComponent(e));
    e.addComponent(new ClickComponent(e, function () { window.alert("WAH"); }));
    return e;
}
function newContainer(game, position, name, openname) {
    var sprite = game.add.sprite(position.x, position.y, name);
    var e = new Entity(game);
    e.addComponent(new SpriteComponent(e, sprite));
    e.addComponent(new DragComponent(e));
    e.addComponent(new ClickComponent(e));
    e.addComponent(new OpenableComponent(e, name, openname || (name + "-open")));
    return e;
}
function newFridge(game, position) {
    return newContainer(game, position, "fridge");
}
function newNightstand(game, position) {
    return newContainer(game, position, "nightstand");
}
function newTextPane(game, x, y, w, h, text) {
    return new TextPane(game, x, y, w, h, text);
}
var TextPane = (function (_super) {
    __extends(TextPane, _super);
    function TextPane(game, x, y, w, h, text) {
        var _this = _super.call(this, game) || this;
        var gfx = new Phaser.Graphics(game);
        gfx.beginFill(0x000000, 0.44);
        gfx.drawRect(0, 0, w, h);
        gfx.endFill();
        _this.bg = new Phaser.Sprite(game, x, y, gfx.generateTexture());
        _this.text = new Phaser.Text(game, x, y, text, { font: "30px Arial", fill: "#AAAAFF", align: "left" });
        _this.addMultiple([_this.bg, _this.text]);
        return _this;
    }
    TextPane.prototype.setText = function (text) {
        this.text.text = text;
    };
    return TextPane;
}(Phaser.Group));
var DialogController = (function () {
    function DialogController(game, textPane, dialogData) {
        if (!textPane) {
            textPane = new TextPane(game, 100, 100, 800, 100, "");
        }
        this.textPane = textPane;
        this.textPane.visible = false;
        if (!dialogData) {
            dialogData = new DialogData();
            dialogData.importDialog(game.cache.getText("script"), game.cache.getText("script-annotations"));
        }
        this.dialogData = dialogData;
        this.nextSignal = game.input.onDown;
    }
    DialogController.prototype.beginSequence = function (name) {
        var _this = this;
        var s = this.dialogData.getSequence(name);
        var display = function (speakerName, text) {
            _this.textPane.visible = true;
            _this.textPane.setText(speakerName + ": " + text);
        };
        var process = function (thing) {
            if ("speaker" in thing) {
                display(thing["speaker"], thing["text"]);
            }
            else {
                display("", thing["line"]);
            }
        };
        var continueDialog = function (currentScreenful) {
            process(s[currentScreenful]);
            if (currentScreenful < s.length - 1) {
                _this.nextSignal.addOnce(function () { continueDialog(currentScreenful + 1); });
            }
            else if (currentScreenful >= s.length - 1) {
                _this.nextSignal.addOnce(function () { _this.textPane.visible = false; });
            }
        };
        continueDialog(0);
    };
    return DialogController;
}());
var DialogSequence = (function (_super) {
    __extends(DialogSequence, _super);
    function DialogSequence() {
        return _super.apply(this, arguments) || this;
    }
    return DialogSequence;
}(Array));
var DialogData = (function () {
    function DialogData() {
        this.sequences = {};
    }
    DialogData.prototype.addSequence = function (name) {
        var s = new DialogSequence();
        this.sequences[name] = s;
        return s;
    };
    DialogData.prototype.getSequence = function (name) {
        return this.sequences[name];
    };
    DialogData.prototype.importDialog = function (scriptText, annotationText) {
        var annotationLines = annotationText.split("\n");
        var annotations = {};
        for (var _i = 0, annotationLines_1 = annotationLines; _i < annotationLines_1.length; _i++) {
            var line = annotationLines_1[_i];
            if (line.trim() == "") {
                continue;
            }
            var tmp = line.split("|", 2);
            var key = tmp[0].trim();
            var action = tmp[1].trim();
            annotations[key] = action;
        }
        var scriptLines = scriptText.split("\n");
        var whiteSpaceFlag = true;
        var currentSequence = this.addSequence("START");
        var currentSpeaker = null;
        for (var _a = 0, scriptLines_1 = scriptLines; _a < scriptLines_1.length; _a++) {
            var line = scriptLines_1[_a];
            line = line.trim();
            if (line == "") {
                whiteSpaceFlag = true;
                continue;
            }
            if (line in annotations) {
                var a = annotations[line];
                if (a == 'section start') {
                    currentSequence = this.addSequence(line);
                }
                else {
                    currentSequence.push({ action: a, line: line });
                }
            }
            else {
                if (whiteSpaceFlag) {
                    currentSpeaker = line;
                }
                else {
                    currentSequence.push({
                        speaker: currentSpeaker,
                        text: line
                    });
                }
            }
            whiteSpaceFlag = false;
        }
    };
    return DialogData;
}());
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'content', {
            create: this.create, preload: this.preload,
            update: this.update
        });
    }
    SimpleGame.prototype.preload = function () {
        var loader = this.game.load.image("bgroom", "assets/bg.jpg");
        var loader = this.game.load.image("waluigi", "assets/waluigi.png");
        var loader = this.game.load.image("fridge", "assets/fridge.png");
        var loader = this.game.load.image("fridge-open", "assets/fridge-open.png");
        var loader = this.game.load.image("nightstand", "assets/nightstand.png");
        var loader = this.game.load.image("nightstand-open", "assets/nightstand-open.png");
        var loader = this.game.load.image("bookcase1", "assets/bookcase1.png");
        function l(thiss, name) {
            var loader = thiss.game.load.image(name, "assets/" + name + ".png");
        }
        l(this, "bookcase2");
        l(this, "bookcase3");
        l(this, "dadsheet");
        l(this, "gregsheet");
        l(this, "momsheet");
        l(this, "phone");
        l(this, "phone-ring");
        l(this, "cat");
        l(this, "cat-sleep");
        l(this, "changing");
        l(this, "changing-open");
        l(this, "drip1");
        l(this, "drip2");
        l(this, "drip3");
        l(this, "laundry");
        l(this, "mop");
        l(this, "puddle1");
        l(this, "puddle2");
        l(this, "puddle3");
        l(this, "puddle4");
        l(this, "safe");
        l(this, "safe-open");
        l(this, "switches");
        l(this, "trash");
        l(this, "bee");
        l(this, "bed-case");
        l(this, "bed-case-open");
        l(this, "logo");
        var loader = this.game.load.image("window", "assets/window.png");
        var loader = this.game.load.image("fullscreen", "assets/fullscreen.png");
        var loader = this.game.load.text("script", "dialog/LudumDare37.txt");
        var loader = this.game.load.text("script-annotations", "dialog/key.txt");
    };
    SimpleGame.prototype.create = function () {
        var _this = this;
        var image = this.game.cache.getImage("bgroom");
        this.bgSprite = this.game.add.sprite(this.game.width / 2 - image.width / 2, this.game.height / 2 - image.height / 2, "bgroom");
        var image = this.game.cache.getImage("fridge");
        this.fridge = newFridge(this.game, new Phaser.Point(1180, 397));
        var image = this.game.cache.getImage("nightstand");
        this.nightstand = newNightstand(this.game, new Phaser.Point(479, 329));
        var image = this.game.cache.getImage("window");
        this.windowSprite = this.game.add.sprite(756.5, 171.5, "window");
        var dd = function (dialog, s) {
            s.inputEnabled = true;
            s.events.onInputDown.addOnce(function () { _this.dialogger.beginSequence(dialog); });
        };
        function l(thiss, name, x, y, alt, dialog) {
            if (alt) {
                var c = newContainer(thiss.game, new Phaser.Point(x, y), name, alt);
                var sprite = c.getComponent("SpriteComponent").sprite;
                if (dialog) {
                    sprite.events.onInputDown.addOnce(function () { thiss.dialogger.beginSequence(dialog); });
                }
                return sprite;
            }
            var image = thiss.game.cache.getImage(name);
            var s = thiss.game.add.sprite(x || thiss.game.width / 2 - image.width / 2, y || thiss.game.height / 2 - image.height / 2, name);
            draggify(s);
            return s;
        }
        dd('ON CLEANING UP THE LAUNDRY:', l(this, "laundry", 811.5, 725));
        l(this, "bookcase1", 1371.5, 335, "bookcase3");
        l(this, "phone", 616.5, 439, "phone-ring");
        l(this, "bed-case", 613.5, 404, "bed-case-open");
        l(this, "cat-sleep", 761.5, 459);
        l(this, "changing", 202.5, 387, "changing-open");
        l(this, "mop", 67.5, 746);
        l(this, "safe", 1504, 669.5, "safe-open");
        l(this, "switches", 105, 641.5);
        l(this, "trash", 205.5, 750.5);
        l(this, "bee", 927, 357);
        var image = this.game.cache.getImage("fullscreen");
        this.fullscreenSprite = this.game.add.sprite(0, 0, "bee");
        this.fullscreenText = this.game.add.text(40, 0, "toggle fullscreen", { font: "30px Arial", fill: "#777777", align: "left" });
        this.fullscreenGroup = this.game.add.group();
        this.fullscreenGroup.addMultiple([this.fullscreenSprite, this.fullscreenText]);
        var d = new DialogController(this.game);
        this.dialogger = d;
        var blackbg = (function () {
            var gfx = new Phaser.Graphics(_this.game);
            gfx.beginFill(0x000000, 0.44);
            gfx.drawRect(0, 0, 1920, 1080);
            gfx.endFill();
            return new Phaser.Sprite(_this.game, 0, 0, gfx.generateTexture());
        })();
        this.game.world.add(blackbg);
        var logo = l(this, "logo");
        this.game.input.onDown.addOnce(function () {
            blackbg.visible = false;
            logo.visible = false;
            d.beginSequence("START");
        });
        console.log(d);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.scale.onFullScreenChange.add(SimpleGame.prototype.onFullScreenChange, this);
        this.fullscreenGroup.setAll("inputEnabled", true);
        this.fullscreenGroup.forEach(function (e) {
            e.events.onInputDown.add(function () {
                if (_this.game.scale.isFullScreen) {
                    _this.game.scale.stopFullScreen();
                }
                else {
                    _this.game.scale.startFullScreen(true);
                }
            }, _this);
        }, this);
        draggify(this.windowSprite);
    };
    SimpleGame.prototype.update = function () {
        this.game.input.update();
    };
    SimpleGame.prototype.onFullScreenChange = function () {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.refresh();
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
function draggify(sprite) {
    sprite.inputEnabled = true;
    sprite.input.draggable = true;
    sprite.input.dragStopBlocksInputUp = true;
    sprite.input.dragDistanceThreshold = 5;
    sprite.events.onInputUp.add(function () {
    });
    sprite.events.onDragStop.add(function () {
    });
}
var GameObject = (function () {
    function GameObject(game, imageName, position, options) {
        this.game = game;
        this.sprite = this.game.add.sprite(position.x, position.y, imageName);
    }
    return GameObject;
}());
//# sourceMappingURL=game.js.map