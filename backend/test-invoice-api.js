import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';
let token = null;
let invoiceId = null;

const testInvoiceAPI = async () => {
  try {
    // Login first to get token
    console.log('Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!',
      }),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Login failed: ${errorText}`);
    }

    const loginData = await loginResponse.json();
    token = loginData.token;
    console.log('Login successful');

    // Create a test invoice
    console.log('\nCreating test invoice...');
    const invoiceData = {
      project: '65f1a5b3e214f12345678901', // Replace with actual project ID
      type: 'invoice',
      status: 'draft',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          description: 'Test Item',
          quantity: 2,
          unit: 'hours',
          unitPrice: 100,
          vatRate: 21,
        },
      ],
      paymentTerms: '30 days',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountHolder: 'Test Company',
        bankName: 'Test Bank',
        iban: 'NL91ABNA0417164300',
        bic: 'ABNANL2A',
      },
    };

    const createResponse = await fetch(`${API_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create invoice: ${errorText}`);
    }

    const createdInvoice = await createResponse.json();
    invoiceId = createdInvoice._id;
    console.log('Invoice created:', createdInvoice.invoiceNumber);

    // Get invoice list
    console.log('\nFetching invoice list...');
    const listResponse = await fetch(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!listResponse.ok) throw new Error('Failed to fetch invoices');
    const invoices = await listResponse.json();
    console.log('Invoices fetched:', invoices.invoices.length, 'invoices found');

    // Get single invoice
    console.log('\nFetching single invoice...');
    const getResponse = await fetch(`${API_URL}/invoices/${invoiceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!getResponse.ok) throw new Error('Failed to fetch invoice');
    const invoice = await getResponse.json();
    console.log('Invoice fetched:', invoice.invoiceNumber);

    // Update invoice
    console.log('\nUpdating invoice...');
    const updateResponse = await fetch(`${API_URL}/invoices/${invoiceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'sent',
        notes: 'Test note added',
      }),
    });

    if (!updateResponse.ok) throw new Error('Failed to update invoice');
    const updatedInvoice = await updateResponse.json();
    console.log('Invoice updated:', updatedInvoice.status);

    // Add payment
    console.log('\nAdding payment...');
    const paymentResponse = await fetch(`${API_URL}/invoices/${invoiceId}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: 100,
        method: 'bank_transfer',
        reference: 'TEST-001',
      }),
    });

    if (!paymentResponse.ok) throw new Error('Failed to add payment');
    const invoiceWithPayment = await paymentResponse.json();
    console.log('Payment added:', invoiceWithPayment.payments.length, 'payments recorded');

    // Send reminder
    console.log('\nSending reminder...');
    const reminderResponse = await fetch(`${API_URL}/invoices/${invoiceId}/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'first',
        notes: 'Test reminder',
      }),
    });

    if (!reminderResponse.ok) throw new Error('Failed to send reminder');
    const invoiceWithReminder = await reminderResponse.json();
    console.log('Reminder sent:', invoiceWithReminder.reminders.length, 'reminders recorded');

    // Get statistics
    console.log('\nFetching statistics...');
    const statsResponse = await fetch(`${API_URL}/invoices/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!statsResponse.ok) throw new Error('Failed to fetch statistics');
    const stats = await statsResponse.json();
    console.log('Statistics fetched:', stats);

    // Delete invoice
    console.log('\nDeleting invoice...');
    const deleteResponse = await fetch(`${API_URL}/invoices/${invoiceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!deleteResponse.ok) throw new Error('Failed to delete invoice');
    console.log('Invoice deleted successfully');

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      const errorBody = await error.response.text();
      console.error('Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        body: errorBody,
      });
    }
    process.exit(1);
  }
};

// First create a test user if it doesn't exist
const createTestUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('User already exists or error:', errorText);
    } else {
      console.log('Test user created successfully');
    }
  } catch (error) {
    console.error('Failed to create test user:', error.message);
  }
};

// Run the tests
createTestUser().then(() => testInvoiceAPI());
