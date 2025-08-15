import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// =================================================================
// INTERFACES & TYPES
// =================================================================

/**
 * @interface ImageAsset
 * Represents the structure for image objects (e.g., thumbnail, snapshots)
 * stored in the database and returned by the API.
 */
interface ImageAsset {
  public_id: string;
  url: string;
}

/**
 * @interface Project
 * Defines the shape of a single project object.
 * This should match the Mongoose schema on your backend.
 * I've added the 'snapshots' field which was missing.
 */
export interface Project {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  keyFeatures: string[];
  stack: string[];
  thumbnail: ImageAsset;
  snapshots: ImageAsset[]; // This was missing from your original interface
  githubLink: string;
  live: string;
  createdAt: string; // Timestamps are often useful on the frontend
  updatedAt: string;
}

/**
 * @interface ProjectsApiResponse
 * Defines the shape of the successful response from your `getAllProject` controller.
 * Your API returns a pagination object, not just an array of projects.
 */
interface ProjectsApiResponse {
  success: boolean;
  totalProjects: number;
  totalPages: number;
  currentPage: number;
  projects: Project[];
}

/**
 * @interface ProjectsState
 * Defines the shape of the Redux slice's state.
 * It includes pagination data to properly manage the API response.
 */
interface ProjectsState {
  projects: Project[];
  totalProjects: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * @interface ApiError
 * Defines a standard shape for API error responses for predictable error handling.
 */
interface ApiError {
    message: string;
    // You can add other fields your ErrorHandler might return
    // success: false;
    // statusCode: number;
}


// =================================================================
// INITIAL STATE
// =================================================================

const initialState: ProjectsState = {
  projects: [], // Initialize with an empty array for easier mapping in components
  totalProjects: 0,
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
};


// =================================================================
// ASYNC THUNK
// =================================================================

/**
 * @function fetchProjects
 * Fetches projects from the API.
 * It's typed for better safety:
 * - First generic: The type of the successful return value (ProjectsApiResponse).
 * - Second generic: The type of the argument passed to the thunk (void, as it takes no args).
 * - Third generic: The configuration for thunkAPI, specifying the reject value type.
 */
export const fetchProjects = createAsyncThunk<ProjectsApiResponse, number | void, { rejectValue: string }>(
  "projects/fetchProjects", // Action type prefix: 'sliceName/thunkName'
  async (page, thunkAPI) => {
    try {
      // The backend returns a data object. We destructure it here.
      const pageNumber = page || 1;
      const { data } = await axios.get<ProjectsApiResponse>(
        // Using a placeholder for the environment variable for clarity
        `${process.env.NEXT_PUBLIC_MAIN_SERVER}/api/v1/projects?page=${pageNumber}`,
        // { withCredentials: true }
      );
      return data; // This will be the `action.payload` in the `fulfilled` case
    } catch (err) {
      const error = err as Error | AxiosError<ApiError>;
      let errorMessage = "An unexpected error occurred.";

      // Check if it's an Axios error with a response from the server
      if (axios.isAxiosError(error) && error.response) {
        // Use the error message from your backend's ErrorHandler
        errorMessage = error.response.data.message || "Server error.";
      } else if (error instanceof Error) {
        // Handle non-Axios errors (e.g., network issues)
        errorMessage = error.message;
      }

      // The returned value will be the `action.payload` in the `rejected` case
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


// =================================================================
// SLICE DEFINITION
// =================================================================

const projectsSlice = createSlice({
  // Renamed from 'products' to 'projects' for consistency
  name: "projects",
  initialState,
  // No synchronous reducers needed for this example
  reducers: {},
  // Handles actions from async thunks
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors on a new request
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<ProjectsApiResponse>) => {
          state.isLoading = false;
          // The payload is the entire API response object
          state.projects = action.payload.projects;
          state.totalProjects = action.payload.totalProjects;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        // The payload is the string returned from `rejectWithValue`
        state.error = action.payload || "Something went wrong.";
      });
  },
});

// Export the reducer to be added to the store
export default projectsSlice.reducer;
