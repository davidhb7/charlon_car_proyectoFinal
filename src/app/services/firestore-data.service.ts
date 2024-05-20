import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {
  private firestore: Firestore = inject(Firestore);

  constructor() {

  }


  //CREATEBYID
  async crearDocumentoGeneralPorID(data: any, enlace: string, idDoc: string){
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return await setDoc(documento,data);//setDoc, es el encargado de ordenar la creacion del documento en Firestore
  }
}
