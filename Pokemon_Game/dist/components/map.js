"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const constants_1 = require("../utils/constants");
class Map {
    constructor(map) {
        this.prevMapCols = 0;
        this.prevMapRows = 0;
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
        this.prevMapCols = this.currentMap.COLS;
        this.prevMapRows = this.currentMap.ROWS;
        this.currentMap = Object.assign({}, constants_1.constants.MAPS[mapName]);
        this.adjacentMaps = {};
        this.MapLocation = {
            xBegin: 0,
            xEnd: this.currentMap.COLS,
            yBegin: 0,
            yEnd: this.currentMap.ROWS,
        };
    }
    isNextMap(x, y) {
        if (this.MapLocation) {
            const currentCol = this.getCol(x);
            const currentRow = this.getRow(y);
            // console.debug('x-axis: ' + this.MapLocation.xBegin + ' : ' + currentCol + ' : ' + this.MapLocation.xEnd)
            // console.debug('y-axis: ' + this.MapLocation.yBegin + ' : ' + currentRow + ' : ' + this.MapLocation.yEnd)
            if (this.MapLocation.xBegin < currentCol && currentCol < this.MapLocation.xEnd) {
                if (this.MapLocation.yBegin > currentRow)
                    return [this.adjacentMaps['top'], 'top'];
                if (this.MapLocation.yEnd < currentRow)
                    return [this.adjacentMaps['bottom'], 'bottom'];
            }
            else {
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
            // const isSolid = tile === 10 || tile === 11 || tile === 12 || tile === 13 || tile === 36 || tile === 37 ||
            //                 tile === 38 || tile === 39 || tile === 40 || tile === 41 || tile === 42 ||
            //                 tile === 38 || tile === 39 || tile === 40 || tile === 41 || tile === 42;
            const solidTiles = [
                10, 11, 12, 13, 36, 37, 38, 39, 40, 41, 42,
                549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560,
                565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576,
                581, 582, 583, 584, 585, 597, 598, 599, 600, 601,
            ];
            const isSolid = solidTiles.includes(tile);
            const colHalfTile = col + 0.5;
            const rowHalfTile = row + 0.5;
            const oneWay = (tile === 3 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX !== 0)) ||
                (tile === 4 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX === -1)) ||
                (tile === 7 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && (dirY === -1 || dirX === 1)) ||
                (tile === 5 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && colHalfTile * constants_1.constants.MAP_TSIZE < x) ||
                (tile === 8 && rowHalfTile * constants_1.constants.MAP_TSIZE < y && colHalfTile * constants_1.constants.MAP_TSIZE > x) ||
                (tile === 6 &&
                    (rowHalfTile * constants_1.constants.MAP_TSIZE < y || colHalfTile * constants_1.constants.MAP_TSIZE < x) &&
                    (dirX === -1 || dirY === -1)) ||
                (tile === 9 && (rowHalfTile * constants_1.constants.MAP_TSIZE < y || colHalfTile * constants_1.constants.MAP_TSIZE < x &&
                    (dirX === 1 || dirY === -1))) ||
                (tile === 30 && (row + 0.3) * constants_1.constants.MAP_TSIZE < y) ||
                (tile === 33 && colHalfTile * constants_1.constants.MAP_TSIZE < x && (dirX === -1 || dirY !== 0)) ||
                (tile === 34 && colHalfTile * constants_1.constants.MAP_TSIZE < x && (dirX === -1 || dirY === 1));
            (tile === 35 &&
                (rowHalfTile * constants_1.constants.MAP_TSIZE < y ||
                    colHalfTile * constants_1.constants.MAP_TSIZE < x) && (dirX === -1 || dirY !== 0));
            return res || isSolid || oneWay;
        }, false);
    }
    addMap(mapName, location, tileOffset) {
        const mapToAdd = Object.assign({}, constants_1.constants.MAPS[mapName]);
        const finalLayers = [];
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
                    const arrayAddedMap = (typeof mapToAdd.layers[layer][begin2] === 'number') ? mapToAdd.layers[layer].slice(begin2, end2) : Array(end2 - begin2).fill(0);
                    if (location === 'left') {
                        finalLayers[layer].push(...arrayAddedMap);
                    }
                    finalLayers[layer].push(...arrayCurrentMap);
                    if (location === 'right') {
                        finalLayers[layer].push(...arrayAddedMap);
                    }
                }
                if (location === 'left' && layer === 0) {
                    // console.log('loading ' +  mapName + ' to left') 
                    this.MapLocation.xBegin = this.MapLocation.xBegin + mapToAdd.COLS;
                    this.MapLocation.xEnd = this.MapLocation.xEnd + mapToAdd.COLS;
                }
                // if (location === 'right' && layer === 0) {
                //   console.log('loading ' +  mapName + ' to right')
                // }
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
                    // if (layer === 0) {
                    //   console.log('loading ' +  mapName + ' to bottom')
                    // }
                    finalLayers[layer].push(...this.currentMap.layers[layer]);
                }
                finalLayers[layer].push(...arrayAddedMap);
                if (location === 'top') {
                    finalLayers[layer].push(...this.currentMap.layers[layer]);
                    if (layer === 0) {
                        // console.log('loading ' +  mapName + ' to top')
                        this.MapLocation.yBegin = this.MapLocation.yBegin + mapToAdd.ROWS;
                        this.MapLocation.yEnd = this.MapLocation.yEnd + mapToAdd.ROWS;
                    }
                }
                finalCols = this.currentMap.COLS;
                finalRows = this.currentMap.ROWS + mapToAdd.ROWS;
            }
        }
        // console.log('previous map rows: ' + this.prevMapRows + ' | current map rows:  ' + finalRows)
        // console.log('rows difference: ' + (finalRows - this.prevMapRows))
        // console.log('previous to top: ' + this.prevAddedRows + '    | added rows to top: ' + this.added[1])
        // console.log('rows added difference: ' + (this.added[1] - this.prevAddedRows))
        // console.log('previous map cols: ' + this.prevMapCols + ' | current map cols:  ' + finalCols)
        // console.log('cols difference: ' + (finalCols - this.prevMapCols))
        // console.log('previous to left: ' + this.prevAddedCols + '   | added cols to left: ' + this.added[0])
        // console.log('cols added difference: ' + (this.added[0] - this.prevAddedCols))
        this.adjacentMaps[location] = mapName;
        this.currentMap = {
            layers: finalLayers,
            COLS: finalCols,
            ROWS: finalRows,
        };
        return {
            currentMap: this.currentMap,
            diff: [finalCols - this.prevMapCols, finalRows - this.prevMapRows],
        };
    }
    getAjacent(mapName) {
        if (mapName === 'route 101') {
            return [
                { name: 'littleroot town', position: 'bottom' },
                { name: 'oldale town', position: 'top' },
            ];
        }
        else if (mapName === 'route 102') {
            return [
                { name: 'oldale town', position: 'right' },
            ];
        }
        else if (mapName === 'littleroot town') {
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