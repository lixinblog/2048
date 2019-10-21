/**获取屏幕尺寸宽度 */
documentWidth=window.screen.availWidth;
/**获取游戏大方块的尺寸 */
gridContainerWidth=0.92*documentWidth;
/**获取游戏每个小方块的尺寸 */
cellSideLength = 0.18*documentWidth;
/**获取游戏每个小方块之间的间距尺寸 */
cellSpace = 0.04*documentWidth;
function getPosTop(i,j)
{
    //return 20+i*(20+100);
    return cellSpace+i*(cellSpace+cellSideLength);
}

function getPosLeft(i,j)
{
    //return 20+j*(20+100);
    return cellSpace+j*(cellSpace+cellSideLength);
}
function getNumberBackgroundColor(number)
{
    switch(number)
    {
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#ede0c8";break;
        case 16:return "#ede0c8";break;
        case 32:return "#f2b179";break;
        case 64:return "#f59563";break;
        case 128:return "#f67c5f";break;
        case 256:return "#f65e3b";break;
        case 512:return "#edcf72";break;
        case 1024:return "#edcc61";break;
        case 2048:return "#9c0";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }
    return "black";
}
function getNumberColor(number)
{
    if(number<=4)//当值小于4时，一种颜色
        return "#776e65";
    return "white";//当值大于4时，是白色
}
function nospace(board)//判断格子是否占满，占满就返回true
{
    for(var i=0; i<4; i++)
    {
        for(var j=0; j<4; j++)
        {
            if(board[i][j]==0)
                return false;
        }
    }
    return true;
}

function notroublehori(row,cols1,cols2,board)//水平没有障碍
{
    for(var l=cols1+1; l<cols2; l++)
    {
        if(board[row][l]!=0)
            return false;
    }
    return true;
}

function canmoveleft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++)//从第二列开始判断
        {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])//当左边的格子的数值为零或者数值和自己相等时，就可以向左移动
                    return true;
            }
        }
    }
    return false;
}

function canmoveup(board)
{
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++)//从第二行开始判断
        {
            if (board[j][i] != 0) {
                if (board[j-1][i] == 0 || board[j-1][i] == board[j][i])//当上边的格子的数值为零或者数值和自己相等时，就可以向左移动
                    return true;
            }
        }
    }
    return false;   
}

function notroublevert(cols, row2, row1, board)/**垂直没有障碍i列，k行到j行 */
{
    for(var l=row2+1; l<row1; l++)
    {
        if(board[l][cols]!=0)
            return false;
    }
    return true;
}

function canmoveright(board)
{
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++)
        {
            if (board[i][j] != 0) {
                if (board[i][j+1] == 0 || board[i][j+1] == board[i][j])//当右边的格子的数值为零或者数值和自己相等时，就可以向左移动
                    return true;
            }
        }
    }
    return false;   
}

function canmovedown(board)
{
    for (var i = 0; i < 4; i++) {
        for (var j =0; j < 3; j++)//从第二行开始判断
        {
            if (board[j][i] != 0) {
                if (board[j+1][i] == 0 || board[j+1][i] == board[j][i])//当下边的格子的数值为零或者数值和自己相等时，就可以向左移动
                    return true;
            }
        }
    }
    return false;   
}

function nomove(board)
{
    if(canmovedown(board)||canmoveleft(board)||canmoveright(board)||canmoveup(board))//不可以上下左右移动
        return false;
    return true;
}