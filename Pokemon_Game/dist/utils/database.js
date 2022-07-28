"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedDB = void 0;
class IndexedDB {
    constructor() {
        const request = indexedDB.open('Pokemon', 1);
        request.onupgradeneeded = (event) => {
            this.db = event.target;
        };
        request.onsuccess = (event) => {
            var _a;
            this.db = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
        };
    }
}
exports.IndexedDB = IndexedDB;
//# sourceMappingURL=database.js.map