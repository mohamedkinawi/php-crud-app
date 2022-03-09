import React , { useState , useEffect } from 'react';
import useForm from './hooks/use-form';
import ErrorIcon from '../icons/ErrorIcon';
import DvdForm , { processDvd } from './ProductForms/DvdForm';
import BookForm , { processBook } from './ProductForms/BookForm';
import FurnitureForm , { processFurniture } from './ProductForms/FurnitureForm';

/*
	TO ADD A NEW PRODUCT TYPE: 
		- IMPORT THE COMPONENT AND ITS PROCESSING FUNCTION (USED FOR VALIDATING AND SANITIZING)
		- INSERT BOTH IN THE BELOW DICTIONARY
*/

const ProductTypeDict = {
    'DVD': {
        component: DvdForm,
        processFn: processDvd
    },
    'Book':{
        component: BookForm,
        processFn: processBook
    },
    'Furniture':{
        component: FurnitureForm,
        processFn: processFurniture
    }
};

const processProductSelection = (formElement,formJson,errorsJson) => {
    let noerror = true;
    formJson['productType'] = formElement['productType'].value;
    if(Object.keys(ProductTypeDict).filter(k=>k===formJson['productType']).length===0){
        noerror = false;
        errorsJson['productType'] = 'Select one of the following : '+Object.keys(ProductTypeDict).join(' , ');
    }
    return noerror;
};

const ProductForm = () => {
    const [ ProductType , setProductType ] = useState(Object.keys(ProductTypeDict)[0]);
    const processThisProduct = ProductTypeDict[ProductType] ? ProductTypeDict[ProductType].processFn
        : (formElement,formJson,errorsJson)=>{return true;};
    const [ Errors , process , setErrors ] = useForm([processProductSelection,processThisProduct]);
    useEffect(()=>{
        setErrors({});
    },[ProductType,setErrors]);
    return [ <section id="product_type_section">
               <div className="form-field">
                   <label htmlFor="productType">* Product Type</label>
                   <select name="productType" id="productType"
                   value={ProductType} onChange={(e)=>{setProductType(e.target.value);}}>
                       {Object.keys(ProductTypeDict).map((k,i)=><option key={i} id={k} value={k}>{k}</option>)}
                   </select>
                   <div className="form-field-warning" style={{visibility:Errors['productType']?"visible":"hidden"}}>
                       <ErrorIcon/>
                       <span>{Errors['productType']?Errors['productType']:null}</span>
                   </div>
               </div>
               {ProductTypeDict[ProductType] ? ProductTypeDict[ProductType].component(Errors) : null}
           </section> , process ];
};

export default ProductForm;