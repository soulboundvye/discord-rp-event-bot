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
    console.log(template.text);
    var conflict1Lead, conflict2Lead;

    text = template.text.split(" ");

    var con1Pos = text.indexOf("CONFLICT1"),
    con2Pos = text.indexOf("CONFLICT2");

    // console.log(text[con1Pos-1] + " " + text[con2Pos-1]);


    if (text[con1Pos-1] == "PROTAGONIST1") { conflict1Lead = "protagonist1"; }
    if (text[con1Pos-1] == "PROTAGONIST2") { conflict1Lead = "protagonist2"; }
    if (text[con1Pos-1] == "ANTAGONIST1") { conflict1Lead = "antagonist1"; }
    if (text[con1Pos-1] == "ANTAGONIST2") { conflict1Lead = "antagonist2"; }

    if (text[con2Pos-1] == "PROTAGONIST1") { conflict2Lead = "protagonist1"; }
    if (text[con2Pos-1] == "PROTAGONIST2") { conflict2Lead = "protagonist2"; }
    if (text[con2Pos-1] == "ANTAGONIST1") { conflict2Lead = "antagonist1"; }
    if (text[con2Pos-1] == "ANTAGONIST2") { conflict2Lead = "antagonist2"; }

    console.log(conflict1Lead, conflict2Lead);


    var i;
    for (i = 0; i < text.length; i++) {
        switch (text[i]) {
            default:
                break;
            case "CONFLICT1":
                if (conflict1Lead == "protagonist1") {
                    text[i] = conflict[0].text + protagonist[0].verbConjugation + conflict[0].textAddon;
                }
                if (conflict1Lead == "protagonist2") {
                    text[i] = conflict[0].text + protagonist[1].verbConjugation + conflict[0].textAddon;
                }
                if (conflict1Lead == "antagonist1") {
                    text[i] = conflict[0].text + antagonist[0].verbConjugation + conflict[0].textAddon;
                }
                if (conflict1Lead == "antagonist2") {
                    text[i] = conflict[0].text + antagonist[1].verbConjugation + conflict[0].textAddon;
                }
                break;
            case "CONFLICT2":
                if (conflict2Lead == "protagonist1") {
                    text[i] = conflict[1].text + protagonist[0].verbConjugation + conflict[1].textAddon;
                }
                if (conflict2Lead == "protagonist2") {
                    text[i] = conflict[1].text + protagonist[1].verbConjugation + conflict[1].textAddon;
                }
                if (conflict2Lead == "antagonist1") {
                    text[i] = conflict[1].text + antagonist[0].verbConjugation + conflict[1].textAddon;
                }
                if (conflict2Lead == "antagonist2") {
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
        // console.log("current string is: " + text);
    }

    // console.log("Ready to join the string...");
    text = text.join(" ");
    // console.log("current string is: " + text);
    text = text.replace(/\s\./g, ".");
    text = text.replace(/\s\,/g, ",");

    //TODO: This needs some rethinking. It's not flowing well.
    // text = text.concat(" ", conflict[0].question);
    // text = text.concat(" ", conflict[1].question);
    // }
    console.log(`Final text is: ${text}`);
    return text;
}

//Returns randomly selected conflicts of the given type
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
                // if(conflicts.label.length > 1) {
                //     // console.log("there is more than one option, so we're randomly selecting it");
                //     object[i] = conflicts.label[Math.floor(Math.random() * conflicts.label.length)];
                // }
                // else {
                    // console.log("there is not more than one option, so just setting the value to " + conflicts[i].label[0]);
                    object[i] = conflicts.label;
                // }
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

//Returns conflicts that match the criteria in the story objects
function getConflicts(protagonists,antagonists,settings,usedConflicts) {
    //the arguments passed in are from an array 
    //need to find a conflict that meet the requirements (eventually should be unique)
    //this function will be called for each scene which could have 2 conflicts, so must return 2 conflicts
    var matchingConflicts = [], filteredConflicts = [], requirements;
    try {
        for (var i = 0; i < 2; i++) {
            // console.log(`Looking for ${protagonists[i].label} protagonist, ${antagonists[i].label} antagonist, and ${settings[i].label} setting`);
            requirements = {protagonist: protagonists[i].label, antagonist: antagonists[i].label, setting: settings[i].label};
            filteredConflicts = conflictArray.filter(hasRequiredActors,requirements);
            // console.log(`Number of filtered conflicts: ${filteredConflicts.length}`);
            //get the index of any already used conflicts so they can be removed
            for (var j = 0; j < usedConflicts.length; j++) {
                console.log(`Checking for already used conflict.`);
                var index = filteredConflicts.indexOf(usedConflicts[j]);
                if (index >= 0) {
                    console.log(`Removing already used conflict: ${usedConflicts[j].text}`);
                    filteredConflicts.splice(index,1);
                }
            }
            console.log(`Number of filtered conflicts after removal: ${filteredConflicts.length}`);
            matchingConflicts[i] = filteredConflicts[Math.floor(Math.random() * filteredConflicts.length)];
            usedConflicts.push(matchingConflicts[i]);
            console.log(`Matching conflicts: ${matchingConflicts[i].text}`);
            console.log(`Already used ${usedConflicts.length} conflicts.`);
        }
    } catch (e) {
        console.log(e);
    }

    return matchingConflicts;
}

//Returns motivations that match the criteria in the conflict and haven't been used yet
function getMotivations(conflicts,usedMotivations) {
    var matchingMotivations = [], filteredMotivations = [];
    try {
        for (var i = 0; i < conflicts.length; i++) {
            // console.log(`Getting motivations for ${conflicts[i].text}`);
            filteredMotivations = motivationArray.filter(hasRequiredTheme,conflicts[i].label);
            // console.log(`Number of filtered motivations: ${filteredMotivations.length}`);
            //get the index of any already used motivations so they can be removed
            for (var j = 0; j < usedMotivations.length; j++) {
                // console.log(`Checking for already used motivations.`);
                var index = filteredMotivations.indexOf(usedMotivations[j]);
                if (index >= 0) {
                    // console.log(`Removing already used motivation: ${usedMotivations[j].text}`);
                    filteredMotivations.splice(index,1);
                }
            }
            // console.log(`Number of filtered motivations after removal: ${filteredMotivations.length}`);
            matchingMotivations[i] = filteredMotivations[Math.floor(Math.random() * filteredMotivations.length)];
            usedMotivations.push(matchingMotivations[i]);
            // console.log(`Got motivation ${matchingMotivations[i].text} for conflict ${conflicts[i].text}`);
            // console.log(`Already used ${usedMotivations.length} motivations.`);
        }
    } catch (e) {
        console.log(e);
    }
    return matchingMotivations; 
}

//for use with filter function for conflicts
function hasRequiredActors(conflict) {
    // console.log(`Looking for a matching conflict for ${this.protagonist}, ${this.antagonist}, ${this.setting}`);
    // console.log(`Against conflict ${conflict.text} with requirements ${conflict.protagonistReq}, ${conflict.antagonistReq}, ${conflict.settingReq}`);
    var result = conflict.protagonistReq.some(hasLabel,this.protagonist) &&
        conflict.antagonistReq.some(hasLabel,this.antagonist) &&
        conflict.settingReq.some(hasLabel,this.setting);
    // console.log(`Conflict ${conflict.text} has matching actors: ${result}`);
    return result;

}

//for use with filter function for motivations
function hasRequiredTheme(motivation) {
    // console.log(`Checking if ${motivation.text} contains ${this} theme`);
    var result = motivation.label.some(hasLabel,this);
    // console.log(result);
    return result;
}

//for use with filter function for story templates
function hasRequiredStoryType(story) {
    // console.log(`Checking story type ${story.label} against ${this}`);
    var result = (story.label == this);
    // console.log(result);
    return result;
}

//for use with filter function
function hasLabel(labelToCheck) {
    // console.log(`Checking label ${labelToCheck} against ${this}`);
    return labelToCheck == this;
}

//for use with filter function
function hasLabelInArray(arrayToCheck) {
    var i = 0;
    // console.log(`Checking in ${arrayToCheck.text} for ${this.label}`);
    // for (i = 0; i < arrayToCheck.length; i++) {
        if (this.label == arrayToCheck.label) return true;
    // }
    // console.log(`Didn't find ${this.label}`);
    return false;
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
        /* randomly select one or more story template.  If more than 1, should be an intro type
        and ending type. If 3 or more, all the middle ones should be middle types.
        */
        var i;
        var selectedStoryTemplate = [];
        try {
            for (i = 0; i < args; i++) {
                if (i == 0)
                {
                    var introTemplates = storyTemplateArray.filter(hasRequiredStoryType,"intro");
                    selectedStoryTemplate[i] = introTemplates[Math.floor(Math.random() * introTemplates.length)];
                    // console.log(`Got an intro template: ${selectedStoryTemplate[i].name}`);
                }
                if (i > 0) {
                    if (i == (args - 1)) {
                        var endingTemplates = storyTemplateArray.filter(hasRequiredStoryType,"ending");
                        selectedStoryTemplate[i] = endingTemplates[Math.floor(Math.random() * endingTemplates.length)];
                        // console.log(`Got an ending template: ${selectedStoryTemplate[i].name}`);
                    }
                    else {
                        var middleTemplates = storyTemplateArray.filter(hasRequiredStoryType,"middle");
                        selectedStoryTemplate[i] = middleTemplates[Math.floor(Math.random() * middleTemplates.length)];                    
                        // console.log(`Got a middle template: ${selectedStoryTemplate[i].name}`);
                    }
                }
            }
            // console.log(`Selected ${selectedStoryTemplate.length} templates`);
        } catch (e) {
            console.log(e.stack);
        }
        //randomly select a couple protagonists and antagonists (there should only be 2 of each per week)
        //randomly get some settings (a couple per week)
        var selectedProtagonist = [];
        var selectedAntagonist = [];
        var selectedSetting = [];
        for (i = 0; i < 2; i++) {
            try {
                selectedProtagonist[i] = protagonistArray[Math.floor(Math.random() * protagonistArray.length)];
                selectedAntagonist[i] = antagonistArray[Math.floor(Math.random() * antagonistArray.length)];
                selectedSetting[i] = settingArray[Math.floor(Math.random() * settingArray.length)];
            } catch (e) {
                console.log(e);
            }
        }
        console.log("Got the actors. Now on to the conflict and motivation.");

        //use their types to select some conflicts they work in (there should be a new one for each story template)
        var selectedConflicts = [];
        var selectedMotivation = [], alreadyUsedConflicts = [], alreadyUsedMotivations = [];
        for (i = 0; i < args; i++) {
            try {
                selectedConflicts[i] = getConflicts(selectedProtagonist,selectedAntagonist,selectedSetting,alreadyUsedConflicts);
                // console.log(`Got 2 random conflicts with labels: ${selectedConflicts[i][0].label}, ${selectedConflicts[i][1].label}`);
            } catch (e) {
                console.log(e);
            }
        }
        //and motivations too (a couple per story template)
        for (i = 0; i < args; i++) {
            try {
                selectedMotivation[i] = getMotivations(selectedConflicts[i],alreadyUsedMotivations);
            } catch (e) {
                console.log(e);
            }
        }

        // console.log("going to get all objects for the week's stories");
        // try {
        //     await getAllObjects (
        //         2, /*generating 2 of each for now*/
        //         selectedConflict,
        //         selectedProtagonist,
        //         selectedAntagonist,
        //         selectedSetting,
        //         selectedMotivation
        //     );
        // } catch (e) {
        //     console.log(e.stack);
        // }

        // Get the string that will be used to describe the scene and replace all the relevant objects
        var sceneText = [];
        for (i = 0; i < args; i++) {
            try {
                sceneText[i] = getConflictTemplateString(selectedStoryTemplate[i],selectedConflicts[i],selectedSetting,selectedProtagonist,selectedAntagonist,selectedMotivation[i]);
                sceneText[i] = sceneText[i].charAt(0).toUpperCase() + sceneText[i].slice(1);
                message.channel.send(sceneText[i]);
            } catch (e) {
                console.log(e.stack);
            }            
        }
    }
}
module.exports = GenerateScenarioCommand;