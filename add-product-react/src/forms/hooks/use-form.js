import { useState , useCallback } from 'react';
import { combineProcessingFns } from '../helper-functions/processing-input';

const useForm = (processingFns) => {
    const [ Errors , setErrors ] = useState({});
    const process = useCallback((formElement,formJson)=>{
        let errorsJson = {};
        const noerrors = combineProcessingFns(formElement,formJson,errorsJson,processingFns);
        setErrors(errorsJson);
        return noerrors;
    },[processingFns]);
    return [ Errors , process , setErrors ];
};

export default useForm;