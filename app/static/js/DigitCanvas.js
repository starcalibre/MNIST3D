'use strict';

var Utils = require('./Utils');

function DigitCanvas(element, width, height) {
    this.canvas = document.getElementById(element);
    this.context = this.canvas.getContext('2d');
    this.lastValue = null;

    this.setSize(width, height);
}

DigitCanvas.prototype.draw = function(valueArray) {
    for(var i = 0; i < valueArray.length; i++) {
        var cellX = i % 28;
        var cellY = Math.floor(i / 28);
        this.drawCell(valueArray[i], cellX, cellY);
    }
    this.lastValue = valueArray;
};

DigitCanvas.prototype.drawCell = function(value, cellX, cellY) {
    this.context.fillStyle = Utils.rgbToHex(255 - value,
        255 - value, 255 - value);
    this.context.lineWidth = 0;
    this.context.fillRect(this.gridWidth * cellX, this.gridHeight * cellY,
        this.gridWidth, this.gridHeight);
};

DigitCanvas.prototype.setSize = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gridWidth = this.canvas.width/28;
    this.gridHeight = this.canvas.height/28;
};

DigitCanvas.prototype.resize = function(width, height) {
    this.setSize(width, height);
    if(this.lastValue) {
        this.draw(this.lastValue);
    }
};

module.exports = DigitCanvas;

