import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// =================================================================
// INTERFACES & TYPES
// =================================================================

/**
 * @interface ImageAsset
 * Represents the structure for image objects stored in the database.
 */
interface ImageAsset {
  public_id: string;
  url: string;
}

/**
 * @interface StackItem
 * Defines the shape of an item in the user's technology stack.
 */
export interface StackItem {
  image: ImageAsset;
  description: string;
}

/**
 * @interface AboutMe
 * Defines the structure for the 'about me' section.
 */
interface AboutMe {
  heading: string;
  description: string;
}

/**
 * @interface User
 * Defines the complete shape of the user object, matching the Mongoose schema.
 */
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  title: string;
  description: string;
  stack: StackItem[];
  aboutMe: AboutMe;
  githubLink: string;
  linkedInLink: string;
  copyright: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface UserApiResponse
 * Defines the shape of the successful response from an API endpoint that returns a user.
 * Your backend likely wraps the user object in a standard response.
 */
interface UserApiResponse {
  success: boolean;
  user: User; // Assuming the API returns a 'user' object
}

/**
 * @interface UserState
 * Defines the shape of this Redux slice's state.
 */
interface UserState {
  user: User | null;
  isAuthenticated: boolean; // Useful for UI logic
  isLoading: boolean;
  error: string | null;
}

/**
 * @interface ApiError
 * Defines a standard shape for API error responses.
 */
interface ApiError {
    message: string;
}

// =================================================================
// INITIAL STATE
// =================================================================

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Use 'isLoading' for consistency
  error: null,
};


// =================================================================
// ASYNC THUNK
// =================================================================

/**
 * @function fetchUser
 * Fetches the currently authenticated user's profile data.
 * Assumes an endpoint like '/api/v1/me' exists for this purpose.
 */
export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "user/fetchUser", // Action type: 'sliceName/thunkName'
  async (_, thunkAPI) => {
    try {
      // Your backend login/register controllers use sendCookie which returns the user object.
      // We assume a dedicated endpoint '/me' to get the current user's data.
      const { data } = await axios.get<UserApiResponse>(
        `${process.env.NEXT_PUBLIC_MAIN_SERVER}/api/v1/me`, // **You will need to create this route**
        // { withCredentials: true }
      );
      return data.user; // Return the user object on success
    } catch (err) {
      const error = err as Error | AxiosError<ApiError>;
      let errorMessage = "Could not authenticate user.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || "An error occurred during authentication.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


// =================================================================
// SLICE DEFINITION
// =================================================================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Optional: A reducer to manually clear the user on logout
    logoutUser: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || "Authentication failed.";
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
