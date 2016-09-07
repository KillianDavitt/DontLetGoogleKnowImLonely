var pri_history = [];

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.search('get_pri') != -1){
        return;
    }
    if (message.search('pri_history') != -1){
        arr = message.substr(12, message.length);
        pri_history = JSON.parse("[" + arr + "]"); 
        redraw_graph(pri_history);
        return; 
    }
    if (message.search('pri') != -1) {
        addPri(0, message.substr(5,message.length));
    }
});

get_pri_history();

function get_pri_history(){
    chrome.runtime.sendMessage('get_pri');
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
    var max_pri = get_max(pri_history);
    var min_pri = get_min(pri_history);
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
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    setupGraph();
    var y_axis_height = 200;

    y_axis_multiplier = get_y_axis_multiplier(pri_history, y_axis_height);

    for(var i=0; i< pri_history.length; i++){
        if(280-(i*10)>=40){
            draw_point(i,pri_history[pri_history.length-1-i], y_axis_multiplier);
        }
    }
}

function draw_point(x,y, mult){
    if (y == "-1"){
        return;
    }
    y = parseFloat(y);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(280-(x*10),100-(y*mult),3,0,2*Math.PI);
    ctx.stroke();

}

redraw_graph();

function fetch_data(){
    full_history = localStorage.getItem('pri_history');
    console.log(full_history);
}
