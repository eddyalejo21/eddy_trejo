import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { IFactura } from 'src/app/Interfaces/factura';
import { ICliente } from 'src/app/Interfaces/icliente';
import { ClientesService } from 'src/app/Services/clientes.service';
import { FacturaService } from 'src/app/Services/factura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevafactura',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './nuevafactura.component.html',
  styleUrl: './nuevafactura.component.scss'
})
export class NuevafacturaComponent implements OnInit {

  titulo = 'Nueva Factura';
  listaClientes: ICliente[] = [];
  listaClientesFiltrada: ICliente[] = [];
  totalapagar: number = 0;

  frm_factura: FormGroup;
  idFactura: number = 0;

  constructor(
    private clientesServicios: ClientesService,
    private facturaServicio: FacturaService,
    private facturaService: FacturaService,
    private navegacion: Router,
    private ruta: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idFactura = parseInt(this.ruta.snapshot.paramMap.get('idFac'));
    console.log('Id para modificar', this.idFactura);

    this.frm_factura = new FormGroup({
      Fecha: new FormControl('', Validators.required),
      Sub_total: new FormControl('', Validators.required),
      Sub_total_iva: new FormControl('', Validators.required),
      Valor_IVA: new FormControl('0.15', Validators.required),
      Clientes_idClientes: new FormControl('', Validators.required)
    });

    if (this.idFactura > 0) {

      this.facturaService.uno(this.idFactura).subscribe((factura) => {

        let fecha = factura.Fecha;
        let [fechaParte] = fecha.split(" ");

        this.frm_factura = new FormGroup({
          Fecha: new FormControl(fechaParte, Validators.required),
          Sub_total: new FormControl(factura.Sub_total, Validators.required),
          Sub_total_iva: new FormControl(factura.Sub_total_iva, Validators.required),
          Valor_IVA: new FormControl('0.15', Validators.required),
          Clientes_idClientes: new FormControl(factura.Clientes_idClientes, Validators.required),
        });
      });

      this.titulo = 'Editar Factura';
    }

    this.clientesServicios.todos().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.listaClientesFiltrada = data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }


  grabar() {
    let factura: IFactura = {
      idFactura: this.idFactura,
      Fecha: this.frm_factura.get('Fecha')?.value,
      Sub_total: this.frm_factura.get('Sub_total')?.value,
      Sub_total_iva: this.frm_factura.get('Sub_total_iva')?.value,
      Valor_IVA: this.frm_factura.get('Valor_IVA')?.value,
      Clientes_idClientes: this.frm_factura.get('Clientes_idClientes')?.value
    };

    Swal.fire({
      title: 'Facturas',
      text: 'Desea guardar la factura ' + this.idFactura,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f00',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Grabar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.idFactura > 0) {
          this.facturaService.actualizar(factura).subscribe((data) => {
            Swal.fire({
              title: 'Factura',
              text: 'Actualización exitosa',
              icon: 'success'
            });
            this.navegacion.navigate(['/facturas']);
          });
        } else {
          this.facturaService.insertar(factura).subscribe((data) => {
            Swal.fire({
              title: 'Factura',
              text: 'Guardado exitoso',
              icon: 'success'
            });
            this.navegacion.navigate(['/facturas']);
          });
        }
      }
    });


  }


  calculos() {
    let sub_total = this.frm_factura.get('Sub_total')?.value;
    let iva = this.frm_factura.get('Valor_IVA')?.value;
    let sub_total_iva = sub_total * iva;
    this.frm_factura.get('Sub_total_iva')?.setValue(sub_total_iva);
    this.totalapagar = parseInt(sub_total) + sub_total_iva;
  }

  cambio(objetoSleect: any) {
    let idCliente = objetoSleect.target.value;
    this.frm_factura.get('Clientes_idClientes')?.setValue(idCliente);
  }
}
