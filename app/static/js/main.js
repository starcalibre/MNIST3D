'use strict';
var Scatterplot3 = require('./Scatterplot3');
var DigitCanvas = require('./DigitCanvas');

var scatterplot;
var $body = $('body');
var $scatterplotDiv = $('#scatterplotDiv');
var $canvasDiv = $('#canvasDiv');

var scatterPlotWidth = $scatterplotDiv.width();
var scatterPlotHeight = $scatterplotDiv.height();
var digitCanvasWidth = $canvasDiv.width();
var digitCanvasHeight = $canvasDiv.width();

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
        scatterplot = new Scatterplot3('scatterplotDiv', scatterPlotWidth,
            scatterPlotHeight, data.result);
    }
});

// handle events when points in scatterplot clicked
$body.on('updatePoint', function(event, data) {
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

$('#reset-button').on('click', function() {
    scatterplot.resetView();
    $('input:checkbox').removeAttr('checked');
});

$('#rotate-x').on('change', function() {
    var val = $(this).is(':checked');
    scatterplot.toggleRotate('x', val);
});

$('#rotate-y').on('change', function() {
    var val = $(this).is(':checked');
    scatterplot.toggleRotate('y', val);
});

$('#rotate-z').on('change', function() {
    var val = $(this).is(':checked');
    scatterplot.toggleRotate('z', val);
});

var resizeDebounce;
$(window).on('resize', function() {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(function() {
        scatterPlotWidth = $scatterplotDiv.width();
        scatterPlotHeight = $scatterplotDiv.height();
        digitCanvasWidth = $canvasDiv.width();
        digitCanvasHeight = $canvasDiv.width();

        digitCanvas.resize(digitCanvasWidth, digitCanvasHeight);
        scatterplot.resize(scatterPlotWidth, scatterPlotHeight);
    }, 100);
});

// set the first point to be active when plot loaded
$body.trigger('updatePoint', 0);


