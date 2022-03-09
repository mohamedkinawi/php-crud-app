<?php

    // phpMyAdmin credentials on https://databases.000webhost.com/
    define("DB_USER","");
    define("DB_NAME","id18450628_juniortest");
    define("DB_SERVER","localhost");
    define("DB_PASSWORD","");


/*
A Database object represents a connection to a database.
A Database object is passed to the ProductsTable constructor.
A Database object is passed to a Product save() function.
*/
class Database
{
    private $connection;
    public function __construct($db_server,$db_user,$db_password,$db_name)
    {
        $this->connection = new mysqli($db_server,$db_user,$db_password,$db_name);
        if($this->connection->connect_errno)
        {
            exit("Failed to connect to MySQL!\nError : " . $this->connection->connect_error
            . "(" . $this->connection->connect_errno . ")");
        }
    }
    public function __destruct()
    {
        $this->connection->close();
    }
    public function getConnection()
    {
        return $this->connection;
    }
}

/*
A ProductsTable object represents the 'products' table in the database.
A ProductsTable object has 2 methods; readAll and deleteAll.
*/
class ProductsTable
{
    private $db;
    private $read_all_result;
    public function __construct($db)
    {
        $this->db = $db->getConnection();
        $this->read_all_result = null;
    }
    public function readAll()
    {
        if(!isset($this->read_all_result))
        {
            $sql = "SELECT * FROM products"
            . " LEFT JOIN dvds USING (sku)"
            . " LEFT JOIN books USING (sku)"
            . " LEFT JOIN furniture USING (sku)"
            . " ORDER BY sku ASC";
            $this->read_all_result = $this->db->query($sql);
        }
        if($assoc_array = $this->read_all_result->fetch_assoc())
        {
            $product = new $assoc_array["productType"]($assoc_array);
            return $product;
        }
        else
        {
            $this->read_all_result->free();
            $this->read_all_result = null;
            return false;
        }
    }
    public function deleteAll($delete_arr_skus)
    {
        $sql = "DELETE FROM products WHERE sku IN (";
        $sql .= implode(",",
            array_map(
                function($e){
                     return "'" .$this->db->escape_string($e) . "'";
                },
                $delete_arr_skus
            )
        );
    	$sql .= ");";
        $this->db->query($sql);
    }
}

/*
The Product parent class handles the common properties that all products have (sku,name,price,productType).
The Product parent class initializes these properties, formats them for displaying and saves them into the 'products' table in the database.
Each of the child classes handle the specific properties of that product type i.e. initializes them, formats them for displaying and saves them into that product type table.
*/
abstract class Product
{
    protected $sku;
    private $name;
    private $price;
    private $productType;
    protected function __construct($assoc_array)
    {
        // ADD COMMON PROPERTIES HERE
        $this->sku = $assoc_array["sku"];
        $this->name = $assoc_array["name"];
        $this->price = (float) $assoc_array["price"];
        $this->productType = $assoc_array["productType"];
    }
    abstract protected function safe_create_child($db);
    protected function safe_create($db)
    {
        $error = '';
        $db->getConnection()->begin_transaction();
        $stmt = $db->getConnection()->prepare("INSERT INTO products(sku,name,price,productType) VALUES (?,?,?,?)");
        $stmt->bind_param("ssds",$this->sku,$this->name,$this->price,$this->productType);
        if(!$stmt->execute())
        {
            $db->getConnection()->rollback();
            $error = $stmt->error==="Duplicate entry '{$this->sku}' for key 'PRIMARY'" ? "SKU already exists" : $stmt->error;
        }
        $stmt->close();
        if($error)
        {
            return $error;
        }
        $error = $this->safe_create_child($db);
        if($error)
        {
            $db->getConnection()->rollback();
            return $error;
        }
        $db->getConnection()->commit();
        return '';
    }
    protected function display()
    {
        $display = array(
            "sku" => $this->sku,
            "name" => $this->name,
            "price" => $this->price . " \$"
        );
        return $display;
    }
    public function getSku()
    {
        return $this->sku;
    }
    
}

class Dvd extends Product
{
    private $size;
    public function __construct($assoc_array)
    {
        parent::__construct($assoc_array);
        $this->size = (float) $assoc_array["size"];
    }
    public function save($db)
    {
        return parent::safe_create($db);
    }
    protected function safe_create_child($db)
    {
        $error = '';
        $stmt = $db->getConnection()->prepare("INSERT INTO dvds(sku,size) VALUES (?,?)");
        $stmt->bind_param('sd',$this->sku, $this->size);
        if(!$stmt->execute())
        {
            $error = $stmt->error==="Duplicate entry '{$this->sku}' for key 'PRIMARY'" ? "SKU already exists" : $stmt->error;
        }
        $stmt->close();
        return $error;
    }
    public function display()
    {
        $prop = "Size : ";
        $prop .= $this->size . " MB";
        $display = parent::display();
        $display["specific_prop"] = $prop;
        return $display;
    }
}

class Book extends Product
{
    private $weight;
    public function __construct($assoc_array)
    {
        parent::__construct($assoc_array);
        $this->weight = (float) $assoc_array["weight"];
    }
    public function save($db)
    {
        return parent::safe_create($db);
    }
    protected function safe_create_child($db)
    {
        $error = '';
        $stmt = $db->getConnection()->prepare("INSERT INTO books(sku,weight) VALUES (?,?)");
        $stmt->bind_param('sd',$this->sku, $this->weight);
        if(!$stmt->execute())
        {
            $error = $stmt->error==="Duplicate entry '{$this->sku}' for key 'PRIMARY'" ? "SKU already exists" : $stmt->error;
        }
        $stmt->close();
        return $error;
    }
    public function display()
    {
        $prop = "Weight : ";
        $prop .= $this->weight . " KG";
        $display = parent::display();
        $display["specific_prop"] = $prop;
        return $display;
    }
}

class Furniture extends Product
{
    private $height;
    private $width;
    private $length;
    public function __construct($assoc_array)
    {
        parent::__construct($assoc_array);
        $this->height = (float) $assoc_array["height"];
        $this->width = (float) $assoc_array["width"];
        $this->length = (float) $assoc_array["length"];
    }
    public function save($db)
    {
        return parent::safe_create($db);
    }
    protected function safe_create_child($db)
    {
        $error = '';
        $stmt = $db->getConnection()->prepare("INSERT INTO furniture(sku,height,width,length) VALUES (?,?,?,?)");
        $stmt->bind_param('sddd',$this->sku,$this->height,$this->width,$this->length);
        if(!$stmt->execute())
        {
            $error = $stmt->error==="Duplicate entry '{$this->sku}' for key 'PRIMARY'" ? "SKU already exists" : $stmt->error;
        }
        $stmt->close();
        return $error;
    }
    public function display()
    {
        $prop = "Dimensions : ";
        $prop .= $this->height . "x";
        $prop .= $this->width . "x";
        $prop .= $this->length;
        $display = parent::display();
        $display["specific_prop"] = $prop;
        return $display;
    }
}
