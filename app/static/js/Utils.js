var Utils = {};

Utils.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

Utils.rgbToHex = function(r, g, b) {
    return '#' + Utils.componentToHex(r) + Utils.componentToHex(g) +
        Utils.componentToHex(b);
};

module.exports = Utils;
