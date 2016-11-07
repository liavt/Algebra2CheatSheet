/*global $*/

var OPERATORS = [
    ["%",function(left,right){
        if(left[0]===right[0]){
            return [[0, STATES.NUMBER],"Anything modulo itself is 0"];
        }else if(left[0]==0){
            return [[0, STATES.NUMBER],"0 modulo anything is 0"];
        }else if(right[0]==0){
            return [[0, STATES.NUMBER],"Anything modulo 0 is 0"];
        }else if(right[0]==1){
            return [[0, STATES.NUMBER],"Anything modulo 1 is 0"];
        }else if(right[1]==STATES.NUMBER&&left[1]==STATES.NUMBER){
            return [[Number(left[0])%Number(right[0]),STATES.NUMBER],"Definition of modulo"];
        }else{
            return [[left[0]+"%"+right[0],STATES.PARENS],"Cannot perform operation"];
        }
    }], ["^",function(left,right){
        if(right[0]==0){
            return [[1, STATES.NUMBER],"Anything to the power of 0 is 1"];
        }else if(right[0]==1){
            return [left, "Anything to the power of 1 is itself"];
        }else if(right[1]==STATES.NUMBER&&left[1]==STATES.NUMBER){
            return [[Math.pow(Number(left[0]),Number(right[0])),STATES.NUMBER],"Definition of exponents"];
        }else{
            return [[left[0]+"^"+right[0],STATES.PARENS],"Cannot perform operation"];
        }
    }], ["*",function(left,right){
        if(right[0]==0||left[0]==0){
            return [[0,STATES.NUMBER],"Property of 0"];
        }else if(right[0]==1){
            return [left,"Multiplicative identity property"];
        }else if(left[0]==1){
            return [right,"Multiplicative identity property"];
        }else if(right[1]==STATES.NUMBER&&left[1]==STATES.NUMBER){
            return [[Number(left[0])*Number(right[0]),STATES.NUMBER],"Definition of multiplication"];
        }else if(right[1]==STATES.PARENS){
            var tokens = tokenize(openParens(right[0]));
            var result = "(";
            
            for(var i = 0;i<tokens.length;++i){
                if(tokens[i][1]!=STATES.OPERATOR){
                    result += "("+left[0]+"*"+tokens[i][0]+")";
                }else{
                    result += tokens[i][0];
                }
            }
            
            result += ")";
            
            return [[result,STATES.PARENS],"Distributive Property"];
        }else{
            return [[left[0]+"*"+right[0],STATES.PARENS],"Cannot perform operation"];
        }
    }], ["/",function(left,right){
        if(left==right){
            return [[1, STATES.NUMBER],"Anything divided by itself is 1"]; 
        }else if(left[0]==0){
            return [[0, STATES.NUMBER],"Property of 0"];
        }else if(right[0]==0){
            throw "Can\'t divide by 0!";
        }else if(right[1]==STATES.NUMBER&&left[1]==STATES.NUMBER){
            return [[Number(left[0])/Number(right[0]),STATES.NUMBER],"Definition of division"];
        }else{
            return [[left[0]+"/"+right[0],STATES.PARENS],"Cannot perform operation"];
        }
    }], ["+",function(left,right){
        if(left[0]==0){
            return [right,"Additive identity property"];
        }else if(right[0]==0){
            return [left,"Additive identity property"];
        }else if(right[1]==STATES.NUMBER&&left[1]==STATES.NUMBER){
            return [[Number(left[0])+Number(right[0]),STATES.NUMBER],"Definition of addition"];
        }else{
            return [[left[0]+"+"+right[0],STATES.PARENS],"Cannot perform operation"];
        }
    }], ["-",function(left,right){
        if(right[0]==0){
            return [left,"Property of 0"];
        }else if(left[0]===right[0]){
            return [[0,STATES.NUMBER],"Additive inverse property"];
        }else if(right[1]==STATES.NUMBER&&left[1]==STATES.NUMBER){
            return [Number(left[0])-Number(right[0]),STATES.NUMBER];
        }else{
            return [[left[0]+"-"+right[0],STATES.PARENS],"Cannot perform operation"];
        }
    }], ["=",function(left,right){
        if(left[1]==STATES.VARIABLE){
            return [right,"Definition of equal"];
        }else if(right[1]==STATES.VARIABLE){
            return [left,"Symmetric POE"];
        }else{
            if(left[0]!=right[0]){
                throw "Expression is invalid. Both sides don't equal the same thing";
            }
            return [left,"Reflexive property"];
        }
    }]
];

