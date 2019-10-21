var board = new Array();
var score = 0;
var hasconflict=new Array();//用来标记每个小格子是否发生过碰撞(解决一个bug，例如：2 2 4 8，向左移动时，不能生成16，而是生成4 4 8)

var startx;
var starty;
var endx;
var endy;

/*当整个程序加载完成后，将运行一个newgame函数 */
$(document).ready(function () {
    //移动端进行游戏前的准备工作
    prepareForMobile();
    newgame();
});

function prepareForMobile()
{
    if(documentWidth>500)
    {
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();//在16格子随机找一个格子，并随机生成一个数字
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++)//对每个小格子的位置进行赋值 
    {
        for (var j = 0; j < 4; j++) {
            // alert("hahha");
            var gridCell = $("#grid-cell-" + i + "-" + j);//通过id获得小格子
            gridCell.css('top', getPosTop(i, j));//通过i，j的值，通过getPosTop函数获得top的值
            //alert("xixii");
            gridCell.css('left', getPosLeft(i, j));//通过i，j的值，通过getPosLeft函数获得left的值
            //alert("wahahah");
            //console.log(getPosTop(i,j)+"......."+getPosLeft(i,j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();//把board数组生成二维数组
        hasconflict[i]=new Array();//把hasconflict数组生成二维数组
        for (var j = 0; j < 4; j++)//初始化board数组的值，开始都为零
        {
            board[i][j] = 0;
            hasconflict[i][j]=false;//初始化为false
        }
    }
    score=0;//初始化，score=0；
    updateBoardView();//初始化完毕后，需要通知number-cell进行显示的设定
    updatescore(score);
}

function updateBoardView() {
    $(".number-cell").remove();//开始有number-cell这样的元素的话，要统统删除
    for (var i = 0; i < 4; i++)//根据board元素设置number-cell的值
    {
        for (var j = 0; j < 4; j++) {
            //每一个board元素都要生成一个number-cell，在grid-container里面添加number-cell元素
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');//这里写错了，检查了半天(格式注意一下啊))
            var theNumberCell = $("#number-cell-" + i + '-' + j);//用来操作当前number-cell 

            if (board[i][j] == 0)//board的值，对应number-cell的样式也不同
            {
                theNumberCell.css('width', '0px');//把number-cell的宽和高设置为零，让它不显示
                theNumberCell.css('height', '0px');
                //theNumberCell.css('top', getPosTop(i, j) + '50px');原网页是这样的
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength/2);//getPosTop计算了每个（数字框）的上边的位置
                //theNumberCell.css('left', getPosTop(i, j) + '50px');
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength/2);//getPosLeft计算了每个（数字框）的左边的位置
            }
            else//board的值不为零时和grid-cell的样式是一样的
            {
                //theNumberCell.css('width', '100px');
                theNumberCell.css('width', cellSideLength);
                //theNumberCell.css('height', '100px');
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));//这时每一个number-cell的背景色也不同（根据board的值不同而不同）
                theNumberCell.css('color', getNumberColor(board[i][j]));//这时每一个number-cell的前景色也不同
                theNumberCell.text(board[i][j]);//number-cell要显示board[i][j]的值
            }
            hasconflict[i][j]=false;//显示完之后，要把hasconflict重新置为false
        }
        $('.number-cell').css('line-height',cellSideLength+'px');//在css中将number-cell对应的行高进行改写
        $('.number-cell').css('font-size',0.6*cellSideLength+'px');//将字号进行设置
    }
}

function generateOneNumber() {
    if (nospace(board))//首先要判断一下，当前情况还能不能随机生成一个数字，判断4×4还有空间，就能生成
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    /*while (true) {
        if (board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
    }*/
    //优化寻找空位置的算法,只让他寻找五十次，如果找不到，就人工查找
    var time=0;
    while (time<50) {
        if (board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        time++;
    }
    if(time==50)
    {
        for(var i=0; i<4; i++)
        {
            for(var j=0; j<4; j++)
            {
                if(board[i][j]==0)
                {
                    randx=i;
                    randy=j;
                    break;
                }
            }
        }
    }
    //生成随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    //出现一个随机数显示一个动画效果
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}
/*没按下一个键，进行循环 */
$(document).keydown(function (event) {
   // event.preventDefault();//禁止页面进行上下移动
    switch (event.keyCode) {
        case 37://left
            event.preventDefault();//禁止页面进行上下移动
            if (moveLeft())//向左移动，首先判断是否可以进行左边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
            break;
        case 38://up
            event.preventDefault();//禁止页面进行上下移动
            if (moveUp())//判断是否可以进行向上边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
            break;
        case 39://right
            event.preventDefault();//禁止页面进行上下移动
            if (moveRight())//判断是否可以进行向右边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
            break;
        case 40://down
            event.preventDefault();//禁止页面进行上下移动
            if (moveDown())//判断是否可以进行向下边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
            break;
        default:
            break;
    }
});
/**document上增加一个事件监听器，监听touchstart这个事件，捕捉这个事件，将响应一个匿名函数
 * event会存储相关的信息
 */
document.addEventListener('touchstart',function(event)
{
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});
 
document.addEventListener('touchmove',function(event)//用来解决手指识别不管用
{
    event.preventDefault();
});
document.addEventListener('touchend',function(event)
{
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax=endx-startx;
    var deltay=endy-starty;

    if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)//当滑动的距离小于一定距离时，就判断它不是滑动操作
    {
        return;
    }
    //x方向
    if(Math.abs(deltax)>Math.abs(deltay))
    {
        if(deltax>0)//向x的正方向移动
        {
            if (moveRight())//判断是否可以进行向右边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
        }
        else//向x轴的负方向移动
        {
            if (moveLeft())//向左移动，首先判断是否可以进行左边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
        }
    }
    else//y方向
    {
        if(deltay<0)//向上移动(注意屏幕坐标是向下的,和数学坐标是不一样的)
        {
            if (moveUp())//判断是否可以进行向上边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
        }
        else//向下移动
        {
            if (moveDown())//判断是否可以进行向下边移动
            {
                setTimeout("generateOneNumber()",210);//生成一个随机数
                setTimeout("isgameover()",300);//判断是否游戏结束
            }
        }
    }
});
function isgameover() {
    if(nospace(board)&&nomove(board))//如果棋盘格占满，并且真的不能移动了(相邻间没有相等的数字)
    {
        gameover();
    }
}

