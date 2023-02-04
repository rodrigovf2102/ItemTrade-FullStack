import TopBar from "../components/TopBar";
import styled from "styled-components";
import useGames from "../hooks/api/useGames";
import { GameWithoutId, ObjectWithName } from "../protocols";
import { useContext, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import usePostGame from "../hooks/api/usePostGames";
import UserContext from "../contexts/UserContext";
import { Grid } from "react-loader-spinner";
import BottomBar from "../components/BottomBar";
import errorMessagesAll from "../usefull/errorMessages";
import { device } from "../mediaqueries/devices";

export default function GamePage() {
  const { games, getGames, gamesLoading } = useGames();
  const [ gameName, setGameName] = useState<ObjectWithName>({ name: "" });
  const [ postNewGame, setPostNewGame] = useState<GameWithoutId>({ name: "", gameUrl: "" });
  const [ modalStatus, setModalStatus ] = useState("none");
  const [ postGameErrorMessage, setPostGameErrorMessage] = useState<string[]>([]);
  const navigate = useNavigate();
  const { postGame, postGameLoading } = usePostGame();
  const { userData } = useContext(UserContext);

  async function inputOnChange(event : any) {
    gameName.name = event.target.value;
    setGameName({ ...gameName, name: event.target.value });
    await getGames(gameName.name);
  }

  async function postGameForm() {
    try {
      await postGame(postNewGame, userData.token);
      setModalStatus("none");
      await getGames(gameName.name);
    } catch (err) {
      errorMessages(err);
    }
  }

  function errorMessages(error : any) {
    errorMessagesAll(error, setPostGameErrorMessage);
  }

  async function goToServers(gameId:number) {
    navigate(`/servers/${gameId}`);
  }

  function postForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function openModal() {
    setModalStatus("flex");
    window.scrollTo(0, 0);
  }

  return(
    <>
      <TopBar></TopBar>
      <Container>
        <FormContainer>
          <Form>
            <Input readOnly={gamesLoading} type="text" placeholder=" Procure um jogo aqui..." onChange={inputOnChange}/>
          </Form>
        </FormContainer>
        <GamesContainer>
          {games ? games.map(game => (
            <GameContainer onClick={() => {goToServers(game.id);}}>
              <GameImage><img alt={""} src={game.gameUrl}/></GameImage>
              <div>{game.name}</div>
            </GameContainer>)) : ""}
          <GameContainer onClick={openModal}>
            <IoMdAddCircleOutline size={"140px"}></IoMdAddCircleOutline>
            <div>Adicione um Jogo</div>
          </GameContainer>
        </GamesContainer>
        <Modal display={modalStatus}>
          <FormContainer>
            <FormPostGame onSubmit={postForm}>
              <FormInfo>
                <div>Adicione as informações do jogo:</div>
                <AiOutlineCloseCircle onClick={() => {setModalStatus("none");}} size={"30px"}></AiOutlineCloseCircle>
              </FormInfo>
              <InputPostGame type="text" placeholder=" Digite o nome do jogo aqui..." onChange={(e) => {setPostNewGame({ ...postNewGame, name: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o link da imagem aqui..." onChange={(e) => {setPostNewGame({ ...postNewGame, gameUrl: e.target.value });}}/>
              <Entrar disabled={postGameLoading} onClick={postGameForm} type="submit">
                {postGameLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Adicionar Jogo"}
              </Entrar>
              {typeof postGameErrorMessage !== "string" ? postGameErrorMessage.map((msg) => 
                <ErrorMessage>{msg}</ErrorMessage>) 
                : 
                <ErrorMessage>{postGameErrorMessage}</ErrorMessage>}
            </FormPostGame>
          </FormContainer>
        </Modal>
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  align-items: flex-start;
  flex-wrap: wrap;
  @media ${device.mobileM} {
  justify-content  :center ;
  }
`;

const FormPostGame = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Input = styled.input`
  margin-top: 10px;
  width: 350px;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  margin-right: 50px;
  margin-left: 15px;
  margin-bottom: 10px;
  @media ${device.mobileM} {
  font-size: 15px;
  margin: 5px;
  }
`;

const InputPostGame = styled.input`
  margin-top: 20px;
  width: 75%;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  @media ${device.mobileM} {
    width: 80%;
    font-size: 14px;
  }

`;

const GameImage = styled.div`
  width: 90%;
  overflow: hidden;
  height: 50%;
  img{
    width: 100%;
    height: 80%;
    object-fit: contain;
  }
`;

const FormInfo = styled.div`
  display: flex;
  font-size: 20px;
  width: 85%;
  justify-content: space-between;
  align-items: center;
  @media ${device.mobileM} {
    width: 90%;
    font-size: 15px;
  }
`;

export type DisplayModal = { display:string };

const Entrar = styled.button`
  height: 55px;
  width: 60%;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  color: white;
  font-size: 18px;
  box-shadow: 15px 15px 15px 0 rgba(0, 0, 0, 0.5);
  margin: 20px;
  overflow: hidden;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
  @media ${device.mobileM} {
    font-size: 15px;
    max-width: 350px;
    width: 60%;
    height: 50px;
    padding: 10px;
    text-align: center;
  }
`;

const Modal = styled.div.attrs((props: DisplayModal) => ({
  display: props.display
}))`
  padding: 10px;
  display: ${props => props.display};
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 500px;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background:  linear-gradient(#333333,#000000,#333333);
  border-radius: 10px;
  @media ${device.mobileM} {
    font-size: 15px;
    max-width: 420px;
    width: 90%;
    text-align: center;
  }
`;

const GamesContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
`;

const FormContainer = styled.div`
  min-width: 100%;
  height: 100%;
`;

const GameContainer = styled.div`
  width  :200px ;
  height: 260px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  object-fit: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: white;
  background: linear-gradient(#333333,#000000,#333333);
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  div{
    font-size: 18px;
    text-align: center;
  }
  @media ${device.mobileM} {
    width: 150px;
    height: 180px;
    margin: 5px;
    div{
      font-size: 14px;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 3px;
  color: red;
  font-size: 15px;
  margin-bottom: 3px;
  display: flex; 
  @media ${device.mobileM} {
    font-size: 14px;
  }
`;

export {
  Container,
  ErrorMessage,
  GameContainer,
  FormContainer,
  GamesContainer,
  Modal,
  Entrar,
  FormInfo,
  GameImage,
  InputPostGame,
  Form,
  FormPostGame,
  Input
};
