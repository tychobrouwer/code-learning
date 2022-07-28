"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalStorage = exports.setLocalStorage = exports.randomFromMinMax = exports.randomFromArray = void 0;
function randomFromArray(propbabilityArray) {
    return propbabilityArray[Math.floor(Math.random() * propbabilityArray.length)];
}
exports.randomFromArray = randomFromArray;
function randomFromMinMax(min, max) {
    return (max !== -1) ? Math.floor(Math.random() * (max - min + 1)) + min : min;
}
exports.randomFromMinMax = randomFromMinMax;
function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
exports.setLocalStorage = setLocalStorage;
function getLocalStorage(key) {
    const data = localStorage.getItem(key);
    if (!data) {
        return {};
    }
    return JSON.parse(data);
}
exports.getLocalStorage = getLocalStorage;
//# sourceMappingURL=helper.js.map