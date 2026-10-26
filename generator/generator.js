/* QR-Engine integriert, MIT-Lizenz siehe generator/QR_LICENSE.txt. */
/* QRCode for JavaScript © Kazuhiko Arase (MIT). Browser packaging from qrcode-terminal vendor. See QR_LICENSE.txt. */
(function(){
"use strict";
const definitions = Object.create(null);
const loaded = Object.create(null);
definitions['QR8bitByte'] = function(require,module,exports){
var QRMode = require('./QRMode');

function QR8bitByte(data) {
	this.mode = QRMode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function() {
		return this.data.length;
	},
	
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

module.exports = QR8bitByte;

};
definitions['QRBitBuffer'] = function(require,module,exports){
function QRBitBuffer() {
	this.buffer = [];
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

module.exports = QRBitBuffer;

};
definitions['QRErrorCorrectLevel'] = function(require,module,exports){
module.exports = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};


};
definitions['QRMaskPattern'] = function(require,module,exports){
module.exports = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

};
definitions['QRMath'] = function(require,module,exports){
var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

module.exports = QRMath;

};
definitions['QRMode'] = function(require,module,exports){
module.exports = {
    MODE_NUMBER :       1 << 0,
    MODE_ALPHA_NUM :    1 << 1,
    MODE_8BIT_BYTE :    1 << 2,
    MODE_KANJI :        1 << 3
};

};
definitions['QRPolynomial'] = function(require,module,exports){
var QRMath = require('./QRMath');

function QRPolynomial(num, shift) {
	if (num.length === undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] === 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var x = 0; x < e.getLength(); x++) {
			num[x] ^= QRMath.gexp(QRMath.glog(e.get(x) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

module.exports = QRPolynomial;

};
definitions['QRRSBlock'] = function(require,module,exports){
var QRErrorCorrectLevel = require('./QRErrorCorrectLevel');

function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

	// L
	// M
	// Q
	// H

	// 1
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	
	// 2
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],

	// 3
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],

	// 4		
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	
	// 5
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	
	// 6
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	
	// 7		
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	
	// 8
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	
	// 9
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	
	// 10		
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],

	// 11
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],

	// 12
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],

	// 13
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],

	// 14
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],

	// 15
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],

	// 16
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],

	// 17
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],

	// 18
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],

	// 19
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],

	// 20
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],

	// 21
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],

	// 22
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],

	// 23
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],

	// 24
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],

	// 25
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],

	// 26
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],

	// 27
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],

	// 28
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],

	// 29
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],

	// 30
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],

	// 31
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],

	// 32
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],

	// 33
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],

	// 34
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],

	// 35
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],

	// 36
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],

	// 37
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],

	// 38
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],

	// 39
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],

	// 40
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock === undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = [];
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
};

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
};

module.exports = QRRSBlock;

};
definitions['QRUtil'] = function(require,module,exports){
var QRMode = require('./QRMode');
var QRPolynomial = require('./QRPolynomial');
var QRMath = require('./QRMath');
var QRMaskPattern = require('./QRMaskPattern');

var QRUtil = {

    PATTERN_POSITION_TABLE : [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],        
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)    | (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) );    
        }
        return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) );    
        }
        return (data << 12) | d;
    },

    getBCHDigit : function(data) {

        var digit = 0;

        while (data !== 0) {
            digit++;
            data >>>= 1;
        }

        return digit;
    },

    getPatternPosition : function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
        
        switch (maskPattern) {
            
        case QRMaskPattern.PATTERN000 : return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001 : return i % 2 === 0;
        case QRMaskPattern.PATTERN010 : return j % 3 === 0;
        case QRMaskPattern.PATTERN011 : return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0;
        case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 === 0;

        default :
            throw new Error("bad maskPattern:" + maskPattern);
        }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

        var a = new QRPolynomial([1], 0);

        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
        }

        return a;
    },

    getLengthInBits : function(mode, type) {

        if (1 <= type && type < 10) {

            // 1 - 9

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 10;
            case QRMode.MODE_ALPHA_NUM  : return 9;
            case QRMode.MODE_8BIT_BYTE  : return 8;
            case QRMode.MODE_KANJI      : return 8;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 27) {

            // 10 - 26

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 12;
            case QRMode.MODE_ALPHA_NUM  : return 11;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 10;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 41) {

            // 27 - 40

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 14;
            case QRMode.MODE_ALPHA_NUM  : return 13;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 12;
            default :
                throw new Error("mode:" + mode);
            }

        } else {
            throw new Error("type:" + type);
        }
    },

    getLostPoint : function(qrCode) {
        
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0; 
        var col = 0;

        
        // LEVEL1
        
        for (row = 0; row < moduleCount; row++) {

            for (col = 0; col < moduleCount; col++) {

                var sameCount = 0;
                var dark = qrCode.isDark(row, col);

                for (var r = -1; r <= 1; r++) {

                    if (row + r < 0 || moduleCount <= row + r) {
                        continue;
                    }

                    for (var c = -1; c <= 1; c++) {

                        if (col + c < 0 || moduleCount <= col + c) {
                            continue;
                        }

                        if (r === 0 && c === 0) {
                            continue;
                        }

                        if (dark === qrCode.isDark(row + r, col + c) ) {
                            sameCount++;
                        }
                    }
                }

                if (sameCount > 5) {
                    lostPoint += (3 + sameCount - 5);
                }
            }
        }

        // LEVEL2

        for (row = 0; row < moduleCount - 1; row++) {
            for (col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                if (qrCode.isDark(row,     col    ) ) count++;
                if (qrCode.isDark(row + 1, col    ) ) count++;
                if (qrCode.isDark(row,     col + 1) ) count++;
                if (qrCode.isDark(row + 1, col + 1) ) count++;
                if (count === 0 || count === 4) {
                    lostPoint += 3;
                }
            }
        }

        // LEVEL3

        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount - 6; col++) {
                if (qrCode.isDark(row, col) && 
                        !qrCode.isDark(row, col + 1) && 
                         qrCode.isDark(row, col + 2) && 
                         qrCode.isDark(row, col + 3) && 
                         qrCode.isDark(row, col + 4) && 
                        !qrCode.isDark(row, col + 5) && 
                         qrCode.isDark(row, col + 6) ) {
                    lostPoint += 40;
                }
            }
        }

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount - 6; row++) {
                if (qrCode.isDark(row, col) &&
                        !qrCode.isDark(row + 1, col) &&
                         qrCode.isDark(row + 2, col) &&
                         qrCode.isDark(row + 3, col) &&
                         qrCode.isDark(row + 4, col) &&
                        !qrCode.isDark(row + 5, col) &&
                         qrCode.isDark(row + 6, col) ) {
                    lostPoint += 40;
                }
            }
        }

        // LEVEL4
        
        var darkCount = 0;

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount; row++) {
                if (qrCode.isDark(row, col) ) {
                    darkCount++;
                }
            }
        }
        
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;

        return lostPoint;       
    }

};

