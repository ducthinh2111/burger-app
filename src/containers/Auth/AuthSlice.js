import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  signupStatus: "idle",
  signupError: null,
  signinStatus: "idle",
  signinError: null,
  token: null,
  userId: null,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData, { rejectWithValue }) => {
    const payload = {
      ...signupData,
      returnSecureToken: true,
    };

    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOooPWbkJL1ywknq4nabdLvvPsU45qqCs",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const checkAuthTimeout = createAsyncThunk(
  "auth/checkAuthTimeout",
  (timeoutData, { dispatch }) => {
    setTimeout(() => {
      dispatch(logout());
    }, timeoutData.timeout * 1000);
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (signinData, { rejectWithValue, dispatch }) => {
    const payload = {
      ...signinData,
      returnSecureToken: true,
    };

    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOooPWbkJL1ywknq4nabdLvvPsU45qqCs",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const expirationDate = new Date(
        new Date().getTime() + response.data.expiresIn * 1000
      );
      localStorage.setItem("token", response.data.idToken);
      localStorage.setItem("expirationDate", expirationDate);
      dispatch(checkAuthTimeout({ timeout: response.data.expiresIn }));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const authCheck = createAsyncThunk(
  "auth/authCheck",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate > new Date()) {
        try {
          const response = await axios.post(
            "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAOooPWbkJL1ywknq4nabdLvvPsU45qqCs",
            { idToken: token },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          dispatch(authSuccess({ token: token, userId: response.data.users[0].localId }));
          dispatch(
            checkAuthTimeout({
              timeout: (expirationDate.getTime() - new Date().getTime()) / 1000,
            })
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        dispatch(logout());
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout(state, action) {
      state.token = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("expirationDate");
    },
    signupRefreshed(state, action) {
      state.signupStatus = "idle";
    },
    signinRefreshed(state, action) {
      state.signinStatus = "idle";
    },
  },
  extraReducers: {
    [signup.pending]: (state, action) => {
      state.signupStatus = "loading";
    },
    [signup.fulfilled]: (state, action) => {
      state.signupStatus = "succeeded";
      console.log(action.payload);
    },
    [signup.rejected]: (state, action) => {
      state.signupStatus = "failed";
      state.signupError = action.payload;
    },
    [signin.pending]: (state, action) => {
      state.signinStatus = "loading";
    },
    [signin.fulfilled]: (state, action) => {
      state.signinStatus = "succeeded";
      state.token = action.payload.idToken;
      state.userId = action.payload.localId;
    },
    [signin.rejected]: (state, action) => {
      state.signinStatus = "failed";
      state.signinError = action.payload;
    },
  },
});

export const {
  signinRefreshed,
  signupRefreshed,
  logout,
  authSuccess,
} = authSlice.actions;

export default authSlice.reducer;
