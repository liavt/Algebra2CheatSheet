let nlp = window.nlp_compromise;

function capitalize(string){
    return string.substring(0,1).toUpperCase() + string.substring(1);
}

function decaptilize(string){
    return string.substring(0,1).toLowerCase() + string.substring(1);
}

function parse(input){
    var type = 'None found';
    var conclusion = 'None found';
    var hypothesis = 'None found';
    
    var index;
    
    //check for biconditional
    index = input.indexOf('if and only if');
    if(index!=-1){
        type = 'Biconditional';
        hypothesis = input.substr(0,index);
        conclusion = input.substr(index+14);//14 is the length of if and only if
    }else{
    
        index = input.indexOf('and');
        if(index!=-1){
            type = 'Conjunction';
            hypothesis = input.substr(0,index);
            conclusion = input.substr(index+3);//14 is the length of if and only if
        }else{
            
        index = input.indexOf('or');
        if(index!=-1){
            type = 'Disjunction';
            hypothesis = input.substr(0,index);
            conclusion = input.substr(index+2);//14 is the length of if and only if
        }else{
        
            index = input.indexOf('then');
            if(input.toLowerCase().substr(0,2)=='if'&&index!=-1){
                type = 'Converse';
                hypothesis = input.substring(2,index);
                conclusion = input.substring(index+4);
            }
        
        }
            
        }
    
    }
    
    //fix if there is a comma at the end
    while(hypothesis.substr(hypothesis.length-1)==','||hypothesis.substr(hypothesis.length-1)==' ')hypothesis = hypothesis.substr(0,hypothesis.length-1);

    return [type,hypothesis,conclusion];
}

function create(type, hypothesis,conclusion){
    switch(type){
            case 'Inverse' :
                return ('If '+nlp.statement(hypothesis).negate().text()+', then '+nlp.statement(conclusion).negate().text());
            case 'Contrapositive':
                return ('If '+nlp.statement(conclusion).negate().text()+', then '+nlp.statement(hypothesis).negate().text());
            case 'Converse':
                return ('If '+conclusion+', then '+hypothesis);
            case 'Biconditional':
                return (capitalize(hypothesis + ' if and only if '+conclusion));
            case 'Conjunction':
                return (capitalize(hypothesis+' and '+conclusion));
            case 'Disjunction':
                return (capitalize(hypothesis+' or '+conclusion));
            default:
                return('An error occured');
    }
}

$(document).ready(function(){
    $('#create-submit').click(function(){
        var type = $('#create-type option:selected').text()

        var hypothesis = decaptilize($('#hypothesis').val());
        var conclusion = decaptilize($('#conclusion').val());
        $('#create-result').html(create(type,hypothesis,conclusion));
    });
    
    $('#parse-submit').click(function(){
        var input = $('#parse-input').val();
        
        var result = parse(input);
        
        $('#parse-result').html('Type: '+result[0]+'<br>Hypothesis: '+capitalize(result[1])+'<br>Conclusion: '+capitalize(result[2]));
    });
    
    $('#swap-submit').click(function(){
        var input = parse($('#swap-input').val());
        var newType = $('#swap-type option:selected').text();
        
        if(input[1]=='None found'||input[2]=='None found'){
            $('#swap-result').html('Error parsing statement');
        }else{
            $('#swap-result').html(create(newType,input[1],input[2]));
        }
    });
    
    $('#counter-submit').click(function(){
        var input = parse($('#counter-input').val());
        if(input[1]=='None found'||input[2]=='None found'){
            $('#counter-result').html('Error parsing statement');
        }else{
            $('#counter-result').html(capitalize(nlp.statement(input[2]).to_present().negate().text())+' but '+nlp.statement(input[1]).to_present().text());
        }    
        
    });
});