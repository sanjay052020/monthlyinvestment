class ContactUser:
    def __init__(self, user_id, name, mobile, address, state, city, pin):
        self.user_id = user_id
        self.name = name
        self.mobile = mobile
        self.address = address
        self.state = state
        self.city = city
        self.pin = pin

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "mobile": self.mobile,
            "address": self.address,
            "state": self.state,
            "city": self.city,
            "pin": self.pin
        }