// Fetch URL of the page
var page_url = window.location.href;
/**/console.log("Add-on loaded...\n\n\n");

// Execute only on Google pages
if (window.location.href.contains("google")) { (function() {
        // Debugging
        /**/document.body.style.border = "2px solid red";
        console.log("Page is a google page...")

        /* --------------- Page interactions --------------- */
        // Page loaded
        var req = new XMLHttpRequest();
        console.log("Opening request....");
        req.open("GET", page_url, true);
        console.log("sending request....");
        req.send();
        console.log("Adding event listener");
        req.addEventListener("load", function() {
            console.log("Begining training");
        
            chrome.runtime.sendMessage({"url": page_url});
        
            training(); // Do the training when the page first loads (change this)
            console.log("Finished training");
            main();
        });

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
    })();
}
function notifyExtension(e) {
  chrome.runtime.sendMessage({"url": "bananas"});
}

console.log("Adding the listener");
window.addEventListener("click", notifyExtension);
