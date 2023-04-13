import './style.css'
import $ from 'jquery';

/**
 * Calculates the weight(number of non zero elements) in a vector or a matrix
 * @param {Array|Matrix} vec
 * @returns {number}
 */
const weight = (vec) => {
	// not sure about this
	let vector = vec;
	if (vector.isMatrx)
		vector = vector.elements;

	let res = 0;
	for (let i in vector) {
		if (vector[i] !== 0)
			res++;
	}
	return res;
};

/**
 * creates an array of a given length and fills its
 * with elements with given value
 * @param {Number} length
 * @param value
 * @return {Array}
 */
const makeArray = (length, value = 0) => {
	const res = [];
	for (let i = 0; i < length; i++) {
		res.push(value);
	}
	return res;
};

/**
 * adds two vectors together elementwise
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
const addVectors = (a, b) => {
	if (a.length !== b.length) {
		throw new Error('Vectors must have the same length');
	}

	const res = [];
	for (let i in a) {
		res[i] = a[i] + b[i];
	}
	return res;
};

/**
 * Calculates mod two of a vector
 * @param vec
 * @return {Array}
 */
const modTwo = (vec) => {
	return vec.map(x => x % 2);
};

/**
 * creates a new vector of 0s in all positions
 * except position n where it has a value of 1
 * @param {Number} size
 * @param {Number} n
 * @return {Array}
 */
const eyeVector = (size, n) => {
	const res = [];
	for (let i = 0; i < size; i++) {
		res[i] = (i == n) + 0;
	}
	return res;
};

/**
 * Creates a vector of given size filled with 0s
 * except random position of given count
 * @param {Number} size
 * @param {Number} noise
 * @return {{vec: Array, noise: Number}}
 */
const noiseVector = (size, noise) => {
	let res = [];
	let noiseAmount = 0;
	for (let i = 0; i < size; i++) {
		if (Math.random() * size < noise) {
			res.push(1);
			noiseAmount++;
		}
		else {
			res.push(0);
		}
	}
	return {vec: res, noise: noiseAmount};
};



function enforce() {
}
class Matrix {

	/**
	 * Constructor for Matrix class
	 * @param {Number} height
	 * @param {Number} width
	 * @param {Array} data
	 */
	constructor(height = 0, width = 0, data = null) {
		this._onChangeListeners = [];

		this.width = width;
		this.height = height;
		if (!data) {
			this.elements = [];
			for (let i = 0; i < width * height; i++) {
				this.elements.push(0);
			}
		}
		else {
			this.elements = data;
		}

	}

	get isMatrx() {
		return true;
	}

	/**
	 * Adds a row to the current Matrix
	 * @param {Array} row
	 */
	addRow(row) {
		if (row.length !== this.width) {
			throw new Error('In order to add a row to a Matrix, it must have the same length as Matrix width');
		}

		this.height++;
		this.elements = this.elements.concat(row);
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Adds a column to the current Matrix
	 * @param {Array} col
	 */
	addCol(col) {
		if (col.length !== this.height) {
			throw new Error('In order to add a column to a Matrix, it must have the same length as Matrix height');
		}

		for (let i = 0; i < this.height; i++) {
			this.elements.splice(this.width * i, 0, col[i]);
		}
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Creates a new Matrix that is identical to this one
	 * @returns {Matrix} this
	 */
	clone() {
		return new this.constructor(this.width, this.height, this.elements);
	}

	/**
	 * Gets element i,j of the matrix
	 * @param {Number} i
	 * @param {Number} j
	 * @returns {Number}
	 */
	get(i, j) {
		return this.elements[i * this.width + j];
	}


	/**
	 * Sets element i,j of the matrix to val
	 * @param {Number} i
	 * @param {Number} j
	 * @param {Number} val
	 * @returns {Matrix} this
	 */
	set(i, j, val) {
		this.elements[i * this.width + j] = val;
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Gets a row of the current matrix as an array
	 * @param {Number} row
	 * @returns {Array} row
	 */
	getRow(row) {
		return this.elements.slice(this.width * row, this.width * (row + 1));
	}

	/**
	 * Gets a column of the current matrix as an array
	 * @param {Number} col
	 * @returns {Array} column
	 */
	getCol(col) {
		const res = [];
		for (let i = 0; i < this.height; i++) {
			res.push(this.get(i, col));
		}
		return res;
	}

	/**
	 * Gets all the rows of the given matrix in an array
	 * @return {Array}
	 */
	getRows() {
		const res = [];
		for (let i = 0; i < this.height; i++) {
			res.push(this.getRow(i));
		}
		return res;
	}

	/**
	 * adds a the given matrix to the current matrix
	 * and returns a new matrix that is the sum
	 * @param {Matrix} b
	 * @return {Matrix}
	 */
	add(b) {
		if (this.width !== b.width || this.height !== b.height) {
			throw new Error('In order to add two matrices their width and height must be the same');
		}
		const res = new this.constructor(this.height, this.width);
		for (let i in this.elements) {
			res.elements[i] = this.elements[i] + b.elements[i];
		}

		res._callOnChanged(enforce);
		return res;
	}

	/**
	 * Adds val to element i,j of the matrix
	 * @param {Number} i
	 * @param {Number} j
	 * @param {Number} val
	 * @returns {Matrix} this
	 */
	addTo(i, j, val) {
		this.set(i, j, this.get(i, j) + val);
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Transposes the current matrix
	 * @return {Matrix} transposed matrix
	 */
	transpose() {
		const res = new this.constructor(this.width, this.height);
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				res.set(j, i, this.get(i, j));
			}
		}
		return res;
	}

	/**
	 * Multiplies the current matrix with b, writes the
	 * result into a new matrix and returns it
	 * @param {Matrix} b
	 * @returns {Matrix}
	 */
	mult(b) {
		if (this.width !== b.height) {
			throw new Error('In order to multiply matrices the number of columns in the first one must be equal to the number of rows in the second one!');
		}
		const res = new this.constructor(this.height, b.width);
		for (let i = 0; i < res.height; i++) {
			for (let j = 0; j < res.width; j++) {
				res.set(i, j, 0);
				for (let g = 0; g < b.height; g++) {
					res.addTo(i, j, this.get(i, g) * b.get(g, j));
				}
			}
		}

		return res;
	}

	/**
	 * Writes the content of the matrix to a string
	 * uses linebreak as a line breaking character
	 * @param {String} lineBreak
	 * @returns {string}
	 */
	toString(lineBreak = '<br>') {
		let res = '';
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				res += this.get(i, j) + ' ';
			}
			res += lineBreak;
		}
		return res;
	}

