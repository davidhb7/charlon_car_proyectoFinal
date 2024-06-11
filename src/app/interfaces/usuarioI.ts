export interface UsuarioI{
  id:string,
  cedula:string,
  nombre:string,
  correo:string,
  edad:string,
  celular:string,
  tipo:string,

  // COMO CONDUCTOR
  marcaVehiculo:string,
  modelo:string,
  placa:string,
  ciudadRegistrado:string,
  color:string
}
