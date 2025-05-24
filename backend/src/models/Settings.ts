import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/database';

export interface ISettings {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  group?: string;
  createdAt: string;
  updatedAt: string;
}

export class Settings {
  static async create(data: Omit<ISettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<ISettings> {
    const settingsRef = doc(collection(db, 'settings'));
    const now = new Date().toISOString();
    const settings: ISettings = {
      id: settingsRef.id,
      ...data,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(settingsRef, settings);
    return settings;
  }

  static async findById(id: string): Promise<ISettings | null> {
    const settingsDoc = await getDoc(doc(db, 'settings', id));
    if (!settingsDoc.exists()) {
      return null;
    }
    return settingsDoc.data() as ISettings;
  }

  static async findByKey(key: string): Promise<ISettings | null> {
    const q = query(collection(db, 'settings'), where('key', '==', key));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot.docs[0].data() as ISettings;
  }

  static async update(id: string, data: Partial<ISettings>): Promise<ISettings | null> {
    const settingsRef = doc(db, 'settings', id);
    const settingsDoc = await getDoc(settingsRef);
    
    if (!settingsDoc.exists()) {
      return null;
    }

    const updates = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(settingsRef, updates);
    const updatedDoc = await getDoc(settingsRef);
    return updatedDoc.data() as ISettings;
  }

  static async findAll(options: {
    group?: string;
    type?: ISettings['type'];
  } = {}): Promise<ISettings[]> {
    const { group, type } = options;
    
    let q = query(collection(db, 'settings'));
    
    if (group) {
      q = query(q, where('group', '==', group));
    }
    
    if (type) {
      q = query(q, where('type', '==', type));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ISettings);
  }

  static async findByGroup(group: string): Promise<ISettings[]> {
    const q = query(collection(db, 'settings'), where('group', '==', group));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ISettings);
  }
} 