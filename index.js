// Fetch URL of the page
var page_url = window.location.href;
/**/console.log("Add-on loaded...\n\n\n");

// Execute only on Google pages
if (page_url.indexOf("google") != -1) {
        // Debugging
        document.body.style.border = "2px solid red";
        console.log("Page is a google page...");
        
        tab_index = document.activeElement.tabIndex;
        chrome.runtime.sendMessage({'tabindex':tab_index});
        
        chrome.runtime.onMessage.addListener(main_ads);

}

function main_ads(message){

        labels = message.labels;
        keywords = message.keywords;
        count_matrix = message.count_matrix;

        // Search button pressed (WORKS SOMETIMES)
        var search_button = document.getElementsByClassName("lsb").item(0);
        search_button.addEventListener("click", function() {
            main();
        });

        // Return key pressed in search bar (WORKS SOMETIMES)
        var search_bar = document.getElementById("lst-ib");
        search_bar.addEventListener("keydown", function(event) {
            if (event.key == "Enter")
                main();
        });

        // TODO: listen to other events
    
}
