const commando = require('discord.js-commando');
const storyTemplateData = require('../../data/story_templates.json');
const settingsData = require('../../data/settings.json');
const antagonistsData = require('../../data/antagonists.json');
const protagonistsData = require('../../data/protagonists.json');
const conflictsData = require('../../data/conflicts.json');
const motivationsData = require('../../data/motivations.json');

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
    // var text = template.text;
    console.log("Entered getConflictTemplateString function");
    /*templates can have the following objects:
    SETTING = the name of a location or event (ex. a cave)
    RICHSETTING = a more descriptive name of a location or event (ex. a mysterious cave)
    PROTAGONIST = the name of a person or group (ex. a swineherd, the villagers)
    ANTAGONIST = the name of a person, group, beast, or nature (ex. the king, a cult, a lion, a storm)
    MOTIVATION = the theme of the conflict (ex. violence, wealth, fellowship, power)
    CONFLICT = the parameters for a story with a theme, protagonist, antagonist, setting, and action

    Currently, antagonists are required to come first. Need to rework so either can come first.
    */
    var text = template.text;
    var whoFirst;
    if (text.indexOf("PROTAGONIST") < text.indexOf("ANTAGONIST")) {
        whoFirst = "protagonist";
    }
    else {
        whoFirst = "antagonist";
    }

    text = template.text.split(" ");

    var i;
    for (i = 0; i < text.length; i++) {
        switch (text[i]) {
            default:
                break;
            case "CONFLICT1":
                if (whoFirst == "protagonist") {
                    text[i] = conflict[0].text + protagonist[0].verbConjugation + conflict[0].textAddon;
                }
                else {
                    text[i] = conflict[0].text + antagonist[0].verbConjugation + conflict[0].textAddon;
                }
                break;
            case "CONFLICT2":
                if (whoFirst == "protagonist") {
                    text[i] = conflict[0].text + protagonist[0].verbConjugation + conflict[0].textAddon;
                }
                else {
                    text[i] = conflict[1].text + antagonist[1].verbConjugation + conflict[1].textAddon;
                }
                break;
            case "PROTAGONIST1":
                text[i] = protagonist[0].text;
                break;
            case "PROTAGONIST2":
                text[i] = protagonist[1].text;
                break;
            case "ANTAGONIST1":
                text[i] = antagonist[0].text;
                break;
            case "ANTAGONIST2":
                text[i] = antagonist[1].text;
                break;
            case "RICHSETTING1":
                text[i] = setting[0].article + setting[0].descriptor + setting[0].text;
                break;
            case "RICHSETTING2":
                text[i] = setting[1].article + setting[1].descriptor + setting[1].text;
                break;
            case "SETTING1":
                text[i] = setting[0].article + setting[0].text;
                break;
            case "SETTING2":
                text[i] = setting[1].article + setting[1].text;
                break;
            case "MOTIVATION1":
                text[i] = motivation[0].text;
                break;
            case "MOTIVATION2":
                text[i] = motivation[1].text;
                break;
        }
        console.log("current string is: " + text);
    }

    console.log("Ready to join the string...");
    text = text.join(" ");
    console.log("current string is: " + text);
    //Add a period
    text = text.concat(".");


    text = text.concat(" ", conflict[0].question);
    if (template.conflictCount == 2) {
        text = text.concat(" ", conflict[1].question);
    }
    

    return text;
}

