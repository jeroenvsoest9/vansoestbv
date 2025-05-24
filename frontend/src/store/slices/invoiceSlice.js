import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunks for invoice actions
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get('/api/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post('/api/invoices', invoiceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoiceData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`/api/invoices/${id}`, invoiceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateInvoicePDF = createAsyncThunk(
  'invoices/generatePDF',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`/api/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the invoice slice
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    currentInvoice: null,
    isLoading: false,
    error: null,
    pdfGenerating: false
  },
  reducers: {
    clearInvoiceError: (state) => {
      state.error = null;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch invoices';
      })
      // Fetch Invoice By Id
      .addCase(fetchInvoiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch invoice';
      })
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create invoice';
      })
      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.invoices.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice && state.currentInvoice._id === action.payload._id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update invoice';
      })
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = state.invoices.filter(i => i._id !== action.payload);
        if (state.currentInvoice && state.currentInvoice._id === action.payload) {
          state.currentInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete invoice';
      })
      // Generate PDF
      .addCase(generateInvoicePDF.pending, (state) => {
        state.pdfGenerating = true;
        state.error = null;
      })
      .addCase(generateInvoicePDF.fulfilled, (state) => {
        state.pdfGenerating = false;
      })
      .addCase(generateInvoicePDF.rejected, (state, action) => {
        state.pdfGenerating = false;
        state.error = action.payload?.message || 'Failed to generate PDF';
      });
  }
});

export const { clearInvoiceError, clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer; 