"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyboard = void 0;
exports.keyboard = {
    LEFT: 'a',
    RIGHT: 'd',
    UP: 'w',
    DOWN: 's',
    ENTER: 'Enter',
    _keys: {
        a: false,
        d: false,
        w: false,
        s: false,
        enter: false,
    },
    listenForEvents: function (keys) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        keys.forEach(function (keyCode) {
            this._keys[keyCode] = false;
        }.bind(this));
    },
    _onKeyDown: function (event) {
        const keyCode = event.key;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = true;
        }
    },
    _onKeyUp: function (event) {
        const keyCode = event.key;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = false;
        }
    },
    isDown: function (keyCode) {
        if (!(keyCode in this._keys)) {
            throw new Error('Keycode ' + keyCode + ' is not being listened to');
        }
        return this._keys[keyCode];
    }
};
//# sourceMappingURL=keyboard.js.map