function getRandomConflictRequirement(count,conflicts,type) {
    // console.log("Entered getRandomConflictRequirement function");
    var object = [];

    var i = 0;

    switch (type) {
        default:
            object = "No conflict requirement found.";
            break;
        case "antagonist":
            for (i = 0; i < count; i++) {
                // console.log("in the for loop to randomly choose an antagonist from conflict " + i + "'s options");
                if(conflicts.antagonistReq.length > 1) {
                    // console.log("there is more than one option, so we're randomly selecting it");
                    object[i] = conflicts.antagonistReq[Math.floor(Math.random() * conflicts.antagonistReq.length)];
                }
                else {
                    // console.log("there is not more than one option, so just setting the value to " + conflicts[i].antagonistReq[0]);
                    object[i] = conflicts.antagonistReq[0];                    
                }
                // console.log("the antagonist chosen is " + object[i]);
            }
            break;
        case "protagonist":
            for (i = 0; i < count; i++) {
                // console.log("in the for loop to randomly choose a protagonist from conflict " + i + "'s options");
                if(conflicts.protagonistReq.length > 1) {
                    // console.log("there is more than one option, so we're randomly selecting it");
                    object[i] = conflicts.protagonistReq[Math.floor(Math.random() * conflicts.protagonistReq.length)];
                }
                else {
                    // console.log("there is not more than one option, so just setting the value to " + conflicts[i].protagonistReq[0]);
                    object[i] = conflicts.protagonistReq[0];                    
                }
                // console.log("the protagonist chosen is " + object[i]);
            }
            break;
        case "setting":
            for (i = 0; i < count; i++) {
                // console.log("in the for loop to randomly choose a setting from conflict " + i + "'s options");
                if(conflicts.settingReq.length > 1) {
                    // console.log("there is more than one option, so we're randomly selecting it");
                    object[i] = conflicts.settingReq[Math.floor(Math.random() * conflicts.settingReq.length)];
                }
                else {
                    // console.log("there is not more than one option, so just setting the value to " + conflicts[i].settingReq[0]);
                    object[i] = conflicts.settingReq[0];                    
                }
                // console.log("the setting chosen is " + object[i]);
            }
            break;
        case "motivation":
            for (i = 0; i < count; i++) {
                // console.log("in the for loop to randomly choose a motivation from conflict " + i + "'s options");
                if(conflicts.theme.length > 1) {
                    // console.log("there is more than one option, so we're randomly selecting it");
                    object[i] = conflicts.theme[Math.floor(Math.random() * conflicts.theme.length)];
                }
                else {
                    // console.log("there is not more than one option, so just setting the value to " + conflicts[i].theme[0]);
                    object[i] = conflicts.theme[0];                    
                }
                // console.log("the motivation chosen is " + object[i]);
            }
            break;
        }
    return object;
}

// Returns a randomly selected object of that type, filtered by label
function getRandomStoryObject(type,label) {
    // console.log("In the getRandomStoryObject function");
    var object = "Didn't enter switch";

    switch (type) {
        default:
            object = "No Story Object Found."
            break;
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
        case "conflict":
            do {
                object = conflictArray[Math.floor(Math.random() * conflictArray.length)];
            }
            while (object.outcome != label)
            break;
    }
    console.log("Completed getRandomStoryObject of type: " + type + " and label " + label);
    return object;
}

