copySVGString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/></svg>'

ColorTypeEnums = Object.freeze({
    unity: "unity",
    rgba: "rgba", 
    "allValues": ["unity", "rgba"]
});

(function () {
    var colorBox = {
        constructor: function(app) {
            this.app = app;
            self = this;
            initialColor = this.app.body.css('background');
            this.options = {
                flat: true,
                chooseText: 'ok',
                color: initialColor,
                showAlpha: true,
                showButtons: false,
                preferredFormat: "hex",
                move: function(col) { self.onMove(col.toHexString()); },
                change: function(col) { self.onChange(col.toHexString()); },
                hide: function(col) { self.onHide(col.toHexString()); }
            }
        },
        onMove: function(color) {
            this.app.result.css('background', color);
            this.app.body.css('background', color);
            this.broadcast(color);
        },
        onChange: function(color) {
            this.app.result.css('background', color);
            this.app.body.css('background', color);
            this.broadcast(color);
        },
        onHide: function(color) {
            this.result.css('background', color);
            this.broadcast(color);
        },
        broadcast: function(color) {
            // this.output.html('Final color: ' + hexCalculator.toUnityRGBA(color));
            this.app.updateColor(color);
        }
    }

    var hexCalculator = {
        toRGBA: function(hexString) {
            var hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i.exec(hexString);
            return hexRegex ? {
                r: parseInt(hexRegex[1], 16),
                g: parseInt(hexRegex[2], 16),
                b: parseInt(hexRegex[3], 16),
                a: parseInt(hexRegex[4], 16)
            } : null;
        },
        toRGBAOutput: function(hexString) {
            var rgba = this.toRGBA(hexString);
            return "rgb" + (!isNaN(rgba.a) ? "a" : "")
                    + "("
                    + rgba.r + ","
                    + rgba.g + ","
                    + rgba.b
                    + (!isNaN(rgba.a) ? "," + rgba.a : "")
                    + ")";
        },
        toUnityRGBA: function(hexString) {
            var rgba = this.toRGBA(hexString);
            var unityColor = rgba ? {
                r: rgba.r / 256,
                g: rgba.g / 256,
                b: rgba.b / 256,
                a: rgba.a / 256
            } : null;
            var unityFormat = this.formatForUnity(unityColor);
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

    var outputCell = {
        constructor: function(colorType, colorValue) {
            this.colorType = colorType;
            this.colorValue = colorValue;
        },
        getHTML: function() {
            var div = document.createElement("div");
            div.className = "outputCell";
            div.id = this.colorType;
            this.colorTypeTitleLabel = document.createElement("h3");
            this.colorTypeTitleLabel.appendChild(document.createTextNode(this.colorType));
            this.copySVG = document.createElement("div");
            this.copySVG.innerHTML = copySVGString;
            this.colorValueLabel = document.createElement("p");
            this.colorValueLabel.appendChild(document.createTextNode(this.colorValue));
            div.appendChild(this.colorTypeTitleLabel);
            div.appendChild(this.copySVG);
            div.appendChild(this.colorValueLabel);
            div.addEventListener("click", outputCell.buttonEvent.bind(this));
            return div;
            return ('<div class="outputCell" id="outputCell"><h3>Unity C#</h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/></svg><p>new Color(0.1, 0.2, 0.3, 1);</p></div>');
        },
        buttonEvent: function() {
            // var range = document.body.createTextRange();
            // range.moveToElementText(this.colorType);
            // range.select();
            // TextSelect.apply(document);
            if(window.getSelection()) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(document.getElementById(this.colorType).lastChild);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            document.execCommand("Copy");
        }
    }

    var app = {
        start: function() {
            this.fetchUI();
            this.colorBox = Object.create(colorBox);
            this.colorBox.constructor(this);
            var colorPicker = $('#color-picker').spectrum(this.colorBox.options);
            this.colorBox.broadcast(colorPicker.spectrum('get').toHexString());
        },
        fetchUI: function() {
            this.body = $('body');
            this.hexInput = $('#hexTextInput');
            this.output = $('#output');
            this.outputCell = $('outputCell');
            this.result = $('#result');
        },
        updateColor: function(color) {
            this.hexInput[0].value = color;
            console.log(this.hexInput);
            for (let colorType of ColorTypeEnums.allValues) {
                var convertedColorTypeString;
                var convertedColor;
                switch (colorType) {
                    case ColorTypeEnums.unity:
                        convertedColorTypeString = "Unity C#";
                        convertedColor = hexCalculator.toUnityRGBA(color);
                        break;
                    case ColorTypeEnums.rgba:
                        convertedColorTypeString = "RGBA";
                        convertedColor = hexCalculator.toRGBAOutput(color);
                        break;
                    default:
                        break;
                }
                if(convertedColor == null){ return; }
                var cell = document.getElementById(colorType);
                if(!cell) {
                    var newObjectCell = Object.create(outputCell);
                    newObjectCell.constructor(colorType, convertedColor);
                    cell = newObjectCell.getHTML();
                    document.getElementById("output").appendChild(cell);
                }
                cell.children[0].innerHTML = convertedColorTypeString;
                cell.lastElementChild.innerHTML = convertedColor;
            }
        }
     };

    $(function () {
        app.start();
    });
})();