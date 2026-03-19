# controllers/graphql_controller.py
import graphene
from services.auth_service import register_user, login_user
from models.user_model import find_user_by_email

class UserType(graphene.ObjectType):
    email = graphene.String()
    role = graphene.String()

class Query(graphene.ObjectType):
    user_details = graphene.Field(UserType, email=graphene.String())

    def resolve_user_details(self, info, email=None):
        user = find_user_by_email(email)
        if not user:
            raise Exception("User not found")
        return UserType(email=user["email"], role=user["role"])

class Register(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        role = graphene.String(default_value="user")

    ok = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, email, password, role):
        result = register_user(email, password, role)
        if "error" in result:
            raise Exception(result["error"])
        return Register(ok=True, message=result["message"])

class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()

    def mutate(self, info, email, password):
        result = login_user(email, password)
        if "error" in result:
            raise Exception(result["error"])
        return Login(token=result["token"])

class Mutation(graphene.ObjectType):
    register = Register.Field()
    login = Login.Field()