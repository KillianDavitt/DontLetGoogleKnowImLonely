window.onload = function(){

// Fetch URL of the page
var page_url = window.location.href;
/**/console.log("Add-on loaded...\n\n\n");

// Execute only on Google pages
if (page_url.indexOf("google") != -1) {
        // Debugging
        document.body.style.border = "2px solid red";
        console.log("Page is a google page...");
        


        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse){
                if(request.subject == "categories"){
                    chrome.runtime.onMessage.removeListener(this);
                    
                    ads = document.getElementsByClassName("ads-ad");
                    console.log(ads.length);
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

                    }
                }
        });

        chrome.runtime.sendMessage(message={subject:"request_categories"}) ;
}
};
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
}


