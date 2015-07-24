from app import db

class Digit(db.Model):
    id = db.Column(db.INTEGER, primary_key=True)
    label = db.Column(db.INTEGER)
    tsne_x = db.Column(db.REAL)
    tsne_y = db.Column(db.REAL)
    tsne_z = db.Column(db.REAL)
    array = db.Column(db.String)
    image = db.Column(db.BLOB)

    def __repr__(self):
        return '<Digit %d %d>' % (self.id, self.label)
