class Tutor:
    def __init__(self, email, firstname, lastname):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    def __repr__(self):
        return self.email + self.firstname + self.lastname

    def asdict(self):
        return {
            'Email': self.email,
            "Firstname": self.firstname,
            "Lastname": self.lastname
        }

