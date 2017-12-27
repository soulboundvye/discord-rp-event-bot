const commando = require('discord.js-commando');
const storyTemplateData = require('../../data/story_templates.json');
const settingsData = require('../../data/settings.json');
const antagonistsData = require('../../data/antagonists.json');
const protagonistsData = require('../../data/protagonists.json');
const conflictsData = require('../../data/conflicts.json');
const motivationsData = require('../../data/motivations.json');

// function StoryObject(type,label,name) {
//     this.type = type;
//     this.label = label;
//     this.text = text;
// }

//Load the set of story objects that have a type that can be filtered from
var settingArray = [];
settingArray = settingsData.settings;
var protagonistArray = [];
protagonistArray = protagonistsData.protagonists;
var antagonistArray = [];
antagonistArray = antagonistsData.antagonists;
var motivationArray = [];
motivationArray = motivationsData.motivations;
//Load the set of conflicts that require specific protagonists, antagonists, settings, and motivations
var conflictArray = [];
conflictArray = conflictsData.conflicts;
//Load the set of story templates to shove everything into
var storyTemplateArray = [];
storyTemplateArray = storyTemplateData.story_templates;

// Returns the text to be used by the conflict so that it is stated in English, not variables
function getConflictTemplateString(template,conflict,setting,protagonist,antagonist,motivation) {
    var text = template.text;
    console.log("Entered the story string function");
    /*templates can have the following objects:
    SETTING = the name of a location or event (ex. a cave)
    RICHSETTING = a more descriptive name of a location or event (ex. a mysterious cave)
    PROTAGONIST = the name of a person or group (ex. a swineherd, the villagers)
    ANTAGONIST = the name of a person, group, beast, or nature (ex. the king, a cult, a lion, a storm)
    MOTIVATION = the theme of the conflict (ex. violence, wealth, fellowship, power)
    CONFLICT = the parameters for a story with a theme, protagonist, antagonist, setting, and action
    */
    if (text.indexOf("ANTAGONIST1") != -1) {
        text = text.replace("ANTAGONIST1",antagonist[0].text);
    }
    console.log(text);
    if (text.indexOf("ANTAGONIST2") != -1) {
        text = text.replace("ANTAGONIST2",antagonist[1].text);
    }

    console.log(text);
    if (text.indexOf("PROTAGONIST1") != -1) {
        text = text.replace("PROTAGONIST1",protagonist[0].text);
    }
    console.log(text);
    if (text.indexOf("PROTAGONIST2") != -1) {
        text = text.replace("PROTAGONIST2",protagonist[1].text);
    }

    console.log(text);
    if (text.indexOf("RICHSETTING1") != -1) {
        text = text.replace("RICHSETTING1",setting[0].article + setting[0].descriptor + setting[0].text);
    }
    console.log(text);
    if (text.indexOf("RICHSETTING2") != -1) {
        text = text.replace("RICHSETTING2",setting[1].article + setting[1].descriptor + setting[1].text);
    }

    console.log(text);
    if (text.indexOf("SETTING1") != -1) {
        text = text.replace("SETTING1",setting[0].article + setting[0].text);
    }
    console.log(text);
    if (text.indexOf("SETTING2") != -1) {
        text = text.replace("SETTING2",setting[1].article + setting[1].text);
    }

    console.log(text);
    if (text.indexOf("CONFLICT1") != -1) {
        text = text.replace("CONFLICT1",conflict.text);
    }
    console.log(text);
    if (text.indexOf("CONFLICT2") != -1) {
        text = text.replace("CONFLICT2",conflict[1].text);
    }
    console.log(text);

    if (text.indexOf("MOTIVATION1") != -1) {
        text = text.replace("MOTIVATION1",motivation[0].text);
    }
    console.log(text);
    if (text.indexOf("MOTIVATION2") != -1) {
        text = text.replace("MOTIVATION2",motivation[1].text);
    }
    console.log(text);

    text = text.concat(" ", conflict.question);
    if (template.conflictCount == 2) {
        text = text.concat(" ", conflict[1].question);
    }
    

    return text;
}

// Returns a randomly selected object of that type, filtered by label
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
        case "motivation":
            do {
                object = motivationArray[Math.floor(Math.random() * motivationArray.length)];
            }
            while (object.label != label)
            break;
    }

    return object;
}

//For a given template, get all the necessary story objects
function getAllObjectsForStoryTemplate(template,conflicts,protagonists,antagonists,settings,motivations) {
    return null;
}

//Add random and unique story objects to an array based on the required type and label from the conflict
function getUniqueStoryObjects(count,object,type,label) {
    console.log("Entered unique story object function");
    var i = 0;
    for (i = 0; i < count; i++) {
        object[i] = getRandomStoryObject(type,label);
        console.log("Entered for loop to set object to " + object[i].text);
        if (i > 0) {
            console.log("Entered if i > 0 statement");
            if (object[i] == object[i-1]) {
                console.log("Objects matched, retrying...");
                i--;
            }
        }
    }
}


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
        // randomly select a conflict and then use its requirements to generate the remaining parts
        var selectedStoryTemplate = storyTemplateArray[Math.floor(Math.random() * storyTemplateArray.length)];
        var selectedConflict = [];
        selectedConflict = conflictArray[Math.floor(Math.random() * conflictArray.length)];
        var selectedProtagonist = [];
        var selectedAntagonist = [];
        var selectedSetting = [];
        var selectedMotivation = [];

        console.log("before getting unique story objects");
        getUniqueStoryObjects(selectedStoryTemplate.protagonistCount,selectedProtagonist,"protagonist",selectedConflict.protagonistReq);
        console.log("got past the protagonist");
        getUniqueStoryObjects(selectedStoryTemplate.motivationCount,selectedMotivation,"motivation",selectedConflict.theme);
        console.log("got past the motivation");
        getUniqueStoryObjects(selectedStoryTemplate.antagonistCount,selectedAntagonist,"antagonist",selectedConflict.antagonistReq);
        console.log("got past the antagonist");
        getUniqueStoryObjects(selectedStoryTemplate.settingCount,selectedSetting,"setting",selectedConflict.settingReq);
        console.log("got past the setting");

        // var i = 0;
        // for (i = 0; i < selectedStoryTemplate.protagonistCount; i++) {
        //     selectedProtagonist[i] = getRandomStoryObject("protagonist",selectedConflict.protagonistReq);
        //     if (i > 0) {
        //         if (selectedProtagonist[i] == selectedProtagonist[i-1]) {
        //             console.log(selectedConflict.text + ' ' + selectedProtagonist[i].text);
        //             i--;
        //         }
        //     }
        // }


        // Get the string that will be used to describe the scene and replace all the relevant objects
        var sceneText = getConflictTemplateString(selectedStoryTemplate,selectedConflict,selectedSetting,selectedProtagonist,selectedAntagonist,selectedMotivation);
        sceneText = sceneText.charAt(0).toUpperCase() + sceneText.slice(1);
        message.channel.send(sceneText);
    }


}
module.exports = GenerateScenarioCommand;