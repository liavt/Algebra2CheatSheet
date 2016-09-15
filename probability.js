/*global $ */

var probalityRow = '<tr><td><input class="good-combos"type="number"min="2"></td><td><input class="possible-combos"type="number"min="2"></td><td><select class="possibility-type"><option value="ind">Independent</option><option value="de">Dependent</option></select></td></tr>';

function gcd(a,b){
    return b ? gcd(b, a%b) : a;
}

function reduce(numerator,denominator){
  var gcdResult = gcd(numerator,denominator);
  return [numerator/gcdResult, denominator/gcdResult];
}

function lcm(denominators){
    var result = denominators[0];
    for(var i = 1;i<denominators.length;i++){
        result = Math.abs(result*denominators[i]) / gcd(result,denominators[i]);
    }
    return result;
}

function calculateProbability(numerators,denominators,types){
    var commonMultiple = lcm(denominators);
    for(var i =0;i<numerators.length;i++){
        var multiplier = denominators[i]/commonMultiple;
        console.log(multiplier);
        numerators[i] /=multiplier;
        denominators[i] = commonMultiple;
    }
    
    var result = 0;
        
    for(var i =0;i<types.length;i++){
        var type = types[i];
        if(type=='ind'){
            result+=Number(numerators[i]/denominators[i]);
        }else if(type=='de'){
            result*=Number(numerators[i]/denominators[i]);
        }
    }
    
    return result;
}

$(document).ready(function(){
    var table = $('#calc-table');
    
    table.append(probalityRow);
    
    $('#calc-row-add').click(function(){
        table.append(probalityRow);
    })
    
    $('#calc-row-remove').click(function(){
        if($('#calc-table tr').length>2)$('#calc-table tr:last').remove();
    });
    
    $('#calc-submit').click(function(){
        var out='';
        
        var goodCombos = [];
        var possibleCombos = [];
        var types = [];
        
        $('#calc-table td').each(function(){
            var currentGoodCombo = $('.good-combos',this).val();
            if(currentGoodCombo)goodCombos.push(currentGoodCombo);
            
            var currentPossibleCombo = $('.possible-combos',this).val();
            if(currentPossibleCombo)possibleCombos.push(currentPossibleCombo);
            
            var currentType = $('.possibility-type',this).val();
            if(currentType)types.push(currentType);
        });
        
        var result = calculateProbability(goodCombos,possibleCombos,types).toFixed(2);
        
        if(result>1)result=1;
        
        var fraction = reduce((result*100),100);
        
        $('#calc-result').html((result*100)+'% probability of success.<br>Fraction: '+fraction[0]+'/'+fraction[1]+'<br>Decimal result: '+result); 
    });
    
    $('#dice-submit').click(function(){
        var sides = Math.floor($('#dice-input').val());
        var resultElement = $('#dice-result');
        
        if(sides<=1)resultElement.html('Input cant be less than 2');
        else{
            var result =Math.floor((Math.random() * sides) + 1);
            
            var reducedFraction = reduce(result,sides);
            resultElement.html('Rolled: '+result+'<br>Fraction: '+reducedFraction[0]+'/'+reducedFraction[1]+'<br>Decimal: '+result/sides);
        }
    });
});