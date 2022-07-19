"use strict";
exports.__esModule = true;
exports.Pokemon = void 0;
var pokemonIndex = {
    1: {
        grassland: {
            zigzagoon: {
                name: 'Zigzagoon',
                level: [2, 3],
                encounterRate: 45
            },
            wurmple: {
                name: 'Wurmple',
                level: [2, 3],
                encounterRate: 45
            },
            poochyena: {
                name: 'Poochyena',
                level: [2, 3],
                encounterRate: 10
            }
        }
    },
    2: {}
};
var Pokemon = /** @class */ (function () {
    function Pokemon(route, environment) {
        var candinates = pokemonIndex[route][environment];
        var items = [];
        for (var pokemon in candinates) {
            for (var i = 1; i <= candinates[pokemon].encounterRate; i++) {
                items.push(pokemon);
            }
        }
        this.pokemon = candinates[items[Math.floor(Math.random() * items.length)]];
    }
    Pokemon.prototype.getPokemon = function () {
        return this.pokemon;
    };
    return Pokemon;
}());
exports.Pokemon = Pokemon;
//# sourceMappingURL=pokemon.js.map