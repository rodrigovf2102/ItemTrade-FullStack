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
            <IoMdAddCircleOutline size={"180px"}></IoMdAddCircleOutline>
            <div>Adicione um Jogo</div>
          </GameContainer>
        </GamesContainer>
        <Modal display={modalStatus}>
          <FormContainer>
            <FormPostGame onSubmit={postForm}>
              <FormInfo>
                <div>Adicione as informações do jogo:</div>
                <AiOutlineCloseCircle onClick={() => {setModalStatus("none");}} size={"35px"}></AiOutlineCloseCircle>
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
  width: 400px;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 20px;
  font-weight: 700;
  margin-right: 50px;
`;

const InputPostGame = styled.input`
  margin-top: 20px;
  width: 60%;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700; 
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
  font-size: 22px;
  width: 80%;
  justify-content: space-between;
  align-items: center;
`;

export type DisplayModal = { display:string };

const Entrar = styled.button`
  min-width: 300px;
  height: 50px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  border-radius: 15px;
  color: white;
  font-size: 22px;
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
`;

const Modal = styled.div.attrs((props: DisplayModal) => ({
  display: props.display
}))`
  padding-top: 40px;
  display: ${props => props.display};
  align-items: flex-start;
  justify-content: center;
  left: 35%;
  height: 100px;
  position: absolute;
  width: 600px;
  height: 400px;
  background:  linear-gradient(#333333,#000000,#333333);
  border-radius: 10px;
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
  width  :250px ;
  height: 300px;
  background-color: gray;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  object-fit: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: gray;
  background: linear-gradient(#333333,#000000,#333333);
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  div{
    font-size: 22px;
    text-align: center;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 3px;
  color: red;
  font-size: 16px;
  margin-bottom: 3px;
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
