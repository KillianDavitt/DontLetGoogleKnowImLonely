training();

chrome.runtime.onMessage.addListener(send_training_data);

pageWorker = require("sdk/page-worker").Page({
  contentScript: "console.log(document.body.innerHTML);",
    contentURL: "http://en.wikipedia.org/wiki/Internet"
    });


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
	var theUrl = "https://www.google.ie/?gws_rd=ssl#q=hotels";
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
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
        var iframe = document.createElement('iframe');
        //iframe.style.display = "none";
        iframe.src = "www.google.ie";
        document.body.appendChild(iframe);
        /*document = doc;
        document.head = doc.head;
        document.title = doc.title;
        
        document = Object.assign({}, doc);
        */
		/*var all = doc.getElementsByTagName("*");

		for (var i=0; i < all.length; i++) {
			document.appendChild(all[i]);
		}*/
        //location.reload();
        ads = document.getElementsByClassName("ads-ad");
        notify({'url':String(ads.length)});
        processed_ads = processAds(ads);
        var [row_probs, col_probs] = getProbs();
        var pri_arr = [];
        for (var ad of processed_ads) {
            pri_arr.push(getPRI(ad, row_probs, col_probs));
        }
        
        notify({"url":average(pri_arr)});
        notify({'url': document.head});
}
}
