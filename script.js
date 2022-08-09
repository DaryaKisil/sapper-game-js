const textBox = document.getElementsByClassName("textBox");
const button = document.getElementById("OkBtn");
const canva = document.getElementById("canva");
const holst = canva.getContext("2d");

let h;
let w;
let area = [];
let visibleArea = [];
let countMines = 0;
let game = false;
textBox[0].onkeyup = checkNumber;
textBox[1].onkeyup = checkNumber;
function checkNumber()
{
    this.value = this.value.replace(/[^0-9\.]/g,'');
}

button.onmousedown = function()
{
    h = Number(textBox[0].value);
    w = Number(textBox[1].value);
    game = true;
    setTable();
    setMines();
}


canva.onmousedown = function(e)
{
    if(game == true)
    {
    let x = e.offsetX;
    let y = e.offsetY;
    x/= (800/w);
    y/= (800/h);
    x = Math.floor(x);
    y = Math.floor(y);
    recShow(y, x);
    visibleArea[y][x] = true;
    if(area[y][x] >= 10)
    {
        game = false;
        alert("Вы проиграли");
    }
    showArea();
    let count = 0;
    for(let i = 0; i < h; i++)
    {
        for(let j = 0; j < w; j++)
        { 
            if(visibleArea[i][j] == false)
            count++;
        }
    }
    if(count == countMines && game == true)
    {
        game = false;
        alert("Вы выиграли");
    }
}
}

function recShow(y, x)
{
    if(y < 0 || x < 0 || x >= w || y >=h)
        return;
    if(visibleArea[y][x] == true)
    {
        return;
    }
    visibleArea[y][x] = true;
    if(area[y][x] == 0)
    {
        recShow(y - 1, x);
        recShow(y - 1, x - 1);
        recShow(y, x - 1);
        recShow(y + 1, x);
        recShow(y + 1, x + 1);
        recShow(y - 1, x + 1);
        recShow(y + 1, x - 1);
    }
}
function setTable()
{
    holst.strokeStyle = "black";
    holst.lineWidth = 2;
    holst.fillStyle = "lightgray";
    holst.fillRect(0,0,800,800);
    for(let i = 0; i < w; i++)
    {
        holst.beginPath();
        holst.moveTo((800/w) * i, 0);
        holst.lineTo((800/w) * i, 800);
        holst.stroke();
        holst.closePath();
    }

    for(let i = 0; i < h; i++)
    {
        holst.beginPath();
        holst.moveTo(0, (800/h) * i);
        holst.lineTo(800, (800/h) * i);
        holst.stroke();
        holst.closePath();
    }

    for(let i = 0; i < h; i++)
    {
        area[i] = [];
        visibleArea[i] = []; 
        for(let j = 0; j < w; j++)
        {
            area[i][j] = 0;
            visibleArea[i][j] = false;
        }
    }
    countMines = Math.round((h+w)/2);
}


function setMines()
{
    for(let i = 0; i < countMines;)
    {
        let x = Math.floor(Math.random()*w);
        let y = Math.floor(Math.random()*h);
        if(area[y][x]<10)
        {
            area[y][x] = 10;
            if(y > 0)
            {
                area[y-1][x]++;
                if(x>0) area[y-1][x-1]++;
                if(x!=w-1) area[y-1][x+1]++;
            }
            if(y != h-1)
            {
                area[y+1][x]++;
                if(x>0) area[y+1][x-1]++;
                if(x!=w-1) area[y+1][x+1]++;
            }
            if(x > 0) area[y][x-1]++;
            if(x!=w-1) area[y][x+1]++;
            i++;
        }
    }
}

function showArea()
{
    for(let i = 0; i < h; i++)
    {
        for(let j = 0; j < w; j++)
        {
            let r = h<w?250/w:250/h;
            if(visibleArea[i][j] == true)
            {
                holst.fillStyle = "gray";
                holst.fillRect(j*(800/w)+2, i* (800/h)+ 2, 800/w -2, 800/h - 2);
                if(area[i][j] >= 10)
                {
                    let r = h<w?250/w:250/h;
                    holst.fillStyle = "black";
                    holst.beginPath();
                    holst.arc(j*(800/w)+400/w,i*(800/h)+400/h, r-10, 0, 7);
                    holst.fill();
                    holst.closePath();
                }
                else if (area[i][j]>0)
                {
                    holst.fillStyle = "red";
                    holst.beginPath();
                    holst.font = r+"px Arial";
                    holst.fillText(area[i][j], j*(800/w)+400/w, i*(800/h)+400/h);
                    holst.closePath();
                }
            }
        }
    }
}