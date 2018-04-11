copySVGString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/></svg>'

ColorTypeEnums = Object.freeze({
    unity: "unity",
    rgba: "rgba", 
    hex: "hex", 
    "allValues": ["unity", "rgba", "hex"]
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
        setColorBrightness: function(color, deltaBrightness) {
            let rgba = this.toRGBA(color);
            let newRGBA = rgba;
            let changeInBrightness255 = deltaBrightness * 255;
            newRGBA.r = parseInt(newRGBA.r + changeInBrightness255);
            newRGBA.g = parseInt(newRGBA.g + changeInBrightness255);
            newRGBA.b = parseInt(newRGBA.b + changeInBrightness255);

            newRGBA.r = (newRGBA.r < 255) ? newRGBA.r : 255
            newRGBA.g = (newRGBA.g < 255) ? newRGBA.g : 255
            newRGBA.b = (newRGBA.b < 255) ? newRGBA.b : 255
            newRGBA.r = (newRGBA.r > 0) ? newRGBA.r : 0
            newRGBA.g = (newRGBA.g > 0) ? newRGBA.g : 0
            newRGBA.b = (newRGBA.b > 0) ? newRGBA.b : 0

            let hexR = (newRGBA.r.toString(16).length == 1) ? "0" + newRGBA.r.toString(16) : newRGBA.r.toString(16);
            let hexG = (newRGBA.g.toString(16).length == 1) ? "0" + newRGBA.g.toString(16) : newRGBA.g.toString(16);
            let hexB = (newRGBA.b.toString(16).length == 1) ? "0" + newRGBA.b.toString(16) : newRGBA.b.toString(16);
            return "#"+hexR+hexG+hexB
        },
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
        rgbaToHex: function() {

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
            this.toolTip = document.createElement("div");
            this.toolTip.className = "toolTip";
            this.toolTipLabel = document.createElement("h5");
            this.toolTipLabel.appendChild(document.createTextNode("copy this?"));
            this.toolTip.appendChild(this.toolTipLabel);
            this.copySVG = document.createElement("div");
            this.copySVG.innerHTML = copySVGString;
            this.colorValueLabel = document.createElement("p");
            this.colorValueLabel.appendChild(document.createTextNode(this.colorValue));
            div.appendChild(this.colorTypeTitleLabel);
            div.appendChild(this.toolTip);
            div.appendChild(this.copySVG);
            div.appendChild(this.colorValueLabel);
            div.addEventListener("click", outputCell.buttonEvent.bind(this));
            div.addEventListener("mouseleave", outputCell.hoverEvent.bind(this));
            return div;
            return ('<div class="outputCell" id="outputCell"><h3>Unity C#</h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/></svg><p>new Color(0.1, 0.2, 0.3, 1);</p></div>');
        },
        setColor: function(color) {
            var style = document.createElement('style');
            var css = "::selection{ background-color: " + color + " } " + ".outputCell:active {background-color: " + color + "}" ;

            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            document.getElementsByTagName('head')[0].appendChild(style);

            let outputCells = document.getElementsByClassName("outputCell");
            console.log(outputCells);
            for (let index = 0; index < outputCells.length; index++) {
                console.log("cell is" + outputCells[index]);
                
            }
            for (let cellIndex in outputCells) {
                // outputCells[1].style.borderColor = color;
            }

        },
        buttonEvent: function() {
            this.setCopiedState(true);

            if(window.getSelection()) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(document.getElementById(this.colorType).lastChild);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            document.execCommand("Copy");
        },
        hoverEvent: function() {
            setTimeout(this.setCopiedState.bind(this),100);

        },
        setCopiedState: function(isCopied) {
            let outputCell = document.getElementById(this.colorType);
            let outputCellTip = outputCell.children[1];

            if(isCopied) {
                outputCellTip.childNodes[0].innerHTML = "copied to clipboard!";
                outputCellTip.style.color = "black";
            } else {
                outputCellTip.childNodes[0].innerHTML = "copy this?";
                outputCellTip.style.color = "#9B9B9B";
            }
        }
    }

    var eyeTracker = {
        eyes : {},
        createEye(elementID){
            let eye = document.getElementById(elementID);
            let pupil = eye.lastElementChild;
            let eyeBounds = eye.getBoundingClientRect();
            let centerX = eyeBounds.left + eyeBounds.width/2;
            let centerY = eyeBounds.top + eyeBounds.height/2;
            let radius = eyeBounds.width / 2;
            this.eyes[elementID] = {pupil, centerX, centerY, radius};
        },
        calculateMouseToPupilMargins: function (eye, mouseX, mouseY) {
            var x = mouseX - eye.centerX;
            var y = mouseY - eye.centerY;
            var r = eye.radius;
            var eyePosition = {x:x, y:y};
            if(x*x + y*y > r*r) {
                if(x !== 0) {
                    var m = y/x;
                    eyePosition.x = Math.sqrt(r*r / (m*m + 1));
                    eyePosition.x = (x > 0)? eyePosition.x : -eyePosition.x;
                    eyePosition.y = Math.abs(m * eyePosition.x);
                    eyePosition.y = (y > 0)? eyePosition.y : -eyePosition.y;
                } else {
                    eyePosition.y = y > 0? r : -r;
                }
            }
            return eyePosition;
        },
        setPupil: function(pupil, pupilMargins) {
            pupil.style.left = pupilMargins.x.toPrecision(2) + "px";
            pupil.style.top = pupilMargins.y.toPrecision(2) + "px";
        },
        startTracking: function() {
            selfEyes = this;
            document.onmousemove = function(e) {
                var mouseX = e.clientX;
                var mouseY = e.clientY;
                for (var key in selfEyes.eyes) {
                    let eye = selfEyes.eyes[key];
                    let eyePupilMargins = selfEyes.calculateMouseToPupilMargins(eye, mouseX, mouseY);
                    selfEyes.setPupil(eye.pupil, eyePupilMargins);
                }
            }
        }
    }

    var chami = {
        constructor: function(elementID) {
            this.element = document.getElementById(elementID);
            this.eyeTracker = Object.create(eyeTracker);
            this.eyeTracker.createEye("right");
            this.eyeTracker.createEye("left");
            this.eyeTracker.startTracking();
            this.changeColor("C1F68B");
        },
        changeColor: function(color) {
            this.element.style.fill = "red";
            let paths = this.element.querySelectorAll("path");
            for (let path of paths) {
                console.log(path + " will now turn " + color);
                path.style.fill = hexCalculator.setColorBrightness(color, 0.1);
                path.style.stroke = hexCalculator.setColorBrightness(color, -0.2);
            }
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
            this.chami = Object.create(chami);
            this.chami.constructor("chami");
        },
        updateColor: function(color) {
            console.log(this.chami);
            outputCell.setColor(color);
            this.chami.changeColor(color);
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
                    case ColorTypeEnums.hex:
                        convertedColorTypeString = "HEX";
                        convertedColor = color;
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
                cell.style.borderColor = color;
                cell.children[0].innerHTML = convertedColorTypeString;
                cell.lastElementChild.innerHTML = convertedColor;
            }
        }
     };

    $(function () {
        app.start();
    });
})();