	/**
	 * Prints the current matrix to the console
	 * using console.table()
	 * @returns {Matrix} this
	 */
	printToTable() {
		const tmp = [];
		for (let i = 0; i < this.height; i++) {
			tmp.push(this.elements.slice(this.width * i, this.width * (i + 1)));
		}
		console.table(tmp);
		return this;
	}

	/**
	 * Calls the given function for every element
	 * of the matrix, passes (currentValue, i, j, this)
	 * @param {function} fcn
	 * @returns {Matrix} this
	 */
	forEach(fcn) {
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				fcn.bind(this)(this.get(i, j), i, j, this);
			}
		}
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Calles all onchange event listeners
	 * @param {function} e
	 * @private
	 */
	_callOnChanged(e) {
		if (e !== enforce) {
			throw new Error('_callOnChanged function is a private function, it cannot be called from the outside of class Matrix');
		}
		for (let i in this._onChangeListeners) {
			this._onChangeListeners[i].bind(this)(this);
		}
	}

	/**
	 * Adds fcn to the list of onchange Listeners
	 * Whenever the matrix is modified fcn will be called
	 * @param {function} fcn
	 * @returns {Matrix} this
	 */
	onChange(fcn) {
		this._onChangeListeners.push(fcn);
		return this;
	}

	/**
	 * Creates an identity matrix with width size and height size
	 * @param {Number} size
	 * @returns {Matrix}
	 */
	static Identity(size) {
		const res = new this.constructor(size, size);
		for (let i = 0; i < size; i++) {
			res.set(i, i, 1);
		}
		return res;
	}

}
class BinaryMatrix extends Matrix {
	constructor(...args) {
		super(...args);
		this.onChange(binarize);
	}

	get isBinaryMatrix() {
		return true;
	}
}

/**
 * Converts a matrix into a binary matrix
 * @param {Matrix} matrix
 */
function binarize(matrix) {
	for (let i in matrix.elements) {
		matrix.elements[i] %= 2;
	}
}
class GolayCode {
    constructor() {
        throw new Error('Golay code is not an instantiatable class, use static methods instead');
    }

    static encode(vec) {
        if (!vec.isBinaryMatrix) {
            vec = new BinaryMatrix(1, 12, vec);
        }
        const mRes = vec.mult(GolayCode.G);
        return mRes.getRow(0);
    }

