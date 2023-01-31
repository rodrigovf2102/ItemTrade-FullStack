import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import { GameInfo, ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, ItemWithNameAndType } from "../protocols";
import { Container, FormContainer, Form, Input, 
  FormPostGame, FormInfo, InputPostGame, Entrar, ErrorMessage, DisplayModal } from "./games";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Grid } from "react-loader-spinner";
import UserContext from "../contexts/UserContext";
import useItems from "../hooks/api/useItems";
import styled from "styled-components";
import usePostItem from "../hooks/api/usePostItem";
import BottomBar from "../components/BottomBar";
import errorMessagesAll from "../usefull/errorMessages";

export default function ItemsPage() {
  const { items, getItems, itemsLoading } = useItems();
  const { postItemLoading, postItem } = usePostItem();
  const { userData } = useContext(UserContext);
  const [ itemName, setItemName] = useState<ItemWithNameAndType>({ name: "", itemType: "Todos" });
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [ gameInfo, setGameInfo ] = useState<GameInfo>({ gameName: "", serverName: "" });
  const [ postItemErrorMessage, setPostItemErrorMessage] = useState<string[]>([]);
  const [ modalStatus, setModalStatus ] = useState("none");
  const [ postNewItem, setPostNewItem] = useState<ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName>
  ({ name: "", price: 0, amount: 0, itemUrl: "", gameName: "", serverName: "", itemType: "" });
  const itemCategories = ["Selecione um tipo...", "Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Raros"];
  const itemCategoriesGet = ["Todos", "Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Raros"];

  useEffect(() => {
    async function refreshItems() {
      await getItems(Number(serverId), itemName.itemType, itemName.name, "");
    }
    refreshItems();
  }, [serverId, itemName]);

  function navigateItem(itemId:number) {
    navigate(`/item/${itemId}`);
  }

  useEffect(() => {
    getGameNameAndServerName();
  }, [items]);

  async function postItemForm() {
    try {
      await postItem(postNewItem, userData.token);
      setModalStatus("none");
      await getItems(Number(serverId), "Todos", "", "");
    } catch (err) {
      errorMessages(err);
    }
  }

  function getGameNameAndServerName() {
    let game : string | undefined;
    let server : string | undefined;
    if(items?.length>0) {
      game = items[0].Game.name;
      game = items.find(item => item.Game.name!==game)?.Game.name;
      if(!game) gameInfo.gameName =  `Jogo ${items[0].Game.name} e `;
      if(game) gameInfo.gameName = "Todos os Jogos e ";

      server = items[0].Server.name;
      server = items.find(item => item.Server.name!==server)?.Server.name;
      if(!server && !game) gameInfo.serverName = `Servidor ${items[0].Server.name}`;
      if(!server && game) gameInfo.serverName = `Servidores ${items[0].Server.name}`;
      if(server && !game) gameInfo.serverName = "Todos os Server do jogo";
      if(server && game) gameInfo.serverName = "Todos os Servers";
      
      setGameInfo({ ...gameInfo });
    } 
  }

  function errorMessages(error : any) {
    errorMessagesAll(error, setPostItemErrorMessage);
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
            <Input readOnly={itemsLoading} type="text" placeholder=" Procure um item aqui..."  onChange={(e) => {setItemName({ ...itemName, name: e.target.value  });}}/>
            <SelectPostGame placeholder=" Selecione o tipo do item..." onChange={(e) => {setItemName({ ...itemName, itemType: e.target.value  });}}>
              {itemCategoriesGet.map((categorie) => (<option value={categorie}>{categorie}</option>))}
            </SelectPostGame>
          </Form>
        </FormContainer>
        <Title>{gameInfo.gameName}{gameInfo.serverName}</Title>
        <GamesContainer>
          {items ? items.map(item => (
            <GameContainer>
              <div>{item.name}</div>
              <GameImage><img alt={""} src={item.itemUrl}/></GameImage>
              <div>R${(item.price/100).toFixed(2)}</div>
              <div>Quantidade: {item.amount}</div>
              <div>Tipo: {item.itemType}</div>
              <Button onClick={() => {navigateItem(item.id);}}>Clique para ver mais</Button>
            </GameContainer>)) : ""}
          <GameContainer  onClick={openModal}>
            <IoMdAddCircleOutline size={"180px"}></IoMdAddCircleOutline>
            <div>Adicione um Item</div>
          </GameContainer>
        </GamesContainer>
        <Modal display={modalStatus}>
          <FormContainer>
            <FormPostGame onSubmit={postForm}>
              <FormInfo>
                <div>Adicione as informações do jogo:</div>
                <AiOutlineCloseCircle onClick={() => {setModalStatus("none");}} size={"35px"}></AiOutlineCloseCircle>
              </FormInfo>
              <InputPostGame type="text" placeholder=" Digite o nome do item aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, name: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o link da imagem aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, itemUrl: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o nome do jogo aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, gameName: e.target.value });}}/>
              <InputPostGame type="text" placeholder=" Digite o preço do item(s) aqui..." onChange={(e) => {setPostNewItem({ ...postNewItem, price: Number(e.target.value)*100 });}}/>
              <InputPostGame type="text" placeholder=" Digite a quantidade de item..." onChange={(e) => {setPostNewItem({ ...postNewItem, amount: Number(e.target.value) });}}/>
              <InputPostGame type="text" placeholder=" Digite o server que o item se encontra..." onChange={(e) => {setPostNewItem({ ...postNewItem, serverName: e.target.value });}}/>
              <SelectPostGame placeholder=" Selecione o tipo do item..." onChange={(e) => {setPostNewItem({ ...postNewItem, itemType: e.target.value });}}>
                {itemCategories.map((categorie) => (<option value={categorie}>{categorie}</option>))}
              </SelectPostGame>
              <Entrar disabled={postItemLoading} onClick={postItemForm} type="submit">
                {postItemLoading ? <Grid color="white" width="100px" height="200px" radius="8"></Grid> : "Adicionar Item"}
              </Entrar>
              {typeof postItemErrorMessage !== "string" ? postItemErrorMessage.map((msg) => 
                <ErrorMessage>{msg}</ErrorMessage>) 
                : 
                <ErrorMessage>{postItemErrorMessage}</ErrorMessage>}
            </FormPostGame>
          </FormContainer>
        </Modal>
      </Container>
      <BottomBar></BottomBar>
    </>
  );
}

const Title = styled.div`
  font-size: 30px;
  padding: 15px;
  width: 100%;
`;

export const GameContainer = styled.div`
  width:350px ;
  height: 450px;
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
    font-size: 20px;
    text-align: center;
    line-height: 35px;
  }
`;

export const GamesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const GameImage = styled.div`
  width: 90%;
  overflow: hidden;
  height: 45%;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Button = styled.div`
  min-width: 100px;
  height: 50px;
  background: linear-gradient(#555555,#000000,#555555);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  :hover{
    background: linear-gradient(#000000,#333333,#000000);
  }
  :active{
    background: linear-gradient(#000000,#666666,#000000);
  }
`;

const SelectPostGame = styled.select`
  margin-top: 10px;
  width: 300px;
  height: 45px;
  background-color: white;
  border-radius: 6px;
  font-size: 20px;
  font-weight: 700; 
`;

const Modal = styled.div.attrs((props: DisplayModal) => ({
  display: props.display
}))`
  padding-top: 20px;
  display: ${props => props.display};
  align-items: flex-start;
  justify-content: center;
  left: 35%;
  position: absolute;
  min-width: 575px;
  height: 700px;
  background:  linear-gradient(#333333,#000000,#333333);
  border-radius: 10px;
`;

