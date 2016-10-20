/*global $*/

function rootCalc(number,result){
    var iterations = 0;
    var n = number;
    while(n!=result){
        n *= number;
        iterations++;
    }
    return n;
}

function calculateLog(base,number){
    

}

$(document).ready(function(){
    $('#log-submit').click(function(){
        var base = $('#log-base').val();
        var number = $('#log-number').val();
        
        var html = '';
        
        if(!base){
            html = '<i>No base was given; assuming it is 10.</i><br>';
            base = 10;
        }else if(base.toLowerCase()=='e'){
            base = Math.E;
        }else if(isNaN(base)){
            html += '<i>Not a valid base, replacing it with 10</i><br>';
            base = 10;
        }
        
        if(!number){
            html += '<i>No argument was given; assuming it is 1</i><br>';
            number=1;
        }else if(number.toLowerCase()=='e'){
            number = Math.E;
        }else if(isNaN(number)){
            html += '<i>Not a valid argument, replacing it with 1</i><br>';
            number = 1;
        }
        
        var answer = (Math.log(number)/Math.log(base));
        
        html += 'Equation: log<sub>'+base+'</sub> '+number+'<br>Exponent form: '+base+'<sup>'+answer+'</sup> = '+number+'<br>Answer: '+answer;
        
        $('#log-result').html(html);
    });
});