module.exports = QRUtil;

};
definitions['index'] = function(require,module,exports){
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
// Modified to work in node for this project (and some refactoring)
//---------------------------------------------------------------------

var QR8bitByte = require('./QR8bitByte');
var QRUtil = require('./QRUtil');
var QRPolynomial = require('./QRPolynomial');
var QRRSBlock = require('./QRRSBlock');
var QRBitBuffer = require('./QRBitBuffer');

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

QRCode.prototype = {
	
	addData : function(data) {
		var newData = new QR8bitByte(data);
		this.dataList.push(newData);
		this.dataCache = null;
	},
	
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},

	getModuleCount : function() {
		return this.moduleCount;
	},
	
	make : function() {
		// Calculate automatically typeNumber if provided is < 1
		if (this.typeNumber < 1 ){
			var typeNumber = 1;
			for (typeNumber = 1; typeNumber < 40; typeNumber++) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

				var buffer = new QRBitBuffer();
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i++) {
					totalDataCount += rsBlocks[i].dataCount;
				}

				for (var x = 0; x < this.dataList.length; x++) {
					var data = this.dataList[x];
					buffer.put(data.mode, 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
					data.write(buffer);
				}
				if (buffer.getLengthInBits() <= totalDataCount * 8)
					break;
			}
			this.typeNumber = typeNumber;
		}
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	
	makeImpl : function(test, maskPattern) {
		
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new Array(this.moduleCount);
		
		for (var row = 0; row < this.moduleCount; row++) {
			
			this.modules[row] = new Array(this.moduleCount);
			
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
	
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
	
		if (this.dataCache === null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
	
		this.mapData(this.dataCache, maskPattern);
	},

	setupPositionProbePattern : function(row, col)  {
		
		for (var r = -1; r <= 7; r++) {
			
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			
			for (var c = -1; c <= 7; c++) {
				
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				
				if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                     (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                     (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	
	getBestMaskPattern : function() {
	
		var minLostPoint = 0;
		var pattern = 0;
	
		for (var i = 0; i < 8; i++) {
			
			this.makeImpl(true, i);
	
			var lostPoint = QRUtil.getLostPoint(this);
	
			if (i === 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
	
		return pattern;
	},
	
	createMovieClip : function(target_mc, instance_name, depth) {
	
		var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
		var cs = 1;
	
		this.make();

		for (var row = 0; row < this.modules.length; row++) {
			
			var y = row * cs;
			
			for (var col = 0; col < this.modules[row].length; col++) {
	
				var x = col * cs;
				var dark = this.modules[row][col];
			
				if (dark) {
					qr_mc.beginFill(0, 100);
					qr_mc.moveTo(x, y);
					qr_mc.lineTo(x + cs, y);
					qr_mc.lineTo(x + cs, y + cs);
					qr_mc.lineTo(x, y + cs);
					qr_mc.endFill();
				}
			}
		}
		
		return qr_mc;
	},

	setupTimingPattern : function() {
		
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] !== null) {
				continue;
			}
			this.modules[r][6] = (r % 2 === 0);
		}
	
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] !== null) {
				continue;
			}
			this.modules[6][c] = (c % 2 === 0);
		}
	},
	
	setupPositionAdjustPattern : function() {
	
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		
		for (var i = 0; i < pos.length; i++) {
		
			for (var j = 0; j < pos.length; j++) {
			
				var row = pos[i];
				var col = pos[j];
				
				if (this.modules[row][col] !== null) {
					continue;
				}
				
				for (var r = -2; r <= 2; r++) {
				
					for (var c = -2; c <= 2; c++) {
					
						if (Math.abs(r) === 2 || 
                            Math.abs(c) === 2 ||
                            (r === 0 && c === 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	
	setupTypeNumber : function(test) {
	
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
	
		for (var i = 0; i < 18; i++) {
			mod = (!test && ( (bits >> i) & 1) === 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
	
		for (var x = 0; x < 18; x++) {
			mod = (!test && ( (bits >> x) & 1) === 1);
			this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
		}
	},
	
	setupTypeInfo : function(test, maskPattern) {
	
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
	
		// vertical		
		for (var v = 0; v < 15; v++) {
	
			mod = (!test && ( (bits >> v) & 1) === 1);
	
			if (v < 6) {
				this.modules[v][8] = mod;
			} else if (v < 8) {
				this.modules[v + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + v][8] = mod;
			}
		}
	
		// horizontal
		for (var h = 0; h < 15; h++) {
	
			mod = (!test && ( (bits >> h) & 1) === 1);
			
			if (h < 8) {
				this.modules[8][this.moduleCount - h - 1] = mod;
			} else if (h < 9) {
				this.modules[8][15 - h - 1 + 1] = mod;
			} else {
				this.modules[8][15 - h - 1] = mod;
			}
		}
	
		// fixed module
		this.modules[this.moduleCount - 8][8] = (!test);
	
	},
	
	mapData : function(data, maskPattern) {
		
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
	
			if (col === 6) col--;
	
			while (true) {
	
				for (var c = 0; c < 2; c++) {
					
					if (this.modules[row][col - c] === null) {
						
						var dark = false;
	
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
						}
	
						var mask = QRUtil.getMask(maskPattern, row, col - c);
	
						if (mask) {
							dark = !dark;
						}
						
						this.modules[row][col - c] = dark;
						bitIndex--;
	
						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
								
				row += inc;
	
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
		
	}

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new QRBitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var x = 0; x < rsBlocks.length; x++) {
		totalDataCount += rsBlocks[x].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. (" + 
            buffer.getLengthInBits() + 
            ">" +  
            totalDataCount * 8 + 
            ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 !== 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new Array(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var x = 0; x < ecdata[r].length; x++) {
            var modIndex = x + modPoly.getLength() - ecdata[r].length;
			ecdata[r][x] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var y = 0; y < rsBlocks.length; y++) {
		totalCodeCount += rsBlocks[y].totalCount;
	}

	var data = new Array(totalCodeCount);
	var index = 0;

	for (var z = 0; z < maxDcCount; z++) {
		for (var s = 0; s < rsBlocks.length; s++) {
			if (z < dcdata[s].length) {
				data[index++] = dcdata[s][z];
			}
		}
	}

	for (var xx = 0; xx < maxEcCount; xx++) {
		for (var t = 0; t < rsBlocks.length; t++) {
			if (xx < ecdata[t].length) {
				data[index++] = ecdata[t][xx];
			}
		}
	}

	return data;

};

module.exports = QRCode;

};
function load(name){
  const id=name.replace(/^\.\//,'');
  if(loaded[id])return loaded[id].exports;
  if(!definitions[id])throw Error('Unknown QR module '+id);
  const module={exports:{}};loaded[id]=module;
  definitions[id](load,module,module.exports);
  return module.exports;
}
const QRCode=load('index');
const Level=load('QRErrorCorrectLevel');
window.qrVector=function(value){
 const code=new QRCode(-1, Level.M);code.addData(value);code.make();
 const n=code.getModuleCount(),pad=4,total=n+pad*2;
 const parts=[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" role="img" aria-label="QR-Code"><rect width="${total}" height="${total}" fill="white"/>`];
 for(let y=0;y<n;y++)for(let x=0;x<n;){
  if(!code.isDark(y,x)){x++;continue;}
  const begin=x;while(x<n&&code.isDark(y,x))x++;
  parts.push(`<rect x="${begin+pad}" y="${y+pad}" width="${x-begin}" height="1" fill="black"/>`);
 }
 parts.push('</svg>');return parts.join('');
};
})();

/* Arbeitsblatt-Generator */
'use strict';
/* Generiert ausschließlich lokal im Browser; die Datenquelle ist das archivierte
   Lerntrainer-Snapshot /v1.1.0/index.html auf derselben GitHub-Pages-Origin. */
const $=selector=>document.querySelector(selector);
const labels={standard:'Standardmotor · modern',historical:'Standardmotor · historisch','dahlander-delta':'Dahlander Δ/YY','dahlander-star':'Dahlander Y/YY',dual:'Zwei getrennte Wicklungen'};
const kinds=Object.keys(labels);
const WORKSHEET_RELEASE='1.1.3';
const EXPECTED_CODE_PATTERN=/^[AL]1-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]$/;
const state={mode:'balanced',enabled:new Set(kinds),counts:{standard:1,historical:1,'dahlander-delta':1,'dahlander-star':1,dual:1},sheets:[],ready:false,generatedKey:null};
const esc=text=>String(text??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function nMotors(){return Math.max(1,Math.min(30,Number($('#motorCount').value)||1));}
function sides(){return Number(document.querySelector('[name="pages"]:checked').value);}
function solutionMode(){return document.querySelector('[name="solution"]:checked').value;}
function selectedList(){return kinds.filter(k=>state.enabled.has(k));}
function totalManual(){return kinds.reduce((sum,k)=>sum+state.counts[k],0);}
function renderTypes(){
 const block=$('#typeSelection');block.replaceChildren();
 for(const kind of kinds){
  const row=document.createElement('div');row.className='type-row';
  if(state.mode==='balanced'){
   row.innerHTML=`<label class="checkbox"><input type="checkbox" data-kind="${kind}" ${state.enabled.has(kind)?'checked':''} ${state.enabled.size===1&&state.enabled.has(kind)?'disabled':''}> ${esc(labels[kind])}</label>`;
   row.querySelector('input').addEventListener('change',e=>{if(e.target.checked)state.enabled.add(kind);else if(state.enabled.size>1)state.enabled.delete(kind);renderTypes();});
  }else{
   row.innerHTML=`<span>${esc(labels[kind])}</span><div class="count-controls"><button type="button" data-minus aria-label="${esc(labels[kind])} reduzieren">−</button><input type="number" data-value="${kind}" min="0" max="30" value="${state.counts[kind]}" aria-label="Anzahl ${esc(labels[kind])}"><button type="button" data-plus aria-label="${esc(labels[kind])} erhöhen">+</button></div>`;
   const set=v=>{state.counts[kind]=Math.max(0,Math.min(30,Math.trunc(Number(v)||0)));row.querySelector('input').value=state.counts[kind];updateStatus();};
   row.querySelector('[data-minus]').onclick=()=>set(state.counts[kind]-1);
   row.querySelector('[data-plus]').onclick=()=>set(state.counts[kind]+1);
   row.querySelector('input').onchange=e=>set(e.target.value);
  }
  block.appendChild(row);
 }
 updateStatus();
}
function configurationKey(){return JSON.stringify({count:nMotors(),printStyle:$('#plateStyle').value,pages:sides(),mode:state.mode,enabled:selectedList(),counts:kinds.map(k=>state.counts[k]),solutions:solutionMode(),qr:$('#practiceQR').checked});}
function updateStatus(){
 if(state.sheets.length&&state.generatedKey!==configurationKey()){
  state.sheets=[];state.generatedKey=null;
  $('#previewToolbar').hidden=true;
  $('#printSheetsRoot').replaceChildren();$('#printSolutionsRoot').replaceChildren();$('#printLinksRoot').replaceChildren();
  $('#status').textContent='Einstellungen geändert. Bitte die Arbeitsblätter neu erstellen.';
 }
 const count=nMotors();
 const valid=state.mode==='balanced'?state.enabled.size>=1:totalManual()===count;
 const error=$('#distributionError');
 error.textContent=state.mode==='manual'&&!valid?`Du hast ${totalManual()} Motoren zugewiesen, benötigt werden ${count}.`:'';
 $('#summary').textContent=`${count} Typenschilder · ${count*sides()} Arbeitsblattseiten · ${sides()===2?'10':'4'} Aufgaben je Motor`;
 $('#generate').disabled=!state.ready||!valid;
 return valid;
}
$('#increase').onclick=()=>{$('#motorCount').value=Math.min(30,nMotors()+1);updateStatus();};
$('#decrease').onclick=()=>{$('#motorCount').value=Math.max(1,nMotors()-1);updateStatus();};
$('#motorCount').oninput=updateStatus;
$('#motorCount').onchange=()=>{$('#motorCount').value=nMotors();updateStatus();};
document.querySelectorAll('[name="distribution"]').forEach(r=>r.onchange=()=>{state.mode=r.value;renderTypes();});
document.querySelectorAll('[name="pages"],[name="solution"]').forEach(r=>r.onchange=updateStatus);
$('#practiceQR').onchange=updateStatus;$('#plateStyle').onchange=updateStatus;
renderTypes();
const iframe=$('#motorEngine');
// Der versteckte Frame steht im HTML vor den Skripten. Bei schnellem Laden
// kann sein load-Ereignis schon vor der Registrierung dieses Listeners liegen.
// Daher die bereits geladene Schnittstelle sofort prüfen UND das Ereignis
// sowie die nächsten Sekunden beobachten.
function activateMotorEngine(){
 if(state.ready)return true;
 if(typeof window.qrVector!=='function'){
  $('#status').textContent='QR-Code-Engine konnte nicht gestartet werden. Bitte die Datei generator.js aus V1.1.3 erneut hochladen.';
  return false;
 }
 try{
  const api=iframe.contentWindow?.__motorlab;
  if(!api||typeof api.newMotor!=='function'||typeof api.questions!=='function')return false;
  // Alte Generator- oder Archivdateien dürfen niemals unbemerkt alte A-/L-Codes drucken.
  if(typeof api.makeWorksheetCode!=='function'||typeof api.parseWorksheetCode!=='function'||typeof api.worksheetSelection!=='function'){
   $('#status').textContent='Falsche Datenquelle geladen. Bitte das gesamte V1.1.3-Paket hochladen und neu laden (Strg+F5).';
   return false;
  }
  const probeA=api.makeWorksheetCode('standard',0x12345678,10,false);
  const probeL=api.makeWorksheetCode('standard',0x12345678,10,true);
  const parsedA=api.parseWorksheetCode(probeA),parsedL=api.parseWorksheetCode(probeL);
  if(!EXPECTED_CODE_PATTERN.test(probeA)||!EXPECTED_CODE_PATTERN.test(probeL)||
     !parsedA||!parsedL||parsedA.seed!==0x12345678||parsedL.seed!==0x12345678||
     parsedA.solutions||!parsedL.solutions){
   $('#status').textContent='Falsche Code-Version geladen: Erwartet werden A1-/L1-Codes. Bitte Dateien im Ordner /v1.1.0/ prüfen.';
   return false;
  }

  state.ready=true;
  $('#status').textContent='Bereit · Generator V1.1.3 · neue Blattcodes: A1-… / L1-…';
  updateStatus();
  return true;
 }catch(error){return false;}
}
iframe.addEventListener('load',()=>{
 if(!activateMotorEngine()){
  $('#status').textContent='Lerntrainer geladen, aber die Motordaten-Schnittstelle fehlt. Bitte /v1.1.0/ prüfen.';
 }
});
iframe.addEventListener('error',()=>{
 if(!state.ready)$('#status').textContent='Fehler beim Laden des Lerntrainers. Bitte /v1.1.0/ prüfen.';
});
if(!activateMotorEngine()){
 const probe=setInterval(()=>{if(activateMotorEngine())clearInterval(probe);},250);
 setTimeout(()=>{
  clearInterval(probe);
  if(!state.ready)$('#status').textContent='Lerntrainer nicht bereit. Bitte Seite neu laden (Strg+F5) und /v1.1.0/ prüfen.';
 },12000);
}
function seededRandom(){
 const arr=new Uint32Array(1);if(window.crypto?.getRandomValues){window.crypto.getRandomValues(arr);return arr[0];}
 return Math.floor(Math.random()*4294967296)>>>0;
}
function shuffle(array){const out=[...array];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function distribute(){
 if(state.mode==='manual')return shuffle(kinds.flatMap(k=>Array.from({length:state.counts[k]},()=>k)));
 const types=shuffle(selectedList()),out=[];for(let i=0;i<nMotors();i++)out.push(types[i%types.length]);return shuffle(out);
}
function selectQuestions(bank,count){
 const numeric=bank.map((q,i)=>({q,i})).filter(x=>x.q.type==='num');
 const choices=bank.map((q,i)=>({q,i})).filter(x=>x.q.type==='mc');
 const targetNumeric=Math.min(numeric.length,Math.floor(count/2));
 const targetChoice=count-targetNumeric;
 const chosen=[],usedTags=new Set();
 function addFrom(pool,wanted){
  for(let round=0;round<2&&wanted>0;round++){
   for(const p of shuffle(pool)){
    if(wanted===0)break;
    if(chosen.some(x=>x.i===p.i)||(round===0&&usedTags.has(p.q.tag)))continue;
    chosen.push(p);usedTags.add(p.q.tag);wanted--;
   }
  }
 }
 addFrom(numeric,targetNumeric);addFrom(choices,targetChoice);
 if(chosen.length<count)addFrom(bank.map((q,i)=>({q,i})),count-chosen.length);
 return shuffle(chosen).slice(0,count);
}
function exactUrl(sheet,solutions=false){
 const url=new URL('../v1.1.0/',document.baseURI);
 url.searchParams.set('code',solutions?sheet.solutionCode:sheet.practiceCode);
 return url.href;
}
function nameplateSnapshot(doc,clean=false){
 const plate=doc.querySelector('#plate');if(!plate)throw Error('SVG-Typenschild fehlt');
 const clone=plate.cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-hidden','true');
 // Ursprungsschild verwendet CSS für Gravurschrift, Farben und die unterschiedlichen
 // Schildgenerationen. Das CSS bleibt IN DER SVG und beeinflusst keine Dokumentstile.
 const style=document.createElementNS('http://www.w3.org/2000/svg','style');
 // SVG-interne Regeln sind beim Inline-Einfügen NICHT auf das SVG begrenzt.
 // Deswegen ausschließlich .plate-Regeln übernehmen, niemals body, button usw.
 const ruleset=doc.querySelector('style')?.sheet;
 const plateRules=[];
 if(ruleset){for(const rule of ruleset.cssRules){
  if(rule.type!==1)continue;
  const selectors=rule.selectorText.split(',').map(s=>s.trim()).filter(s=>/^\.plate(?=[\s.#:\[]|$)/.test(s));
  if(selectors.length)plateRules.push(`${selectors.join(',')}{${rule.style.cssText}}`);
 }}
 style.textContent=plateRules.join('\n');
 clone.insertBefore(style,clone.firstChild);
 if(clean){
  // Gealterte Druckschilder ohne 135 Patina-Ringe und Kratzspuren.
  clone.querySelectorAll('g[aria-hidden="true"][pointer-events="none"]').forEach(g=>{
   if(g.querySelectorAll('circle').length>=80)g.remove();
  });
  clone.classList.add('print-clean');
  const rules=document.createElementNS('http://www.w3.org/2000/svg','style');
  rules.textContent=`.plate.print-clean rect:not(.hit){fill:#ffffff!important} .plate.print-clean rect.hit{fill:transparent!important;stroke:transparent!important} .plate.print-clean text{fill:#161616!important;opacity:1!important;stroke:none!important} .plate.print-clean path,.plate.print-clean line,.plate.print-clean polyline{stroke:#444!important} .plate.print-clean path[fill]:not([fill="none"]),.plate.print-clean polygon{fill:#fff!important} .plate.print-clean stop{stop-color:#ffffff!important} .plate.print-clean pattern *{opacity:0!important} .plate.print-clean circle,.plate.print-clean ellipse{fill:#fff!important;stroke:#666!important}`;
  clone.appendChild(rules);
 }

 return new XMLSerializer().serializeToString(clone);
}
// Die Datenbank kennt beide Aufgabenformen als Zahleneingabe. Für den Druck
// brauchen reine Ableseaufgaben jedoch keine grossen Rechenkaestchen.
const readingQuestionIds=new Set([
 'current','motorprotectLine','historicCurrent','nomCurrentLow','nomCurrentHigh','starvoltage','deltavoltage'
]);
function isReadingQuestion(q){
 const api=iframe.contentWindow?.__motorlab;
 if(api?.worksheetTaskType)return api.worksheetTaskType(q)==='ablesen';
 if(q.type!=='num')return false;
 if(readingQuestionIds.has(q.id))return true;
 return /(?:gib den passenden schildwert|steht (?:f[uü]r|auf|im) (?:die|der|das|dem)|welchen (?:bemessungs[- ]?)?(?:außenleiter)?strom (?:nennt|zeigt|steht)|welcher (?:außenleiter)?strom (?:ist|steht) .*schild)/i.test(q.text);
}
function solutionText(q){
 if(q.type==='mc')return q.choices[q.correct];
 const number=Number(q.answer);
 const digits=Math.abs(number)>=100?0:Math.abs(number)<1?3:2;
 return `${number.toLocaleString('de-DE',{maximumFractionDigits:digits,minimumFractionDigits:Math.min(2,digits)})}${q.unit==='Faktor'?' (dimensionslos)':` ${q.unit}`}`;
}
function isShortCalculation(q){return iframe.contentWindow?.__motorlab?.worksheetTaskType?.(q)==='kurzrechnung';}
function questionHtml(selection,n){
 const q=selection.q,reading=isReadingQuestion(q),shortCalc=isShortCalculation(q);
 const answers=q.type==='mc'?`<div class="paper-choices">${q.choices.map(s=>`<div class="paper-choice">${esc(s)}</div>`).join('')}</div>`:
  reading?`<div class="reading-answer" aria-label="Platz fuer den abgelesenen Wert"></div>`:
  shortCalc?`<div class="short-work" aria-label="Kurzer Rechenweg"><svg width="100%" height="100%" aria-hidden="true"><defs><pattern id="shortgrid-${n}" patternUnits="userSpaceOnUse" width="18.897638" height="18.897638"><path d="M 18.897638 0 H 0 V 18.897638" fill="none" stroke="#c6cdd0" stroke-width=".7" /></pattern></defs><rect width="100%" height="100%" fill="url(#shortgrid-${n})" /></svg></div>`:
  `<div class="writing-space" aria-label="Kariertes Rechenfeld"><svg width="100%" height="100%" aria-hidden="true"><defs><pattern id="grid-${n}" patternUnits="userSpaceOnUse" width="18.897638" height="18.897638"><path d="M 18.897638 0 H 0 V 18.897638" fill="none" stroke="#c6cdd0" stroke-width=".7" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid-${n})" /></svg></div>`;
 return `<article class="paper-question ${q.type==='num'?(reading?'read':shortCalc?'quick':'calc'):'mc'}"><div class="paper-qtext"><span class="num">${n}.</span><span>${esc(q.text)}${q.type==='num'?` <span class="unit">[${esc(q.unit)}]</span>`:''}</span></div>${answers}</article>`;
}
function frontHeader(sheet,isBack=false){
 const qr=$('#practiceQR').checked&&!isBack
 ? `<div class="plate-qr"><a class="qr-link" href="${esc(exactUrl(sheet))}" title="Digitale Aufgaben öffnen" aria-label="Online bearbeiten: Motor ${sheet.no}"><svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg><span class="qr-link-words"><span>Online</span><span>bearbeiten</span></span></a><a class="qr-image" href="${esc(exactUrl(sheet))}" title="Digitale Aufgaben öffnen" aria-label="QR-Code: Motor ${sheet.no}">${qrVector(exactUrl(sheet))}</a></div>` : '';
 return `<header class="sheet-header"><div class="sheet-header-main"><h2>Motortypenschild</h2>${isBack?'':`<div class="identity"><span>Name: __________________</span><span>Klasse: __________</span><span>Datum: __________</span></div>`}</div>${qr}</header>`;
}
function paperPage(sheet,sels,first,last){
 const isBack=!first,pageNo=first?1:2;
 const plate=first?`<div class="plate-row"><div class="paper-plate">${sheet.svg}</div></div>`:'';
 return `<section class="sheet-page ${isBack?'back':''} ${sheet.printStyle==='clean'?'print-clean':'print-original'}" data-sheet="${sheet.no}" data-page="${pageNo}">${frontHeader(sheet,isBack)}${plate}<div class="paper-questions">${sels.map((p,j)=>questionHtml(p,j+(first?1:5))).join('')}</div><footer class="paper-foot"><span>Motor ${sheet.no} · Seite ${pageNo} von ${last?2:1}</span><span class="footer-code">Blattcode: ${sheet.practiceCode}</span></footer></section>`;
}
function worksheetPages(sheet){
 if(sides()===1)return paperPage(sheet,sheet.selected,true,false);
 return paperPage(sheet,sheet.selected.slice(0,4),true,true)+paperPage(sheet,sheet.selected.slice(4),false,true);
}
function compactSolutions(sheet){
 const rows=sheet.selected.map((sel,i)=>{
   const q=sel.q,ans=solutionText(q);
   const calc=q.type==='num'&&q.calc?(()=>{
    const lines=String(q.calc).split('\n').map(x=>x.trim()).filter(x=>x.length>=8&&x.length<100);
    // Bevorzugt den tatsächlich eingesetzten Rechenschritt statt einer allgemeinen
    // Einheiten-Erläuterung oder einer überschriftartigen Zahlenwertgleichung.
    return lines.find(x=>/[=≈]/.test(x)&&/\d/.test(x)&&!/^Zahlenwertgleichung/i.test(x))
      ||lines.find(x=>/[=≈]/.test(x))||'';
   })():'';
   return `<li><span class="solution-answer">${esc(ans)}</span>${calc?`<span class="solution-calc"> · ${esc(calc)}</span>`:''}</li>`;
 }).join('');
 return `<section class="solution-block"><div class="solution-block-title"><div class="solutions-text"><h3>Motor ${sheet.no}</h3><ol class="solution-list">${rows}</ol></div><div class="solution-code"><a href="${esc(exactUrl(sheet,true))}" aria-label="Lösungen online: Motor ${sheet.no}">${qrVector(exactUrl(sheet,true))}</a><a class="qr-link" href="${esc(exactUrl(sheet,true))}">Lösungen online</a><span class="solution-id sheet-short-code">${sheet.solutionCode}</span><a class="retry-label" href="${esc(exactUrl(sheet))}">Erneut üben</a><span class="practice-id sheet-short-code">${sheet.practiceCode}</span></div></div></section>`;
}
function solutionDoc(sheets){
 // Maximal drei Motoreinheiten auf einer festen A4-Seite. Das vermeidet,
 // dass der Umbruch je nach Antwortlaenge bereits nach Motor 2 erfolgt.
 const pages=[];
 for(let i=0;i<sheets.length;i+=3){
  const batch=sheets.slice(i,i+3);
  const intro=i===0
   ? `<div class="solution-header"><h2>Lösungen · Motortypenschilder</h2><p>Kurzantworten in der Reihenfolge der Arbeitsblätter. Ausführliche Erklärungen und Rechenwege stehen über die QR-Codes bereit.</p></div>`
   : `<p class="solution-continued">Lösungen · Fortsetzung</p>`;
  pages.push(`<section class="solution-page" data-solution-page="${Math.floor(i/3)+1}" data-motors="${batch.map(s=>s.no).join(',')}">${intro}<div class="solution-batch">${batch.map(compactSolutions).join('')}</div></section>`);
 }
 return pages.join('');
}
function linkDoc(sheets){
 return `<div class="links-header"><h2>Digitale Lösungen</h2><p>Zu jedem Motor führt der QR-Code zu den passenden Antworten und Erklärungen.</p></div>${sheets.map(sheet=>`<section class="link-item"><a href="${esc(exactUrl(sheet,true))}">${qrVector(exactUrl(sheet,true))}</a><div><h3>Motor ${sheet.no}</h3><p><a href="${esc(exactUrl(sheet,true))}">Lösungen online · ${sheet.solutionCode}</a></p><p><a href="${esc(exactUrl(sheet))}">Erneut üben · ${sheet.practiceCode}</a></p></div></section>`).join('')}`;
}
function generate(){
 if(!state.ready||!updateStatus())return;
 if(typeof window.qrVector!=='function'){
  $('#status').textContent='QR-Code-Erzeugung nicht verfügbar. Bitte generator.js aktualisieren.';
  return;
 }
 $('#generate').disabled=true;$('#status').textContent='Arbeitsblätter werden erstellt …';
 try{
  const kindsToGenerate=distribute(),engine=iframe.contentWindow.__motorlab,doc=iframe.contentDocument;
  const count=sides()===1?4:10;
  const sheets=kindsToGenerate.map((kind,i)=>{
   const seed=seededRandom(),quizSeed=(seed^0x9E3779B9)>>>0;
   engine.newMotor({selection:kind,seed,quizSeed});
   const selected=engine.worksheetSelection(count,seed);
   const practiceCode=engine.makeWorksheetCode(kind,seed,count,false);
   const solutionCode=engine.makeWorksheetCode(kind,seed,count,true);
   if(!EXPECTED_CODE_PATTERN.test(practiceCode)||!EXPECTED_CODE_PATTERN.test(solutionCode)){
    throw Error('Veraltete Blattcodes erkannt. Es wurden keine Arbeitsblätter ausgegeben. Bitte /v1.1.0/ auf die richtige Engine prüfen.');
   }
   return {no:i+1,kind,seed,quizSeed,selected,practiceCode,solutionCode,printStyle:$('#plateStyle').value,svg:nameplateSnapshot(doc,$('#plateStyle').value==='clean')};
  });
  state.sheets=sheets;state.generatedKey=configurationKey();
  $('#printSheetsRoot').innerHTML=sheets.map(worksheetPages).join('');
  $('#printSolutionsRoot').innerHTML=solutionMode()==='appendix'||solutionMode()==='separate'?solutionDoc(sheets):'';
  $('#printLinksRoot').innerHTML=solutionMode()==='links'?linkDoc(sheets):'';
  $('#printSolutions').hidden=solutionMode()!=='separate';
  $('#printLinks').hidden=solutionMode()!=='links';
  $('#previewToolbar').hidden=false;
  $('#status').textContent=`V1.1.3 · ${sheets.length} Motoren und ${sheets.length*count} Aufgaben. Neue Codes: A1-/L1-. Druckformat A4.`;
  $('#previewToolbar').scrollIntoView({block:'start',behavior:'smooth'});
 }catch(error){console.error(error);$('#status').textContent='Erstellung fehlgeschlagen: '+error.message;}
 finally{updateStatus();}
}
let originalGeneratorTitle=document.title;
function pdfName(mode){
 const now=new Date();
 const date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const suffix=state.sheets[0]?.practiceCode.replace(/[^A-Z0-9]/g,'').slice(0,10)||'Blatt';
 const type={worksheets:'Aufgaben',combined:'Aufgaben_und_Loesungen',solutions:'Loesungen',links:'Loesungslinks'}[mode]||'Dokument';
 return `Motortypenschild_${type}_${date}_${suffix}`;
}
function printMode(mode){
 if(!state.sheets.length)return;
 document.body.dataset.printMode=mode;
 // Firefox und Chromium schlagen haeufig document.title als PDF-Dateinamen vor.
 // Der Browser kann den Namen aendern; das Druckbild bleibt unabhaengig vom Dark Mode.
 document.title=pdfName(mode);
 window.print();
}
window.addEventListener('afterprint',()=>{document.title=originalGeneratorTitle;});
const generatorThemeToggle=$('#themeToggle');
function applyGeneratorTheme(mode){
 const dark=mode==='dark';document.documentElement.dataset.theme=dark?'dark':'light';
 generatorThemeToggle.textContent=dark?'☀ Hell':'☾ Dunkel';
 generatorThemeToggle.setAttribute('aria-pressed',String(dark));
 try{localStorage.setItem('motortypenschild.theme',dark?'dark':'light');}catch(e){}
}
generatorThemeToggle.addEventListener('click',()=>applyGeneratorTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
applyGeneratorTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');
$('#generate').onclick=generate;
$('#regenerate').onclick=generate;
$('#printSheets').onclick=()=>printMode(solutionMode()==='appendix'?'combined':'worksheets');
$('#printSolutions').onclick=()=>printMode('solutions');
$('#printLinks').onclick=()=>printMode('links');
window.__worksheets={state,generate,exactUrl,distribute,selectQuestions};
