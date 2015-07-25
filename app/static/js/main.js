'use strict';
/* exported scatterplot, DigitCanvas, digitCanvas */

var Scatterplot3 = require('./Scatterplot3');
var DigitCanvas = require('./DigitCanvas');

var scatterplot;

var scatterPlotWidth = $('#scatterplotDiv').width();
var scatterPlotHeight = $('#scatterplotDiv').height();
var digitCanvasWidth = $('#canvasDiv').width();
var digitCanvasHeight = $('#canvasDiv').width();

var query = {
    limit: 10000,
    select: ['id', 'label', 'tsne_x', 'tsne_y', 'tsne_z']
};

var digitCanvas = new DigitCanvas('digitCanvas', digitCanvasWidth,
    digitCanvasHeight);

$.ajax({
    type: 'GET',
    url: '/api?' + $.param(query, true),
    success: function(data) {
        console.log(data.result.length);
        scatterplot = new Scatterplot3('scatterplotDiv', scatterPlotWidth,
            scatterPlotHeight, data.result);
    }
});

$('body').on('updatePoint', function(event, data) {
    var query = {
        id: data,
        select: ['array']
    };

    $.ajax({
        type: 'GET',
        url: '/api?' + $.param(query, true),
        success: function(data) {
            var digitArray = JSON.parse('[' + data.result[0].array + ']');
            digitCanvas.draw(digitArray[0]);
        }
    });
});
