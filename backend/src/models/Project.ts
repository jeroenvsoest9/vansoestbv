import { adminDb } from '../config/firebase';

export interface Project {
  id: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  type: string;
  status: 'aanvraag' | 'bezig' | 'afgerond' | 'geannuleerd';
  answers: Record<string, string>;
  documents: {
    offerte?: string;
    calculatie?: string;
    planning?: string;
    materiaalstaat?: string;
    nacalculatie?: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  archived?: boolean;
}

function validateProjectData(data: Partial<Project>): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
  if (!data || typeof data !== 'object') throw new Error('Project data is required.');
  if (!data.client || typeof data.client !== 'object') throw new Error('Client info is required.');
  if (!data.client.name || !data.client.email || !data.client.phone) throw new Error('Client name, email, and phone are required.');
  if (!data.type || typeof data.type !== 'string') throw new Error('Project type is required.');
  if (!['aanvraag', 'bezig', 'afgerond', 'geannuleerd'].includes(data.status!)) throw new Error('Invalid status.');
  return {
    client: data.client,
    type: data.type,
    status: data.status!,
    answers: data.answers || {},
    documents: data.documents || {},
    archived: data.archived || false
  };
}

export class ProjectModel {
  private collection = adminDb.collection('projects');

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const validData = validateProjectData(data);
    const ref = this.collection.doc();
    const now = new Date();
    const project: Project = {
      id: ref.id,
      ...validData,
      createdAt: now,
      updatedAt: now
    };
    await ref.set(project);
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data() as Project;
    return data;
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    // Alleen toegestane velden updaten
    const allowedFields: (keyof Project)[] = [
      'client', 'type', 'status', 'answers', 'documents', 'archived'
    ];
    const updateData: Partial<Project> = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    updateData.updatedAt = new Date();
    const ref = this.collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new Error('Project not found.');
    await ref.update(updateData);
    const updatedDoc = await ref.get();
    return updatedDoc.exists ? (updatedDoc.data() as Project) : null;
  }
}