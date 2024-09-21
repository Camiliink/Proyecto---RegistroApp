export interface Asistencia {
  bloqueInicio: number;
  bloqueTermino: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  idAsignatura: string;
  nombreAsignatura: string;
  nombreProfesor: string;
  seccion: string;
  sede: string;

  [key: string]: any;
}
