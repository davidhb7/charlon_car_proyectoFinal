export interface UsuarioI{
  id:string,
  cedula:string,
  nombre:string,
  correo:string,
  edad:string,
  celular:string,
  clave:string,

  // COMO CONDUCTOR
  marcaVehiculo:string,
  modelo:string,
  placa:string,
  ciudadRegistrado:string,
  asientosDisponibles: number
}
