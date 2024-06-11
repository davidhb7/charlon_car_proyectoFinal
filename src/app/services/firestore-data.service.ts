import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, addDoc, arrayUnion, collection, collectionData, deleteDoc, doc, getCountFromServer, getDoc, getDocFromServer, getDocs, query, runTransaction, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

//DECLARACION UNICA DE ID PARA FIRESTORE
import { v4 as uuidv4 } from 'uuid'; // install
import { FirebaseAuthService } from './firebase-auth.service';
import { firstValueFrom } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {
  private firestore: Firestore = inject(Firestore);

  constructor(private serviciosAuth: FirebaseAuthService, private auth: Auth) {

  }

  //CREAR ID ALEATORIO
  crearIDUnico() {
    const uuid = uuidv4();
    console.log("El idUnico", uuid);
    return uuid;
  }

  //EL GET DOCUMENTO SOLO
  async getDocumentSolo(enlace: string, idDoc:string) {
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    const documentSnapshot = await getDocFromServer(documento);
  
    if (documentSnapshot.exists()) {
      // Obtener los datos del documento
      const data = documentSnapshot.data();
      
      return data; // Devolver el objeto de datos directamente
    } else {
      console.log('El documento no existe');
      return {}; // Devolver un objeto vacío en caso de que el documento no exista
    }
  }

  //CREATEBYID
  async crearDocumentoGeneralPorID(data: any, enlace: string, idDoc: string) {
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return await setDoc(documento, data);//setDoc, es el encargado de ordenar la creacion del documento en Firestore
  }

  //GET
  //TODO
  //TRAE TODOS LOS DOCUMENTOS DE ESA COLECCION?
  //TRAER Y OBTENER LOS CAMBIOS DE LA COLECCION.
  //LEE CUALQUEIR COLECCION. ESTA PENDIENTE DE LOS CAMBIOS
  getCambiosYListar<tipo>(path: string) {//tipo: es el campo o variable a leer. Argumento. Path es la ruta a la BDD de firestore
    const itemColection = collection(this.firestore, path);//path: es la ruta de la coleccion
    return collectionData(itemColection) as Observable<tipo[]>;//observable: pendiente de los cambios, segun el <tipo> de variable
  }

  //CREATE
  crearDocumentoGeneral(data: any, enlace: string) {
    const documento = doc(this.firestore, enlace);
    return setDoc(documento, data);
  }

  //UPDATE. ACTUALIZAR DOCUMENTO TENIENDO UN ID DE REFERENCIA
  /*
  async actualizarDocumentoPorID(data: any, enlace: string, idDoc: number) {
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return updateDoc(documento, data);
  }*/

  //DELETE
  eliminarDocPorID(enlace: string, idDoc: string) {
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(documento);
  }

  //OBTENER NUMERO TOTAL DE DATOS REGITRADO-CONTEO. DEFINITIVO
  async contarNumeroDocumentosTotal(path: string) {
    const consulta = collection(this.firestore, path);//REFERENCIA DE LA COLECCION
    const snapshot = await getCountFromServer(consulta);
    let totalCuenta = snapshot.data().count;
    return totalCuenta;
  }

  async agregarDocumentoConIDAutomatico(enlace: string, data: any): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, enlace), data);
    return docRef.id;
  }

  async actualizarDocumentoPorID(enlace: string, idDoc: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${enlace}/${idDoc}`);
    await updateDoc(docRef, data);
  }

  getAllViajes(): Observable<any[]> {
    const viajesCollection = collection(this.firestore, 'viajes');
    return collectionData(query(viajesCollection), { idField: 'id' });
  }

  async agregarPasajeroAViaje(viajeId: string) {
    const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const usuarioDoc = await this.getDocumentSolo2('usuarios', user.uid);
    const pasajero = {
      nombre: usuarioDoc['nombre'],
      celular: usuarioDoc['celular'],
      cedula: usuarioDoc['cedula'],
      usuarioId: user.uid,
      pagoHecho: false
    };

    const viajeDocRef = doc(this.firestore, `viajes/${viajeId}`);
    const usuarioDocRef = doc(this.firestore, `usuarios/${user.uid}`);

    await runTransaction(this.firestore, async (transaction) => {
      const viajeDoc = await transaction.get(viajeDocRef);
      if (!viajeDoc.exists) {
        throw new Error('El viaje no existe');
      }

      const viajeData = viajeDoc.data();
      const sillasDisponibles = viajeData['sillasDisponibles'];

      if (sillasDisponibles > 0) {
        transaction.update(viajeDocRef, {
          pasajeros: arrayUnion(pasajero),
          sillasDisponibles: sillasDisponibles - 1
        });
        transaction.update(usuarioDocRef, {
          viajesSolicitados: arrayUnion(viajeId)
        });
      } else {
        throw new Error('No hay sillas disponibles');
      }
    });
  }

  async getDocumentSolo2(enlace: string, idDoc: string) {
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    const docSnap = await getDoc(documento);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async getViajesSolicitados(): Promise<any[]> {
    const user = this.auth.currentUser;
    if (user) {
      const userDoc = await this.getDocumentSolo('usuarios', user.uid);
      const viajesSolicitados = userDoc['viajesSolicitados'] || [];
      const viajesRef = collection(this.firestore, 'viajes');
      const q = query(viajesRef, where('__name__', 'in', viajesSolicitados));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    return [];
  }

  async updateDocument(collectionPath: string, docId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, docId);
    await updateDoc(docRef, data);
  }

}
