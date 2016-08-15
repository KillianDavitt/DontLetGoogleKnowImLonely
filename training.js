// Global variables
var keywords = [];
var labels = ["sensitive", "other"];
var count_matrix = [];
var training_data = [];
/**
 * Performs the training part of the application.
 * Initializes the variables that contain the keywords,
 * training data and count matrix.
 */
/**
 * Performs the training part of the application: initializes the variables 
 * that contain the keywords, training data and count matrix.
 * @param  {Boolean} first_training  Indicates if this is the first time training
 *                                   is performed; defaults to true.
 */
function training(first_training = true) {
    /**/console.log("function training...\n");
    if (first_training) {
        localStorage.clear();
        localStorage.setItem("training_data", training_data_str_);
        training_data_str = training_data_str_;
    } else {
        training_data_str = localStorage.getItem("training_data");
    }
    // Split the training data into individual ads with a label and some text
    training_data = splitTrainingData(training_data_str);
    // Create a list of keywords and a dictionary
    keywords = buildDictionary(training_data);
    // Create count matrix
    createCountMatrix(labels, training_data);
    // Save training variables to local storage
    localStorage.setItem("labels", serializeArray(labels));
    localStorage.setItem("keywords", serializeArray(keywords));
    localStorage.setItem("count_matrix", serializeMatrix(count_matrix));
    /**/console.log("# Keywords = %i\n\n",keywords.length);
}
/**
 * Loads previous instances of the training variables from the local storage.
 */
function loadTraining() {
    /**/console.log("function loadTraining\n");
    // Get training variables from local storage, if the exist
    try {
        var labels_str = localStorage.getItem("labels");
        var keywords_str = localStorage.getItem("keywords");
        var matrix_str = localStorage.getItem("count_matrix");
        // Convert variables to the original structures
        labels = deserializeStrArray(labels_str);
        keywords = deserializeStrArray(keywords_str);
        count_matrix = deserializeMatrix(matrix_str);
        /**/console.log("# Keywords = %i\n\n", keywords.length);
    } catch(e) {
        console.error(e);
    }
}
/**
 * Checks if the training has already been performed.
 * @return {boolean} True if already trained; false otherwise.
 */
function checkTraining() {
    var is_trained = localStorage.getItem("keywords") != null
                     && localStorage.getItem("labels") != null
                     && localStorage.getItem("count_matrix") != null;
    /**/console.log("is_trained =", is_trained);
    return is_trained;
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
    training_data = training_data.split(';').slice(0, -1);  // "slice" removes extra ';' at the end of the string
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
 * Includes and advert in the training data.
 * @param {Array}  ad_txt  Array containing the advert text.
 * @param {String} label   Advert label.
 */
function addTrainingData(ad_txt, label) {
    var ad_data = label + ':: ' + ad_txt.join(' ') + ';';
    
    // Add advert to training data
    var old_training = localStorage.getItem("training_data");
    var new_training = old_training + ad_data;
    localStorage.setItem("training_data", new_training);
    // Redo training
    training(false);
    // TODO: maybe add a counter to do training again only after adding 'n' new ads
}
/**
 * Creates a list of unique keywords appearing in the adverts.
 * @param  {Array} training_data  Training data.
 * @return {Array}                List of keywords found in training data.
 */
function buildDictionary(training_data) {
    var words = getKeywords(training_data);
    // Remove repeated words
    var keywords = getUniqueWords(words);
    return keywords;
}
/**
 * Creates a count matrix using the training data
 * @param  {Array} labels    List of advert labels.
 * @param  {Array} ad_texts  Training data.
 */
function createCountMatrix(labels, ad_texts) {
    var matrix = [];
    var ad_label = '';
    // Initialize empty count matrix
    initMatrix(labels.length, keywords.length);
    // Update count matrix using the training data
    for (var ad of ad_texts) {
        ad_label = getAdLabel(ad)
        tokens = ad[1].split(' ');
        // Update count matrix
        for (var token of tokens) {
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
 * @param  {Array} arr  List of words.
 * @return {Array}      List of unique words found in arr.
 */
function getUniqueWords(arr) {
        var words = [], prev;
        arr.sort();
        for (var i = 0; i < arr.length; i++ ) {
            if (arr[i] !== prev) {
                words.push(arr[i]);
            }
            prev = arr[i];
        }
        return words;
}
/**
 * Initializes the count matrix (2d array) and sets all values to 0.
 * @param  {Number} len_labels    Number of labels.
 * @param  {Number} len_keywords  Number of keywords.
 */
function initMatrix(len_labels, len_keywords) {
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
