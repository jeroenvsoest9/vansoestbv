import { adminDb } from '../config/firebase';
import { collections } from '../config/firebase';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  target?: '_blank' | '_self';
  icon?: string;
  order: number;
  parent?: string;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export class MenuModel {
  private collection = adminDb.collection(collections.menus);

  async create(data: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>): Promise<Menu> {
    const menuRef = this.collection.doc();
    const now = new Date();

    const menu: Menu = {
      id: menuRef.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await menuRef.set(menu);
    return menu;
  }

  async findById(id: string): Promise<Menu | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as Menu) : null;
  }

  async findByLocation(location: string): Promise<Menu | null> {
    const snapshot = await this.collection.where('location', '==', location).limit(1).get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as Menu);
  }

  async update(id: string, data: Partial<Menu>): Promise<Menu | null> {
    const menuRef = this.collection.doc(id);
    const doc = await menuRef.get();

    if (!doc.exists) {
      return null;
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await menuRef.update(updateData);
    return (await menuRef.get()).data() as Menu;
  }

  async delete(id: string): Promise<boolean> {
    const menuRef = this.collection.doc(id);
    const doc = await menuRef.get();

    if (!doc.exists) {
      return false;
    }

    await menuRef.delete();
    return true;
  }

  async list(): Promise<Menu[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data() as Menu);
  }

  async addMenuItem(menuId: string, item: Omit<MenuItem, 'id'>): Promise<Menu | null> {
    const menuRef = this.collection.doc(menuId);
    const doc = await menuRef.get();

    if (!doc.exists) {
      return null;
    }

    const menu = doc.data() as Menu;
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      ...item,
    };

    menu.items.push(newItem);
    menu.updatedAt = new Date();

    await menuRef.update(menu);
    return menu;
  }

  async updateMenuItem(
    menuId: string,
    itemId: string,
    data: Partial<MenuItem>
  ): Promise<Menu | null> {
    const menuRef = this.collection.doc(menuId);
    const doc = await menuRef.get();

    if (!doc.exists) {
      return null;
    }

    const menu = doc.data() as Menu;
    const itemIndex = menu.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return null;
    }

    menu.items[itemIndex] = {
      ...menu.items[itemIndex],
      ...data,
    };
    menu.updatedAt = new Date();

    await menuRef.update(menu);
    return menu;
  }

  async deleteMenuItem(menuId: string, itemId: string): Promise<Menu | null> {
    const menuRef = this.collection.doc(menuId);
    const doc = await menuRef.get();

    if (!doc.exists) {
      return null;
    }

    const menu = doc.data() as Menu;
    menu.items = menu.items.filter((item) => item.id !== itemId);
    menu.updatedAt = new Date();

    await menuRef.update(menu);
    return menu;
  }

  async reorderItems(menuId: string, itemIds: string[]): Promise<Menu | null> {
    const menuRef = this.collection.doc(menuId);
    const doc = await menuRef.get();

    if (!doc.exists) {
      return null;
    }

    const menu = doc.data() as Menu;
    const items = [...menu.items];

    // Reorder items based on the provided order
    menu.items = itemIds
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean) as MenuItem[];
    menu.updatedAt = new Date();

    await menuRef.update(menu);
    return menu;
  }
}
