<?php
    if($_SERVER['REQUEST_METHOD']==='POST'){
        require_once '../../private/definitions.php';
        $db = new Database(DB_SERVER,DB_USER,DB_PASSWORD,DB_NAME);
        $form_assoc_array = json_decode($_POST["formData"], true);
        $product_type = $form_assoc_array['productType'];
        $product_object = new $product_type($form_assoc_array);
        $result = array(
            "error" => htmlspecialchars($product_object->save($db))
        );
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($result);
    }
    else if($_SERVER['REQUEST_METHOD']==='GET')
    {
        /* HTML FROM REACT BUILD
           CSS LINKED IN HTML IS FROM REACT BUILD
           JS LINKED IN HTML IS FROM REACT BUILD  */
    ?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta name="theme-color" content="#000000"/>
        <meta name="description" content="PHP crud app"/>
        <title>Add Product</title>
        <script defer="defer" src="/add-product/main.cf17ffa8.js"></script>
        <link href="/stylesheets/main.7bf711f0.css" rel="stylesheet">
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
    </body>
</html>
    <?php
    }
    ?>