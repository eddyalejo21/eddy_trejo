import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../theme/shared/shared.module';
import { IUnidadMedida } from '../Interfaces/iunidadmedida';
import { UnidadmedidaService } from '../Services/unidadmedida.service';

@Component({
  selector: 'app-unidadmedida',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './unidadmedida.component.html',
  styleUrl: './unidadmedida.component.scss'
})
export class UnidadmedidaComponent implements OnInit {

  listaunidades: IUnidadMedida[] = [];

  constructor(private unidadServicio: UnidadmedidaService) {}
  
  ngOnInit(): void {
    this.cargatabla();
  }

  cargatabla() {
    this.unidadServicio.todos().subscribe((data) => {
      this.listaunidades = data;
    });
  }

  eliminar(idUnidad_Medida: number) {
    this.unidadServicio.eliminar(idUnidad_Medida).subscribe(() => {
      this.listaunidades = this.listaunidades.filter((unidad) => unidad.idUnidad_Medida !== idUnidad_Medida);
    });
    this.unidadServicio.eliminar(idUnidad_Medida).subscribe((data) => {
      this.cargatabla();
    });
  }
}
