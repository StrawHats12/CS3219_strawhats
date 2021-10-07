import axios from "axios";
import Config from "../config.json";

const API_URL = Config.API_URL;

export async function sendMessage(body) {
  const res = await axios.post(`${API_URL}/message`, body);
  return res;
}

export async function getMessagesByConvoId(id) {
  const res = await axios.get(`${API_URL}/message/${id}`);
  return res.data.Items;
}

export async function createConversation(recipients) {
  const res = await axios.post(`${API_URL}/conversation`, recipients);
  return res;
}

export async function getConversationByUserId(id) {
  const res = await axios.get(`${API_URL}/conversation/${id}`);
  return res.data.Items;
}
