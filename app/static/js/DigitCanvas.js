'use strict';

var Utils = require('./Utils');

function DigitCanvas(element, width, height) {
    this.canvas = document.getElementById(element);
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');

    this.gridWidth = this.canvas.width/28;
    this.gridHeight = this.canvas.height/28;
}

DigitCanvas.prototype.draw = function(valueArray) {
    for(var i = 0; i < valueArray.length; i++) {
        var cellX = i % 28;
        var cellY = Math.floor(i / 28);
        this.drawCell(valueArray[i], cellX, cellY);
    }
};

DigitCanvas.prototype.drawCell = function(value, cellX, cellY) {
    this.context.fillStyle = Utils.rgbToHex(255 - value, 255 - value, 255 - value);
    this.context.fillRect(this.gridWidth * cellX, this.gridHeight * cellY,
        this.gridWidth, this.gridHeight);
};

module.exports = DigitCanvas;

