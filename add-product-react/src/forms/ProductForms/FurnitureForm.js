import React from 'react';
import ErrorIcon from '../../icons/ErrorIcon';
import { processInputNumber , combineProcessingFns } from '../helper-functions/processing-input';

const max = 1000;
const maxDecimalPlaces = 1;

export const processFurniture = (formElement,formJson,errorsJson) => {
    const processingFns = [
        (formElement,formJson,errorsJson)=>{
            return processInputNumber(formElement,formJson,errorsJson,'height',maxDecimalPlaces,max);
        },
        (formElement,formJson,errorsJson)=>{
            return processInputNumber(formElement,formJson,errorsJson,'width',maxDecimalPlaces,max);
        },
        (formElement,formJson,errorsJson)=>{
            return processInputNumber(formElement,formJson,errorsJson,'length',maxDecimalPlaces,max);
        }
    ];
    const noerrors = combineProcessingFns(formElement,formJson,errorsJson,processingFns);
    return noerrors;
};

const FurnitureForm = (Errors) => {
    return   <div className="product_type">
                 <div className="form-field">
                     <label htmlFor="height">Height (cm)</label>
                     <input id="height" type="number" name="height"/>
                     <div className="form-field-warning" style={{visibility:Errors['height']?"visible":"hidden"}}>
                         <ErrorIcon/>
                         <span>{Errors['height']?Errors['height']:null}</span>
                     </div>
                 </div>
                 <div className="form-field">
                     <label htmlFor="width">Width (cm)</label>
                     <input id="width" type="number" name="width"/>
                     <div className="form-field-warning" style={{visibility:Errors['width']?"visible":"hidden"}}>
                         <ErrorIcon/>
                         <span>{Errors['width']?Errors['width']:null}</span>
                     </div>
                 </div>
                 <div className="form-field">
                     <label htmlFor="length">Length (cm)</label>
                     <input id="length" type="number" name="length"/>
                     <div className="form-field-warning" style={{visibility:Errors['length']?"visible":"hidden"}}>
                         <ErrorIcon/>
                         <span>{Errors['length']?Errors['length']:null}</span>
                     </div>
                 </div>
                 <em>* Please provide the height , width and length of the furniture in centimeters (cm).</em>
                 <em>* Must be greater than 0 and less than {max} cm ({max/100} metres) with a maximum of {maxDecimalPlaces} decimal place{maxDecimalPlaces>1?'s':''} (to the nearest millimetre).</em>
             </div>;
};

export default FurnitureForm;