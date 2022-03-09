import React from 'react';
import ErrorIcon from '../../icons/ErrorIcon';
import { processInputNumber } from '../helper-functions/processing-input';

const max = 10000000;
const maxDecimalPlaces = 3;

export const processDvd = (formElement,formJson,errorsJson) => {
    return processInputNumber(formElement,formJson,errorsJson,'size',maxDecimalPlaces,max);
};

const DvdForm = (Errors) => {
    return   <div className="product_type">
                 <div className="form-field">
                     <label htmlFor="size">Size (MB)</label>
                     <input id="size" type="number" name="size"/>
                     <div className="form-field-warning" style={{visibility:Errors['size']?"visible":"hidden"}}>
                         <ErrorIcon/>
                         <span>{Errors['size']?Errors['size']:null}</span>
                     </div>
                 </div>
                 <em>* Please provide disk space in Megabytes (MB).</em>
                 <em>* Must be greater than 0 and less than {max} MB (~{max/1000000} Terabytes) with a maximum of {maxDecimalPlaces} decimal places (to the nearest Kilobyte).</em>
             </div>;
};

export default DvdForm;