// ============================================
// FIREBASE API - Real backend with Firestore
// ============================================

import type { 
  Categoria, 
  Producto, 
  CarritoItem, 
  ProductoFormData, 
  CategoriaFormData 
} from '../types';
import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  COLLECTIONS
} from './firebase';

// ============================================
// CATEGORÍAS API
// ============================================

export const categoriasApi = {
  async getAll(): Promise<Categoria[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIAS));
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Categoria, 'idCategoria'>;
      return {
        idCategoria: doc.id,
        ...data
      };
    });
  },

  async create(categoria: CategoriaFormData): Promise<Categoria> {
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIAS), {
      ...categoria,
      createdAt: new Date().toISOString()
    });
    
    return {
      idCategoria: docRef.id,
      ...categoria
    };
  },

  async update(id: string, categoria: Partial<CategoriaFormData>): Promise<Categoria> {
    const docRef = doc(db, COLLECTIONS.CATEGORIAS, id);
    await updateDoc(docRef, {
      ...categoria,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data() as Omit<Categoria, 'idCategoria'>;
    return {
      idCategoria: id,
      ...data
    };
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIAS, id));
  }
};

// ============================================
// PRODUCTOS API
// ============================================

export const productosApi = {
  async getAll(): Promise<Producto[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTOS));
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Producto, 'idProducto'>;
      return {
        idProducto: doc.id,
        ...data
      };
    });
  },

  async getById(id: string): Promise<Producto | null> {
    const docRef = doc(db, COLLECTIONS.PRODUCTOS, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Producto, 'idProducto'>;
      return {
        idProducto: docSnap.id,
        ...data
      };
    }
    return null;
  },

  async getByCategoria(categoriaId: string): Promise<Producto[]> {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTOS), 
      where('categoriaId', '==', categoriaId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Producto, 'idProducto'>;
      return {
        idProducto: doc.id,
        ...data
      };
    });
  },

  async create(producto: ProductoFormData): Promise<Producto> {
    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTOS), {
      ...producto,
      createdAt: new Date().toISOString()
    });
    
    return {
      idProducto: docRef.id,
      ...producto
    };
  },

  async update(id: string, producto: Partial<ProductoFormData>): Promise<Producto> {
    const docRef = doc(db, COLLECTIONS.PRODUCTOS, id);
    await updateDoc(docRef, {
      ...producto,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data() as Omit<Producto, 'idProducto'>;
    return {
      idProducto: id,
      ...data
    };
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTOS, id));
  },

  async updateStock(id: string, cantidad: number): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PRODUCTOS, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentStock = (docSnap.data() as Producto).stock;
      await updateDoc(docRef, {
        stock: currentStock + cantidad
      });
    }
  }
};

// ============================================
// CARRITO API
// ============================================

export const carritoApi = {
  async getAll(userId: string): Promise<CarritoItem[]> {
    const q = query(
      collection(db, COLLECTIONS.CARRITO),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<CarritoItem, 'id'>;
      return {
        id: doc.id,
        ...data
      };
    });
  },

  async add(userId: string, productoId: string, cantidad: number = 1): Promise<CarritoItem> {
    // Buscar si ya existe
    const q = query(
      collection(db, COLLECTIONS.CARRITO),
      where('userId', '==', userId),
      where('productoId', '==', productoId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Actualizar cantidad existente
      const existingDoc = snapshot.docs[0];
      const currentData = existingDoc.data() as CarritoItem;
      const newCantidad = currentData.cantidad + cantidad;
      
      await updateDoc(doc(db, COLLECTIONS.CARRITO, existingDoc.id), {
        cantidad: newCantidad
      });
      
      return {
        id: existingDoc.id,
        userId,
        productoId,
        cantidad: newCantidad
      };
    } else {
      // Crear nuevo
      const docRef = await addDoc(collection(db, COLLECTIONS.CARRITO), {
        userId,
        productoId,
        cantidad
      });
      
      return {
        id: docRef.id,
        userId,
        productoId,
        cantidad
      };
    }
  },

  async updateCantidad(id: string, cantidad: number): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.CARRITO, id), {
      cantidad
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CARRITO, id));
  },

  async clear(userId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTIONS.CARRITO),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
  }
};
