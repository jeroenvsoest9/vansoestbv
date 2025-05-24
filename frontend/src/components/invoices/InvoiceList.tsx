import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    MenuItem,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Payment as PaymentIcon,
    NotificationAdd as ReminderIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';

const statusColors = {
    draft: 'default',
    sent: 'primary',
    paid: 'success',
    overdue: 'error',
    cancelled: 'error',
};

const InvoiceList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
    });

    // Fetch invoices with filters and pagination
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: pageSize.toString(),
                ...filters,
            });

            const response = await fetch(`/api/invoices?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch invoices');

            const data = await response.json();
            setInvoices(data.invoices);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            // TODO: Show error notification
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [page, pageSize, filters]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset to first page when filters change
    };

    const handleView = (id: string) => {
        navigate(`/invoices/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/invoices/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;

        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete invoice');

            fetchInvoices(); // Refresh list
            // TODO: Show success notification
        } catch (error) {
            console.error('Error deleting invoice:', error);
            // TODO: Show error notification
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'invoiceNumber',
            headerName: 'Invoice #',
            width: 130,
        },
        {
            field: 'client',
            headerName: 'Client',
            width: 200,
            valueGetter: (params) => params.row.client?.company || 'N/A',
        },
        {
            field: 'issueDate',
            headerName: 'Issue Date',
            width: 110,
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 110,
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: 'total',
            headerName: 'Amount',
            width: 130,
            valueFormatter: (params) => formatCurrency(params.value),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
                    color={statusColors[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleView(params.row._id)}>
                            <ViewIcon />
                        </IconButton>
                    </Tooltip>
                    {params.row.status !== 'paid' && (
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(params.row._id)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {user?.role === 'admin' && params.row.status === 'draft' && (
                        <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(params.row._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.status !== 'paid' && (
                        <Tooltip title="Add Payment">
                            <IconButton size="small" onClick={() => navigate(`/invoices/${params.row._id}/payment`)}>
                                <PaymentIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {['sent', 'overdue'].includes(params.row.status) && (
                        <Tooltip title="Send Reminder">
                            <IconButton size="small" onClick={() => navigate(`/invoices/${params.row._id}/reminder`)}>
                                <ReminderIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Invoices</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/invoices/new')}
                >
                    Create Invoice
                </Button>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                select
                                fullWidth
                                name="status"
                                label="Status"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="sent">Sent</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="overdue">Overdue</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                type="date"
                                fullWidth
                                name="startDate"
                                label="Start Date"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                type="date"
                                fullWidth
                                name="endDate"
                                label="End Date"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                type="number"
                                fullWidth
                                name="minAmount"
                                label="Min Amount"
                                value={filters.minAmount}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                type="number"
                                fullWidth
                                name="maxAmount"
                                label="Max Amount"
                                value={filters.maxAmount}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <DataGrid
                rows={invoices}
                columns={columns}
                getRowId={(row) => row._id}
                rowCount={totalPages * pageSize}
                loading={loading}
                pageSizeOptions={[5, 10, 25, 50]}
                paginationMode="server"
                paginationModel={{
                    page,
                    pageSize,
                }}
                onPaginationModelChange={(model) => {
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                disableRowSelectionOnClick
                autoHeight
            />
        </Box>
    );
};

export default InvoiceList; 