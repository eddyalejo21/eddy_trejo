import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProducto } from 'src/app/Interfaces/iproducto';
import { Iproveedor } from 'src/app/Interfaces/iproveedor';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { IIva } from 'src/app/Interfaces/iva';
import { IvaService } from 'src/app/Services/iva.service';
import { ProductosService } from 'src/app/Services/productos.service';
import { ProveedorService } from 'src/app/Services/proveedores.service';
import { UnidadmedidaService } from 'src/app/Services/unidadmedida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevoproducto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './nuevoproducto.component.html',
  styleUrl: './nuevoproducto.component.scss'
})
export class NuevoproductoComponent implements OnInit {

  listaUnidadMedida: IUnidadMedida[] = [];
  listaProveedores: Iproveedor[] = [];
  listaIva: IIva[] = [];
  titulo = 'Nuevo Producto';
  frm_Producto: FormGroup;
  idProducto: number = 0;

  constructor(
    private unidadServicio: UnidadmedidaService,
    private ivaServicio: IvaService,
    private fb: FormBuilder,
    private proveedoreServicio: ProveedorService,
    private ruta: ActivatedRoute,
    private productoServicio : ProductosService,
    private navegacion: Router,
  ) { }

  ngOnInit(): void {
    this.idProducto = parseInt(this.ruta.snapshot.paramMap.get('id'));

    if(isNaN(this.idProducto)){
      this.idProducto = 0;
    }

    console.log(this.idProducto);

    this.unidadServicio.todos().subscribe((data) => (this.listaUnidadMedida = data));
    this.proveedoreServicio.todos().subscribe((data) => (this.listaProveedores = data));
    this.ivaServicio.todos().subscribe((data) => {
      this.listaIva = data
    });

    this.frm_Producto = new FormGroup({
      Codigo_Barras: new FormControl('', Validators.required),
      Nombre_Producto: new FormControl('', Validators.required),
      Graba_IVA: new FormControl('', Validators.required),
      Unidad_Medida_idUnidad_Medida: new FormControl('', Validators.required),
      IVA_idIVA: new FormControl('', Validators.required),
      Cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      Valor_Compra: new FormControl('', [Validators.required, Validators.min(0)]),
      Valor_Venta: new FormControl('', [Validators.required, Validators.min(0)]),
      Proveedores_idProveedores: new FormControl('', Validators.required)
    });

    if (this.idProducto > 0) {

      this.productoServicio.uno(this.idProducto).subscribe((data) => {
        this.frm_Producto = new FormGroup({
          Codigo_Barras: new FormControl(data.Codigo_Barras, Validators.required),
          Nombre_Producto: new FormControl(data.Nombre_Producto, Validators.required),
          Graba_IVA: new FormControl(data.Graba_IVA, Validators.required),
          Unidad_Medida_idUnidad_Medida: new FormControl(data.Unidad_Medida_idUnidad_Medida, Validators.required),
          IVA_idIVA: new FormControl(data.IVA_idIVA, Validators.required),
          Cantidad: new FormControl(data.Cantidad, [Validators.required, Validators.min(1)]),
          Valor_Compra: new FormControl(data.Valor_Compra, [Validators.required, Validators.min(0)]),
          Valor_Venta: new FormControl(data.Valor_Venta, [Validators.required, Validators.min(0)]),
          Proveedores_idProveedores: new FormControl(data.Proveedores_idProveedores, Validators.required)
        });

      });

      this.titulo = 'Editar Producto';
    }

  }

  grabar() {
    console.log('Al grabar el id es', this.idProducto);
    let producto: IProducto = {
      idProductos: this.idProducto,
      Codigo_Barras: this.frm_Producto.get('Codigo_Barras')?.value,
      Nombre_Producto: this.frm_Producto.get('Nombre_Producto')?.value,
      Graba_IVA: this.frm_Producto.get('Graba_IVA')?.value,
      Unidad_Medida_idUnidad_Medida: this.frm_Producto.get('Unidad_Medida_idUnidad_Medida')?.value,
      IVA_idIVA: this.frm_Producto.get('IVA_idIVA')?.value,
      Cantidad: this.frm_Producto.get('Cantidad')?.value,
      Valor_Compra: this.frm_Producto.get('Valor_Compra')?.value,
      Valor_Venta: this.frm_Producto.get('Valor_Venta')?.value,
      Proveedores_idProveedores: this.frm_Producto.get('Proveedores_idProveedores')?.value
    }

    Swal.fire({
      title: 'Producto',
      text: 'Desea guardar el producto ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f00',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Grabar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.idProducto > 0) {
          this.productoServicio.actualizar(producto).subscribe((data) => {
            Swal.fire({
              title: 'Producto',
              text: 'Actualización exitosa',
              icon: 'success'
            });
            this.navegacion.navigate(['/productos']);
          });
        } else {
          console.log('ingresa a insertar');
          this.productoServicio.insertar(producto).subscribe((data) => {
            Swal.fire({
              title: 'Producto',
              text: 'Guardado exitoso',
              icon: 'success'
            });
            this.navegacion.navigate(['/productos']);
          });
        }
      }
    });




  }
}
