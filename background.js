/*
    This is the main background file. Most of the addon code occurs here.
    Training is called from here.
    Lots of communication with both the browser action and the content script happens here.
*/


// When we load the addon, do the training
training();

// Pri history is a dict of arrays, containing the pri's for a given time for each category.
categories = JSON.parse(localStorage.getItem("categories"));

if(categories === null){
    categories = JSON.parse("[]");
    localStorage.setItem('categories', JSON.stringify(categories));
}

var pri_history = {};
// Declare each category as a list
for( var i=0; i<categories.length; i++){
    pri_history[categories[i]] = [];
}


// Add a listener
chrome.runtime.onMessage.addListener(message_recv);


// General listening function, the script will receive several different kinds of messages. 
// The subject needs to be checked in order to distinguish what the messages are for.
function message_recv(message){
    if(message.subject == "add_training_data"){
        label = message.label;
        keywords = message.keywords;
        addTrainingData(keywords, label);
        training();
        return;
    }
    else if (message.subject == "request_categories"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {subject: "categories", categories: JSON.stringify(categories)});
        });
    }
    else if (message.subject == 'get_pri'){
        chrome.runtime.sendMessage(message={subject:'pri_history', pri_history : JSON.stringify(pri_history)});
        return; 
    }
    chrome.tabs.sendMessage(message={'labels' : labels, 'keywords' : keywords, 'count_matrix' : count_matrix});
}

// Calling this sends a notification to the user
function notify(message) {
    console.log("Creating a notification....");
    chrome.notifications.create({
    "type": "basic",
    "iconUrl": "http://www.google.com/favicon.ico",
    "title": "Notification",
    "priority": 1,
    "message": message.url
  });
}


// Set the probe to occur every n milliseconds
setInterval(function() { probe();}, 30000);


// Get the average of each of the lists provided in a list
function average(nums){
    if (nums.length === 0) {
        return [-1];
    }
    var total = [];
    var length = nums.length;
    var i = 0;

    // Loop on the lists and get their totals
    while (i<length){
        total.push(0);
        for(var j=0; j<nums[i].length; j++){
            total[i] += parseFloat(nums[i][j]);
        }
        i++;
    }
    var average = []; 

    // Loop on the totals and divide by the length of each list
    for(var i=0; i<total.length; i++){
        average.push(total[i]/nums[i].length);
    }

    // Return a list of the averages of the lists
    return average;
}

// Do the probe
function probe()
{
	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://www.google.com/search?hl=en&q=causes+and+symptoms";
	xmlHttp.open( "GET", theUrl); // false for synchronous request
    xmlHttp.withCredentials = true;
	xmlHttp.send();

	notify({'url':'Made a probe'});

    // When the page has loaded, proceed.
	xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState == 4) {
            
            // Create a new dom with the page that has loaded, grab the ads from it
            parser = new DOMParser();
            doc = parser.parseFromString(xmlHttp.responseText, "text/html");
            ads = doc.getElementsByClassName("ads-ad");

            notify({'url':"Num ads: " + String(ads.length)});

            processed_ads = processAds(ads);
            var [row_probs, col_probs] = getProbs();
            var pri_arr = [];
            for (var ad of processed_ads) {
                pri_arr.push(getPRI(ad, row_probs, col_probs));
            }
            // I've gotten this backwards, pri_arr has an elem for each ad
            // Transpose the arr

			var pri_fixed = pri_arr[0].map(function(col, i) { 
			  	return pri_arr.map(function(row) { 
    				return row[i] 
 			 	})
			});

            console.log(String(average(pri_arr))); 
            notify({"url": "Average PRI: " + String(average(pri_arr))});
            // Average pri_arr returns an array of floats.
            // We don't want to push this on, we kind of want to zip it on in a sense
            avg_pri = average(pri_arr);
            for(var i=0; i<categories.length; i++){
                pri_history[categories[i]] = pri_history[categories[i]].concat(pri_fixed[i]);
            }

            // Send the new array of pri's to the browser action.
            chrome.runtime.sendMessage(message={subject:'pri_history', pri_history: JSON.stringify(pri_history)});

            // If the pri we get is not -1 save it to localStorage
            if(pri_history[pri_history.length -1] != -1){
                loaded_pri_history = JSON.parse(localStorage.getItem('pri_history'));

                // Unix timestamp is used
                var timestamp = String(Math.floor(Date.now() / 1000));
               
                // If there's no history on disk, make a new entry
                if (loaded_pri_history === null){
                    loaded_pri_history = {timestamp: String(pri_history[pri_history.length -1])};
                }
                else {
                    loaded_pri_history[timestamp] = String(pri_history[pri_history.length -1]);
                }
                localStorage.setItem('pri_history', JSON.stringify(loaded_pri_history));
            }
        }
    };
}
