import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { products as staticProducts, categories as staticCategories, subcategories as staticSubcategories } from '../data/products';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Escutar mudancas na colecao products em tempo real
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Fallback para dados estaticos se Firestore estiver vazio
          setProducts(staticProducts.map((p, i) => ({ ...p, order: i, firestoreId: null })));
        } else {
          const firestoreProducts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            firestoreId: doc.id,
            id: doc.data().legacyId || doc.id,
          }));
          setProducts(firestoreProducts);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar produtos:', err);
        setError(err.message);
        // Fallback para dados estaticos em caso de erro
        setProducts(staticProducts.map((p, i) => ({ ...p, order: i, firestoreId: null })));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Categorias e subcategorias (usar dados estaticos, sao fixos)
  const categories = staticCategories;
  const subcategories = staticSubcategories;

  // Upload de imagem para Firebase Storage
  const uploadImage = useCallback(async (file) => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `products/${timestamp}_${safeName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }, []);

  // Adicionar produto — insere na posicao correta (junto com mesma categoria/subcategoria)
  const addProduct = useCallback(async (productData) => {
    // Encontrar o ultimo produto da mesma categoria+subcategoria
    let insertOrder = -1;
    for (let i = products.length - 1; i >= 0; i--) {
      if (products[i].category === productData.category && products[i].subcategory === productData.subcategory) {
        insertOrder = products[i].order ?? i;
        break;
      }
    }

    // Se nao encontrou mesma subcategoria, buscar ultimo da mesma categoria
    if (insertOrder === -1) {
      for (let i = products.length - 1; i >= 0; i--) {
        if (products[i].category === productData.category) {
          insertOrder = products[i].order ?? i;
          break;
        }
      }
    }

    // Se nao encontrou nada, vai pro final
    if (insertOrder === -1) {
      insertOrder = products.length > 0 ? Math.max(...products.map(p => p.order ?? 0)) : -1;
    }

    const newOrder = insertOrder + 1;

    // Empurrar todos os produtos com order >= newOrder para frente
    const batch = writeBatch(db);
    products.forEach(p => {
      if (p.firestoreId && (p.order ?? 0) >= newOrder) {
        batch.update(doc(db, 'products', p.firestoreId), { order: (p.order ?? 0) + 1 });
      }
    });

    const newProduct = {
      name: productData.name,
      description: productData.description || '',
      category: productData.category,
      subcategory: productData.subcategory,
      price: productData.price !== null && productData.price !== undefined && productData.price !== ''
        ? Number(productData.price)
        : null,
      unit: productData.unit || 'un',
      image: productData.image || '',
      order: newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(collection(db, 'products'));
    batch.set(docRef, newProduct);
    await batch.commit();
    return docRef.id;
  }, [products]);

  // Atualizar produto (aceita campos parciais)
  const updateProduct = useCallback(async (firestoreId, productData) => {
    const docRef = doc(db, 'products', firestoreId);

    const updates = { updatedAt: serverTimestamp() };

    if (productData.name !== undefined) updates.name = productData.name;
    if (productData.description !== undefined) updates.description = productData.description || '';
    if (productData.category !== undefined) updates.category = productData.category;
    if (productData.subcategory !== undefined) updates.subcategory = productData.subcategory;
    if (productData.unit !== undefined) updates.unit = productData.unit || 'un';
    if (productData.image !== undefined) updates.image = productData.image || '';
    if (productData.order !== undefined) updates.order = Number(productData.order);
    if (productData.outOfStock !== undefined) updates.outOfStock = !!productData.outOfStock;

    if (productData.price !== undefined) {
      updates.price = productData.price !== null && productData.price !== ''
        ? Number(productData.price)
        : null;
    }

    await updateDoc(docRef, updates);
  }, []);

  // Deletar produto
  const deleteProduct = useCallback(async (firestoreId) => {
    const docRef = doc(db, 'products', firestoreId);
    await deleteDoc(docRef);
  }, []);

  // Reordenar produtos
  const reorderProducts = useCallback(async (reorderedProducts) => {
    const batch = writeBatch(db);

    reorderedProducts.forEach((product, index) => {
      if (product.firestoreId) {
        const docRef = doc(db, 'products', product.firestoreId);
        batch.update(docRef, { order: index, updatedAt: serverTimestamp() });
      }
    });

    await batch.commit();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        subcategories,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        reorderProducts,
        uploadImage,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}
