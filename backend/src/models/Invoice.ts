import { adminDb } from '../config/firebase';
import { collections } from '../config/firebase';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  userId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

export class InvoiceModel {
  private collection = adminDb.collection(collections.invoices);

  async create(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const invoiceRef = this.collection.doc();
    const now = new Date();

    const invoice: Invoice = {
      id: invoiceRef.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await invoiceRef.set(invoice);
    return invoice;
  }

  async findById(id: string): Promise<Invoice | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as Invoice) : null;
  }

  async findByNumber(number: string): Promise<Invoice | null> {
    const snapshot = await this.collection.where('number', '==', number).limit(1).get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as Invoice);
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice | null> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return null;
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await invoiceRef.update(updateData);
    return (await invoiceRef.get()).data() as Invoice;
  }

  async delete(id: string): Promise<boolean> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return false;
    }

    await invoiceRef.delete();
    return true;
  }

  async list(filters?: { userId?: string; status?: Invoice['status'] }): Promise<Invoice[]> {
    let query = this.collection;

    if (filters?.userId) {
      query = query.where('userId', '==', filters.userId);
    }

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as Invoice);
  }

  async markAsPaid(id: string): Promise<Invoice | null> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return null;
    }

    const now = new Date();
    await invoiceRef.update({
      status: 'paid',
      paidAt: now,
      updatedAt: now,
    });

    return (await invoiceRef.get()).data() as Invoice;
  }

  async markAsOverdue(id: string): Promise<Invoice | null> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return null;
    }

    await invoiceRef.update({
      status: 'overdue',
      updatedAt: new Date(),
    });

    return (await invoiceRef.get()).data() as Invoice;
  }

  async cancel(id: string): Promise<Invoice | null> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return null;
    }

    await invoiceRef.update({
      status: 'cancelled',
      updatedAt: new Date(),
    });

    return (await invoiceRef.get()).data() as Invoice;
  }

  async addItem(id: string, item: Omit<InvoiceItem, 'id'>): Promise<Invoice | null> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return null;
    }

    const invoice = doc.data() as Invoice;
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      ...item,
    };

    invoice.items.push(newItem);
    invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    invoice.total = invoice.subtotal + invoice.tax;
    invoice.updatedAt = new Date();

    await invoiceRef.update(invoice);
    return invoice;
  }

  async removeItem(id: string, itemId: string): Promise<Invoice | null> {
    const invoiceRef = this.collection.doc(id);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return null;
    }

    const invoice = doc.data() as Invoice;
    invoice.items = invoice.items.filter((item) => item.id !== itemId);
    invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    invoice.total = invoice.subtotal + invoice.tax;
    invoice.updatedAt = new Date();

    await invoiceRef.update(invoice);
    return invoice;
  }
}
