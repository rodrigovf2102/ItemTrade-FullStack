import action from "../assets/images/action.gif";
import { Grid } from "react-loader-spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserWithNoId, UserWithNoIdSignUp } from "../protocols";
import {
  Container,
  LeftContainer,
  Form,
  FormTitle,
  Input,
  ErrorMessage,
  Entrar,
  GoToSingUp,
} from "./login";
import useSignUp from "../hooks/api/useSignUp";
import { defaultError } from "../errors/default-error";
import errorMessagesAll from "../usefull/errorMessages";

export default function Signup() {
  const [signup, setSignup] = useState<UserWithNoIdSignUp>({ email: "", password: "", confirmPassword: "" });
  const { signUpLoading, signUp } = useSignUp();
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [corEntrar, setCorEntrar] = useState(1);
  const navigate = useNavigate();

  function loginInfo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  async function userLogup() {
    setCorEntrar(0.4);
    try {
      if(signup.password !== signup.confirmPassword) {
        throw defaultError("As senhas não são iguais");
      }
      const signUpAxios : UserWithNoId = { email: signup.email, password: signup.password }; 
      await signUp(signUpAxios.email, signUpAxios.password);
      autorizado();
    } catch (error) {
      unautorized(error);
    }
  }

  function unautorized(error: any) {
    setCorEntrar(1);
    errorMessagesAll(error, setErrorMessage);
  }

  function autorizado() {
    setCorEntrar(1);
    navigate("/signin");
  }

  return (
    <Container>
      <LeftContainer>
        <img src={action} alt="1" />
      </LeftContainer>
      <RightContainer>
        <Form onSubmit={loginInfo}>
          <FormTitle>Faça seu cadastro:</FormTitle>
          <Input
            type="text"
            placeholder=" Digite seu email..."
            onChange={(event) => setSignup({ ...signup, email: event.target.value })}
            disabled={signUpLoading}
            required
          />
          <Input
            type="password"
            placeholder=" Digite sua senha..."
            onChange={(event) => setSignup({ ...signup, password: event.target.value })}
            disabled={signUpLoading}
            required
          />
          <Input
            type="password"
            placeholder=" Digite sua senha novamente..."
            onChange={(event) => setSignup({ ...signup, confirmPassword: event.target.value })}
            disabled={signUpLoading}
            required
          />
          {typeof errorMessage !== "string" ? (
            errorMessage.map((msg) => <ErrorMessage>{msg}</ErrorMessage>)
          ) : (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}
          <Entrar disabled={signUpLoading} cor={corEntrar} onClick={userLogup} type="submit">
            {signUpLoading ? (
              <div>
                <Grid color="black" radius="10" height="90" width="90" />
              </div>
            ) : (
              "Cadastrar"
            )}
          </Entrar>
        </Form>
        <GoToSingUp
          onClick={() => {
            navigate("/signin");
          }}
        >
          Já tem uma conta? Vá para o login!
        </GoToSingUp>
      </RightContainer>
    </Container>
  );
}

const RightContainer = styled.div`
  width: 30%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #111111;
  border-radius: 20px;
`;
