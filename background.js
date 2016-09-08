training();
var pri_history = [];
chrome.runtime.onMessage.addListener(send_training_data);

chrome.storage.local.set({ ['test'] : 'bod' }, function() {
	  console.log("Stored");
});

function send_training_data(message){
    if (message.search('get_pri') != -1){
        var history = pri_history.slice();

        var i = 0;
        while(i<history.lenght){
            if(String(history[i])=="NaN"){
                history[i] = -1;
            }
            i++;
        }

        chrome.runtime.sendMessage('pri_history: ' + String(history), function(response) {
            console.log('sendResponse was called with: ' + response);
        });
        return; 
    }
    chrome.tabs.sendMessage(message={'labels' : labels, 'keywords' : keywords, 'count_matrix' : count_matrix});
}

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



setInterval(function() { probe();}, 30000);

function average(nums){
    if (nums.length == 0) {
        return -1
    }
    var total = 0;
    var length = nums.length;
    var i = 0;
    while (i<length){
        total += parseFloat(nums[i]);
        i++;
    }

    var average = total/length;
    return average;
}

function probe()
{
	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://www.google.com/search?hl=en&q=causes+and+symptoms";
	xmlHttp.open( "GET", theUrl); // false for synchronous request
    xmlHttp.withCredentials = true;
	xmlHttp.send();
	notify({'url':'Made a probe'});
    var i = 0;
	xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState == 4) {
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
            
            notify({"url": "Average PRI: " + String(average(pri_arr))});
            pri_history.push(average(pri_arr));
            chrome.runtime.sendMessage('pri_history: ' + String(pri_history), function(response) {
                console.log('sendResponse was called with: ' + response);
            });
            if(pri_history[pri_history.length -1] != -1){
                loaded_pri_history = JSON.parse(localStorage.getItem('pri_history'));
                var timestamp = String(Math.floor(Date.now() / 1000))
                
                if (loaded_pri_history == null){
                    loaded_pri_history = JSON.parse('{"' + timestamp + '":" ' + String(pri_history[pri_history.length -1]) + '"}');
                }
                else {
                    loaded_pri_history[timestamp] = String(pri_history[pri_history.length -1]);
                }
                localStorage.setItem('pri_history', JSON.stringify(loaded_pri_history));
            }
        }
    }
}


chrome.storage.local.get('test', function(result) {
	console.log(result);  
})


function fetch_pri_store() {
    
}
