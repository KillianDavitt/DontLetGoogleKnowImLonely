training();

chrome.runtime.onMessage.addListener(send_training_data);



function send_training_data(message){

    chrome.tabs.sendMessage(message={'labels' : labels, 'keywords' : keywords, 'count_matrix' : count_matrix});
}

function notify(message) {
    console.log("Creating a notification....");
    chrome.notifications.create({
    "type": "basic",
    "iconUrl": chrome.extension.getURL("link.png"),
    "title": "You clicked a link!",
    "message": message.url
  });
}



setInterval(function() { probe();}, 50000);

function average(nums){
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
	var theUrl = "http://www.google.com/search?hl=en&q=symptoms";
	xmlHttp.open( "GET", theUrl); // false for synchronous request
    //xmlHttp.withCredentials = true;
	xmlHttp.send();
	notify({'url':'Made a probe'});
    var i = 0;
    while(i<1000){
        var q = i * i * i * i * i;
        i++;
    }
	if (xmlHttp.readyState==4 && xmlHttp.status==200){
		parser = new DOMParser();
		doc = parser.parseFromString(xmlHttp.responseText, "text/html");
        ads = doc.getElementsByClassName("ads-ad");
        notify({'url':String(ads.length)});
        processed_ads = processAds(ads);
        var [row_probs, col_probs] = getProbs();
        var pri_arr = [];
        for (var ad of processed_ads) {
            pri_arr.push(getPRI(ad, row_probs, col_probs));
        }
        
        notify({"url":String(average(pri_arr))});
        for (ad in processed_ads) {
            notify({"url":ad[0].textContent});
        }
    }
}
