import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    Edit as EditIcon,
    PictureAsPdf as PdfIcon,
    Send as SendIcon,
    Payment as PaymentIcon,
    NotificationAdd as ReminderIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const statusColors = {
    draft: 'default',
    sent: 'primary',
    paid: 'success',
    overdue: 'error',
    cancelled: 'error',
};

// PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 100,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    table: {
        marginTop: 20,
        marginBottom: 20,
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 5,
    },
    col1: { width: '40%' },
    col2: { width: '10%' },
    col3: { width: '10%' },
    col4: { width: '20%' },
    col5: { width: '20%' },
    totals: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
});

// PDF Document component
const InvoicePDF = ({ invoice }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Invoice #{invoice.invoiceNumber}</Text>
                
                <View style={styles.row}>
                    <Text style={styles.label}>Issue Date:</Text>
                    <Text style={styles.value}>{formatDate(invoice.issueDate)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Due Date:</Text>
                    <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>From:</Text>
                    <Text>Your Company Name</Text>
                    <Text>Your Address</Text>
                    <Text>Your City, Country</Text>
                    <Text>VAT: Your VAT Number</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>To:</Text>
                    <Text>{invoice.client.company}</Text>
                    <Text>{invoice.client.billingAddress.street}</Text>
                    <Text>{`${invoice.client.billingAddress.zipCode} ${invoice.client.billingAddress.city}`}</Text>
                    <Text>{`VAT: ${invoice.client.vatNumber}`}</Text>
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>Description</Text>
                    <Text style={styles.col2}>Quantity</Text>
                    <Text style={styles.col3}>Unit</Text>
                    <Text style={styles.col4}>Unit Price</Text>
                    <Text style={styles.col5}>Total</Text>
                </View>
                {invoice.items.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.col1}>{item.description}</Text>
                        <Text style={styles.col2}>{item.quantity}</Text>
                        <Text style={styles.col3}>{item.unit}</Text>
                        <Text style={styles.col4}>{formatCurrency(item.unitPrice)}</Text>
                        <Text style={styles.col5}>{formatCurrency(item.total)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.totals}>
                <View style={styles.row}>
                    <Text style={styles.label}>Subtotal:</Text>
                    <Text style={styles.value}>
                        {formatCurrency(invoice.items.reduce((sum, item) => sum + item.subtotal, 0))}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>VAT:</Text>
                    <Text style={styles.value}>
                        {formatCurrency(invoice.items.reduce((sum, item) => sum + item.vatAmount, 0))}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={{ ...styles.label, fontSize: 14, fontWeight: 'bold' }}>Total:</Text>
                    <Text style={{ ...styles.value, fontSize: 14, fontWeight: 'bold' }}>
                        {formatCurrency(invoice.items.reduce((sum, item) => sum + item.total, 0))}
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 40 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Payment Details:</Text>
                <Text>{`Account Holder: ${invoice.bankDetails.accountHolder}`}</Text>
                <Text>{`Bank: ${invoice.bankDetails.bankName}`}</Text>
                <Text>{`IBAN: ${invoice.bankDetails.iban}`}</Text>
                <Text>{`BIC: ${invoice.bankDetails.bic}`}</Text>
            </View>

            {invoice.notes && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notes:</Text>
                    <Text>{invoice.notes}</Text>
                </View>
            )}
        </Page>
    </Document>
);

