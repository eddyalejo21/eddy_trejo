import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { SharedModule } from '../theme/shared/shared.module';
import { RouterLink } from '@angular/router';
import { IProducto } from '../Interfaces/iproducto';
import { ProductosService } from '../Services/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [SharedModule, RouterLink],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  listaproductos: IProducto[] = [];

  constructor(private productoServicio: ProductosService) {}

  ngOnInit(): void {
    this.cargaproductos();
  }

  cargaproductos() {
    this.productoServicio.todos().subscribe((data) => {
      this.listaproductos = data;
      console.log(data);
    });
  }
  trackByFn() {}

  eliminar(idProductos) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServicio.eliminar(idProductos).subscribe((data) => {
          this.cargaproductos();
        });
        Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
      } else {
        Swal.fire('Error', 'Ocurrio un erro', 'error');
      }
    });
  }
}
