from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)

class Evento(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(50))
    categoria = db.Column(db.String(12))
    lugar = db.Column(db.String(50))
    direccion = db.Column(db.String(50))
    fechaInicio = db.Column(db.String(50))
    fechaFin = db.Column(db.String(50))
    modalidad = db.Column(db.String(12))

class Evento_Schema(ma.Schema):
    class Meta:
        fields = ("id", "nombre", "categoria", "lugar", "direccion", "fechaInicio", "fechaFin", "modalidad")

post_schema = Evento_Schema()
posts_schema = Evento_Schema(many = True)

class RecursoListarEventos(Resource):
        def get(self):
                eventos = Evento.query.all()
                return posts_schema.dump(eventos)

        def post(self):
                nuevo_evento = Evento(
                        nombre = request.json['nombre'],
                        categoria = request.json['categoria'],
                        lugar = request.json['lugar'],
                        direccion = request.json['direccion'],
                        fechaInicio = request.json['fechaInicio'],
                        fechaFin = request.json['fechaFin'],
                        modalidad = request.json['modalidad']
                )
                
                db.session.add(nuevo_evento)
                db.session.commit()
                return post_schema.dump(nuevo_evento)

class RecursoUnEvento(Resource):
    def get(self, id_evento):
        evento = Evento.query.get_or_404(id_evento)
        return post_schema.dump(evento)
    
    def put(self, id_evento):
        evento = Evento.query.get_or_404(id_evento)

        if 'nombre' in request.json:
            evento.nombre = request.json['nombre']
        if 'categoria' in request.json:
            evento.categoria = request.json['categoria']
        if 'lugar' in request.json:
            evento.lugar = request.json['lugar']
        if 'direccion' in request.json:
            evento.direccion = request.json['direccion']
        if 'fechaInicio' in request.json:
            evento.fechaInicio = request.json['fechaInicio']
        if 'fechaFin' in request.json:
            evento.fechaFin = request.json['fechaFin']
        if 'modalidad' in request.json:
            evento.modalidad = request.json['modalidad']

        db.session.commit()
        return post_schema.dump(evento)

    def delete(self, id_evento):
        evento = Evento.query.get_or_404(id_evento)
        db.session.delete(evento)
        db.session.commit()
        return '', 204

api.add_resource(RecursoListarEventos,'/eventos')
api.add_resource(RecursoUnEvento, '/eventos/<int:id_evento>')

if __name__ == '__main__':

    app.run(debug=True)