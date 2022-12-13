import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auto } from './clases/auto';
import { Marca } from './clases/marca';
import { Usuario } from './clases/usuario';
import { Viaje } from './clases/viaje';
import { DetViaje } from './clases/det-viaje';

@Injectable({
  providedIn: 'root'
})
export class wayDBService {
  public database: SQLiteObject;
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  arrayApiUsers: any[];
  users: any;

  listaUsuarios = new BehaviorSubject([]);
  Usuario = new BehaviorSubject([]);

  listaAutos = new BehaviorSubject([]);
  listaMarcas = new BehaviorSubject([]);
  listaViajes = new BehaviorSubject([]);
  Viaje = new BehaviorSubject([]);
  Asientos = new BehaviorSubject([]);
  listaDetViaje = new BehaviorSubject([]);
  listaRegistros = new BehaviorSubject([]);
  listaComentarios = new BehaviorSubject([]);
  //String con la creación de tablas
  tablaRol: string = "create table if not exists rol(idrol Integer Primary Key autoincrement, nombreRol VARCHAR(20) NOT NULL);";
  tablaComuna: string = "create table if not exists comuna(idcomuna Integer Primary Key autoincrement, nombreComuna VARCHAR(20) NOT NULL);";
  
  tablaUser: string = "create table if not exists usuario(idusuario Integer Primary Key autoincrement, username VARCHAR(20), rut VARCHAR(15) NOT NULL, nombre VARCHAR(50) NOT NULL, apellido VARCHAR(50) NOT NULL, correo VARCHAR(40) NOT NULL, clave VARCHAR(50) NOT NULL, foto BLOB DEFAULT '/assets/images/noperfil.jpg' NOT NULL, id_rol Integer, foreign key(id_rol) references rol(idrol));";
  
  tablaAuto: string = "create table if not exists auto(patente VARCHAR(10) Primary Key, color VARCHAR(20) NOT NULL, marca VARCHAR(40) NOT NULL, modelo VARCHAR(40) NOT NULL, annio Integer NOT NULL, id_usuario Integer NOT NULL, foreign key(id_usuario) references usuario(idusuario));";
  tablaViaje: string = "create table if not exists viaje(idviaje Integer Primary Key autoincrement, status VARCHAR(20), fechaViaje VARCHAR(20) NOT NULL, horaSalida VARCHAR(6) NOT NULL, asientoDisp Integer NOT NULL, monto Integer NOT NULL, salida VARCHAR(30) NOT NULL, llegada VARCHAR(30), patenteAuto VARCHAR(10), foreign key(patenteAuto) references auto(patente));";
  tablaDetViaje: string = "create table if not exists detalle_viaje(idDetalle Integer Primary Key autoincrement, status VARCHAR(15) NOT NULL, id_usuario Integer NOT NULL, id_viaje Integer NOT NULL, foreign key(id_usuario) references usuario(idusuario), foreign key(id_viaje) references viaje(idviaje));";
  tablaRegistro: string = "create table if not exists registro(idregistro Integer Primary Key autoincrement, horaTermino VARCHAR(10) NOT NULL, id_usuario Integer NOT NULL, id_viaje Integer NOT NULL, id_com Integer NOT NULL, foreign key(id_usuario) references usuario(idusuario), foreign key(id_viaje) references viaje(idviaje), foreign key(id_com) references comentario(idCom));"
  //tablaViajeCom: string = "create table if not exists viajeComuna(id Integer Primary Key autoincrement, id_viaje Integer, id_comuna Integer, foreign key(id_viaje) references viaje(idviaje), foreign key(id_comuna) references comuna(idcomuna));";
  tablaComentario: string = "create table if not exists comentario(idCom Integer Primary Key autoincrement, puntaje Integer NOT NULL, textoCom VARCHAR(150) NOT NULL, id_usuario Integer NOT NULL, id_viaje Integer NOT NULL, foreign key(id_usuario) references usuario(idusuario), foreign key(id_viaje) references viaje(idviaje));";
  //String para pobrar tablas
  RolPasaj: string = "insert or ignore into rol(idrol, nombreRol) values(1, 'Conductor');";
  RolAfil: string = "insert or ignore into rol(idrol, nombreRol) values(2, 'Pasajero');";
  //User1: string = "insert or ignore into usuario(idusuario, username, rut, nombre, apellido, correo, clave, id_rol) values (1, 'user.name', '111-1', 'User', 'Name', 'user@mail.com', '1234', 0)";
  //User2: string = "insert or ignore into usuario(idusuario, username, rut, nombre, apellido, correo, clave, id_rol) values (2, 'chimba_rongo', '222-2', 'Chimba', 'Rongo', 'chimba@rongo.com', 'chimba', 1)";