const InvoiceView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showReminderDialog, setShowReminderDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [reminderNote, setReminderNote] = useState('');

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/invoices/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch invoice');
                const data = await response.json();
                setInvoice(data);
            } catch (error) {
                console.error('Error fetching invoice:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handleAddPayment = async () => {
        try {
            const response = await fetch(`/api/invoices/${id}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    amount: Number(paymentAmount),
                    date: new Date().toISOString(),
                    method: 'bank_transfer',
                }),
            });

            if (!response.ok) throw new Error('Failed to add payment');

            const updatedInvoice = await response.json();
            setInvoice(updatedInvoice);
            setShowPaymentDialog(false);
            setPaymentAmount('');
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };

    const handleSendReminder = async () => {
        try {
            const response = await fetch(`/api/invoices/${id}/reminders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    type: 'reminder',
                    notes: reminderNote,
                }),
            });

            if (!response.ok) throw new Error('Failed to send reminder');

            const updatedInvoice = await response.json();
            setInvoice(updatedInvoice);
            setShowReminderDialog(false);
            setReminderNote('');
        } catch (error) {
            console.error('Error sending reminder:', error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (!invoice) return <Typography>Invoice not found</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">
                    Invoice #{invoice.invoiceNumber}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {invoice.status !== 'paid' && (
                        <>
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/invoices/${id}/edit`)}
                            >
                                Edit
                            </Button>
                            <Button
                                startIcon={<PaymentIcon />}
                                onClick={() => setShowPaymentDialog(true)}
                            >
                                Add Payment
                            </Button>
                            {['sent', 'overdue'].includes(invoice.status) && (
                                <Button
                                    startIcon={<ReminderIcon />}
                                    onClick={() => setShowReminderDialog(true)}
                                >
                                    Send Reminder
                                </Button>
                            )}
                        </>
                    )}
                    <Button
                        startIcon={<PdfIcon />}
                        onClick={() => setShowPdf(true)}
                    >
                        View PDF
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        disabled={invoice.status !== 'draft'}
                        onClick={() => {/* TODO: Implement send functionality */}}
                    >
                        Send
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Invoice Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Status</Typography>
                                    <Chip
                                        label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        color={statusColors[invoice.status] || 'default'}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Type</Typography>
                                    <Typography>{invoice.type}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Issue Date</Typography>
                                    <Typography>{formatDate(invoice.issueDate)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Due Date</Typography>
                                    <Typography>{formatDate(invoice.dueDate)}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Client Details
                            </Typography>
                            <Typography>{invoice.client.company}</Typography>
                            <Typography>{invoice.client.billingAddress.street}</Typography>
                            <Typography>
                                {invoice.client.billingAddress.zipCode} {invoice.client.billingAddress.city}
                            </Typography>
                            <Typography>{invoice.client.billingAddress.country}</Typography>
                            <Typography>VAT: {invoice.client.vatNumber}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Items
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Unit</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">VAT Rate</TableCell>
                                        <TableCell align="right">VAT Amount</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{item.unit}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                                            <TableCell align="right">{item.vatRate}%</TableCell>
                                            <TableCell align="right">{formatCurrency(item.vatAmount)}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography>
                                    Subtotal: {formatCurrency(invoice.items.reduce((sum, item) => sum + item.subtotal, 0))}
                                </Typography>
                                <Typography>
                                    VAT: {formatCurrency(invoice.items.reduce((sum, item) => sum + item.vatAmount, 0))}
                                </Typography>
                                <Typography variant="h6">
                                    Total: {formatCurrency(invoice.items.reduce((sum, item) => sum + item.total, 0))}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {invoice.payments?.length > 0 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Payments
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Method</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell>Reference</TableCell>
                                            <TableCell>Notes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.payments.map((payment, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{formatDate(payment.date)}</TableCell>
                                                <TableCell>{payment.method}</TableCell>
                                                <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                                                <TableCell>{payment.reference}</TableCell>
                                                <TableCell>{payment.notes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {invoice.notes && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Notes
                                </Typography>
                                <Typography>{invoice.notes}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
                <DialogTitle>Add Payment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddPayment} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Reminder Dialog */}
            <Dialog open={showReminderDialog} onClose={() => setShowReminderDialog(false)}>
                <DialogTitle>Send Reminder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Note"
                        multiline
                        rows={4}
                        fullWidth
                        value={reminderNote}
                        onChange={(e) => setReminderNote(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowReminderDialog(false)}>Cancel</Button>
                    <Button onClick={handleSendReminder} variant="contained">Send</Button>
                </DialogActions>
            </Dialog>

            {/* PDF Dialog */}
            <Dialog
                open={showPdf}
                onClose={() => setShowPdf(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Invoice PDF</DialogTitle>
                <DialogContent>
                    <PDFViewer width="100%" height={600}>
                        <InvoicePDF invoice={invoice} />
                    </PDFViewer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPdf(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceView; 