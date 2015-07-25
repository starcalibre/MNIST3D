'use strict';
/* exported scatterplot */

var Scatterplot3 = require('./Scatterplot3');
var scatterplot;

var width = $('#scatterplotDiv').width();
var height = $('#scatterplotDiv').height();

var query = {
    limit: 1000,
    select: ['id', 'label', 'tsne_x', 'tsne_y', 'tsne_z']
};

$.ajax({
    type: 'GET',
    url: '/api?' + $.param(query),
    success: function(data) {
        console.log(data.result);
        scatterplot = new Scatterplot3('scatterplotDiv', width,
            height, data.result);
    }
});
