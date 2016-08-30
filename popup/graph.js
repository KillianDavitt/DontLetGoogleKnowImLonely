var pri_history = [];

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.search('get_pri') != -1){
        return;
    }
    if (message.search('pri_history') == -1){
        pri_history = message.substr(8, message.length);
    }
    if (message.search('pri') != -1) {
        addPri(0, message.substr(5,message.length));
    }
});

get_pri_history();

function get_pri_history(){
    chrome.runtime.sendMessage('get_pri');
}

function setupGraph(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";

    ctx.font = "20px Arial";

    ctx.moveTo(40,0);
    ctx.lineTo(40,100);
    ctx.stroke();

    ctx.lineTo(280,100);
    ctx.stroke()

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

function redraw_graph(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    setupGraph();
    for(var i=0; i< pri_history.length; i++){
        if(280-(i*10)>=40){
            draw_point(i,pri_history[pri_history.length-1-i]);
        }
    }
}

function draw_point(x,y){
    if (y == "NaN"){
        return;
    }
    y = parseFloat(y);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(280-(x*10),100-y,3,0,2*Math.PI);
    ctx.stroke();

}

redraw_graph();
addPri(20,70);


