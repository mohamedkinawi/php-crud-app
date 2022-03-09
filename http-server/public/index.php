<?php
    require_once '../private/definitions.php';
    $db = new Database(DB_SERVER,DB_USER,DB_PASSWORD,DB_NAME);
    $products_table = new ProductsTable($db);
    if($_SERVER['REQUEST_METHOD']==='POST' && isset($_POST["delete"]))
    {
        $products_table->deleteAll($_POST["delete"]);
        header("Location: /index.php");
    }
    else if($_SERVER['REQUEST_METHOD']==='POST' || $_SERVER['REQUEST_METHOD']==='GET')
    {
    ?>
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="description"
                    content="PHP crud app"
                />
                <title>Product list</title>
                <link rel="stylesheet" href="/stylesheets/index.css">
            </head>
            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <form id="all_products_form" method="post" action="/index.php">
                    <header id="header">
                        <h1>Product List</h1>
                        <div id="actions">
                            <?php
                                if($_SERVER['REQUEST_METHOD']==='POST')
                                {
                                    echo "<span id='mass-delete-error'>There are no ticked products.</span>";
                                }
                            ?>
                            <a href="/add-product">ADD</a>
                            <input type="submit" action="/" method="post" id="delete-product-btn" value="MASS DELETE"/>
                        </div>
                    </header>
                    <main id="all_products">
                        <?php
                        $products_exist = false;
                        while($product_object = $products_table->readAll())
                        {
                            $products_exist = true;
                            $product_details = $product_object->display();
                        ?>
                            <div class="product">
                                <input type="checkbox" class="delete-checkbox" value="<?php echo htmlspecialchars($product_object->getSku()) ?>" name="delete[]" />
                                <div class="product_details">
                                    <?php
                                        foreach($product_details as $key => $value)
                                        {
                                            echo "<span>" . htmlspecialchars($value) . "</span>";
                                        }
                                    ?>
                                </div>
                            </div>   
                        <?php
                        }
                        if(!$products_exist)
                        {
                            echo "<span id='no-products-error'>There are no products to show.</span>";
                        }
                        ?>
                    </main>
                    <footer id="footer">PHP crud app</footer>
                </form>
            </body>
        </html>
    <?php
    }
    ?>