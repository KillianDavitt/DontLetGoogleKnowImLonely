// Send probe query from time to time
// setInterval(identifyLearning, 10000);    // Time in milliseconds
/**
 * [identifyLearning description]
 * @return {[type]} [description]
 */
function identifyLearning() {
    // Ignore pages other the Google
    if (window.location.href.search("google") == -1) return;
    var probe_query = "https://www.google.ie/#q=help+and+advice";
    var req = new XMLHttpRequest();
    req.open("GET", probe_query, true);
    req.responseType = "document"
    req.send();
    req.addEventListener("load", function(){
        /* The following doesn't work, because the response contains
        only the static parts of the results page. The actual results
        are loaded later */
        var ads = req.response.getElementsByClassName("ads-ad");
        /* This doesn't work either, because the Document interface
        refers to the page currently open, not to the request */
        var ads2 = document.getElementsByClassName("ads-ad");
    });
}
