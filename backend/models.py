class Tutor:
    def __init__(self, email, firstname, lastname):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    def __repr__(self):
        return {
            'Email': self.email,
            "Firstname": self.firstname,
            "Lastname": self.lastname
        }

# Generate marshmallow Schemas from your models
class ArticlesShema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id","title", "body", "date")


article_schema = ArticlesShema()
articles_schema = ArticlesShema(many=True)