  constructor(public sql: SQLite, private platform: Platform) {
    this.platform.ready().then(() => {
      this.crearDB();
    }).catch(e => console.log("NO FUNCIONA!!!"));
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  fetchUsers(): Observable<Usuario[]> {
    return this.listaUsuarios.asObservable();
  }
  fetchAutos(): Observable<Auto[]> {
    return this.listaAutos.asObservable();
  }
  fetchMarcas(): Observable<Marca[]> {
    return this.listaMarcas.asObservable();
  }
  fetchViajes(): Observable<Viaje[]> {
    return this.listaViajes.asObservable();
  }
  fetchViaje(): Observable<Viaje[]> {
    return this.Viaje.asObservable();
  }
  fetchAsientos(): Observable<any[]> {
    return this.Asientos.asObservable();
  }
  fetchDetViaje(): Observable<DetViaje[]> {
    return this.listaDetViaje.asObservable();
  }
  fetchRegistros(): Observable<any[]> {
    return this.listaRegistros.asObservable();
  }
  fetchComentarios(): Observable<any[]> {
    return this.listaComentarios.asObservable();
  }

  crearDB() {
    this.sql.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.database = db;
      this.tablasDB();
      console.log("Listo!!");
    }).catch(e => console.log(e));
  }

  async tablasDB() {
    try {
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaComuna, []);
      await this.database.executeSql(this.tablaUser, []);
      await this.database.executeSql(this.tablaAuto, []);
      await this.database.executeSql(this.tablaViaje, []);
      await this.database.executeSql(this.tablaDetViaje, []);
      await this.database.executeSql(this.tablaComentario, []);
      await this.database.executeSql(this.tablaRegistro, []);
      
      await this.database.executeSql(this.RolPasaj, []);
      await this.database.executeSql(this.RolAfil, []);
      //Poblar tabla Marca con las Marcas más conocidas
      this.returnUsers();
      this.returnAutos();
      this.returnViajes();
      this.isDBReady.next(true);
    } catch (e) {
      console.log(e);
    }
  }
  returnUsers() {
    return this.database.executeSql('select * from usuario', []).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).idusuario,
            username: res.rows.item(i).username,
            rut: res.rows.item(i).rut,
            nombre: res.rows.item(i).nombre,
            apellido: res.rows.item(i).apellido,
            correo: res.rows.item(i).correo,
            clave: res.rows.item(i).clave,
            foto: res.rows.item(i).foto,
            idRol: res.rows.item(i).id_rol
          })
        }
      }
      this.listaUsuarios.next(items);
    })
  }
  returnUser(id) {
    return this.database.executeSql('select * from usuario where idusuario = ?', [id]).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).idusuario,
            username: res.rows.item(i).username,
            rut: res.rows.item(i).rut,
            nombre: res.rows.item(i).nombre,
            apellido: res.rows.item(i).apellido,
            correo: res.rows.item(i).correo,
            clave: res.rows.item(i).clave,
            foto: res.rows.item(i).foto,
            idRol: res.rows.item(i).id_rol
          })
        }
      }
      this.listaUsuarios.next(items);
    })
  }
  returnAutos() {
    return this.database.executeSql('select * from auto', []).then(res => {
      let items: Auto[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            patente: res.rows.item(i).patente,
            color: res.rows.item(i).color,
            marca: res.rows.item(i).marca,
            modelo: res.rows.item(i).modelo,
            annio: res.rows.item(i).annio,
            idUsuario: res.rows.item(i).id_usuario,
          })
        }
      }
      this.listaAutos.next(items);
    })
  }
  returnAuto(id) {
    return this.database.executeSql('select * from auto where id_usuario = ?', [id]).then(res => {
      let items: Auto[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            patente: res.rows.item(i).patente,
            color: res.rows.item(i).color,
            marca: res.rows.item(i).marca,
            modelo: res.rows.item(i).modelo,
            annio: res.rows.item(i).annio,
            idUsuario: res.rows.item(i).id_usuario,
          })
        }
      }
      this.listaAutos.next(items);
    })
  }
  returnAutoViaje(id) {
    return this.database.executeSql('select * from auto where patente = ?', [id]).then(res => {
      let items: Auto[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            patente: res.rows.item(i).patente,
            color: res.rows.item(i).color,
            marca: res.rows.item(i).marca,
            modelo: res.rows.item(i).modelo,
            annio: res.rows.item(i).annio,
            idUsuario: res.rows.item(i).id_usuario,
          })
        }
      }
      this.listaAutos.next(items);
    })
  }
  returnViajes() {
    return this.database.executeSql('select * from viaje', []).then(res => {
      let items: Viaje[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idviaje: res.rows.item(i).idviaje,
            status: res.rows.item(i).status,
            fechaViaje: res.rows.item(i).fechaViaje,
            horaSalida: res.rows.item(i).horaSalida,
            asientosDisp: res.rows.item(i).asientoDisp,
            monto: res.rows.item(i).monto,
            salida: res.rows.item(i).salida,
            llegada: res.rows.item(i).llegada,
            patente: res.rows.item(i).patenteAuto
          })
        }
      }
      this.listaViajes.next(items);
    })
  }
  returnViaje(id) {
    return this.database.executeSql('select * from viaje where idviaje = ?', [id]).then(res => {
      let items: Viaje[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idviaje: res.rows.item(i).idviaje,
            status: res.rows.item(i).status,
            fechaViaje: res.rows.item(i).fechaViaje,
            horaSalida: res.rows.item(i).horaSalida,
            asientosDisp: res.rows.item(i).asientoDisp,
            monto: res.rows.item(i).monto,
            salida: res.rows.item(i).salida,
            llegada: res.rows.item(i).llegada,
            patente: res.rows.item(i).patenteAuto
          })
        }
      }
      this.Viaje.next(items);
    })
  }
  returnViaje2(patente, fecha, hora) {
    return this.database.executeSql('select * from viaje where patenteAuto = ? and fechaViaje = ? and horaSalida = ?', [patente, fecha, hora]).then(res => {
      let items: Viaje[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idviaje: res.rows.item(i).idviaje,
            status: res.rows.item(i).status,
            fechaViaje: res.rows.item(i).fechaViaje,
            horaSalida: res.rows.item(i).horaSalida,
            asientosDisp: res.rows.item(i).asientoDisp,
            monto: res.rows.item(i).monto,
            salida: res.rows.item(i).salida,
            llegada: res.rows.item(i).llegada,
            patente: res.rows.item(i).patenteAuto
          })
        }
      }
      this.Viaje.next(items);
    })
  }
  returnViaje3(patente) {
    return this.database.executeSql('select * from viaje where patenteAuto = ? and status = "activo"', [patente]).then(res => {
      let items: Viaje[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idviaje: res.rows.item(i).idviaje,
            status: res.rows.item(i).status,
            fechaViaje: res.rows.item(i).fechaViaje,
            horaSalida: res.rows.item(i).horaSalida,
            asientosDisp: res.rows.item(i).asientoDisp,
            monto: res.rows.item(i).monto,
            salida: res.rows.item(i).salida,
            llegada: res.rows.item(i).llegada,
            patente: res.rows.item(i).patenteAuto
          })
        }
      }
      this.Viaje.next(items);
    })
  }
  returnDetViaje(id) {
    return this.database.executeSql('select * from detalle_viaje where id_usuario = ? and status = "activo"', [id]).then(res => {
      let items: DetViaje[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idDet: res.rows.item(i).idDetalle,
            status: res.rows.item(i).status,
            idusuario: res.rows.item(i).id_usuario,
            idviaje: res.rows.item(i).id_viaje,
          })
        }
      }
      this.listaDetViaje.next(items);
    })
  }
  returnDetViaje2(id) {
    return this.database.executeSql('select usuario.username from detalle_viaje inner join usuario on usuario.idusuario = detalle_viaje.id_usuario where detalle_viaje.status = "activo"', []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            username: res.rows.item(i).username,
          })
        }
      }
      this.Asientos.next(items);
    })
  }
  returnRegistros(){
    return this.database.executeSql('select * from registro', []).then(res => {
      // idregistro, horaTermino, id_usuario, id_viaje, id_com
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idReg: res.rows.item(i).idregistro,
            horaTermino: res.rows.item(i).horaTermino,
            idusuario: res.rows.item(i).id_usuario,
            idviaje: res.rows.item(i).id_viaje,
            idcom: res.rows.item(i).id_com
          })
        }
      }
      this.listaRegistros.next(items);
    })
  }
  returnRegistro(id){
    return this.database.executeSql('select * from registro where id_usuario = ?', [id]).then(res => {
      // idregistro, horaTermino, id_usuario, id_viaje, id_com
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idReg: res.rows.item(i).idregistro,
            horaTermino: res.rows.item(i).horaTermino,
            idusuario: res.rows.item(i).id_usuario,
            idviaje: res.rows.item(i).id_viaje,
            idcom: res.rows.item(i).id_com
          })
        }
      }
      this.listaRegistros.next(items);
    })
  }
  returnComentarios(id){
    // idCom, puntaje, textoCom, id_usuario
    return this.database.executeSql('select * from comentario where id_usuario = ?', [id]).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idCom: res.rows.item(i).idCom,
            puntaje: res.rows.item(i).puntaje,
            texto: res.rows.item(i).textoCom,
            idusuario: res.rows.item(i).id_usuario,
            idviaje: res.rows.item(i).id_viaje
          })
        }
      }
      this.listaComentarios.next(items);
    })
  }
  returnComentario(id){
    // idCom, puntaje, textoCom, id_usuario
    return this.database.executeSql('select * from comentario where idCom = ?', [id]).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idCom: res.rows.item(i).idCom,
            puntaje: res.rows.item(i).puntaje,
            texto: res.rows.item(i).textoCom,
            idusuario: res.rows.item(i).id_usuario,
            idviaje: res.rows.item(i).id_viaje
          })
        }
      }
      this.listaComentarios.next(items);
    })
  }
  //Funciones para agregar y editar de la base de datos
  agregarUser(username, rut, nombre, apellido, correo, clave, id_rol) {
    let data = [username, rut, nombre, apellido, correo, clave, id_rol];
    return this.database.executeSql('insert into usuario(username, rut, nombre, apellido, correo, clave, id_rol) values (?,?,?,?,?,?,?)', data).then(res => {
      this.returnUsers();
    })
  }
  editarUser(id, username, rut, nombre, apellido, correo, clave) {
    let data = [username, rut, nombre, apellido, correo, clave, id];
    return this.database.executeSql('update usuario set username = ?, rut = ?, nombre = ?, apellido = ?, correo = ?, clave = ? where idusuario = ?', data).then(res => {
      this.returnUser(id);
    })
  }
  editarUserAfil(id, id_rol) {
    let data = [id_rol, id];
    return this.database.executeSql('update usuario set id_rol = ? where idusuario = ?', data).then(res => {
      this.returnUser(id);
    })
  }
  deleteUser(id) {
    return this.database.executeSql('delete from usuario where idusuario = ?', [id]).then(res => {
      this.returnUsers();
    })
  }
  editarPhoto(id, foto) {
    let data = [foto, id];
    return this.database.executeSql('update usuario set foto = ? where idusuario = ?', data).then(res => {
      this.returnUser(id);
    })
  }
  agregarAuto(patente, color, marca, modelo, annio, idusuario) {
    let data = [patente, color, marca, modelo, annio, idusuario];
    return this.database.executeSql('insert into auto(patente, color, marca, modelo, annio, id_usuario) values (?,?,?,?,?,?)', data).then(res => {
      this.returnAutos();
    })
  }
  editarAuto(patente, color, marca, modelo, annio, idusuario, patente2) {
    let data = [patente, color, marca, modelo, annio, idusuario, patente2];
    return this.database.executeSql('update auto set patente = ?, color = ?, marca = ?, modelo = ?, annio = ?, id_usuario = ? where patente = ?', data).then(res => {
      this.returnAuto(idusuario);
    })
  }
  deleteAuto(patente){
    return this.database.executeSql('delete from auto where patente = ?', [patente]).then(res => {
      this.returnAutos();
    })
  }
  deleteAutoAfil(id){
    return this.database.executeSql('delete from auto where id_usuario = ?', [id]).then(res => {
      this.returnAutos();
    })
  }
  agregarDetViaje(status, idusuario, idviaje) {
    let detalle = [status, idusuario, idviaje];
    return this.database.executeSql('insert into detalle_viaje(status,id_usuario,id_viaje) values(?,?,?)', detalle).then(res => {
      this.returnDetViaje(idusuario);
    })
  }
  editarStatusDet(id, status, idusuario){
    let data = [status, id];
    return this.database.executeSql('update detalle_viaje set status = ? where idDetalle = ?', data).then(res => {
      this.returnDetViaje(idusuario);
    })
  }
  agregarViaje(status, fecha, hora, asiento, monto, salida, llegada, patente) {
    let data = [status, fecha, hora, asiento, monto, salida, llegada, patente];
    return this.database.executeSql('insert into viaje(status, fechaViaje, horaSalida, asientoDisp, monto, salida, llegada, patenteAuto) values(?,?,?,?,?,?,?,?)', data).then(res => {
      this.returnViaje2(patente, fecha, hora);
    })
  }
  editarStatusViaje(id, status){
    let data = [status, id];
    return this.database.executeSql('update viaje set status = ? where idviaje = ?', data).then(res => {
      this.returnViajes;
    })
  }
  deleteViaje(id){
    return this.database.executeSql('delete from viaje where idviaje = ?', [id]).then(res => {
      this.returnViajes();
    })
  }
  agregarRegistro(horaTermino, idusuario, idviaje, idcom){
    //  idregistro, horaTermino, id_usuario, id_viaje, id_com
    let data = [horaTermino, idusuario, idviaje, idcom];
    return this.database.executeSql('insert into registro(horaTermino, id_usuario, id_viaje, id_com) values(?,?,?,?)', data).then(res => {
      this.returnRegistros();
    })
  }
  agregarComentario(puntaje, texto, idusuario, idviaje){
    // idCom, puntaje, textoCom, id_usuario
    let data = [puntaje, texto, idusuario, idviaje];
    return this.database.executeSql('insert into comentario(puntaje, textoCom, id_usuario, id_viaje) values(?,?,?,?)', data).then(res => {
      this.returnComentarios(idusuario);
    })
  }
  ApiUser(id, username, rut, nombre, apellido, correo, clave, id_rol){
    let data = [id, username, rut, nombre, apellido, correo, clave, id_rol]
    return this.database.executeSql('insert or ignore into usuario(idusuario, username, rut, nombre, apellido, correo, clave, id_rol) values(?,?,?,?,?,?,?,?)', data).then(res => {
      this.returnUsers();
    })
  }
  ApiAuto(patente, color, modelo, marca, annio, idusuario){
    let data = [patente, color, marca, modelo, annio, idusuario];
    return this.database.executeSql('insert or ignore into auto(patente, color, marca, modelo, annio, id_usuario) values (?,?,?,?,?,?)', data).then(res => {
      this.returnAutos();
    })
  }
}
