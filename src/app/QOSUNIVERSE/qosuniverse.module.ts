import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlainteComponent } from './plainte/plainte.component'; // Ajoutez cette ligne

import { QOSUNIVERSERoutingModule } from './qosuniverse-routing.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [PlainteComponent], // Ajoutez cette ligne
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    QOSUNIVERSERoutingModule
  ],
  exports: [PlainteComponent] // Ajoutez cette ligne

})
export class QOSUNIVERSEModule { }
