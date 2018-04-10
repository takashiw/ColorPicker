(function () {
    var app = {
        start: function() {
            this.body = $('body');
            this.output = $('#output');
            this.result = $('#result');
            var self = this,
                initialColor = this.body.css('background');
            var colorPicker = $('#color-picker').spectrum({
                flat: true,
                chooseText: 'ok',
                color: initialColor,
                showAlpha: true,
                showButtons: false,
                preferredFormat: "hex",
                move: function(col) { self.onMove(col.toHexString()); },
                change: function(col) { self.onChange(col.toHexString()); },
                hide: function(col) { self.onHide(col.toHexString()); }
            });
            this.broadcast(colorPicker.spectrum('get').toHexString());
        },
        broadcast: function(color) {
            this.output.html('Final color: ' + hexCalculator.toUnityRGBA(color));
        },
        onMove: function(color) {
            this.result.css('background', color);
            this.body.css('background', color);
            this.broadcast(color);
        },
        onChange: function(color) {
            this.result.css('background', color);
            this.body.css('background', color);
            this.broadcast(color);
        },
        onHide: function(color) {
            this.result.css('background', color);
            this.broadcast(color);
        }
     };

    var hexCalculator = {
        toRGBA: function(hexString) {
            var hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i.exec(hexString);
            console.log(hexRegex);
            return hexRegex ? {
                r: parseInt(hexRegex[1], 16),
                g: parseInt(hexRegex[2], 16),
                b: parseInt(hexRegex[3], 16),
                a: parseInt(hexRegex[4], 16)
            } : null;
        },
        toUnityRGBA: function(hexString) {
            console.log(hexString);
            var rgba = this.toRGBA(hexString);
            var unityColor = rgba ? {
                r: rgba.r / 256,
                g: rgba.g / 256,
                b: rgba.b / 256,
                a: rgba.a / 256
            } : null;
            var unityFormat = this.formatForUnity(unityColor);
            console.log(unityFormat);
            return unityFormat;
        },
        formatForUnity: function(unityColor) {
            return "Color(" 
                    + unityColor.r.toPrecision(2) + ", "
                    + unityColor.g.toPrecision(2) + ", "
                    + unityColor.b.toPrecision(2)
                    +   (!isNaN(unityColor.a) ? 
                            ( ", " + unityColor.a.toPrecision(2) + ");")
                            : (");")
                        ); 
        }
    }

    $(function () {
        app.start();
    });
})();