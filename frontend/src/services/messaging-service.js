import axios from "axios";
import { MESSAGING_ENDPOINT } from "../const";

const API_URL = MESSAGING_ENDPOINT;

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
