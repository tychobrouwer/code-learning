import { Keyboard, Keys } from './types';

export const keyboard: Keyboard = {
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

  listenForEvents: function(keys: string[]) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (this: Keyboard, keyCode: string) {
      this._keys[keyCode as keyof Keys] = false;
    }.bind(this));

  },

  _onKeyDown: function(event: KeyboardEvent) {
    const keyCode = event.key;

    if (keyCode in this._keys) {
      event.preventDefault();
      this._keys[keyCode as keyof Keys] = true;
    }
  },

  _onKeyUp: function(event: KeyboardEvent) {
    const keyCode = event.key;

    if (keyCode in this._keys) {
      event.preventDefault();
      this._keys[keyCode as keyof Keys] = false;
    }
  },

  isDown: function(keyCode: string):boolean {
    if (!(keyCode in this._keys)) {
      throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }

    return this._keys[keyCode as keyof Keys];
  }
};
