import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 1
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/jobs', jobData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/jobs/${id}`, jobData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.loading = false;
      })
      .addCase(fetchJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
      });
  }
});

export const { clearJob } = jobSlice.actions;
export default jobSlice.reducer;
