/*
    this is the script which runs on the individual google pages. 
    It gets the ads on the current page and adds the suggested category as well as adding a select box to each ad allowing the user to add an ad to a category.

    Note that a certain amount of communication has to be done between this script and background.js.
    since index.js only has access to the localStorage for the current  webpage and not the addons localStorage, we must retrieve the categories list from background.js

    Then, when the user adds an ad to a category, index.js must communicate this back to background.js with the full text of the ad.
*/

var intervalId = setInterval(function() { main();}, 1000);

/// Bug here, can't get this function to reliably call on the page load and effectively retrieve the ads every time.
/// There is no recognisable pattern to when it does and doesn't work.
console.log(document.readyState);


function main(){

    // Fetch URL of the page
    var page_url = window.location.href;
    /**/console.log("Add-on loaded...\n\n\n");

    // Execute only on Google pages
    if (page_url.indexOf("google") != -1) {
        document.body.style.border = "2px solid red";
        console.log("Page is a google page...");
        


        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse){
                if(request.subject == "categories"){
                    chrome.runtime.onMessage.removeListener(this);
                    
                    ads = document.getElementsByClassName("ads-ad");
                    console.log(ads.length);
                    if(ads.length > 0){
                        clearInterval(intervalId);
                    }
                    categories = JSON.parse(request.categories);
                    for (var i=0; i<ads.length; i++){
                        console.log("Ad");
                        var s = '<select><option value="null">Select a Category</option>'; // HTML string
                        for(var j=0; j<categories.length; j++){
                            s += '<option value="';
                            s += categories[j];
                            s += '">';
                            s += categories[j];
                            s += '</option>';
                        }    
                        
                        s += "</select>";
                        var btn = '<button class="category_add_button">Add to Category</button>'
                        var div = document.createElement('div');
                        div.innerHTML = s;
                        ads[i].appendChild(div.childNodes[0]);
                        div.innerHTML = btn
                        ads[i].appendChild(div.childNodes[0]);

                        button = div.childNodes[0];
                        //button.onclick=add_ad();
                        ads[i].childNodes[ads[i].childNodes.length-1].onclick = add_ad;

                        suspected = document.createElement('div');
                        suspected.innerHTML = "<b>Suggested Category</b>: Cancer";//get_suspect_category(ads[i])

                        ads[i].appendChild(suspected);

                    }
                }
            });

        chrome.runtime.sendMessage(message={subject:"request_categories"}) ;
	}
}

function get_suspect_ad(ad){
    
}

function add_ad(){
    console.log("Adding ad");
    console.log(this.previousSibling.selectedIndex);
    select = this.previousSibling;
    name_of_category = select.options[select.selectedIndex].value;
    console.log(name_of_category);
    console.log(select.parent);

    // Clone the ad and remove what we added so we get an accurate processing of the ad text
    elem = select.parentElement.cloneNode(true);
    elem.removeChild(elem.childNodes[elem.childNodes.length-1]);
    elem.removeChild(elem.childNodes[elem.childNodes.length-1]);

    keywords = processAds([elem])
    chrome.runtime.sendMessage(message={subject:"add_training_data", label: name_of_category, keywords: keywords});
    console.log("+" + name_of_category + "::" + keywords);

    ok_mesg = document.createElement('div');
    ok_mesg.innerHTML = "Ad added to category successfully";
    select.parentElement.appendChild(ok_mesg);

}

//setInterval( function(){ console.log("Hi")clearInterval(intervalId), 8100);

