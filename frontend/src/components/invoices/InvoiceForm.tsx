import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Divider,
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatters";

interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  total: number;
}

interface InvoiceFormData {
  project: string;
  type: "invoice" | "credit_note" | "proforma" | "quote";
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  paymentTerms: string;
  paymentMethod: "bank_transfer" | "credit_card" | "cash" | "other";
  notes: string;
  bankDetails: {
    accountHolder: string;
    bankName: string;
    iban: string;
    bic: string;
  };
}

const defaultItem: InvoiceItem = {
  description: "",
  quantity: 1,
  unit: "hours",
  unitPrice: 0,
  vatRate: 21,
  vatAmount: 0,
  subtotal: 0,
  total: 0,
};

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState<InvoiceFormData>({
    project: "",
    type: "invoice",
    status: "draft",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [{ ...defaultItem }],
    paymentTerms: "30 days",
    paymentMethod: "bank_transfer",
    notes: "",
    bankDetails: {
      accountHolder: "",
      bankName: "",
      iban: "",
      bic: "",
    },
  });

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  // Fetch invoice data if editing
  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch invoice");
        const data = await response.json();
        setFormData({
          ...data,
          issueDate: data.issueDate.split("T")[0],
          dueDate: data.dueDate.split("T")[0],
        });
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const calculateItemTotals = (item: InvoiceItem): InvoiceItem => {
    const subtotal = item.quantity * item.unitPrice;
    const vatAmount = subtotal * (item.vatRate / 100);
    return {
      ...item,
      subtotal,
      vatAmount,
      total: subtotal + vatAmount,
    };
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    newItems[index] = calculateItemTotals(newItems[index]);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...defaultItem }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save invoice");

      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
      setError("Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">
          {id ? "Edit Invoice" : "Create Invoice"}
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/invoices")}>
          Cancel
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Project"
                    value={formData.project}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project: e.target.value,
                      })
                    }
                    required
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                      })
                    }
                    required
                  >
                    <MenuItem value="invoice">Invoice</MenuItem>
                    <MenuItem value="credit_note">Credit Note</MenuItem>
                    <MenuItem value="proforma">Proforma</MenuItem>
                    <MenuItem value="quote">Quote</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    required
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Issue Date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        issueDate: e.target.value,
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dueDate: e.target.value,
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payment Terms"
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentTerms: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Payment Method"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as any,
                      })
                    }
                    required
                  >
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Bank Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Holder"
                    value={formData.bankDetails.accountHolder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: {
                          ...formData.bankDetails,
                          accountHolder: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={formData.bankDetails.bankName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: {
                          ...formData.bankDetails,
                          bankName: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IBAN"
                    value={formData.bankDetails.iban}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: {
                          ...formData.bankDetails,
                          iban: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="BIC/SWIFT"
                    value={formData.bankDetails.bic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: {
                          ...formData.bankDetails,
                          bic: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6">Invoice Items</Typography>
                <Button startIcon={<AddIcon />} onClick={addItem}>
                  Add Item
                </Button>
              </Box>

              {formData.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        label="Unit"
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unitPrice",
                            Number(e.target.value),
                          )
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="VAT %"
                        value={item.vatRate}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "vatRate",
                            Number(e.target.value),
                          )
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Subtotal"
                        value={item.subtotal}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Total"
                        value={item.total}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Subtotal:{" "}
                  {formatCurrency(
                    formData.items.reduce(
                      (sum, item) => sum + item.subtotal,
                      0,
                    ),
                  )}
                </Typography>
                <Typography variant="subtitle1">
                  VAT:{" "}
                  {formatCurrency(
                    formData.items.reduce(
                      (sum, item) => sum + item.vatAmount,
                      0,
                    ),
                  )}
                </Typography>
                <Typography variant="h6">
                  Total:{" "}
                  {formatCurrency(
                    formData.items.reduce((sum, item) => sum + item.total, 0),
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {id ? "Update Invoice" : "Create Invoice"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/invoices")}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceForm;
