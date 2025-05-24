import { adminDb } from '../config/firebase';
import { collections } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';

export interface Content {
  id: string;
  title: string;
  slug: string;
  type: 'page' | 'article' | 'news';
  status: 'draft' | 'published' | 'archived';
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  tags: string[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export class ContentModel {
  private collection = adminDb.collection(collections.content);

  async create(data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    const contentRef = this.collection.doc();
    const now = new Date();
    
    const content: Content = {
      id: contentRef.id,
      ...data,
      createdAt: now,
      updatedAt: now
    };

    await contentRef.set(content);
    return content;
  }

  async findById(id: string): Promise<Content | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as Content) : null;
  }

  async findBySlug(slug: string): Promise<Content | null> {
    const snapshot = await this.collection.where('slug', '==', slug).limit(1).get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as Content);
  }

  async update(id: string, data: Partial<Content>): Promise<Content | null> {
    const contentRef = this.collection.doc(id);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return null;
    }

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    await contentRef.update(updateData);
    return (await contentRef.get()).data() as Content;
  }

  async delete(id: string): Promise<boolean> {
    const contentRef = this.collection.doc(id);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return false;
    }

    await contentRef.delete();
    return true;
  }

  async list(filters?: {
    type?: Content['type'];
    status?: Content['status'];
    author?: string;
    tag?: string;
  }): Promise<Content[]> {
    let query = this.collection;

    if (filters?.type) {
      query = query.where('type', '==', filters.type);
    }

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters?.author) {
      query = query.where('author', '==', filters.author);
    }

    if (filters?.tag) {
      query = query.where('tags', 'array-contains', filters.tag);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as Content);
  }

  async publish(id: string): Promise<Content | null> {
    const contentRef = this.collection.doc(id);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return null;
    }

    const now = new Date();
    await contentRef.update({
      status: 'published',
      publishedAt: now,
      updatedAt: now
    });

    return (await contentRef.get()).data() as Content;
  }

  async archive(id: string): Promise<Content | null> {
    const contentRef = this.collection.doc(id);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return null;
    }

    await contentRef.update({
      status: 'archived',
      updatedAt: new Date()
    });

    return (await contentRef.get()).data() as Content;
  }
} 