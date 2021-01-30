let canvas = document.getElementById("canvas");

let sections = ["0", "32", "15", "19", "4",
    "21", "2", "25", "17", "34",
    "6", "27", "13", "36", "11", "30", "8",
    "23", "10", "5", "24", "16",
    "33", "1", "20", "14", "31", "9", "22",
    "18", "29", "7", "28", "12", "35", "3", "26"];

let colors = ["#0F4", "#FF0000", "#000000", "#FF0000", "#000000",
    "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000",
    "#FF0000", "#000000", "#FF0000", "#000000","#FF0000", "#000000","#FF0000",
    "#000000","#FF0000", "#000000","#FF0000", "#000000","#FF0000", "#000000",
    "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000",
    "#FF0000", "#000000", "#FF0000", "#000000"];

let wheels = null;
let frame = null;
let winNumber = null;

function repaint(angle) {
    // / 2.25
    let r = Math.min(innerWidth, innerHeight) / 2.25 | 0;
    if (wheels === null) {
        wheels = [];
        for (let selected=0; selected<sections.length; selected++) {
            let c = document.createElement("canvas");
            c.width = c.height = 2*r + 10;
            let ctx = c.getContext("2d"), cx = 5 + r, cy = 5 + r;
            let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(1, "rgba(0,0,0,0.5)");
            for (let i=0; i<sections.length; i++) {
                let a0 = 2*Math.PI*i/sections.length;
                let a1 = a0 + 2*Math.PI/(i == 0 ? 1 : sections.length);
                let a = 2*Math.PI*(i+0.5)/sections.length;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, a0, a1, false);
                ctx.fillStyle = colors[i];
                ctx.fill();
                ctx.fillStyle = g;
                ctx.fill();
                ctx.save();
                if (i == selected) {
                    ctx.fillStyle = "#FFF";
                    ctx.shadowColor = "#FFF";
                    ctx.shadowBlur = r/20;
                } else {
                    ctx.fillStyle = "#AAF";
                    ctx.shadowColor = "#000";
                    ctx.shadowBlur = r/100;
                }
                ctx.font = "bold " + r/sections.length*1.6 + "px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.translate(cx, cy);
                ctx.rotate(a);
                ctx.fillText(sections[i], r*0.62, 0);
                ctx.restore();
            }
            wheels.push(c);
        }
    }
    if (frame === null) {
        frame = document.createElement("canvas");
        frame.width = frame.height = 10 + 2*r*1.25 | 0;
        let ctx = frame.getContext("2d"), cx = frame.width/2, cy = frame.height/2;
        ctx.shadowOffsetX = r/40;
        ctx.shadowOffsetY = r/40;
        ctx.shadowBlur = r/40;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.arc(cx, cy, r*1.025, 0, 2*Math.PI, true);
        ctx.arc(cx, cy, r*0.975, 0, 2*Math.PI, false);
        ctx.fillStyle = "#0A0";
        ctx.fill();
        ctx.shadowOffsetX = r/40;
        ctx.shadowOffsetY = r/40;
        g = ctx.createRadialGradient(cx-r/7, cy-r/7, 0, cx, cy, r/3);
        g.addColorStop(0.5, "#0A0");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r/15, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI - 0.2);
        ctx.beginPath();
        ctx.moveTo(- r*1.1, - r*0.05);
        ctx.lineTo(- r*0.9, 0);
        ctx.lineTo(- r*1.1, r*0.05);
        ctx.fillStyle = "#F44";
        ctx.fill();
    }
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let cx = innerWidth/2, cy = innerHeight/2;
    let ctx = canvas.getContext("2d");
    let selected = (Math.floor((- 0.2 - angle) * sections.length / (2*Math.PI))
        % sections.length);
    if (selected < 0) selected += sections.length;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(-wheels[selected].width/2, -wheels[selected].height/2);
    ctx.drawImage(wheels[selected], 0, 0);
    ctx.restore();
    ctx.drawImage(frame, cx - frame.width/2, cy - frame.height/2);
}

let angle = 0, running = false;
function spinTo(winner, duration) {
    let final_angle = (-0.2) - (0.5 + winner)*2*Math.PI/sections.length;
    let start_angle = angle - Math.floor(angle/(2*Math.PI))*2*Math.PI - 5*2*Math.PI;
    let start = performance.now();
    function frame() {
        let now = performance.now();
        let t = Math.min(1, (now - start) / duration);
        t = 3*t*t - 2*t*t*t; // ease in out
        angle = start_angle + t * (final_angle - start_angle);
        repaint(angle);
        if (t < 1) requestAnimationFrame(frame); else running = false;
    }
    requestAnimationFrame(frame);
    running = true;
}

canvas.onmousedown = function() {
    if (!running) {
        winNumber = Math.random()*sections.length|0;
        spinTo(winNumber, 5000);
    }
};

repaint(angle);

/*let csz = null;
setInterval(function() {
    let sz = innerWidth + "/" + innerHeight;
    if (csz !== sz) {
        csz = sz;
        wheels = frame = null;
        repaint(angle);
    }
}, 10);*/

setInterval(function (){
    if(!running){
        winNumber = Math.random()*sections.length|0;
        spinTo(winNumber, 5000);
    }
}, 10000);






/*while(true){
    sleep(1000);

    //ajax for user balance
    //timer of bets start

    if(!running){
        winNumber = Math.random()*sections.length|0;
        spinTo(winNumber, 5000);
    }

    sleep(2000);

    // ajax winNumber to server and calculate bets
}*/

