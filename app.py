from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)

class Evento(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(50))
    categoria = db.Column(db.String(11))
    lugar = db.Column(db.String(50))
    direccion = db.Column(db.String(50))
    fechaInicio = db.Column(db.Time())
    fechaFin = db.Column(db.Time())
    presencial = db.Column(db.Boolean())

class Evento_Schema(ma.Schema):
    class Meta:
        fields = ("id", "nombre", "categoria", "lugar", "direccion", "fechaInicio", "fechaFin", "presencial")

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
                        fechaFin = request.json['fehcaFin'],
                        presencial = request.json['presencial']
                )
                db.session.add(nuevo_evento)
                db.session.commit()
                return post_schema.dump(nueva_evento)

api.add_resource(RecursoListarEventos,'/eventos')


if __name__ == '__main__':

    app.run(debug=True)