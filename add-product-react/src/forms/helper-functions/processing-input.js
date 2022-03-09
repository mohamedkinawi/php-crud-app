const moreThanDecimal = (num,nofdecimalplaces) => {
    const num_str = num + "";
    const decimal_index = num_str.search(/\./);
    if(decimal_index!==-1){ //found decimal
        let decimal_part_str = num_str.substring(decimal_index+1);
        while(decimal_part_str.length>0 && decimal_part_str[decimal_part_str.length-1]==='0'){
            decimal_part_str = decimal_part_str.substring(0,decimal_part_str.length-1);
        }
        return decimal_part_str.length>nofdecimalplaces;
    }
    return false;
};

const capitalizeFirstLetter = (label) => {
    return label.charAt(0).toUpperCase() + label.slice(1);
};

export const processInputNotEmpty = (formElement,formJson,errorsJson,label,maxLength) => {
    const label_first_capital = capitalizeFirstLetter(label);
    let noerror = true;
    formJson[label] = formElement[label].value.trim();
    if(formJson[label]===''){
        noerror = false;
        errorsJson[label] = label_first_capital+' is required';
    }
    else if(formJson[label].length>maxLength){
        noerror = false;
        errorsJson[label] = label_first_capital+' cannot be longer than '+maxLength+' characters';
    }
    return noerror;
};

export const processInputNumber = (formElement,formJson,errorsJson,label,nofdecimals,max) => {
    const label_first_capital = capitalizeFirstLetter(label);
    let noerror = true;
    formJson[label] = formElement[label].value;
    if(formJson[label].trim()===''){
        noerror = false;
        errorsJson[label] = label_first_capital+' is required';
    }
    else if(isNaN(formJson[label])){
        noerror = false;
        errorsJson[label] = 'Only a number is allowed';
    }
    else if(formJson[label]<=0){
        noerror = false;
        errorsJson[label] = label_first_capital+' must be greater than 0';
    }
    else if(moreThanDecimal(formJson[label],nofdecimals)){
        //the commented condition below does not work to check for number of decimal places because multiplication of floats does not give exact numbers
        //therefore, the function moreThanDecimal is used, where string manipulation is used instead of number manipulation (which is used below)
        //does not work --> formJson[label]*Math.pow(10,nofdecimals) - Math.floor(formJson[label]*Math.pow(10,nofdecimals))>0 --> fails if formJson[label]===32.91||32.95||32.98
        noerror = false;
        errorsJson[label] = 'Maximum number of decimal places is '+nofdecimals;
    }
    else if(formJson[label]>=max){
        noerror = false;
        errorsJson[label] = label_first_capital+' must be less than '+max;
    }
    return noerror;
};

export const combineProcessingFns = (formElement,formJson,errorsJson,processingFns) => {
    let noerrors = true;
    for(let i=0;i<processingFns.length;i++){
        noerrors &= processingFns[i](formElement,formJson,errorsJson);
    }
    return noerrors;
};