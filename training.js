/* -------------------------- Main Functions -------------------------- */
/**
 * Calculates two estimated probabilities:
 * 	row_probs: probability of seeing a keyword in the training set
 * 			   *given* the topic being considered;
 * 	col_probs: overall probability of finding a keyword in the training set.
 * @return {Array}  1st object: row_probs (2d Array); 2nd object: col_probs.
 */
function getProbs() {
	// Get the sums of the rows and columns of the count matrix
	var row_sums = getRowSums();
	var col_sums = getColSums();
	var len_labels = labels.length, len_kw = keywords.length;
	/* --- Row probabilities --- */
	// Create a data structure similar to the count matrix
	var row_probs = createEmptyMatrix(len_labels, len_kw);
	// Divide the rows of the count matrix by row sums
	for (var i = 0; i < len_labels; i++) {
		for (var j = 0; j < len_kw; j++) {
			row_probs[i][j] = count_matrix[i][j] / row_sums[i];
		}
	}
	
	/* --- Column probabilities --- */
	var col_probs = [];
	// Calculate total sum
	var total_sum = col_sums.reduce((a,b) => a + b, 0);
	// Divide column sums by total sum
	for (var i = 0; i < len_kw; i++) {
		col_probs.push(col_sums[i]/total_sum);
	}
	return [row_probs, col_probs];
}
/**
 * Calculates the PRI estimator for the advert.
 * @param  {Array} ad         Advert text
 * @param  {Array} row_probs  Row probabilities (2d Array).
 * @param  {Array} col_probs  Column probabilities.
 * @return {Array}            PRI estimator for all the labels.
 */
function getPRI(ad, row_probs, col_probs) {
	// Get the frequency of the words in the advert appearing in the training data
	var word_freq = getWordFreq(ad);
	
	var pri = [];
	var len_labels = labels.length, len_words = word_freq.length;
	// Calculate the PRI for each label
	for (var i = 0; i < len_labels; i++) {
		var sum = 0;
		for (var j = 0; j < len_words; j++) {
			sum += (word_freq[j] * row_probs[i][j]) / col_probs[j];
		}
		pri.push(sum);
	}
	/**/console.log("PRI:");console.log(pri);
	return pri;
}
/* -------------------------- Other functions -------------------------- */
/**
 * Gets the sums of the rows of the count matrix.
 * @return {Array}  Row sums.
 */
function getRowSums() {
	var row_sums = [], sum;
	var n_rows = labels.length, n_cols = keywords.length;
	for (var i = 0; i < n_rows; i++) {
		sum = (count_matrix[i]).reduce((a,b) => a + b, 0);
		row_sums.push(sum);
	}
	return row_sums;
}
/**
 * Gets the sums of the columns of the count matrix.
 * @return {Array}  Column sums.
 */
function getColSums() {
	var col_sums = [], sum;
	var n_rows = labels.length, n_cols = keywords.length;
	for (var i = 0; i < n_cols; i++) {
		sum = 0;
		for (var j = 0; j < n_rows; j++) {
			sum += count_matrix[j][i];
		}
		col_sums.push(sum);
	}
	return col_sums;
}
/**
 * Creates an empty matrix.
 * @param  {Number} n_rows  Number of rows.
 * @param  {Number} n_cols  Number of columns.
 * @return {Array}          2d Array representing empty matrix (n_rows x n_cols).
 */
function createEmptyMatrix(n_rows, n_cols) {
    var matrix = [];
    for (var i = 0; i < n_rows; i++) {
        matrix[i] = new Array(n_cols);
    }
    return matrix;
}
/**
 * Calculates the relative frequencies of the words from the
 * advert that appear in the training data.
 * @param  {Array} ad  Advert text.
 * @return {Array}     Frequency of the words.
 */
function getWordFreq(ad) {
	var len_keywords = keywords.length;
	var len_ad = ad.length;
	var words_in_keywords = 0;
	// Create array of frequencies and initialize it with 0s
	var word_freq = new Array(len_keywords).fill(0);
	// Verify if word from advert is in the list of keywords;
	// If it is, increase its count in the frequency array
	for (var i = 0; i < len_ad; i++) {
		var index = keywords.indexOf(ad[i]);
		if (index != -1) {
			word_freq[index]++;
			words_in_keywords++;
		}
	}
	// Divide word counts by total number of words in the advert and training data
	word_freq = word_freq.map(function(x) {
		return x / words_in_keywords;
	});
	return word_freq;
}
