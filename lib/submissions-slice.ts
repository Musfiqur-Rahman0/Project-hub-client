import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  ApiError,
  createSubmission,
  getSubmissions,
  getSubmissionStats,
  reviewSubmission,
  type ProjectSubmission,
  type SubmissionPagination,
  type SubmissionRequest,
  type SubmissionSort,
  type SubmissionStats,
  type SubmissionStatus,
} from "@/lib/api";

type SubmissionsState = {
  items: ProjectSubmission[];
  pagination: SubmissionPagination | null;
  stats: SubmissionStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  reviewStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  statsError: string | null;
}

export type SubmissionRequestError = {
  message: string;
  details?: unknown;
};

const initialState: SubmissionsState = {
  items: [],
  pagination: null,
  stats: null,
  status: "idle",
  statsStatus: "idle",
  reviewStatus: "idle",
  error: null,
  statsError: null,
};

export const fetchSubmissions = createAsyncThunk<
  Awaited<ReturnType<typeof getSubmissions>>,
  {
    page: number;
    pageSize: number;
    status?: SubmissionStatus;
    search?: string;
    sort?: SubmissionSort;
  },
  { rejectValue: string }
>("submissions/fetch", async (params, { rejectWithValue }) => {
  try {
    return await getSubmissions(params);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to load submissions.",
    );
  }
});

export const fetchSubmissionStats = createAsyncThunk<
  SubmissionStats,
  void,
  { rejectValue: string }
>("submissions/fetchStats", async (_, { rejectWithValue }) => {
  try {
    return await getSubmissionStats();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to load submission stats.",
    );
  }
});

export const submitProject = createAsyncThunk<
  ProjectSubmission,
  SubmissionRequest,
  { rejectValue: SubmissionRequestError }
>("submissions/create", async (input, { rejectWithValue }) => {
  try {
    return await createSubmission(input);
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue({ message: error.message, details: error.details });
    }
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : "Unable to submit this project.",
    });
  }
});

export const saveSubmissionReview = createAsyncThunk<
  ProjectSubmission,
  { id: string; status: Exclude<SubmissionStatus, "PENDING">; feedback: string },
  { rejectValue: string }
>("submissions/review", async (input, { rejectWithValue }) => {
  try {
    return await reviewSubmission(input);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to save this review.",
    );
  }
});

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    clearSubmissions(state) {
      state.items = [];
      state.pagination = null;
      state.stats = null;
      state.status = "idle";
      state.statsStatus = "idle";
      state.reviewStatus = "idle";
      state.error = null;
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.items = action.payload.submissions;
        state.pagination = action.payload.pagination;
        state.status = "succeeded";
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load submissions.";
      })
      .addCase(fetchSubmissionStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(fetchSubmissionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.statsStatus = "succeeded";
      })
      .addCase(fetchSubmissionStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload ?? "Unable to load submission stats.";
      })
      .addCase(submitProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitProject.fulfilled, (state, action) => {
        state.items = [
          action.payload,
          ...state.items.filter((item) => item.id !== action.payload.id),
        ];
        state.status = "succeeded";
      })
      .addCase(submitProject.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ?? "Unable to submit this project.";
      })
      .addCase(saveSubmissionReview.pending, (state) => {
        state.reviewStatus = "loading";
        state.error = null;
      })
      .addCase(saveSubmissionReview.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
        state.reviewStatus = "succeeded";
      })
      .addCase(saveSubmissionReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.error = action.payload ?? "Unable to save this review.";
      });
  },
});

export const { clearSubmissions } = submissionsSlice.actions;
export default submissionsSlice.reducer;
