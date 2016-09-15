/* global $*/

function fact(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function combinatric(goodcombos, maxcombos,type){
    if(type=='rep'){
        return fact(maxcombos)/(fact(maxcombos-goodcombos));
    }else{
        return fact(maxcombos)/fact(goodcombos)*fact(maxcombos-goodcombos)
    }
}

$(document).ready(function(){
    $('#combin-submit').click(function(){
        var type = $('#combin-type').val();
        var goodcombos = $('#combin-goodcombos').val();
        var maxcombos = $('#combin-maxcombos').val();
        
        var result = combinatric(goodcombos,maxcombos,type);
        
        $('#combin-result').html(result+' '+$('#combin-type option:selected').html().toLowerCase()+'s');
    });
    
    $('#fact-submit').click(function(){
        var input = $('#fact-input').val();
        
        var result = '';
        if(input<=0){
            result = 'Number must be greater than 0';
        }else{
            result = input+'! = '+fact(Number(input));
        }
        
        $('#fact-result').html(result);
        
    });
});