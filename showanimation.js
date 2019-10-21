function showNumberWithAnimation(i,j,randNumber)
{
    var numberCell=$("#number-cell-"+i+"-"+j);//显示随机数的时候需要用到number-cell
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        /*width:"100px",*/
        width:cellSideLength,
        /*height:"100px",*/
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);
}

function  showmoveanimaton(tox,toy,fromx,fromy)
{
    var numbercell=$('#number-cell-'+fromx+'-'+fromy);//通过id获得小格子(要移动的数)
    numbercell.animate({/*将这个number-cell进行动画的改变，移动到getPosTop(tox,toy)，getPosLeft(tox,toy)这个位置，在200ms内完成*/
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updatescore(score)
{
    $('#score').text(score);//拿到socre显示的id，让它的文本变成新的score
}