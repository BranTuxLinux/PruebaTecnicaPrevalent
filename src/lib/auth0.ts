import axios, { Axios, AxiosError } from "axios";
import { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_ISSUER } from "./config";

async function getAuth0AccessToken() {
  const tokenUrl = `${AUTH0_ISSUER}/oauth/token`;

  try {
    const response = await axios.post(
      tokenUrl,
      {
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: "https://bell-dev.us.auth0.com/api/v2/",
        grant_type: "client_credentials",
      },
      {
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.access_token; // Retorna el token de acceso
  } catch (error) {
    console.error("Error obteniendo el token:", error);
  }
}

// Función para obtener los usuarios usando el token de acceso
export async function getUsers() {
  try {
    const accessToken = await getAuth0AccessToken();
    const response = await axios.get(`${AUTH0_ISSUER}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw error;
  }
}

export interface IUserAuth0 {
  email: string;
  phone_number: string;
  blocked: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  given_name: string;
  family_name: string;
  name: string;
  nickname: string;
  picture: string;
  user_id: string;
  connection: string;
  password: string;
  verify_email: boolean;
  username: string;
  user_metadata: {};
  app_metadata: {};
}
export const CreateUsers = async (User: Partial<IUserAuth0>) => {
  try {
    const accessToken = await getAuth0AccessToken();
    const response = await axios.post(`${AUTH0_ISSUER}/api/v2/users`, User, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (!axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.error("Error creando usuarios:", err?.response?.data);

      throw err?.response?.data;
    }
    throw error;
  }
};
export const UpdateUsers = async (id: string, User: Partial<IUserAuth0>) => {
  try {
    const accessToken = await getAuth0AccessToken();
    const response = await axios.patch(
      `${AUTH0_ISSUER}/api/v2/users/${id}`,
      User,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (!axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.error("Error actualizando usuarios:", err?.response?.data);

      throw err?.response?.data;
    }
    throw error;
  }
};
export const DeleteUsers = async (id: string) => {
  try {
    const accessToken = await getAuth0AccessToken();
    const response = await axios.delete(`${AUTH0_ISSUER}/api/v2/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 204) return true;
    else return false;
  } catch (error: unknown) {
    if (!axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.error("Error eliminando usuarios:", err?.response?.data);

      throw err?.response?.data;
    }
    throw error;
  }
};
