import React from 'react';
import ErrorIcon from '../../icons/ErrorIcon';
import { processInputNumber } from '../helper-functions/processing-input';

const max = 300;
const maxDecimalPlaces = 3;

export const processBook = (formElement,formJson,errorsJson) => {
    return processInputNumber(formElement,formJson,errorsJson,'weight',maxDecimalPlaces,max);
};

const BookForm = (Errors) => {
    return   <div className="product_type">
                 <div className="form-field">
                     <label htmlFor="weight">Weight (KG)</label>
                     <input id="weight" type="number" name="weight"/>
                     <div className="form-field-warning" style={{visibility:Errors['weight']?"visible":"hidden"}}>
                         <ErrorIcon/>
                         <span>{Errors['weight']?Errors['weight']:null}</span>
                     </div>
                 </div>
                 <em>* Please provide the weight of the book in Kilograms (KG).</em>
                 <em>* Must be greater than 0 and less than {max} KG with a maximum of {maxDecimalPlaces} decimal places (to the nearest gram).</em>
             </div>;
};

export default BookForm;