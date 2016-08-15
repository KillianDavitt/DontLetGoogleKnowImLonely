/**
 * Converts a matrix (2-dimensional Array) into a string.
 * Rows of the matrix are separated by ';'.
 * Individual values are separated by ','.
 * @param  {Array}  matrix  2d Array representing the matrix.
 * @return {String}         String representing the matrix.
 */
function serializeMatrix(matrix) {
	var len = matrix.length;
	var matrix_str = "";
	for (var i = 0; i < len; i++) {
		matrix_str += matrix[i].join() + ';';	// Use ';' as row separator.
	}
	// Remove last ';'
	matrix_str = matrix_str.slice(0, -1);
	return matrix_str;
}
/**
 * Converts an Array into a comma-separated string.
 * @param  {Array}  arr  Array to be converted.
 * @return {String}      Comma-separated string representation of arr.
 */
function serializeArray(arr) {
	return arr.join();
}
