import axios from 'axios';
import {route} from 'ziggy-js';

export const authApi = {
  sendCode: async (login) => {
    const response = await axios.post(route('auth.send-code'), {login});
    return response.data;
  },

  verifyCode: async (login, code) => {
    const response = await axios.post(route('auth.verify'), {login, code});
    return response.data;
  },

  loginPassword: async (login, password) => {
    const response = await axios.post(route('auth.login-password'), {login, password});
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axios.post(route('auth.reset-password'), data);
    return response.data;
  }
};