//For a given template, get all the necessary story objects
function getAllObjectsForStoryTemplate(template,conflicts,protagonists,antagonists,settings,motivations) {
   
    // console.log("Entered getAllObjectsForStoryTemplate function");
    //randomize whether the conflict is for or against the protagonist
    var conflictType = Math.ceil(Math.random() * 2);
    if (conflictType == 1) {
        conflictType = "against";
    }
    else {
        conflictType = "for";
    }

    //select which labels will be used for the conflict, if there are choices
    var chosenProtagonists = [];
    var chosenAntagonists = [];
    var chosenSettings = [];
    var chosenMotivations = [];

    //for each conflict, go get the necessary stuffs
    var i = 0;
    console.log("There are " + template.conflictCount + " conflicts to generate and get objects for");        
    for (i = 0; i < template.conflictCount; i++) {
        getUniqueStoryObjects(i,conflicts,"conflict",conflictType);
        console.log("Conflict " + (i+1) + " is: " + conflicts[i].text);

        console.log("Choosing story object labels from conflict" + (i + 1) + "'s options");
        chosenProtagonists[i] = getRandomConflictRequirement(1,conflicts[i],"protagonist");
        console.log("Got the protagonist label: " + chosenProtagonists);
        chosenAntagonists[i] = getRandomConflictRequirement(1,conflicts[i],"antagonist");
        console.log("Got the antagonist label: " + chosenAntagonists);
        chosenSettings[i] = getRandomConflictRequirement(1,conflicts[i],"setting");
        console.log("Got the setting label: " + chosenSettings);
        chosenMotivations[i] = getRandomConflictRequirement(1,conflicts[i],"motivation");
        console.log("Got the motivation label: " + chosenMotivations);
    
        getUniqueStoryObjects(i,protagonists,"protagonist",chosenProtagonists[i]);
        console.log("got another unique protagonist for conflict " + (i+1));
        getUniqueStoryObjects(i,antagonists,"antagonist",chosenAntagonists[i]);
        console.log("got another unique antagonist for conflict " + (i+1));
        getUniqueStoryObjects(i,settings,"setting",chosenSettings[i]);
        console.log("got another unique setting for conflict " + (i+1));
        getUniqueStoryObjects(i,motivations,"motivation",chosenMotivations[i]);
        console.log("got another unique motivation for conflict " + (i+1));

    }
    
    //Secondary conflicts are overwriting the required elements from the first conflict...
    //Need to change workflow to generate conflict and required elements one at a time. 
    //Is it okay if they are not unique? Probably not, unless I change the templates. 

    // console.log("Now setting the initial story objects from the chosen labels");
    // //get the initial set of story objects
    // console.log("Getting random protagonist with label " + chosenProtagonists[0]);
    // protagonists[0] = getRandomStoryObject("protagonist",chosenProtagonists[0]);
    // console.log("Got the protagonist for conflict 1");
    // console.log("Getting random antagonist with label " + chosenAntagonists[0]);
    // antagonists[0] = getRandomStoryObject("antagonist",chosenAntagonists[0]);
    // console.log("Got the antagonists for conflict 1");
    // console.log("Getting random setting with label " + chosenSettings[0]);
    // settings[0] = getRandomStoryObject("setting",chosenSettings[0]);
    // console.log("Got the settings for conflict 1");
    // console.log("Getting random motivation with label " + chosenMotivations[0]);
    // motivations[0] = getRandomStoryObject("motivation",chosenMotivations[0]);
    // console.log("Got the motivations for conflict 1");
    // console.log("Got all the initial story objects for conflict 1");

    //if there's more than 1 conflict in the story, get the remaining elements and make sure they're unique
    // var i = 1;
    // for (i = 1; i < template.conflictCount; i++) {
    //     console.log("There is more than 1 conflict, so getting additional story objects");
    //     getUniqueStoryObjects(template.conflictCount,protagonists,"protagonist",chosenProtagonists[i]);
    //     console.log("got another unique protagonist for conflict " + (i+1));
    //     getUniqueStoryObjects(template.conflictCount,antagonists,"antagonist",chosenAntagonists[i]);
    //     console.log("got another unique antagonist for conflict " + (i+1));
    //     getUniqueStoryObjects(template.conflictCount,settings,"setting",chosenSettings[i]);
    //     console.log("got another unique setting for conflict " + (i+1));
    //     getUniqueStoryObjects(template.conflictCount,motivations,"motivation",chosenMotivations[i]);
    //     console.log("got another unique motivation for conflict " + (i+1));
    // }
    console.log("Exiting getAllObjectsForStoryTemplate function");
    return null;
}

//Add random and unique story objects to an array based on the required type and label from the conflict
function getUniqueStoryObjects(index,object,type,label) {
    console.log("Entered the getUniqueStoryObjects function with index " + index + " type " + type + " and label " + label);
    if (index == 0) {
        object[index] = getRandomStoryObject(type,label);        
    }
    if (index > 0) {
        do {
            object[index] = getRandomStoryObject(type,label);
        }
        while (object[index].text == object[index - 1].text)
    }
 
    // var i = 0;
    // for (i = 0; i < count; i++) {
        // object[i] = getRandomStoryObject(type,label);
        // console.log("Entered for loop to set object to " + object[i].text);
        // if (i > 0) {
        //     console.log("Entered if i > 0 statement. This shouldn't happen anymore.");
        //     if (object[i] == object[i-1]) {
        //         // console.log("Objects matched, retrying...");
        //         i--;
        //     }
        // }
    // }
    // console.log("Got " + object.length + " unique story objects of type " + type);
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
        var selectedProtagonist = [];
        var selectedAntagonist = [];
        var selectedSetting = [];
        var selectedMotivation = [];

        console.log("going to get all objects for template " + selectedStoryTemplate.template);
        getAllObjectsForStoryTemplate (
            selectedStoryTemplate,
            selectedConflict,
            selectedProtagonist,
            selectedAntagonist,
            selectedSetting,
            selectedMotivation
        );

        // Get the string that will be used to describe the scene and replace all the relevant objects
        var sceneText = getConflictTemplateString(selectedStoryTemplate,selectedConflict,selectedSetting,selectedProtagonist,selectedAntagonist,selectedMotivation);
        sceneText = sceneText.charAt(0).toUpperCase() + sceneText.slice(1);
        message.channel.send(sceneText);
    }


}
module.exports = GenerateScenarioCommand;