import React from 'react';
import useForm from './hooks/use-form';
import ErrorIcon from '../icons/ErrorIcon';
import { processInputNotEmpty , processInputNumber } from './helper-functions/processing-input';

const processSku = (formElement,formJson,errorsJson) => {
    return processInputNotEmpty(formElement,formJson,errorsJson,'sku',20);
};

const processName = (formElement,formJson,errorsJson) => {
    return processInputNotEmpty(formElement,formJson,errorsJson,'name',50);
};

const processPrice = (formElement,formJson,errorsJson) => {
    return processInputNumber(formElement,formJson,errorsJson,'price',2,10000);
};

const MainForm = () => {
    const [ Errors , process ] = useForm([processPrice,processSku,processName]);
    return [ <section>
               <div className="form-field">
                   <label htmlFor="sku">SKU</label>
                   <input name="sku" type="text" id="sku" />
                   <div className="form-field-warning" style={{visibility:Errors['sku']?"visible":"hidden"}}>
                       <ErrorIcon/>
                       <span>{Errors['sku']?Errors['sku']:null}</span>
                   </div>
               </div>
               <div className="form-field">
                   <label htmlFor="name">Name</label>
                   <input name="name" type="text" id="name" />
                   <div className="form-field-warning" style={{visibility:Errors['name']?"visible":"hidden"}}>
                       <ErrorIcon/>
                       <span>{Errors['name']?Errors['name']:null}</span>
                   </div>
               </div>
               <div className="form-field">
                   <label htmlFor="price">Price ($)</label>
                   <input name="price" type="number" id="price" />
                   <div className="form-field-warning" style={{visibility:Errors['price']?"visible":"hidden"}}>
                       <ErrorIcon/>
                       <span>{Errors['price']?Errors['price']:null}</span>
                   </div>
               </div>
    </section> , process ];
};

export default MainForm;