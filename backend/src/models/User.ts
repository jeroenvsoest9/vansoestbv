import { adminDb } from '../config/firebase';
import { collections } from '../config/firebase';

export interface User {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  private collection = adminDb.collection(collections.users);

  async create(data: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const userRef = this.collection.doc(data.uid);
    const now = new Date();

    const user: User = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await userRef.set(user);
    return user;
  }

  async findById(uid: string): Promise<User | null> {
    const doc = await this.collection.doc(uid).get();
    return doc.exists ? (doc.data() as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).limit(1).get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as User);
  }

  async update(uid: string, data: Partial<User>): Promise<User | null> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return null;
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await userRef.update(updateData);
    return (await userRef.get()).data() as User;
  }

  async delete(uid: string): Promise<boolean> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return false;
    }

    await userRef.delete();
    return true;
  }

  async list(filters?: { role?: User['role']; status?: User['status'] }): Promise<User[]> {
    let query = this.collection;

    if (filters?.role) {
      query = query.where('role', '==', filters.role);
    }

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as User);
  }

  async updateLastLogin(uid: string): Promise<void> {
    await this.collection.doc(uid).update({
      lastLogin: new Date(),
      updatedAt: new Date(),
    });
  }
}