    static decode(vec) {
        let u = null;

        if (!vec.isBinaryMatrix) {
            vec = new BinaryMatrix(1, 24, vec);
        }

        // step 1
        GolayCode.Log('Step 1');
        const syndrome = vec.mult(GolayCode.H.transpose()).getRow(0);
        GolayCode.Log('Calculated Syndrome', syndrome.join(', '));

        vec = vec.getRow(0);

        // step 2
        const syndromeWeight = weight(syndrome);
        GolayCode.Log('Step 2');
        GolayCode.Log('Syndrome weight is', syndromeWeight);

        if (syndromeWeight <= 3) {
            GolayCode.Log('Syndrome weight is less than or equal to 3, solution found!');
            u = syndrome.concat(makeArray(12));
            return modTwo(addVectors(u, vec));
            //return u;
        }

        // step 3
        GolayCode.Log('Step 3');

        const bRows = GolayCode.B.getRows();
        for (let i in bRows) {
            const cur = modTwo(addVectors(syndrome, bRows[i]));
            if (weight(cur) <= 2) {
                GolayCode.Log(`B_${i} is a good match, the weight of S+B_${i} is ${weight(cur)} <= 2`);
                u = cur.concat(eyeVector(12, i));
                return modTwo(addVectors(u, vec));
                //return u;
            }
        }

        // step 4
        GolayCode.Log('Step 4');

        const secondSyndrome = new BinaryMatrix(1, syndrome.length, syndrome).mult(GolayCode.B).getRow(0);
        GolayCode.Log('Calculated second syndrome, it is ', secondSyndrome);

        // step 5
        GolayCode.Log('Step 5');

        if (weight(secondSyndrome) <= 3) {
            GolayCode.Log(`Second syndrome weight is ${weight(secondSyndrome)} <= 3`);
            u = makeArray(12).concat(secondSyndrome);
            return modTwo(addVectors(u, vec));
            //return u;
        }

        // step 6
        GolayCode.Log('Step 6');

        for (let i in bRows) {
            const cur = modTwo(addVectors(secondSyndrome, bRows[i]));
            if (weight(cur) <= 2) {
                GolayCode.Log(`B_${i} is a good match, the weight of SS+B_${i} is ${weight(cur)} <= 2`);
                u = eyeVector(12, i).concat(cur);
                return modTwo(addVectors(u, vec));
                //return u;
            }
        }

        // step 7
        GolayCode.Log('Step 7');
        GolayCode.Log('Cant find solution, data is too corrupted');
        return [];

    }

    static Log(...args) {
        for (let i in GolayCode.logHandlers) {
            GolayCode.logHandlers[i](...args);
        }
    }

    static addLogHandler(fcn) {
        GolayCode.logHandlers.push(fcn);
    }

}

GolayCode.logHandlers = [];

GolayCode.H = new BinaryMatrix(0, 24);

GolayCode.H.addRow([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1]);
GolayCode.H.addRow([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1]);
GolayCode.H.addRow([0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);

GolayCode.G = new BinaryMatrix(0, 24);

GolayCode.G.addRow([1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
GolayCode.G.addRow([1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
GolayCode.G.addRow([0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
GolayCode.G.addRow([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);

GolayCode.B = new BinaryMatrix(0, 12);

GolayCode.B.addRow([1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1]);
GolayCode.B.addRow([1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1]);
GolayCode.B.addRow([0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1]);
GolayCode.B.addRow([1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1]);
GolayCode.B.addRow([1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
GolayCode.B.addRow([1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1]);
GolayCode.B.addRow([0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1]);
GolayCode.B.addRow([0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1]);
GolayCode.B.addRow([0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1]);
GolayCode.B.addRow([1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1]);
GolayCode.B.addRow([0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1]);
GolayCode.B.addRow([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]);




document.addEventListener("DOMContentLoaded", (event) => {

	document.getElementById('random').addEventListener('click', () => {
		const randomInput = [];
		for (let i = 0; i < 12; i++) {
			randomInput.push(parseInt(Math.random() * 2));
		}
		document.getElementById('source').value = randomInput.join('');
	});

	document.getElementById('encode').addEventListener('click', () => {
		const inputVector = document.getElementById('source').value.split('').map(x => parseInt(x));
		if (inputVector.length !== 12) {
			alert('Код должен быть длиной в 12 бит!');
			return;
		}
		const encodedRes = GolayCode.encode(inputVector);
		document.getElementById('result').value = encodedRes.join('');
	});


	document.getElementById('corrupt').addEventListener('click', () => {
		const randomNoise = noiseVector(24, 4);
		const output = document.getElementById('result').value.split('').map(x => parseInt(x));
		document.getElementById('corrupted').value = modTwo(addVectors(randomNoise.vec, output)).join('');
		document.getElementById('corruptedBits').innerText = randomNoise.noise;
		if (randomNoise.noise > 3) {
			document.getElementById('message').innerText = 'Искажение слишком сильное. Корректное восстановление не гарантировано.';
		}
		else {
			document.getElementById('message').innerText = '';
		}

	});

	document.getElementById('decode').addEventListener('click', () => {
		const input = document.getElementById('corrupted').value.split('').map(x => parseInt(x));

		document.getElementById('restored').value = GolayCode.decode(input).join('');
	});

	GolayCode.addLogHandler(logToDocument);
});