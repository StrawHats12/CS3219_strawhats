import axios from "axios";
import { MESSAGING_ENDPOINT } from "../const";
import { getCurrentSession } from "../hooks/useAuth";

const API_URL = MESSAGING_ENDPOINT;

export async function sendMessage(body) {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const res = await axios.post(`${API_URL}/message`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getMessagesByConvoId(id) {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const res = await axios.get(`${API_URL}/message/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.Items;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createConversation(members) {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const res = await axios.post(
      `${API_URL}/conversation`,
      { members },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getConversationByUserId(id) {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const res = await axios.get(`${API_URL}/conversation/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.Items;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getConversationByUser(user) {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const res = await axios.get(`${API_URL}/conversation/${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.Items;
  } catch (error) {
    console.log(error);
    return null;
  }
}