function gameover()
{
    alert('gameover');
}
/** 这里出现了问题*/
function moveUp()
{
    if (canmoveup(board) == false)
    {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[j][i] != 0)//如果这个数不为零
            {
                for (var k = 0; k < j; k++) {
                    if (board[k][i] == 0 && notroublevert(i, k, j, board))//如果这个数为零，而且board[j][i]到board[k][i]之间没有非零数字
                    {   //move
                        showmoveanimaton(k, i, j, i);//显示动画
                        //alert("heregoing");
                        board[k][i] = board[j][i];
                        board[j][i] = 0;
                        continue;
                    }
                    else if (board[k][i] == board[j][i] &&notroublevert(i, k, j, board)&&hasconflict[k][i]==false)//如果这个数和board[i][j]相等，而且board[i][j]到board[i][k]之间没有非零数字
                    {   //move
                        showmoveanimaton(k, i, j, i);//显示动画  
                        //add
                        board[k][i] += board[j][i];
                        board[j][i] = 0;

                        score+=board[k][i];
                        updatescore(score);//通知前台更新score

                        hasconflict[k][i]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//初始化完毕后，需要通知number-cell进行显示的设定
    //alert("aa");
    return true;
}

function moveDown()
{
    if (canmovedown(board) == false)
    {
        return false;
    }
    //moveDown
    //alert("haha");
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >=0; j--) {
            if (board[j][i] != 0)//如果这个数不为零
            {
                for (var k = 3; k >j; k--) {
                    //alert("row="+j);
                    //alert("cols="+i);
                    if (board[k][i] == 0 && notroublevert(i, j, k, board))//如果这个数为零，而且board[j][i]到board[k][i]之间没有非零数字
                    {   //move
                        //alert("heregoing");
                        showmoveanimaton(k, i, j, i);//显示动画
                        board[k][i] = board[j][i];
                        board[j][i] = 0;
                        continue;
                    }
                    else if (board[k][i] == board[j][i] &&notroublevert(i, j, k, board)&&hasconflict[k][i]==false)//如果这个数和board[i][j]相等，而且board[i][j]到board[i][k]之间没有非零数字
                    {   //move
                        showmoveanimaton(k, i, j, i);//显示动画  
                        //add
                        board[k][i] += board[j][i];
                        board[j][i] = 0;

                        score+=board[k][i];
                        updatescore(score);//通知前台更新score

                        hasconflict[k][i]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//初始化完毕后，需要通知number-cell进行显示的设定
    //alert("aa");
    return true;
}

function moveLeft() {
    if (canmoveleft(board) == false)//判断是否可以向左移动
    {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0)//如果这个数不为零
            {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && notroublehori(i, k, j, board))//如果这个数为零，而且board[i][j]到board[i][k]之间没有非零数字
                    {   //move
                        showmoveanimaton(i, k, i, j);//显示动画
                        //alert("heregoing");
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && notroublehori(i, k, j, board)&&hasconflict[i][k]==false)//如果这个数和board[i][j]相等，而且board[i][j]到board[i][k]之间没有非零数字
                    {   //move
                        showmoveanimaton(i, k, i, j);//显示动画  
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //addscore
                        score+=board[i][k];
                        updatescore(score);//通知前台更新score

                        hasconflict[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//初始化完毕后，需要通知number-cell进行显示的设定
    return true;
}

function moveRight() {
    if (canmoveright(board) == false)//判断是否可以向左移动
    {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >=0; j--) {
            if (board[i][j] != 0)//如果这个数不为零
            {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && notroublehori(i, j, k, board))//如果这个数为零，而且board[i][j]到board[i][k]之间没有非零数字
                    {   //move
                        showmoveanimaton(i, k, i, j);//显示动画
                        //alert("heregoing");
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && notroublehori(i, j, k, board)&&hasconflict[i][k]==false)//如果这个数和board[i][j]相等，而且board[i][j]到board[i][k]之间没有非零数字
                    {   //move
                        showmoveanimaton(i, k, i, j);//显示动画  
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score+=board[i][k];
                        updatescore(score);//通知前台更新score

                        hasconflict[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//初始化完毕后，需要通知number-cell进行显示的设定
    return true;
}