let canvas = document.getElementById("canvas");

let img_href = 'http://placehold.it/25x25/aa3/fff&text=';
let blc = Number($("#balance_value").html());
let count = 30;

let bets = new Array(49).fill(0);
let timer_prepare = 5000;

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
    let radio = document.querySelector('input[type=radio]:checked').value;
    switch (currentBet){
        case '1':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[0] += Number(radio);
                blc -= radio;
                let text = bets[0].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '2':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[1] += Number(radio);
                blc -= radio;
                let text = bets[1].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '3':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[2] += Number(radio);
                blc -= radio;
                let text = bets[2].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '4':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[3] += Number(radio);
                blc -= radio;
                let text = bets[3].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '5':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[4] += Number(radio);
                blc -= radio;
                let text = bets[4].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '6':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[5] += Number(radio);
                blc -= radio;
                let text = bets[5].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '7':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[6] += Number(radio);
                blc -= radio;
                let text = bets[6].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '8':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[7] += Number(radio);
                blc -= radio;
                let text = bets[7].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '9':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[8] += Number(radio);
                blc -= radio;
                let text = bets[8].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '10':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[9] += Number(radio);
                blc -= radio;
                let text = bets[9].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '11':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[10] += Number(radio);
                blc -= radio;
                let text = bets[10].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '12':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[11] += Number(radio);
                blc -= radio;
                let text = bets[11].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '13':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[12] += Number(radio);
                blc -= radio;
                let text = bets[12].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '14':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[13] += Number(radio);
                blc -= radio;
                let text = bets[13].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '15':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[14] += Number(radio);
                blc -= radio;
                let text = bets[14].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '16':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[15] += Number(radio);
                blc -= radio;
                let text = bets[15].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '17':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[16] += Number(radio);
                blc -= radio;
                let text = bets[16].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '18':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[17] += Number(radio);
                blc -= radio;
                let text = bets[17].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '19':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[18] += Number(radio);
                blc -= radio;
                let text = bets[18].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '20':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[19] += Number(radio);
                blc -= radio;
                let text = bets[19].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '21':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[20] += Number(radio);
                blc -= radio;
                let text = bets[20].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '22':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[21] += Number(radio);
                blc -= radio;
                let text = bets[21].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '23':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[22] += Number(radio);
                blc -= radio;
                let text = bets[22].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '24':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[23] += Number(radio);
                blc -= radio;
                let text = bets[23].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '25':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[24] += Number(radio);
                blc -= radio;
                let text = bets[24].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '26':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[25] += Number(radio);
                blc -= radio;
                let text = bets[25].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '27':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[26] += Number(radio);
                blc -= radio;
                let text = bets[26].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '28':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[27] += Number(radio);
                blc -= radio;
                let text = bets[27].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '29':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[28] += Number(radio);
                blc -= radio;
                let text = bets[28].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '30':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[29] += Number(radio);
                blc -= radio;
                let text = bets[29].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '31':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[30] += Number(radio);
                blc -= radio;
                let text = bets[30].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '32':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[31] += Number(radio);
                blc -= radio;
                let text = bets[31].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '33':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[32] += Number(radio);
                blc -= radio;
                let text = bets[32].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '34':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[33] += Number(radio);
                blc -= radio;
                let text = bets[33].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '35':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[34] += Number(radio);
                blc -= radio;
                let text = bets[34].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '36':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[35] += Number(radio);
                blc -= radio;
                let text = bets[35].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '0':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[36] += Number(radio);
                blc -= radio;
                let text = bets[36].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '1-1':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[37] += Number(radio);
                blc -= radio;
                let text = bets[37].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '2-1':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[38] += Number(radio);
                blc -= radio;
                let text = bets[38].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '3-1':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[39] += Number(radio);
                blc -= radio;
                let text = bets[39].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '1-12':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[40] += Number(radio);
                blc -= radio;
                let text = bets[40].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '2-12':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[41] += Number(radio);
                blc -= radio;
                let text = bets[41].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '3-12':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[42] += Number(radio);
                blc -= radio;
                let text = bets[42].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '1-18':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[43] += Number(radio);
                blc -= radio;
                let text = bets[43].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case '19-36':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[44] += Number(radio);
                blc -= radio;
                let text = bets[44].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case 'even':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[45] += Number(radio);
                blc -= radio;
                let text = bets[45].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case 'odd':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[46] += Number(radio);
                blc -= radio;
                let text = bets[46].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case 'red':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[47] += Number(radio);
                blc -= radio;
                let text = bets[47].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case 'black':
            if(blc >= radio){
                if($(this).children('img')){
                    $(this).children('img').remove();
                }
                let img_bet = document.createElement('img');
                img_bet.id = 'img_bet';
                img_bet.src = '';
                bets[48] += Number(radio);
                blc -= radio;
                let text = bets[48].toString();
                img_bet.src = img_href + text;
                $($(this)).append(img_bet);
            }
            break;
        case 'default':
            break;
    }
});

$("#timer").html("Настраиваем колесо...");

setInterval(function (){
    timer = setInterval(function() {
    $("#timer").html("Делайте ставки...<br>" + --count);
    if(count == 25)
        $("#balance_value").html(blc);
    if(count == 0){
        $("#timer").html("Roll");
        clearInterval(timer);
    }
}, 1000);}, 36000);

setInterval(function (){
    if(count == 0) {

        /*$.ajax({
            type: 'POST',
            url: "/getBalance",
            dataType: 'json',
            success: function (response) {
                balance = response.balance;
                blc = balance;
            }
        });*/


        if (!running) {
            winNumber = Math.random() * sections.length | 0;
            spinTo(winNumber, 5000);
        }

        $.ajax({
            type:'POST',
            url:'/calculateBet',
            dataType: 'json',
            data:{
                winNum: winNumber,
                bts: bets,
                balance: blc,
            },
            success : function (response){
                blc = response.balance;
                console.log(blc);
            }
        });

        count = 30;

    }
},3000);



