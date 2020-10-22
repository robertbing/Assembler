var code = [];
var instructionSet = ["LOAD", "STORE", "ADD", "SUB", "MUL", "QUOT", "MODULO", "JUMP", "JUMPZERO", "STOP"];

function add_instr(instruction){
    var success = false;
    if(instruction.indexOf(" ") == -1){
        alert("Invalid input");        
        success = false;
        exit;
    }
    var operation = instruction.substring(0, instruction.indexOf(" "));
    var register = instruction.substring(instruction.indexOf(" ") + 1);
    if(instructionSet.includes(operation.toUpperCase())){
        code.push([true, operation.toUpperCase(), register.toUpperCase()]);
        success = true;
    } else {
        if(validate_register_name(operation.toUpperCase()) == true){
            code.unshift([false, operation.toUpperCase(), register]);
            success = true;
        } else {
            alert("Register name already allocated");
            success = false;
        }
    }
    create_instr_table();
    return success;
}

function remove_instr(index){
    code.splice(index, 1);
    create_instr_table();
}

function instr_up(index){
    if(index - 1 >= 0){
    var backup = code[index];
    code[index] = code[index - 1];
    code[index - 1] = backup;
    } else {
        alert("Invalid index");
    }
    create_instr_table();
}

function instr_down(index){
    if(index + 1 <= code.length - 1){
        var backup = code[index];
        code[index] = code[index + 1];
        code[index + 1] = backup;
    } else {
        alert("Invalid index");
    }
    create_instr_table();
}

function edit_instr(index){
    var edit_string = code[index][1].toUpperCase() + " " + code[index][2].toUpperCase();
    var newInstruction = prompt("Edit instruction ([operation] [register] OR [register] [value]): ", edit_string);
    if(add_instr(newInstruction)){
        code[index] = code[code.length - 1];
        code.pop();  
    }
    create_instr_table();
}

function create_instr_table(){
    var table = "<table class='tab'><tr><th>Index</th><th>Operation</th><th>Register</th></tr>";
    var lastIndex = -1;
    for(var i = 0; i < code.length; i++){
        var index;
        if(instructionSet.includes(code[i][1])){
            lastIndex++;
            index = lastIndex;
        } else {
            index = "<i>def</i>";
        }        
        var options = "<td><input type='button' onclick='edit_instr(" + i + ")' value='&#9998;'></td><td><input type='button' onclick='remove_instr(" + i + ")' value='X'></td><td></input><input type='button' onclick='instr_up(" + i + ")' value='&#8593;'></td><td></input><input type='button' onclick='instr_down(" + i + ")' value='&#8595;'></input></td>"
        table += "<tr><td>" + index + "</td><td>" + code[i][1] + "</td><td>" + code[i][2]  + "</td>" + options + "</tr>";
    }
    table += "</table>";
    document.getElementById("instr_table").innerHTML = table;
}

function validate_register_name(registerName){
    var valid = true;
    for(var i = 0; i < code.length; i++){
        if(code[i][0] == false && code[i][1] == registerName){
            valid = false;
            break;
        };
     };
     return valid;
}

function run(){
    var AC;
    for(var i = 0; i < code.length; i++){
        console.log(code[i]);
        if(code[i][0]){
            var registerValue;
            if(!isNumeric(code[i][2])){
                registerValue = get_reg(code[i][2]);
            } else {
                registerValue = parseInt(code[i][2]);
            }
            switch(code[i][1]){
                case "LOAD" : AC = registerValue; break;    
                case "STORE" : store(code[i][1], code[i][2]); break;  
                case "ADD" : AC += registerValue; break;   
                case "SUB" : AC -= registerValue; break;      
                case "MUL" : AC *= registerValue; break;      
                case "QUOT" : AC /= registerValue; break;      
                case "MODULO" : AC %= registerValue; break;    
                /*
                case "JUMP" : AC *= registerValue; break;     
                case "JUMPZERO" : AC *= registerValue; break;   
                case "STOP" : AC *= registerValue; break;     
                */         
            }
        }
        console.log(AC);
    }
}

function get_reg(registerName){
    var value;
    for(var i = 0; i < code.length; i++){
        if(code[i][0] == false && code[i][1] == registerName){
           value = code[i][2];
           console.log(code[i][1] + "="  + code[i][2]);
        }
    } 
    return parseInt(value);
}

function store(registerName, value){
    for(var i = 0; i < code.length; i++){
        if(code[i][0] == false && code[i][1] == registerName){
           code[i][2] = value;
        }
    } 
}

function isNumeric(str) {
    // source : https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}