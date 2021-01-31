let canvas = document.getElementById("canvas");


let radio = document.querySelector('input[name="chip"]:checked').value;
let img_bet = document.createElement('img');
let img_href = 'http://placehold.it/25x25/aa3/fff&text=';
let balance = 0;
let blc = 0;

let bets = new Map([
    ['1',0], ['2',0], ['3',0], ['4',0], ['4',0],
    ['5',0], ['6',0], ['7',0], ['8',0], ['9',0],
    ['10',0], ['11',0], ['12',0], ['13',0], ['14',0],
    ['15',0], ['16',0], ['17',0], ['18',0], ['19',0],
    ['20',0], ['21',0], ['22',0], ['23',0], ['24',0],
    ['25',0], ['26',0], ['27',0], ['28',0], ['29',0],
    ['30',0], ['31',0], ['32',0], ['33',0], ['34',0],
    ['35',0], ['36',0], ['0',0], ['1-1',0], ['2-1',0],
    ['3-1',0], ['1-12',0], ['2-12',0], ['3-12',0], ['1-18',0],
    ['19-36',0], ['even',0], ['odd',0], ['red',0], ['black',0],
]);

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

repaint(angle);

/*canvas.onmousedown = function() {
    if (!running) {
        winNumber = Math.random()*sections.length|0;
        spinTo(winNumber, 5000);
    }
};

repaint(angle);

let csz = null;
setInterval(function() {
    let sz = innerWidth + "/" + innerHeight;
    if (csz !== sz) {
        csz = sz;
        wheels = frame = null;
        repaint(angle);
    }
}, 10);*/

function sleep( sleepDuration ){
    let now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

$(".bet_value").click(function () {
    let currentBet = $(this).text();
    console.log(blc);
    switch (currentBet){
        case '1':
            if(blc >= radio){
                img_bet.src = '';
                bets['1'] += radio;
                blc -= radio;
                let text = bets['1'].toString();
                console.log(text);
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '2':
            if(blc < radio){
                tempBets['2'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '3':
            if(blc < radio){
                tempBets['3'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '4':
            if(blc < radio){
                tempBets['4'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '5':
            if(blc < radio){
                tempBets['5'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '6':
            if(blc < radio){
                tempBets['6'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '7':
            if(blc < radio){
                tempBets['7'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '8':
            if(blc < radio){
                tempBets['8'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '9':
            if(blc < radio){
                tempBets['9'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '10':
            if(blc < radio){
                tempBets['10'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '11':
            if(blc < radio){
                tempBets['11'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '12':
            if(blc < radio){
                tempBets['12'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '13':
            if(blc < radio){
                tempBets['13'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '14':
            if(blc < radio){
                tempBets['14'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '15':
            if(blc < radio){
                tempBets['15'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '16':
            if(blc < radio){
                tempBets['16'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '17':
            if(blc < radio){
                tempBets['17'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '18':
            if(blc < radio){
                tempBets['18'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '19':
            if(blc < radio){
                tempBets['19'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '20':
            if(blc < radio){
                tempBets['20'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '21':
            if(blc < radio){
                tempBets['21'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '22':
            if(blc < radio){
                tempBets['22'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '23':
            if(blc < radio){
                tempBets['23'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '24':
            if(blc < radio){
                tempBets['24'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '25':
            if(blc < radio){
                tempBets['25'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '26':
            if(blc < radio){
                tempBets['26'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '27':
            if(blc < radio){
                tempBets['27'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '28':
            if(blc < radio){
                tempBets['28'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '29':
            if(blc < radio){
                tempBets['29'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '30':
            if(blc < radio){
                tempBets['30'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '31':
            if(blc < radio){
                tempBets['31'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '32':
            if(blc < radio){
                tempBets['32'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '33':
            if(blc < radio){
                tempBets['33'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '34':
            if(blc < radio){
                tempBets['34'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '35':
            if(blc < radio){
                tempBets['35'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '36':
            if(blc < radio){
                tempBets['36'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '0':
            if(blc < radio){
                tempBets['0'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '1-1':
            if(blc < radio){
                tempBets['1-1'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '2-1':
            if(blc < radio){
                tempBets['2-1'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '3-1':
            if(blc < radio){
                tempBets['3-1'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '1-12':
            if(blc < radio){
                tempBets['1-12'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '2-12':
            if(blc < radio){
                tempBets['2-12'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '3-12':
            if(blc < radio){
                tempBets['3-12'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '1-18':
            if(blc < radio){
                tempBets['1-18'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case '19-36':
            if(blc < radio){
                tempBets['19-36'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case 'even':
            if(blc < radio){
                tempBets['even'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case 'odd':
            if(blc < radio){
                tempBets['odd'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case 'red':
            if(blc < radio){
                tempBets['red'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case 'black':
            if(blc < radio){
                tempBets['black'] += radio;
                blc -= radio;
                // append img to bets board
            }
            break;
        case 'default':
            break;
    }
});

setInterval(function (){
    $.ajax({
        type:'POST',
        url:"/getBalance",
        dataType:'json',
        success: function (response){
            balance = response.balance;
            blc = balance;
        }
    });


    if(!running){
        winNumber = Math.random()*sections.length|0;
        spinTo(winNumber, 5000);
    }
}, 30000);



