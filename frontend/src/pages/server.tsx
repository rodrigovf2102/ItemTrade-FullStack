import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import useServers from "../hooks/api/useServers";
import { ObjectWithName, ServerNoIdName } from "../protocols";
import { FormContainer, Form, Input, GameContainer, GamesContainer,
  GameImage, Modal, FormPostGame, FormInfo, InputPostGame, Entrar, ErrorMessage } from "./games";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Grid } from "react-loader-spinner";
import UserContext from "../contexts/UserContext";
import usePostServer from "../hooks/api/usePostServer";
import BottomBar from "../components/BottomBar";
import errorMessagesAll from "../usefull/errorMessages";
import images from "../assets/images/landscapes/images";
import styled from "styled-components";

export default function ServerPage() {
  const [ serverName, setServerName] = useState<ObjectWithName>({ name: "" });
  const [ postNewServer, setPostNewServer] = useState<ServerNoIdName>({ name: "", gameName: "" });
  const { gameId } = useParams();
  const { servers, getServers, serversLoading } = useServers();
  const [ modalStatus, setModalStatus ] = useState("none");
  const { userData } = useContext(UserContext);
  const [ postServerErrorMessage, setPostServerErrorMessage] = useState<string[]>([]);
  const { postServerLoading, postServer } = usePostServer();
  const navigate = useNavigate();
  const [ image ] = useState(images[Math.floor(Math.random() * 24) + 1]);

  useEffect(() => {
    async function refreshServers() {
      await getServers(Number(gameId), "");
    }
    refreshServers();
  }, [gameId]);

  async function inputOnChange(event : any) {
    serverName.name = event.target.value;
    setServerName({ ...serverName, name: event.target.value });
    await getServers(Number(gameId), serverName.name);
  }

  function postForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  async function postServerForm() {
    try {
      await postServer(postNewServer, userData.token);
      setModalStatus("none");
      await getServers(Number(gameId), serverName.name);
    } catch (err) {
      errorMessages(err);
    }
  }

  function errorMessages(error : any) {
    errorMessagesAll(error, setPostServerErrorMessage);
  }

  async function goToItems(serverId:number) {
    navigate(`/items/${serverId}`);
  }

  function openModal() {
    setModalStatus("flex");
    window.scrollTo(0, 0);
  }
  
  return (
    <>
      <TopBar></TopBar>
      <Container randomImage={image}>
        <FormContainer>
          <Form>
            <Input readOnly={serversLoading} type="text" placeholder=" Procure um server aqui..." onChange={inputOnChange}/>
          </Form>
        </FormContainer>
        <GamesContainer>
          {servers ? servers.map(server => (
            <GameContainer onClick={() => {goToItems(server.id);}}>
              <GameName>{server.Game.name}</GameName>
              <GameImage><img alt={""} src={server.Game.gameUrl}/></GameImage>
              <GameServer>{server.name}</GameServer>
            </GameContainer>)) : ""}
          <GameContainer onClick={openModal}>
            <IoMdAddCircleOutline size={"180px"}></IoMdAddCircleOutline>
            <div>Adicione um Server</div>
          </GameContainer>
        </GamesContainer>
        <Modal display={modalStatus}>
          <FormContainer>
            <FormPostGame onSubmit={postForm}>
              <FormInfo>
                <div>Adicione as informações do server:</div>
                <AiOutlineCloseCircle onClick={() => {setModalStatus("none");}} size={"35px"}></AiOutlineCloseCircle>
              </FormInfo>
              <InputPostGame type="text" placeholder=" Digite o nome do server aqui..." 
                onChange={(e) => {setPostNewServer({ ...postNewServer, name: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o nome do jogo aqui..." 
                onChange={(e) => {setPostNewServer({ ...postNewServer, gameName: e.target.value });}}/>
              <Entrar disabled={postServerLoading} onClick={postServerForm} type="submit">
                {postServerLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Adicionar Server"}
              </Entrar>
              {typeof postServerErrorMessage !== "string" ? postServerErrorMessage.map((msg) => 
                <ErrorMessage>{msg}</ErrorMessage>) 
                : 
                <ErrorMessage>{postServerErrorMessage}</ErrorMessage>}
            </FormPostGame>
          </FormContainer>
        </Modal>
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

export type DisplayImage = { display:string };

const Container = styled.div.attrs((props: any) => ({
  randomImage: props.randomImage
}))`
  width: 100%;
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
  background-image: url(${props => props.randomImage});
  background-size: cover;
`;

const GameName = styled.div`
  color: blue;
`;

const GameServer = styled.div`
  color: green;
`;

