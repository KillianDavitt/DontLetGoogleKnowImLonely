/**
 * Converts a string into a 2-dimensional array representing a matrix.
 * The values are separated in the string by ','; the rows of the
 * corresponding matrix are separated by ';'.
 * @param  {String} matrix_str  String representing a matrix.
 * @return {Array}              2d array representing a matrix.
 */
function deserializeMatrix(matrix_str) {
	// Isolate the rows of the matrix
	var rows = matrix_str.split(';');
	var n_rows = rows.length;
	var matrix = [];
	// Separate individual values
	for (var i = 0; i < n_rows; i++) {
		matrix[i] = rows[i].split(',');
	}
	// The values of the matrix are saved as strings;
	// Convert back to numbers
	var n_cols = matrix[0].length;	// Consider all rows of the same length
	for (var i = 0; i < n_rows; i++) {
		for (var j = 0; j < n_cols; j++) {
			matrix[i][j] = parseInt(matrix[i][j]);
		}
	}
	return matrix;
}
/**
 * Converts a comma-separated string into an array.
 * @param  {String} str  String to be converted.
 * @return {Array}     	 Resulting array.
 */
function deserializeStrArray(str) {
	return str.split(',');
}
