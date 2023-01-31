export default function errorMessagesAll(error : any, setErrorMessage : React.Dispatch<React.SetStateAction<string[]>> ) {
  if (error.message === "Network Error") return setErrorMessage(error.message);
  if (error.response?.data === "DuplicatedEmail") return setErrorMessage(["Email já cadastrado"]);
  if (error.response?.data?.details) return messageTranslateInglesToPortuguese(error.response.data.details, setErrorMessage);
  if (error?.detail === "As senhas não são iguais" ) return setErrorMessage(error.detail);
  if (error.response?.data === "InvalidCredentials") return setErrorMessage(["Usuário ou senha incorretos..."]);
  if (error.response.data?.name==="InvalidDataError") setErrorMessage(["Informações Inválidas"]);
  if (error.response.data?.detail==="GameAlreadyExist") setErrorMessage(["Jogo já existe"]);
  if (error.response.data ==="UserWithoutEnrollment") setErrorMessage(["Finalize seu cadastro para continuar"]);
  if (error.response.statusText ==="Unauthorized") setErrorMessage(["Seu Login expirou, refaça o login"]);
  if (error.response?.data?.clientVersion ==="4.9.0") return setErrorMessage(["Imagem muito grande, pegue outra..."]);
  if (error.response.data?.detail==="ItemAlreadyExist") setErrorMessage(["Jogo já existe"]);
  if (error.response.statusText ==="Unauthorized") setErrorMessage(["Seu Login expirou, refaça o login"]);
  if (error.response.data ==="ServerNotFound") setErrorMessage(["Servidor não encontrado"]);
  if (error.response.data ==="GameNotFound") setErrorMessage(["Jogo não encontrado"]);
  if (error.response?.data?.clientVersion ==="4.9.0") return setErrorMessage(["Imagem muito grande, pegue outra..."]);
  if (error.response.data.detail==="CPFAlreadyExists") return setErrorMessage(["CPF já cadastrado!"]);
  if (error.response.data==="InvalidCPF") return setErrorMessage(["CPF inválido!"]);
  if (error.response.statusText ==="Unauthorized") return setErrorMessage(["Seu Login expirou, refaça o login"]);
  if (error.response?.data?.clientVersion ==="4.9.0") return setErrorMessage(["Imagem muito grande, pegue outra..."]);
  if (error.response?.data==="GameNameDoesntExist") setErrorMessage(["Jogo não cadastrado"]);
  if (error.response?.data==="ServerAlreadyExist") setErrorMessage(["Server já existe"]);
  if (error.response.statusText ==="Unauthorized") setErrorMessage(["Seu Login expirou, refaça o login"]);
  if (error.response?.data?.clientVersion ==="4.9.0") return setErrorMessage(["Imagem muito grande, pegue outra..."]);
  setErrorMessage(["Erro desconhecido, tente mais tarde ou refaça o login..."]);
}

function messageTranslateInglesToPortuguese(messages : string[], setErrorMessage : React.Dispatch<React.SetStateAction<string[]>>) {
  const messagesPortuguese = [];
  for (let message of messages) {
    if(message === "\"email\" is not allowed to be empty") messagesPortuguese.push("Preencha o campo email...");
    if(message === "\"password\" is not allowed to be empty") messagesPortuguese.push("Preencha o campo de senha...");
    if(message === "\"email\" must be a valid email") messagesPortuguese.push("Email inválido...");
    if(message === "\"password\" length must be at least 6 characters long") messagesPortuguese.push("Senha deve ter no mínimo 6 caracteres");
    if(message === "\"name\" is not allowed to be empty") messagesPortuguese.push("Preencha o campo nome...");
    if(message === "\"gameUrl\" does not match any of the allowed types") messagesPortuguese.push("URL deve ser do tipo https ou data:image...");
    if(message === "\"name\" length must be at least 3 characters long") messagesPortuguese.push("Nome deve ter no mínimo 3 caracteres..");
    if(message === "\"gameName\" is not allowed to be empty") messagesPortuguese.push("Preencha o campo nome do jogo...");
    if(message === "\"name\" length must be at least 4 characters long") messagesPortuguese.push("Nome deve ter no mínimo 4 caracteres..");
    if(message === "\"itemUrl\" does not match any of the allowed types") messagesPortuguese.push("URL deve ser do tipo https ou data:image...");
    if(message === "\"serverName\" is not allowed to be empty") messagesPortuguese.push("Preencha o campo server...");
    if(message === "\"price\" must be a number") messagesPortuguese.push("Preço deve ser um número...");
    if(message === "\"amount\" must be a number") messagesPortuguese.push("Quantidade deve ser um número...");
    if(message === "\"name\" length must be less than or equal to 70 characters long") messagesPortuguese.push("Nome deve ter no máximo 70 caracteres..");
    if(message === "\"CPF\" is not allowed to be empty") messagesPortuguese.push("Preencha o campo CPF...");
    if(message === "\"CPF\" length must be at least 11 characters long") messagesPortuguese.push("CPF deve ter 11 caracteres..");
    if(message === "\"CPF\" length must be less than or equal to 11 characters long") messagesPortuguese.push("CPF deve ter 11 caracteres..");
    if(message === "\"enrollmentUrl\" does not match any of the allowed types") messagesPortuguese.push("URL deve ser do tipo https ou data:image...");
  }
  return setErrorMessage(messagesPortuguese);
}
