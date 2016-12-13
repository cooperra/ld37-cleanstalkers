////// <reference path="

class DialogController {
    textPane: TextPane;
    dialogData: DialogData;
    nextSignal: Phaser.Signal; // For progressing dialog
    
    constructor(game: Phaser.Game, textPane?: TextPane, dialogData?: DialogData) {
	if (!textPane) {
	    textPane = new TextPane(game, 100, 100, 800, 100, "");
	}
	this.textPane = textPane;
	this.textPane.visible = false;
	if (!dialogData) {
	    dialogData = new DialogData();
	    dialogData.importDialog(game.cache.getText("script"),
				    game.cache.getText("script-annotations"));
	}
	this.dialogData = dialogData;

	this.nextSignal = game.input.onDown;
    }

    beginSequence(name: string) {
	let s = this.dialogData.getSequence(name);
	let display = (speakerName: string, text: string) => {
	    this.textPane.visible = true;
	    this.textPane.setText(speakerName + ": " + text);
	};
	let process = (thing: any) => {
	    if ("speaker" in thing) {
		display(thing["speaker"], thing["text"]);
	    } else {
		// TODO actions
		display("", thing["line"]);
	    }
	};
	let continueDialog = (currentScreenful: number) => {
	    process(s[currentScreenful]);
	    if (currentScreenful < s.length-1){
		this.nextSignal.addOnce(()=>{continueDialog(currentScreenful+1);});
	    } else if (currentScreenful >= s.length-1){
		this.nextSignal.addOnce(()=>{this.textPane.visible = false;});
	    }
	};
	continueDialog(0);
    }
	
}

class DialogSequence extends Array {
}

class DialogData {
    sequences: any; // string -> DialogSequence
    
    constructor() {
	this.sequences = {};
    }

    addSequence(name: string) : DialogSequence {
	let s = new DialogSequence();
	this.sequences[name] = s;
	return s;
    }
    
    getSequence(name: string) : DialogSequence {
	return this.sequences[name];
    }


    importDialog(scriptText: string, annotationText: string) {
	// First we parse the annotations
	let annotationLines = annotationText.split("\n");
	let annotations = {};
	for (let line of annotationLines) {
	    if (line.trim() == "") {
		continue;
	    }
	    let tmp = line.split("|", 2);
	    let key = tmp[0].trim();
	    let action = tmp[1].trim();
	    annotations[key] = action;
	}

	// On to the script
	let scriptLines = scriptText.split("\n");
	let whiteSpaceFlag = true;
	let currentSequence = this.addSequence("START");
	let currentSpeaker = null;
	for (let line of scriptLines) {
	    line = line.trim();
	    // Skip if blank
	    if (line == "") {
		whiteSpaceFlag = true;
		continue;
	    }
	    // Check for annotation
	    if (line in annotations) {
		let a = annotations[line];
		if (a == 'section start') {
		    currentSequence = this.addSequence(line);
		} else {
		    currentSequence.push({action: a, line: line});
		}
	    } else {
		if (whiteSpaceFlag) {
		    // Let's assume this is a character name
		    currentSpeaker = line;
		} else {
		    // Let's speak the dialog
		    currentSequence.push({
			speaker: currentSpeaker,
			text: line
		    });
		}
	    }
	    whiteSpaceFlag = false;
	}
	
    }
}
