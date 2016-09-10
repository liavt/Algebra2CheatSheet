var probalityRow = '<tr><td><input class="good-combos"type="number"min="2"></td><td><input class="possible-combos"type="number"min="2"></td><td><select><option value="ind">Independent</option><option value="de">Dependent</option></select></td></tr>';

function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}

function calculateProbability(possibilities){
    
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
        $('#calc-table td').each(function(){
            out+=$('.good-combos',this).val();
        });
        $('#calc-result').html(out); 
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