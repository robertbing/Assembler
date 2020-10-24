var code = [];
var instructionSet = ["LOAD", "STORE", "ADD", "SUB", "MUL", "QUOT", "MODULO", "JUMP", "JUMPZERO", "STOP"];
var nextIndex = 0;

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
        if(isNumeric(register)){
             //add numeric value as seperate register
            
            var newRegisterName = "R0";
            var newRegisterIndex = 0;
            while(validate_register_name(newRegisterName) == false){
                newRegisterIndex++;
                newRegisterName = "R" + String(newRegisterIndex);
            }
            add_instr(String(newRegisterName) + " " + String(register));
            code.push([nextIndex, true, operation.toUpperCase(), String(newRegisterName)]);    
            nextIndex++; 
        } else {
            code.push([nextIndex, true, operation.toUpperCase(), register.toUpperCase()]);    
            nextIndex++;
        }
        success = true;
    } else {
        if(validate_register_name(operation.toUpperCase()) == true){
            code.unshift(["def", false, operation.toUpperCase(), register]);
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
    var edit_string = code[index][2].toUpperCase() + " " + code[index][2].toUpperCase();
    var newInstruction = prompt("Edit instruction ([operation] [register] OR [register] [value]): ", edit_string);
    if(add_instr(newInstruction)){
        code[index] = code[code.length - 1];
        code.pop();  
    }
    create_instr_table();
}

function create_instr_table(){
    fix_indices();
    var table = "<table class='tab'><tr><th>Index</th><th>Operation</th><th>Register</th></tr>";
    for(var i = 0; i < code.length; i++){
        var options = "<td><input type='button' onclick='edit_instr(" + i + ")' value='&#9998;'></td><td><input type='button' onclick='remove_instr(" + i + ")' value='X'></td><td></input><input type='button' onclick='instr_up(" + i + ")' value='&#8593;'></td><td></input><input type='button' onclick='instr_down(" + i + ")' value='&#8595;'></input></td>"
        table += "<tr><td>" + String(code[i][0]) + "</td><td>" + code[i][2] + "</td><td>" + code[i][3]  + "</td>" + options + "</tr>";
    }
    table += "</table>";
    document.getElementById("instr_table").innerHTML = table;    
    //console.clear();
    console.log(code);
}

function validate_register_name(registerName){
    var valid = true;
    for(var i = 0; i < code.length; i++){
        if(code[i][1] == false && code[i][2] == registerName){
            valid = false;
            break;
        };
     };
     return valid;
}

function run(){
    var AC;
    for(var i = 0; i < code.length; i++){
        //console.log(code[i]);
        if(code[i][1]){
            var registerValue;
            if(!isNumeric(code[i][3])){
                if(get_reg(code[i][3]) != null){
                    registerValue = get_reg(code[i][3]);
                } else {
                    alert("Error in Index " + String(i));
                }
            } else {
                registerValue = parseInt(code[i][3]);
            }
            switch(code[i][2]){
                case "LOAD" : AC = registerValue; break;    
                case "STORE" : store(code[i][2], code[i][3]); break;  
                case "ADD" : AC += registerValue; break;   
                case "SUB" : AC -= registerValue; break;      
                case "MUL" : AC *= registerValue; break;      
                case "QUOT" : AC /= registerValue; break;      
                case "MODULO" : AC %= registerValue; break;    
                
                case "JUMP" : AC *= registerValue; break;     
                /*
                case "JUMPZERO" : AC *= registerValue; break;   
                case "STOP" : AC *= registerValue; break;     
                */         
            }
        }
        console.log(AC);
        document.getElementById("AC_res").innerHTML = "Accumulator value : " + String(AC);
    }
}

function execute(startIndex, stopIndex){
    var index = startIndex;
    if(stopIndex == -1){
        stopIndex = code.length - 1;
    }
    var AC;
    console.log(startIndex, stopIndex);

    while(index <= stopIndex){
        //console.log(code[index]);
        var registerValue = get_reg(code[index][3]); 
        switch(code[index][2]){
            case "LOAD" : AC = registerValue; break;    
            case "STORE" : store(code[i][2], code[i][3]); break;  
            case "ADD" : AC += registerValue; break;   
            case "SUB" : AC -= registerValue; break;      
            case "MUL" : AC *= registerValue; break;      
            case "QUOT" : AC /= registerValue; break;      
            case "MODULO" : AC %= registerValue; break;    
                
            //case "JUMP" : index = ; break;     
                /*
                case "JUMPZERO" : AC *= registerValue; break;   
                case "STOP" : AC *= registerValue; break;     
                */         
        }
        index++;
    }        
    console.log(AC);
    document.getElementById("AC_res").innerHTML = "Accumulator value : " + String(AC);
}

function get_reg(registerName){
    var value = null;
    for(var i = 0; i < code.length; i++){
        if(code[i][1] == false && code[i][2] == registerName){
           value = code[i][3];
           console.log(code[i][2] + "="  + code[i][3]);
        }
    } 
    return parseInt(value);
}

function store(registerName, value){
    for(var i = 0; i < code.length; i++){
        if(code[i][1] == false && code[i][2] == registerName){
           code[i][3] = value;
        }
    } 
}

function isNumeric(str) {
    // source : https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

function test(){
    add_instr("test 2");
    add_instr("test2 4");
    add_instr("load test");
    add_instr("add test2");
    add_instr("mul test2");
    //run();
    execute(0, -1);
}

function get_next_index(){
    try{
        //if(code[code.length - 1][1])
        var index = code[code.length - 1][2] + 1; 
    } catch (e){
        console.log(e);
        index = 0;
    }
    return index;   
}

function fix_indices(){
    var lastIndex = 0;
    for(var i = 0; i < code.length; i++){
        if(code[i][0] != "def"){
            code[i][0] = lastIndex++;
            console.log("Index #" + i + " (" + code[i][0] + ") was changed to " + lastIndex);
        };
    }
}