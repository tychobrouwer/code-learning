"use strict";
exports.__esModule = true;
exports.keyboard = void 0;
exports.keyboard = {
    LEFT: 'a',
    RIGHT: 'd',
    UP: 'w',
    DOWN: 's',
    _keys: {},
    listenForEvents: function (keys) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        keys.forEach(function (key) {
            this._keys[key] = false;
        }.bind(this));
    },
    _onKeyDown: function (event) {
        var keyCode = event.key;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = true;
        }
    },
    _onKeyUp: function (event) {
        var keyCode = event.key;
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