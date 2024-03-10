import { ObjectId } from "mongodb";
import fs from 'fs';

/**
 * Checks to see if a string exists and returns a trimmed version of it
 * @param {string} str String to check
 * @param {string} label Name of the string (for printing out error messages)
 * @param {boolean} allowEmptySpaces Coding flag to not throw errors for having an empty string.
 * @param {array} extraChecks An array of [function, error message] pairs for extra checks.
 * @returns A trimmed string
 */
function checkString(str, label, allowEmptySpaces=false, extraChecks=undefined){
    if(typeof str !== "string") throw `${label} must exist and be a string.`;
    const trimmed = str.trim();
    if(!allowEmptySpaces && trimmed.length === 0) throw `${label} cannot be just empty spaces.`;
    if(extraChecks){
        for (const [func, msg] of extraChecks) {
            if(!func(trimmed)) throw `${label} ${msg}.`;
        }
    }
    return trimmed;
}

function checkObjectId(_id, label="_id"){
    return checkString(_id, label, false, [[(s) => ObjectId.isValid(s),"is not a valid ObjectId"]]);
}

function checkPath(path, label="path", fileTypes=["png","jpg","jpeg"]){
    return checkString(path, label, false, [
        [(s) => fs.existsSync(s),"is not a valid filepath"],
        [(s) => new RegExp(`.+\\.(${fileTypes.join('|')})$`,'g').test(s), "is not a valid file type"]
    ]);
}

function checkNum(num, label, extraChecks=undefined){
    if(typeof num !== "number" || isNaN(num)) throw `${label} is not a valid number.`;
    if(extraChecks){
        for(const [func, msg] of extraChecks){
            if(!func(num)) throw `${label} ${msg}.`;
        }
    }
    return num;
}

function checkArray(arr, label="arr", elementPredicate=[((el) => true), "is invalid"]){
    if(!Array.isArray(arr)) throw `${label} must be a valid array`;
    const result = arr.map(e => {
        if(!elementPredicate[0](e)) throw `Element '${e}' of ${label} ${elementPredicate[1]}.`;
        return e;
    });
    return result;
}

function checkStringArray(arr, label="arr", elementPredicate=[((el) => true), "is invalid"]){
    if(!Array.isArray(arr)) throw `${label} must be a valid array`;
    const result = arr.map(e => {
        if(!elementPredicate[0](e)) throw `Element '${e}' of ${label} ${elementPredicate[1]}.`;
        const trimmed = checkString(e, `Element of ${label}`);
        return trimmed;
    });
    return result;
}

export{
    checkString,
    checkObjectId,
    checkNum,
    checkPath,
    checkArray,
    checkStringArray
}