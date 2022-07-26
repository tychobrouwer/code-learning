"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const constants_1 = require("../utils/constants");
class Map {
    constructor(map) {
        this.prevMapCols = 0;
        this.prevMapRows = 0;
        this.added = [0, 0];
        this.currentMap = map;
        this.adjacentMaps = {};
        this.MapLocation = {
            xBegin: 0,
            xEnd: this.currentMap.COLS,
            yBegin: 0,
            yEnd: this.currentMap.ROWS,
        };
    }
    getTile(layer, col, row) {
        return this.currentMap.layers[layer][row * this.currentMap.COLS + col];
    }
    updateMap(mapName) {
        this.added = [
            0,
            0
        ];
        // console.log(this.added[0], map.COLS)
        // console.log(this.added[1], map.ROWS)
        // this.prevMapCols = this.currentMap.COLS
        // this.prevMapRows = this.currentMap.ROWS
        this.currentMap = Object.assign({}, constants_1.constants.MAPS[mapName]);
        this.adjacentMaps = {};
        this.MapLocation = {
            xBegin: 0,
            xEnd: this.currentMap.COLS,
            yBegin: 0,
            yEnd: this.currentMap.ROWS,
        };
        // console.log(this.MapLocation)
        // this.added = [ 0, 0 ];
        // return added;
    }
    isNextMap(x, y) {
        if (this.MapLocation) {
            const currentCol = this.getCol(x);
            const currentRow = this.getRow(y);
            // console.debug('x-axis: ' + this.MapLocation.xBegin + ' : ' + currentCol + ' : ' + this.MapLocation.xEnd)
            console.debug('y-axis: ' + this.MapLocation.yBegin + ' : ' + currentRow + ' : ' + this.MapLocation.yEnd);
            if (this.MapLocation.xBegin < currentCol && currentCol < this.MapLocation.xEnd) {
                // console.log('y-axis')
                if (this.MapLocation.yBegin > currentRow)
                    return [this.adjacentMaps['top'], 'top'];
                if (this.MapLocation.yEnd < currentRow)
                    return [this.adjacentMaps['bottom'], 'bottom'];
            }
            else {
                // console.log('x-axis')
                if (this.MapLocation.xBegin > currentCol)
                    return [this.adjacentMaps['left'], 'left'];
                if (this.MapLocation.xEnd < currentCol)
                    return [this.adjacentMaps['right'], 'right'];
            }
        }
        return false;
    }
    isSolidTileAtXY(x, y, dirX, dirY) {
        const col = Math.floor(x / constants_1.constants.MAP_TSIZE);
        const row = Math.floor(y / constants_1.constants.MAP_TSIZE);
        return this.currentMap.layers.reduce((res, layer, index) => {
            const tile = this.getTile(index, col, row);
            const isSolid = tile === 10 || tile === 11 || tile === 12 || tile === 13;
            const colHalfTile = row + 0.5;
            const rowHalfTile = row + 0.5;
            const oneWay = (tile === 3 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX !== 0)) ||
                (tile === 4 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX === -1)) ||
                (tile === 7 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX === 1)) ||
                (tile === 5 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && colHalfTile * constants_1.constants.MAP_TSIZE < x) ||
                (tile === 8 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && colHalfTile * constants_1.constants.MAP_TSIZE > x) ||
                (tile === 6 && ((rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX !== 0)) ||
                    (colHalfTile * constants_1.constants.MAP_TSIZE < x && (dirX === -1 || dirY !== 0)))) ||
                (tile === 9 && ((rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX !== 0)) ||
                    (colHalfTile * constants_1.constants.MAP_TSIZE > x && (dirX === 1 || dirY !== 0)))) ||
                (tile === 30 && (row + 0.3) * constants_1.constants.MAP_TSIZE < y);
            return res || isSolid || oneWay;
        }, false);
    }
    addMap(locationName, location, tileOffset) {
        const mapToAdd = constants_1.constants.MAPS[locationName];
        const finalLayers = [];
        // const added = [ 0, 0 ];
        let finalCols = 0, finalRows = 0;
        for (let layer = 0; layer < this.currentMap.layers.length; layer++) {
            if (!finalLayers[layer])
                finalLayers[layer] = [];
            if (location === 'right' || location === 'left') {
                for (let row = 0; row < this.currentMap.ROWS; row++) {
                    const begin = row * this.currentMap.COLS;
                    const end = begin + this.currentMap.COLS;
                    const begin2 = row * mapToAdd.COLS;
                    const end2 = begin2 + mapToAdd.COLS;
                    const arrayCurrentMap = this.currentMap.layers[layer].slice(begin, end);
                    const arrayAddedMap = (mapToAdd.layers[layer][begin2]) ? mapToAdd.layers[layer].slice(begin2, end2) : Array(end2 - begin2).fill(0);
                    if (location === 'left') {
                        finalLayers[layer].push(...arrayAddedMap);
                    }
                    finalLayers[layer].push(...arrayCurrentMap);
                    if (location === 'right') {
                        finalLayers[layer].push(...arrayAddedMap);
                    }
                }
                if (location === 'left' && layer === 0) {
                    // added[0] = mapToAdd.COLS;
                    console.log('loading map to left');
                    this.MapLocation.xBegin = this.MapLocation.xBegin + mapToAdd.COLS;
                    this.MapLocation.xEnd = this.MapLocation.xEnd + mapToAdd.COLS;
                }
                if (location === 'right' && layer === 0) {
                    console.log('loading map to right');
                }
                finalCols = this.currentMap.COLS + mapToAdd.COLS;
                finalRows = this.currentMap.ROWS;
            }
            else if (location === 'top' || location === 'bottom') {
                const arrayAddedMap = [];
                for (let row = 0; row < mapToAdd.ROWS; row++) {
                    for (let col = 0; col < this.currentMap.COLS; col++) {
                        if (col >= tileOffset && col < this.currentMap.COLS + tileOffset) {
                            arrayAddedMap.push(mapToAdd.layers[layer][col - tileOffset + row * mapToAdd.COLS]);
                        }
                        else {
                            arrayAddedMap.push(0);
                        }
                    }
                }
                if (location === 'bottom') {
                    if (layer === 0) {
                        console.log('loading map to bottom');
                    }
                    finalLayers[layer].push(...this.currentMap.layers[layer]);
                }
                finalLayers[layer].push(...arrayAddedMap);
                if (location === 'top') {
                    finalLayers[layer].push(...this.currentMap.layers[layer]);
                    if (layer === 0) {
                        console.log('loading map to top');
                        this.MapLocation.yBegin = this.MapLocation.yBegin + mapToAdd.ROWS;
                        this.MapLocation.yEnd = this.MapLocation.yEnd + mapToAdd.ROWS;
                        this.added[1] = mapToAdd.ROWS;
                    }
                }
                finalCols = this.currentMap.COLS;
                finalRows = this.currentMap.ROWS + mapToAdd.ROWS;
            }
        }
        console.log('added rows to top: ' + this.added[1] + ' | current map rows: ' + this.currentMap.ROWS);
        console.log('map rows difference: ' + (this.added[1] - finalRows));
        this.adjacentMaps[location] = locationName;
        this.currentMap.layers = finalLayers;
        this.currentMap.COLS = finalCols;
        this.currentMap.ROWS = finalRows;
        const returnObject = {
            currentMap: this.currentMap,
            location: location,
            added: [this.added[0] - finalCols, this.added[1] - finalRows],
        };
        return returnObject;
    }
    getAjacent(mapName) {
        if (mapName === 'route 101') {
            return [
                { name: 'litteroot town', position: 'bottom' },
                { name: 'oldale town', position: 'top' },
            ];
        }
        else if (mapName === 'route 102') {
            return [
                { name: 'oldale town', position: 'right' },
            ];
        }
        else if (mapName === 'litteroot town') {
            return [
                { name: 'route 101', position: 'top' },
            ];
        }
        else if (mapName === 'oldale town') {
            return [
                { name: 'route 101', position: 'bottom' },
                { name: 'route 102', position: 'left' },
            ];
        }
        return [];
    }
    getCol(x) {
        return Math.floor(x / constants_1.constants.MAP_TSIZE);
    }
    getRow(y) {
        return Math.floor(y / constants_1.constants.MAP_TSIZE);
    }
    getX(col) {
        return col * constants_1.constants.MAP_TSIZE;
    }
    getY(row) {
        return row * constants_1.constants.MAP_TSIZE;
    }
}
exports.Map = Map;
//# sourceMappingURL=map.js.map