// Global variables
var keywords = [];
var count_matrix = [];
var labels = ["sensitive", "other"];

function training() {
    // Split the training data into individual ads with a label and some text
    var training_data = splitTrainingData(training_data_str);

    // Create a list of keywords and a dictionary
    // [keywords, dict] = buildDictionary(training_data);  // OBS.: dict is not being used
    keywords = buildDictionary(training_data);
    /**/console.log("Keywords ("+ keywords.length + "):"); console.log(keywords);
    // /**/console.log("\nDICTIONARY:"); console.log(dict);

    // Create count matrix
    init(labels, training_data);
    /**/console.log("Count Matrix:");console.log(count_matrix);
    /**/console.log("----------------");
}
/* -------------------------- Main Functions -------------------------- */

/**
 * Splits the training data into an array of individual adverts.
 * Each advert consists of an array containing a label and some text.
 * @param  {String} training_data  String containing the training data.
 * @return {Array}                 Training data split into individual adverts. 
 */
function splitTrainingData(training_data) {
    // Split adverts (delimited by ';')
    training_data = training_data.split(';');
    var training_data_ = [];

    for (var i = 0; i < training_data.length; i++) {
        // Separate label and advert text (delimited by '::')
        training_data_[i] = training_data[i].split('::');

        // Tokenise advert text
        training_data_[i][1] = tokeniseText(training_data_[i][1]);
        training_data_[i][1] = (training_data_[i][1]).join(' ');
    }
    return training_data_;
}

/**
 * Creates a list of unique keywords appearing in the adverts.
 * @param  {Array} training_data  Training data.
 * @return {Array}                List of keywords found in training data.
 */
function buildDictionary(training_data) {
    // OBS.: dict is not being used

    var words = getKeywords(training_data);

    // Count number of occurrences of each word
    var keywords, count, dict = {};
    [keywords, count] = getUniqueWords(words);
    // /**/console.log(keywords);

    for (var i = 0; i < keywords.length; i++) {
        dict[keywords[i]] = count[i];
    }
    // return [keywords, dict];
    return keywords
}

/**
 * Creates a count matrix using the training data
 * @param  {Array} labels    List of advert labels.
 * @param  {Array} ad_texts  Training data.
 */
function init(labels, ad_texts) {
    var matrix = [];
    var ad_label = '';

    // Initialize empty count matrix
    initCountMatrix(labels.length, keywords.length);

    // Update count matrix using the training data
    for (var ad of ad_texts) {
        ad_label = getAdLabel(ad)
        tokens = ad[1].split(' ');
        // Update count matrix
        for (var token of tokens) {
            // This will be used when the training data is expanded
            if(!findKeyword(token)) {
                addKeyword(token);
            }
            updateCountMatrix(token, ad_label);
        }
    }
}

/* -------------------------- Other functions -------------------------- */

/**
 * Gets all the keywords found in the advert texts.
 * @param  {Array} training_data  Training data.
 * @return {Array}                List of all the words found.
 */
function getKeywords(training_data) {
    var keywords = '';

    for (var i = 0; i < training_data.length - 1; i++) {
        keywords += ((training_data[i])[1]) + ' ';      // String
    }
    // Don't add blank character at the end of the string
    keywords += ((training_data[training_data.length - 1])[1]);

    // Convert string to array of keywords
    keywords = keywords.split(' '); 

    return keywords;
}

/**
 * Gets the unique words found in an array.
 * @param  {Array}       arr  List of words.
 * @return {Array,Array}      List of unique words and the corresponding
 *                            number of occurrences.
 */
function getUniqueWords(arr) {
        var words = [], count = [], prev;
        arr.sort();

        for (var i = 0; i < arr.length; i++ ) {
            if (arr[i] !== prev) {
                words.push(arr[i]);
                count.push(1);
            } else {
                count[count.length-1]++;
            }
            prev = arr[i];
        }
        return [words, count];
}

/**
 * Initializes the count matrix (2d array) and sets all values to 0.
 * @param  {Number} len_labels    Number of labels.
 * @param  {Number} len_keywords  Number of keywords.
 */
function initCountMatrix(len_labels, len_keywords) {
    // First dimension: labels.
    // Second dimension: keywords.
    for (var i = 0; i < len_labels; i++) {
        count_matrix[i] = new Array(len_keywords);
    }
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < len_keywords; j++) {
            count_matrix[i][j] = 0;
        }
    }
}

/**
 * Increments the count matrix element corresponding
 * to a keyword and a label.
 * @param  {String} keyword  Keyword.
 * @param  {String} label    Label.
 */
function updateCountMatrix(keyword, label) {
    var keyword_index = keywords.indexOf(keyword); 
    var label_index = labels.indexOf(label);

    count_matrix[label_index][keyword_index]++;
}

/**
 * Gets the label that corresponds to an advert.
 * @param  {Array} ad  Advert from the training data.
 * @return {String}    Label corresponding to the advert.
 */
function getAdLabel(ad) {
    // TODO: change labels

    // Use random condition
    if (ad[1].length % 2) {
        return "sensitive";
    } else {
        return "other";
    }

    // Use "location" as a non-sensitive topic
    // return (ad[0] == "location")?"other":"sensitive";
}

/**
 * Checks if the word given is in the list of keywords.
 * @param  {String}  word  Word being searched.
 * @return {Boolean}       True if word is found; false otherwise.
 */
function findKeyword(word) {
    return (keywords.indexOf(word) != -1);
}

/**
 * Adds a new keyword to the list of keywords and
 * allocates a new column in the count matrix.
 * @param {String} word  Word to be added to the list.
 */
function addKeyword(word) {
    // Add new word to the list
    keywords.push(word);

    // Allocate column in the count matrix
    count_matrix[1].push([[0],[0]]);
    count_matrix[0].push([[0],[0]]);
}

/**
 * Gets number of occurrences of a keyword and a label in the count matrix.
 * @param  {String} keyword  Keyword.
 * @param  {String} label    Label.
 * @return {Number}          Number of occurrences of the keyword and the label.
 */
function getCount(keyword, label) {
    var keyword_index = keywords.indexOf(keyword);
    var label_index = labels.indexOf(label);
    
    return count_matrix[label_index][keyword_index];
}
