import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Form } from 'react-bootstrap';

const url = "http://127.0.0.1:5000/eventos";

class App extends Component {
  state={
    data:[]
  }

  eventosGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  eventosPost=async()=>{
    delete this.state.form.id;
   await axios.post(url,this.state.form).then(response=>{
      this.modalInsertar();
      this.eventosGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }
  
  eventosPut=()=>{
    axios.put(url+'/'+this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.eventosGet();
    })
  }
  
  eventosDelete=()=>{
    axios.delete(url+'/'+this.state.form.id).then(response=>{
      this.setState({modalEliminar: false});
      this.eventosGet();
    })
  }
  
  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }
  
  seleccionarEvento=(evento)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: evento.id,
        nombre: evento.nombre,
        categoria: evento.categoria,
        lugar: evento.lugar,
        direccion: evento.direccion,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        modalidad: evento.modalidad
      }
    })
  }
  
  handleChange=async e=>{
  e.persist();
  await this.setState({
    form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }
  });
  console.log(this.state.form);
  }
  
    componentDidMount() {
      this.eventosGet();
    }

  render(){
    const {form}=this.state;
    return (
      <div className="App">
      <br /><br /><br />
    <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Evento</button>
    <br /><br />
      <table className="table ">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Lugar</th>
            <th>Dirección</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Modalidad</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(eventos=>{
            return(
              <tr>
            <td>{eventos.nombre}</td>
            <td>{eventos.categoria}</td>
            <td>{eventos.lugar}</td>
            <td>{eventos.direccion}</td>
            <td>{eventos.fechaInicio}</td>
            <td>{eventos.fechaFin}</td>
            <td>{eventos.modalidad}</td>
            <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarEvento(eventos); this.modalInsertar()}}>Editar</button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarEvento(eventos); this.setState({modalEliminar: true})}}>Eliminar</button>
                </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="categoria">Categoria</label>
                    <Form.Select type="categoria" name="categoria" id="categoria" onChange={this.handleChange}>
                      <option>Seleccione una categoria</option>
                      <option value="Conferencia">Conferencia</option>
                      <option value="Seminario">Seminario</option>
                      <option value="Congreso">Congreso</option>
                      <option value="Curso">Curso</option>
                    </Form.Select>
                    <br />
                    <label htmlFor="lugar">Lugar</label>
                    <input className="form-control" type="text" name="lugar" id="lugar" onChange={this.handleChange} value={form?form.lugar: ''}/>
                    <br />
                    <label htmlFor="direccion">Dirección</label>
                    <input className="form-control" type="text" name="direccion" id="direccion" onChange={this.handleChange} value={form?form.direccion: ''}/>
                    <br />
                    <label htmlFor="fechaInicio">Fecha de Inicio</label>
                    <input className="form-control" type="text" name="fechaInicio" id="fechaInicio" onChange={this.handleChange} value={form?form.fechaInicio: ''}/>
                    <br />
                    <label htmlFor="fechaFin">Fecha de Fin</label>
                    <input className="form-control" type="text" name="fechaFin" id="fechaFin" onChange={this.handleChange} value={form?form.fechaFin: ''}/>
                    <br />
                    <label htmlFor="modalidad">Modalidad</label>
                    <Form.Select type="modalidad" name="modalidad" id="modalidad" onChange={this.handleChange}>
                      <option>Seleccione una modalidad</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                    </Form.Select>
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal=='insertar'?
                    <button className="btn btn-success" onClick={()=>this.eventosPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.eventosPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar el evento{form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.eventosDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>


    );
  }
}
export default App;
