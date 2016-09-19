/*  This file encompasses all of the javascript for the browser action, i.e. what shows when you press the button in the browser toolbar
    Most of this involves drawing the graph.
    There is also functionality to export all of the data as well as adding new categories
*/


var pri_history = {};


// Pri history is a dict of arrays, containing the pri's for a given time for each category.
categories = JSON.parse(localStorage.getItem("categories"));

// Declare each category as a list
for( var i=0; i<categories.length; i++){
    pri_history[categories[i]] = [];
}

// General listening function
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.subject == 'get_pri'){
        return;
    }
    if (message.subject == 'pri_history'){
        pri_history = JSON.parse(message.pri_history); 
        redraw_graph(pri_history);
        return; 
    }
    if (message.subject == 'pri') {
        addPri(0, message.pri);
    }
});

get_pri_history();

// Instruct the background to send us the pri_history for the session
function get_pri_history(){
    chrome.runtime.sendMessage(message={subject:'get_pri'});
}


function get_max(arr){

    var max=0;
    for(var i=0; i<arr.length; i++){
        if (arr[i] > max){
            max = arr[i];
        }
    }
    return max;
}

function get_min(arr){
    var min=0;
    for(var i=0; i<arr.length; i++){
        if( arr[i]<min){
            min = arr[i];
        }
    }
    return min;
}

function get_y_axis_multiplier(pri_history, y_axis_height){
    var pri_range =0;
    var max_pri=0;
    for(var i=0; i< pri_history.length; i++){
        new_max = get_max(pri_history[i]);
        if (new_max > max_pri){
            max_pri = new_max;
        }
    }
    var min_pri = 20;
    for(var i=0; i<pri_history.length; i++){
        new_min = get_min(pri_history[i]);
        if(new_min < min_pri){
            min_pri = new_min;
        }
    }
    pri_range = max_pri - min_pri;
    var y_axis_multiplier = y_axis_height / pri_range;
    return y_axis_multiplier;
}


function setupGraph(){


    // Y Axis height is equal to 
    // X axis is constant
    // Y axis multiplier = y axis height divided by range of pri_history
    var y_axis_height = 200;
    var x_axis_height = 200;

    y_axis_multiplier = get_y_axis_multiplier(pri_history, y_axis_height);

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";

    ctx.font = "20px Arial";

    ctx.moveTo(40,0);
    ctx.lineTo(40,100);
    ctx.stroke();

    ctx.lineTo(280,100);
    ctx.stroke();

    ctx.fillText("Time",140,160);
    ctx.fillText("PRI",0,50);
    ctx.fillText("Now", 260,140);
    ctx.moveTo(280,125);
    ctx.lineTo(280,110);
    ctx.stroke();

    ctx.fillText("-5 mins", 20,140);
    ctx.moveTo(40,125);
    ctx.lineTo(40,110);
    ctx.stroke();

}

function addPri(time, pri){
    pri_history.push(pri);
    redraw_graph();
}

function redraw_graph(pri_history){
    
    document.getElementById('export_button').onclick = fetch_data;
    document.getElementById('new_category_button').onclick = new_category;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    setupGraph();
    var y_axis_height = 200;

    y_axis_multiplier = get_y_axis_multiplier(pri_history, y_axis_height);

    // For all categories
    for(var i=0; i< pri_history.length; i++){

        curr_cat_arr = pri_history[i];
        // For all pri's in that category
        for(var j=curr_cat_arr.length-1; j>=0; j--){
             
            // If the point goes off the x axis, don't draw
            if(280-(i*10)>=40){
                draw_point(i,curr_cat_arr[j], y_axis_multiplier);
            }
        }
    }
}

function new_category(){
    // Grab category name from form
    category_name = document.getElementById("new_category").value;

    // Grab categories from localStorage
    categories = JSON.parse(localStorage.getItem("categories"));

    if(categories === null){
        categories = [];
    }

    // Add to the list of categories and store new list back
    categories.push(category_name);
    localStorage.setItem("categories", JSON.stringify(categories));
}

function draw_point(x,y, mult){
    // a y of -1 is a null point, don't draw it
    if (y == "-1"){
        return;
    }
    y = parseFloat(y);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(280-(x*10),400-(y*mult),3,0,2*Math.PI);
    ctx.stroke();

}

redraw_graph();


// Grabs the full history of pri's from localStorage and puts them in the html for the user to view
function fetch_data(){
    full_history = localStorage.getItem('pri_history');
    obj = JSON.parse(full_history);

    // Iterate on the items, create proper dates from the unix timestamps then remove the old entries
    for (var key in obj) {
        var date_time = new Date(key * 1000);
        var temp = obj[key];
        delete obj[key];
        obj[date_time] = temp;
        
    }

    elem = document.getElementById('export_data');
    elem.innerHTML = "<pre>" + JSON.stringify(obj, null, '\t') + "</pre>";
}
