const commando = require('discord.js-commando');
const storyTemplateData = require('../../data/story_templates.json');
const settingsData = require('../../data/settings.json');
const antagonistsData = require('../../data/antagonists.json');
const protagonistsData = require('../../data/protagonists.json');
const conflictsData = require('../../data/conflicts.json');
const motivationsData = require('../../data/motivations.json');

var protagonistArray = [];
var antagonistArray = [];
var settingArray = [];
var motivationArray = [];
var conflictArray = [];
var storyTemplateArray = [];

//Load the set of story objects from JSON that have a type that can be filtered from
protagonistArray = protagonistsData.protagonists;
antagonistArray = antagonistsData.antagonists;
settingArray = settingsData.settings;
motivationArray = motivationsData.motivations;
//Load the set of conflicts from JSON that require specific protagonists, antagonists, settings, and motivations
conflictArray = conflictsData.conflicts;
//Load the set of story templates from JSON to shove everything into
storyTemplateArray = storyTemplateData.story_templates;

var scenarioOfTheWeek;
var test;
test = "this is from generate_scene.js";

// Returns the text to be used by the conflict so that it is stated in English, not variables
function getConflictTemplateString(template,conflict,setting,protagonist,antagonist,motivation) {
    console.log("Entered getConflictTemplateString function");
    /*templates can have the following objects:
    SETTING = the name of a location or event (ex. a cave)
    RICHSETTING = a more descriptive name of a location or event (ex. a mysterious cave)
    PROTAGONIST = the name of a person or group (ex. a swineherd, the villagers)
    ANTAGONIST = the name of a person, group, beast, or nature (ex. the king, a cult, a lion, a storm)
    MOTIVATION = the theme of the conflict (ex. violence, wealth, fellowship, power)
    CONFLICT = the parameters for a story with a theme, protagonist, antagonist, setting, and action
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
    console.log(`Final text is: ${text}`);
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
function getAllObjects(count,conflicts,protagonists,antagonists,settings,motivations) {
   
    // console.log("Entered getAllObjects function");

    //select which labels will be used for the conflict, if there are choices
    var chosenProtagonists = [];
    var chosenAntagonists = [];
    var chosenSettings = [];
    var chosenMotivations = [];

    //for each conflict, go get the necessary stuffs
    var i = 0;
    for (i = 0; i < count; i++) {
        //randomize whether the conflict is for or against the protagonist
        var conflictType = Math.ceil(Math.random() * 2);
        if (conflictType == 1) {
            conflictType = "against";
        }
        else {
            conflictType = "for";
        }

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
    
    // console.log("Exiting getAllObjectsForStoryTemplate function");
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
        args = (args > 1) ? args : 1;
        // randomly select one or more story template 
        var i;
        var selectedStoryTemplate = [];
        for (i = 0; i < args; i++) {
            selectedStoryTemplate[i] = storyTemplateArray[Math.floor(Math.random() * storyTemplateArray.length)];
        }
        //and then use its requirements to generate the remaining parts
        //really should just get 2 of everything...
        var selectedConflict = [];
        var selectedProtagonist = [];
        var selectedAntagonist = [];
        var selectedSetting = [];
        var selectedMotivation = [];

        console.log("going to get all objects for the week's stories");
        try {
            await getAllObjects (
                2, /*generating 2 of each for now*/
                selectedConflict,
                selectedProtagonist,
                selectedAntagonist,
                selectedSetting,
                selectedMotivation
            );
        } catch (e) {
            console.log(e.stack);
        }
        //add all that data to a place to keep and reference for the week
        // scenarioOfTheWeek = {
        //     scenarioTemplate: selectedStoryTemplate,
        //     scenarioConflict: selectedConflict,
        //     scenarioProtagonist: selectedProtagonist,
        //     scenarioAntagonist: selectedAntagonist,
        //     scenarioSetting: selectedSetting,
        //     scenarioMotivation: selectedMotivation            
        // };

        // Get the string that will be used to describe the scene and replace all the relevant objects
        var sceneText = [];
        for (i = 0; i < args; i++) {
            try {
                sceneText[i] = await getConflictTemplateString(selectedStoryTemplate[i],selectedConflict,selectedSetting,selectedProtagonist,selectedAntagonist,selectedMotivation);
                console.log(`Got this back: ${sceneText}`);
                sceneText[i] = sceneText[i].charAt(0).toUpperCase() + sceneText[i].slice(1);
                message.channel.send(sceneText[i]);
            } catch (e) {
                console.log(e.stack);
            }            }
    }


}
module.exports = GenerateScenarioCommand;