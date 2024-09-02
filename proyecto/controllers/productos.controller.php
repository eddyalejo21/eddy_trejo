<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}
//TODO: controlador de productos

require_once('../models/productos.model.php');
error_reporting(0);
$productos = new Productos;

switch ($_GET["op"]) {
        //TODO: operaciones de productoes

    case 'todos': //TODO: Procedimeinto para cargar todos las datos de los productoes
        $datos = array(); // Defino un arreglo para almacenar los valores que vienen de la clase productos.model.php
        $datos = $productos->todos(); // Llamo al metodo todos de la clase productos.model.php
        while ($row = mysqli_fetch_assoc($datos)) //Ciclo de repeticion para asociar los valor almancenados en la variable $datos
        {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;
        //TODO: procedimiento para obtener un registro de la base de datos
    case 'uno':
        $idProductos = $_POST["idProductos"];
        $datos = array();
        $datos = $productos->uno($idProductos);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;
        //TODO: procedimiento para insertar un producto en la base de datos
    case 'insertar':
        $Codigo_Barras = $_POST["Codigo_Barras"];
        $Nombre_Producto = $_POST["Nombre_Producto"];
        $Graba_IVA = $_POST["Telefono"];
        $Contacto_Empresa = $_POST["Graba_IVA"];

        $datos = array();
        $datos = $productos->insertar($Codigo_Barras, $Nombre_Producto, $Graba_IVA);
        echo json_encode($datos);
        break;
        //TODO: procedimiento para actualizar un producto en la base de datos
    case 'actualizar':
        $idProductos = $_POST["idProductos"];
        $Codigo_Barras = $_POST["Codigo_Barras"];
        $Nombre_Producto = $_POST["Nombre_Producto"];
        $Graba_IVA = $_POST["Telefono"];
        $Contacto_Empresa = $_POST["Graba_IVA"];

        $datos = array();
        $datos = $productos->actualizar($idProductos, $Codigo_Barras, $Nombre_Producto, $Graba_IVA);
        echo json_encode($datos);
        break;
        //TODO: procedimiento para eliminar un producto en la base de datos
    case 'eliminar':
        $idProductos = $_POST["idProductos"];
        $datos = array();
        $datos = $productos->eliminar($idProductos);
        echo json_encode($datos);
        break;
}
