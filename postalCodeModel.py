from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class PostalCode(db.Model):
    __tablename__ = 'postal_codes'
    id = db.Column(db.Integer, primary_key=True)
    country_code = db.Column(db.String(10))
    postal_code = db.Column(db.String(20))
    place_name = db.Column(db.String(200))
    admin_name1 = db.Column(db.String(200))
    admin_code1 = db.Column(db.String(20))
    admin_name2 = db.Column(db.String(200))
    admin_code2 = db.Column(db.String(20))
    admin_name3 = db.Column(db.String(200))
    admin_code3 = db.Column(db.String(20))
    latitude = db.Column(db.String(50))
    longitude = db.Column(db.String(50))
    accuracy = db.Column(db.String(50))
    coordinates = db.Column(db.String(200))

    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}


class infoPostalCodes(db.Model):
    __tablename__ = 'info_postal_codes'
    id = db.Column(db.Integer, primary_key=True)
    country_code = db.Column(db.String(10))
    er = db.Column(db.String(200))
    rule = db.Column(db.String(200))
    name = db.Column(db.String(200))

    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}
