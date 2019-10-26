import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {SearchModel} from '../../models/search.model';
import {VueloModel} from '../../models/vuelo.model';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../../dialogs/confirm/confirm-dialog';
import 'rxjs';

import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {AppDateAdapter, APP_DATE_FORMATS} from 'src/app/shared/format-datepicker';

@Component({
  selector: 'app-reserva-component',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css'],
  providers: [
    DatePipe,
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ReservaComponent implements OnInit {
  @ViewChild('f', {static: true}) form: NgForm;
  typeTrip: string[];
  categories: string[];
  destinations: string[];
  typeTripSelected: string;
  category: string;
  cantPassengers: number;
  searchs: SearchModel[];
  searchsCopy: SearchModel[];
  dialogDelete: MatDialogRef<ConfirmDialogComponent>;
  vuelos: VueloModel[];
  resultSearch: VueloModel[];

  constructor(public dialog: MatDialog, private datePipe: DatePipe) {
    this.typeTrip = ['Solo ida', 'Ida y vuelta'];
    this.typeTripSelected = this.typeTrip[0];
    this.categories = ['Económica', 'Ejecutiva', 'Primera'];
    this.category = this.categories[0];
    this.cantPassengers = 1;
    this.searchs = [];
    this.resultSearch = [];
    this.vuelos = [];
    this.destinations = ['La Habana', 'Miami', 'Chile', 'España'];
  }

  ngOnInit() {
    this.searchs.push(new SearchModel());
    this.vuelos.push(new VueloModel('La Habana', 'Miami', '29-10-2019', 'Económica', 10,
      'https://www.cronista.com/__export/1569423379950/sites/diarioelcronista/img/2019/01/30/miami_crop1548892151154.jpg_258117318.jpg'));
    this.vuelos.push(new VueloModel('Miami', 'La Habana', '27-10-2019', 'Económica', 10,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvzsyWDiooZ-_KVdgnBU0sZ_zzKChboC8jui-Gc7axNUa9ITdz'));
    this.vuelos.push(new VueloModel('La Habana', 'España', '30-10-2019', 'Económica', 10,
      'https://fotos02.lne.es/2019/10/14/328x206/oviedo-contara.jpg'));
    this.vuelos.push(new VueloModel('La Habana', 'Chile', '30-10-2019', 'Económica', 10,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ1w_vBU-MGU9eYSMhom4OOEUeC4kX2Y0_M1hz5zJE29byhHacb'));
    this.vuelos.push(new VueloModel('Chile', 'La Habana', '30-10-2019', 'Económica', 10,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvzsyWDiooZ-_KVdgnBU0sZ_zzKChboC8jui-Gc7axNUa9ITdz'));
  }

  private validateField(): boolean {
    let valid = true;
    this.searchs.map((object) => {
      for (const property in object) {
        if (object[property] === undefined && this.typeTripSelected === 'Ida y vuelta') {
          valid = false;
          break;
        } else if (object[property] === undefined && property !== 'returnDate' && this.typeTripSelected !== 'Ida y vuelta') {
          valid = false;
          break;
        }
      }
    });
    return valid;
  }

  private viewWarningDialog() {
    this.dialogDelete = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Advertencia',
        content: 'Existen campos vacios, por favor llénelos o elimine el criterio de búsqueda'
      }
    });
    this.dialogDelete
      .afterClosed()
      .subscribe(deleted => {
      });
  }

  private transformDate(date): string {
    return date.getDate().toString() + '-' +
      (date.getMonth() + 1).toString() + '-' + date.getFullYear();
  }

  private cloneSearchsArray(): any {
    const arrayResult = [];
    this.searchs.map((object) => {
      const search = Object.assign({}, object);
      arrayResult.push(search);
      for (const property in object) {
        if (object[property] !== undefined && (property === 'returnDate' || property === 'departureDate')) {
          search[property] = this.transformDate(object[property]);
        }
      }
    });
    return arrayResult.slice();
  }

  public search(): void {
    this.resultSearch = [];
    if (this.validateField()) {
      this.searchsCopy = this.cloneSearchsArray();
      for (const vuelo of this.vuelos) {
        for (const search of this.searchsCopy) {
          if (this.typeTripSelected === 'Ida y vuelta') {
            if (vuelo.origin === search.origin && vuelo.destination === search.destination && vuelo.date === search.departureDate &&
              this.cantPassengers <= vuelo.passengers && this.category === vuelo.category) {
              const vueloCopy = Object.assign({}, vuelo, {type: 'Ida'});
              this.resultSearch.push(vueloCopy);
            }
            if (vuelo.origin === search.destination &&  vuelo.destination === search.origin && vuelo.date === search.returnDate &&
              this.cantPassengers <= vuelo.passengers && this.category === vuelo.category) {
              const vueloCopy = Object.assign({}, vuelo, {type: 'Vuelta'});
              this.resultSearch.push(vueloCopy);
            }
          } else {
            if (vuelo.origin === search.origin && vuelo.destination === search.destination && vuelo.date === search.departureDate &&
              this.cantPassengers <= vuelo.passengers && this.category === vuelo.category) {
              const vueloCopy = Object.assign({}, vuelo, {type: 'Ida'});
              this.resultSearch.push(vueloCopy);
            }
          }
        }
      }
    } else {
      this.viewWarningDialog();
    }
  }

  public addSearch(index): void {
    this.searchs.splice(index + 1, 0, new SearchModel());
  }

  public deleteSearch(index): void {
    this.searchs.splice(index, 1);
  }
}
