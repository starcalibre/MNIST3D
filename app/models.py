from app import db

class Digit(db.Model):
    __tablename__ = 'digits'

    id = db.Column(db.INTEGER, primary_key=True)
    label = db.Column(db.INTEGER)
    tsne_x = db.Column(db.REAL)
    tsne_y = db.Column(db.REAL)
    tsne_z = db.Column(db.REAL)
    array = db.Column(db.String)

    def __repr__(self):
        return '<Digit %d %d>' % (self.id, self.label)

    def as_dict(self, fields=None):
        if not fields:
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}
        else:
            return {c: getattr(self, c) for c in fields}