var FUNCTIONS = [
    ["sin",function(args){
        if(!args)throw "sin requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["sin("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.sin(Number(args[0])),STATES.NUMBER];
    },"Calculates the sine of an angle"],
    ["cos",function(args){
        if(!args)throw "cos requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["cos("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.cos(Number(args[0])),STATES.NUMBER];
    },"Calculates the cosine of an angle"],
    ["tan",function(args){
        if(!args)throw "tan requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["tan("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.tan(Number(args[0])),STATES.NUMBER];
    },"Calculates the tangent of an angle"],
    ["asin",function(args){
        if(!args)throw "asin requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["asin("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.asin(Number(args[0])),STATES.NUMBER];
    },"Calculates the arcsine of an angle"],
    ["acos",function(args){
        if(!args)throw "acos requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["acos("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.acos(Number(args[0])),STATES.NUMBER];
    },"Calculates the arccosine of an angle"],
    ["atan",function(args){
        if(!args)throw "atan requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["atan("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.atan(Number(args[0])),STATES.NUMBER];
    },"Calculates the arctangent of an angle"],
    ["csc",function(args){
        if(!args)throw "csc requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["(1/sin("+args[0]+"))",STATES.PARENS];
        }
        return [1/Math.sin(Number(args[0])),STATES.NUMBER];
    },"Calculates the cosecant of an angle"],
    ["sec",function(args){
        if(!args)throw "sec requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["(1/cos("+args[0]+"))",STATES.PARENS];
        }
        return [1/Math.cos(Number(args[0])),STATES.NUMBER];
    },"Calculates the secant of an angle"],
    ["cot",function(args){
        if(!args)throw "cot requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["(1/tan("+args[0]+"))",STATES.PARENS];
        }
        return [1/Math.tan(Number(args[0])),STATES.NUMBER];
    },"Calculates the cotangent of an angle"],
    ["abs",function(args){
        if(!args)throw "abs requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["abs("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.abs(Number(args[0])),STATES.NUMBER];
    },"Returns the absolute value of a number"],
    ["sqrt",function(args){
        if(!args)throw "sqrt requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["sqrt("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.sqrt(Number(args[0])),STATES.NUMBER];
    },"Finds the square root of a nubmer"],
    ["rand",function(arg1,arg2){
        if(arg1){
            if(arg2){
                if(arg1[1]!=STATES.NUMBER||arg2[1]!=STATES.NUMBER){
                    return ["(floor(rand()*"+arg2[0]+"-"+arg1[0]+")+"+arg1[0]+")",STATES.PARENS];
                }
                return [Math.floor(Math.random()*(Number(arg2[0])-Number(arg1[0])))+Number(arg1[0]),STATES.NUMBER];
            }else{
                if(arg1[1]!=STATES.NUMBER){
                    return ["(floor(rand()*"+arg1[0]+"))",STATES.PARENS];
                }
                return [Math.floor(Math.random()*Number(arg1[0])),STATES.NUMBER];
            }
        }else{
            return [Math.random(),STATES.NUMBER];
        }
    },"Calculates a random number. If one parameter is given returns a random number between 0 and the argument. If 2 parameters are given, returns a random number between argument 1 and argument 2"],
    ["round",function(args){
        if(!args)throw "round requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["round("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.round(Number(args[0])),STATES.NUMBER];
    },"Rounds a number"],
    ["ceil",function(args){
        if(!args)throw "ceil requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["ceil("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.ceil(Number(args[0])),STATES.NUMBER];
    },"Ceils a number, or rounds it up"],
    ["floor",function(args){
        if(!args)throw "floor requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["floor("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.floor(Number(args[0])),STATES.NUMBER];
    },"Floors a number, or rounds it down"],
    ["log",function(arg1,arg2){
        if(arg2){
            if(arg1[1]!=STATES.NUMBER||arg2[1]!=STATES.NUMBER){
                return ["(log("+arg2[0]+")/log("+arg1[0]+"))",STATES.PARENS];
            }
            return [Math.log(arg2[0])/Math.log(arg1[0]),STATES.NUMBER];
        }else if(arg1){
            if(arg1[1]!=STATES.NUMBER){
                return ["log("+arg1[0]+")",STATES.FUNCTION];
            }
            return [Math.log10(Number(arg1[0])),STATES.NUMBER];
        }else{
            throw "Log requires a parameter";
        }
    },"If 1 parameter is specified, returns the log base 10 of the argument. If 2 arguments are given, then returns log base argument 1 of the second argument"],
    ["ln",function(args){
        if(!args)throw "ln requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["ln("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.log(Number(args[0])),STATES.NUMBER];
    },"Returns the natural log, or log base e, of a number"],
    ["lg",function(args){
        if(!args)throw "lg requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["lg("+args[0]+")",STATES.FUNCTION];
        }
        return [Math.log(Number(args[0]))/Math.log(2),STATES.NUMBER];
    },"Returns the binary log, or log base 2, of a number"],
    ["deg",function(args){
        if(!args)throw "deg requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["("+args[0]+"*(180/PI()))",STATES.PARENS];
        }
        return [Number(args[0])*(180/Math.PI),STATES.NUMBER];
    },"Converts an angle to degrees."],
    ["rad",function(args){
        if(!args)throw "rad requires an argument";
        if(args[1]!=STATES.NUMBER){
            return ["("+args[0]+"*(PI()/180))",STATES.PARENS];
        }
        return [Number(args[0])*(Math.PI/180),STATES.NUMBER];
    },"Converts an angle to radians"],
    ["min",function(arg1,arg2){
        if(!arg1||!arg2){
            throw "min requires 2 arguments";
        }
        if(arg1[1]!=STATES.NUMBER||arg2[1]!=STATES.NUMBER){
            return ["min("+arg1[0]+","+arg2[0]+")",STATES.FUNCTION];
        }
        if(arg1[0]>arg2[0]){
            return [arg2[0],STATES.NUMBER];
        }else{
            return [arg1[0],STATES.NUMBER];
        }
    },"Calculates the smallest of 2 numbers"],
    ["max",function(arg1,arg2){
        if(!arg1||!arg2){
            throw "max requires 2 arguments";
        }
        if(arg1[1]!=STATES.NUMBER||arg2[1]!=STATES.NUMBER){
            return ["max("+arg1[0]+","+arg2[0]+")",STATES.FUNCTION];
        }
        if(arg1[0]<arg2[0]){
            return [arg2[0],STATES.NUMBER];
        }else{
            return [arg1[0],STATES.NUMBER];
        }
    },"Calculates the largest of 2 numbers"],
    ["EC",function(){
        return [Math.E,STATES.NUMBER];
    },"Returns Euler\'s constant, the golden ratio"],
    ["PI",function(){
        return [Math.PI,STATES.NUMBER];
    },"Returns pi."],
    ["TAU",function(){
        return [Math.PI*2,STATES.NUMBER];
    },"Returns tau, or pi*2"],
    ["INF",function(){
        return [Infinity,STATES.VARIABLE];
    },"Returns infinity"],
    
];

var STATES = {
    PROBING:0,
    NUMBER:1,
    OPERATOR:2,
    VARIABLE:3,
    FUNCTION:4,
    PARENS:5,
};

var proofs = [
];

function pushProof(message,tokens){
    var result = "";
    
    if(tokens){
        for(var i = 0;i<tokens.length;++i){
            if(tokens[i]&&tokens[i]!=undefined){
                result += (tokens[i][0]);
            }
        }
        
        result += ": "+message;
    }
    
    proofs.push(result);
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
} 

function isSpace(str){
    return str.length === 1 && str.match(/\s/g);
}

function tokenize(input){
    var out = [];
    
    var state = STATES.PROBING;
    
    var token = "";
    
    //to manage nested parentehsis, we increment this every ( and decrement it every )
    var parenthesisLevel = 0;
    
    var pushToken = function(){
        if(token&&token!=""){
            out.push([token,state]);
            token = "";
        }
    };
    
    var processCharacter = function(){
        switch(state){
            case STATES.PROBING:
            default:
                if(isNaN(value)){
                    for(var iter = 0;iter<OPERATORS.length;++iter){
                        if(OPERATORS[iter][0]==value){
                            state = STATES.OPERATOR;
                            return;
                        }
                    }
                    if(isLetter(value)){
                        state = STATES.VARIABLE;
                        break;
                    }else if(value==='('){
                        state = STATES.PARENS;
                        processCharacter();
                        break;
                    }
                }else{
                    state = STATES.NUMBER;
                }
                
            case STATES.NUMBER:
                if(isNaN(value)&&value!='.'){
                    pushToken();
                    state = STATES.PROBING;
                    processCharacter();
                }
                break;
            case STATES.VARIABLE:
                if(!isLetter(value)){
                    pushToken();
                    state = STATES.PROBING;
                    processCharacter();
                    break;
                }
                state = STATES.FUNCTION;
    
            case STATES.FUNCTION:
                if(parenthesisLevel===0&&value!='('){
                    break;
                }
            case STATES.PARENS:
                if(value==='('){
                    ++parenthesisLevel;
                }else if(value===')'){
                    --parenthesisLevel;
                }
                if(parenthesisLevel===0){
                    token+=value;//this line has to be there, or else it will skip the last parenthesis
                    pushToken();
                    state = STATES.PROBING;
                }
                break;
                
            case STATES.OPERATOR:
                pushToken();
                state = STATES.PROBING;
                processCharacter();
                break;
        }
    }
    
    for(var i = 0;i<input.length;++i){
        var value = input[i];
        
        processCharacter();
        
        if(!isSpace(value)){
            switch(state){
                case STATES.NUMBER:
                case STATES.OPERATOR:
                case STATES.VARIABLE:
                case STATES.FUNCTION:
                case STATES.PARENS:
                    token += value;
                    break;
                default:
            }
        }
    }
    
    if(parenthesisLevel>0){
        throw "Missing a closing parenthesis";
    }
    
    pushToken();
    
    //negatives
    if(out[0][1]==STATES.OPERATOR&&out[0][0]=="-"){
        out.splice(0,2,["-"+out[1][0],out[1][1]]);
    }
    
    return out;
}

function evaluateParens(token){
    var expression = openParens(token[0]);
    
    var result = evaluateTokens(tokenize(expression));

    if(result.length==1){
        if(result[0][0]==expression){
            return token;
        }
        return result[0];
    }else{
        var joinedExpression = "";
        
        for(var i = 0;i<result.length;++i){
            joinedExpression += result[i][0];
        }
        
        if(joinedExpression===expression){
            return token;
        }
        return joinedExpression;
    }
}

function openParens(input){
    if(input[0]=='('){
        return input.substr(1,input.length-2);
    }else{
        return input;
    }
}

function evaluateTokens(input){
    var tokens = input;
    
    for(var i = 0;i<tokens.length;++i){
        if(tokens[i][1]==STATES.PARENS){
            var result = evaluateParens(tokens[i]);
            tokens[i] = result;
            pushProof("Evaluated parenthesis",tokens);
        }else if(tokens[i][1]==STATES.FUNCTION){
            tokens[i] = evaluateFunction(tokens[i],tokens);
            pushProof("Definition of function",tokens);
        }
    }
    
    if(tokens[0][1]==STATES.OPERATOR){
        throw "Can't start expression with an operator";
    }
    
    for(var iter = 0;iter<OPERATORS.length;++iter){
        for(var i = 1;i<tokens.length;++i){
            if(tokens[i][1]==STATES.OPERATOR){
                var right = tokens[i+1];
                var left = tokens[i-1];
                
                if(!right||!left){
                    throw "Operator must have a left and right!";
                }
                
                if(OPERATORS[iter][0]===tokens[i][0]){
                    var result = OPERATORS[iter][1](left,right);
                    tokens.splice(i-1,3,result[0]);
                    pushProof(result[1],tokens);
                    i=0;
                }
            }
        }
    }
    
    return input;
}

function evaluateFunction(token){
    var name = "";
    var args = [];
    
    var tokenName = token[0];
    
    var negative = false;
    
    if(tokenName[0] === '-'){
        negative = true;
        tokenName = tokenName.substr(1);
    }
    
    for(var i = 0;i<tokenName.length;++i){
        if(tokenName[i]==='('){
            name = tokenName.substr(0,i);
            args = tokenName.substr(i+1).slice(0,-1).split(",");
            for(var iter = 0;iter<args.length;++iter){
                if(args[iter]&&args[iter]!=""){
                    args[iter] = evaluateTokens(tokenize(args[iter]))[0];//it returns an array of tokens, but it should only ever return 1 token, so we access the first
                }
            }
            break;
        }
    }
    
    for(var i = 0;i<FUNCTIONS.length;++i){
        if(name===FUNCTIONS[i][0]){
            var result = (FUNCTIONS[i][1].apply(this,args));
            if(negative){
                if(isNaN(result[0])){
                    result[0] = '-'+String(result[0]);
                }else{
                    result[0] = -result[0];
                }
            }
            return result;
        }
    }
    
    
    return token;
}

function evaluate(input){
    var tokens = tokenize(input);
    
    var result = evaluateTokens(tokens);
    
    while(true){
        var simplifiedResult = evaluateTokens(result);
        console.log(result);
        /*if(simplifiedResult != result){
            result = simplifiedResult;
        }else{
            return result;
        }*/
        return result;
    }
}

$(function(){
    $('#input').keypress(function(e){
      if(e.keyCode==13)
      $('#submit').click();
    });
    
    $("#functions").click(function(){
        var result = "Functions:<br>";
        for(var i = 0;i<FUNCTIONS.length;i++){
            result += "<b>"+FUNCTIONS[i][0] + "</b> - "+FUNCTIONS[i][2]+"<br>";
        }
        
        $("#result").html(result);
    });
    
    $("#help").click(function(){
        $("#result").html("Type in a math expression and this calculator will try to solve it as well as possible.<br>Variables are seldom supported.<br>You can use functions and parenthesis. You can also use mathmatical operators: +, -, *,/ for the basic operations. You can use ^ for exponents and % for modulo. Order of operations is supported.");
    });
    
    $("#formulas").click(function(){
        var result = "<h5>Formulas</h5>";
        result += "Here are some formulas to test this out with. <i>It doesn't support variable equations however.</i><br>";
        result += "<b>Newton's Law of Cooling:</b> f = s + (o - s) * EC() ^ (-k*t)<br>";
        result += "<b>Continuous Groth/Decay:</b> f = o * EC() ^ (k * t)<br>";
        result += "<b>General Growth/Decay:</b> f = s + (o - s) * EC() ^ (-k*t)<br>";
        result += "<b>Decibel Formula:</b> f = 10 * log( i / t )<br>";
        result += "<b>pH Formula:</b> p = -log( h )<br>";
        result += "<b>Carbon Decay:</b> t = ( ln( c / 100 ) / -0.693 ) * 5730<br>";
        
        $("#result").html(result);

    });
    
    $("#submit").click(function(){
        var input = $("#input").val();
        
        var result= "";
        
        proofs = [];
        
        if(input===""){
            result = "Nothing to solve";
        }else{
            try{
                pushProof("Given",input);
                
                var tokens = evaluate(input);
                
                pushProof("Solution",tokens);
                
                for(var i = 0;i<tokens.length;++i){
                    if(tokens[i]&&tokens[i]!=undefined){
                        result += (tokens[i][0]);
                    }
                }
                
                result += "<br><br>Proofs:<br>";
                
                for(var i = 0;i<proofs.length;++i){
                    result += proofs[i]+"<br>";
                }
                
            }catch(ex){
                result = ex;
            }
        }
        
        
        $("#result").html(result);
        
    }); 
});