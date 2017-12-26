const commando = require('discord.js-commando');
const settingsData = require('../../data/settings.json');
const antagonistsData = require('../../data/antagonists.json');
const protagonistsData = require('../../data/protagonists.json');

function StoryObject(type,label,name) {
    this.type = type;
    this.label = label;
    this.name = name;
}

//Create a set of locations that have a type that can be filtered from
// var setting1 = new StoryObject("setting","location","Location1");
// var setting2 = new StoryObject("setting","location","Location2");
// var settingArray = [setting1,setting2];
var settingArray = new Array();
settingArray = settingsData.settings;

//create a set of protagonists that have a type that can be filtered from
// var protagonist1 = new StoryObject("protagonist","person","Protagonist1");
// var protagonist2 = new StoryObject("protagonist","group","Protagonist2");
// var protagonistArray = [protagonist1,protagonist2];
var protagonistArray = new Array();
protagonistArray = protagonistsData.protagonists;

//Create a set of antagonists that have a type that can be filtered from
// var antagonist1 = new StoryObject("antagonist","person","Antagonist1");
// var antagonist2 = new StoryObject("antagonist","person","Antagonist2");
// var antagonistArray = [antagonist1,antagonist2];
var antagonistArray = new Array();
antagonistArray = antagonistsData.antagonists;

function getConflictTemplateString(template) {
    var text;

    switch(template) {
        case "Template1":
            text = "In SETTING, PROTAGONIST CONFLICT ANTAGONIST.";// + this.settings + ', ' + this.protagonists + ' ' + this.conflicts + ' ' + this.antagonists;
            break;
        case "Template2":
            text = "PROTAGONIST CONFLICT ANTAGONIST in SETTING.";//this.protagonists + ' ' + this.conflicts + ' ' + this.antagonists + ' in ' + this.settings;
            break;
        default:
            text = "Something went wrong. That story template doesn't exist."
    }
    return text;
}

function getRandomStoryObject(type,label) {
    var object = "Didn't enter switch";

    switch (type) {
        default:
            object = "No Story Object Found."
        case "antagonist":
            do {
                object = antagonistArray[Math.floor(Math.random() * antagonistArray.length)];
            }
            while (object.label != label);
            break;
        case "protagonist":
            do {
                object = protagonistArray[Math.floor(Math.random() * protagonistArray.length)];
            }
            while (object.label != label)
            break;
        case "setting":
            do {
                object = settingArray[Math.floor(Math.random() * settingArray.length)];
            }
            while (object.label != label)
            break;
    }

    return object.name;
}

//Create a set of conflicts that require specific protagonists and antagonists
var conflict1 = {protagonistReq:"person",antagonistReq:"person",settingReq:"location",text:"Conflict1",template:"Template1"};
var conflict2 = {protagonistReq:"group",antagonistReq:"person",settingReq:"location",text:"Conflict2",template:"Template2"};
var conflictArray = [conflict1,conflict2];



class GenerateScenarioCommand extends commando.Command {
    constructor (client) {
        super(client, {
           name: 'scene',
           group: 'random', 
           memberName: 'scene',
           description: 'Randomly generates a scenario'
        });
    }


    async run(message, args) {
        //var roll = Math.floor(Math.random() * 6) + 1;


        //randomize which scene elements are selected
        // var selectedSetting = settingArray[Math.floor(Math.random() * settingArray.length)];
        // //var selectedProtagonist = protagonistArray[Math.floor(Math.random() * protagonistArray.length)];
        // var selectedAntagonist = antagonistArray[Math.floor(Math.random() * antagonistArray.length)];
        var selectedConflict = conflictArray[Math.floor(Math.random() * conflictArray.length)];
        var selectedAntagonist = getRandomStoryObject("antagonist",selectedConflict.antagonistReq);
        var selectedProtagonist = getRandomStoryObject("protagonist",selectedConflict.protagonistReq);
        var selectedSetting = getRandomStoryObject("setting",selectedConflict.settingReq);

        // do {
        //     var selectedProtagonist = protagonistArray[Math.floor(Math.random() * protagonistArray.length)];
        // }
        // while(selectedConflict.protagonistReq != selectedProtagonist.label);


        //combine the scene elements into templates
        // var sceneTemplate1 = {
        //     setting: selectedSetting.name,
        //     protagonist: selectedProtagonist.name,
        //     conflict: selectedConflict.text,
        //     antagonist: selectedAntagonist.name,
        //     scenario: function() {return "In " + this.setting + ', ' + this.protagonist + ' ' + this.conflict + ' ' + this.antagonist;}
        // };

        // var sceneTemplate2 = {
        //     setting: selectedSetting.name,
        //     protagonist: selectedProtagonist.name,
        //     conflict: selectedConflict.text,
        //     antagonist: selectedAntagonist.name,
        //     scenario: function() {return this.protagonist + ' ' + this.conflict + ' ' + this.antagonist + ' in ' + this.setting;}
        // };
        // var sceneArray = [sceneTemplate1.scenario(),sceneTemplate2.scenario()];

        //randomly select the scene template to use
        //var scene = sceneArray[Math.floor(Math.random() * sceneArray.length)];
        var sceneText = getConflictTemplateString(selectedConflict.template);
        sceneText = sceneText.replace("ANTAGONIST",selectedAntagonist);
        sceneText = sceneText.replace("PROTAGONIST",selectedProtagonist);
        sceneText = sceneText.replace("SETTING",selectedSetting);
        sceneText = sceneText.replace("CONFLICT",selectedConflict.text);
        message.channel.send(sceneText);
    }


}
module.exports = GenerateScenarioCommand;