import React , { useState } from 'react';
import MainForm from './forms/MainForm';
import ProductForm from './forms/ProductForm';
import ErrorIcon from './icons/ErrorIcon';

const App = () => {
  const [ ErrorMsg , setErrorMsg ] = useState('');
  const [ MainFormJSX , validateMainForm ] = MainForm();
  const [ ProductFormJSX , validateProductForm ] = ProductForm();
  const SubmitHandler = (e) => {
      e.preventDefault();
      let form_json = {};
      let noerrors = true;
      noerrors &= validateMainForm(e.target,form_json);
      noerrors &= validateProductForm(e.target,form_json);
      setErrorMsg('');
      if(noerrors){
          fetch('/add-product/',{
              method:'POST',
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              body:'formData='+JSON.stringify(form_json)
          }).then(response=>{
              if(!response.ok){
                  throw new Error('Unexpected error from server.');
              }
              return response.json();
          }).then(res=>{
              if(res.error){
                  setErrorMsg(res.error);
              }
              else{
                  window.location.pathname = "/";
              }
          }).catch(error=>{
              setErrorMsg(error.message);
          });
      }
  };
  return (
    <form id="product_form" noValidate={true} onSubmit={SubmitHandler}>
        <header id="header">
            <h1>Add Product</h1>
            <section id="actions">
                <input type="submit" value="Save" />
                <a href="/">Cancel</a>
            </section>
        </header>
        <main>
            {ErrorMsg ?
                <div id="server_error" className="form-field-warning">
                    <ErrorIcon/>
                    <span>{ErrorMsg}</span>
                </div>
            : null}
            {MainFormJSX}
            {ProductFormJSX}
        </main>
        <footer id="footer">PHP crud app</footer>
    </form>
  );
};

export default App;