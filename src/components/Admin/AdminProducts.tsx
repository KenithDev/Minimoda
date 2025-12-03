// ============================================
// ADMIN PRODUCTS COMPONENT
// ============================================

import { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import type { ProductoFormData } from '../../types';

export const AdminProducts = () => {
  const { productos, loading, agregarProducto, actualizarProducto, eliminarProducto } = useProducts();
  const { categorias } = useCategories();
  const toast = useToast();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoriaId: ''
  });

  const productosFiltrados = filtroCategoria
    ? productos.filter(p => p.categoriaId === filtroCategoria)
    : productos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoriaId) {
      toast.warning('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (editingId) {
        await actualizarProducto(editingId, formData);
        toast.success('Producto actualizado exitosamente');
        setEditingId(null);
      } else {
        await agregarProducto(formData);
        toast.success('Producto creado exitosamente');
      }
      
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        imagenUrl: '',
        categoriaId: ''
      });
    } catch (err) {
      toast.error('Error al guardar el producto. Por favor intenta nuevamente.');
    }
  };

  const handleEdit = (productoId: string) => {
    const producto = productos.find(p => p.idProducto === productoId);
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagenUrl: producto.imagenUrl,
        categoriaId: producto.categoriaId
      });
      setEditingId(productoId);
    }
  };

  const handleDelete = async (productoId: string) => {
    toast.confirm(
      '¿Deseas eliminar este producto?',
      async () => {
        try {
          await eliminarProducto(productoId);
          toast.success('Producto eliminado exitosamente');
        } catch (err) {
          toast.error('Error al eliminar el producto. Por favor intenta nuevamente.');
        }
      }
    );
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 max-w-[1920px]">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#5A4633] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
        <Package className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#5A4633]" />
        <span className="hidden xs:inline">Administrar Productos</span>
        <span className="xs:hidden">Productos</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:sticky lg:top-24 border border-gray-100">
            <h2 className="text-2xl font-black mb-8 text-[#5A4633] pb-4 border-b border-gray-100 flex items-center gap-3">
              {editingId ? (
                <>
                  <div className="bg-[#5A4633] p-2 rounded-lg">
                    <Edit2 className="w-6 h-6 text-white" />
                  </div>
                  <span>Editar Producto</span>
                </>
              ) : (
                <>
                  <div className="bg-[#5A4633] p-2 rounded-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span>Nuevo Producto</span>
                </>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5A4633]/10 focus:border-[#5A4633] transition-all bg-gray-50 focus:bg-white text-lg"
                  placeholder="Ej: Camiseta Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5A4633]/10 focus:border-[#5A4633] transition-all bg-gray-50 focus:bg-white resize-none text-base"
                  rows={4}
                  placeholder="Describe el producto..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3">
                    Precio (S/) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5A4633]/10 focus:border-[#5A4633] transition-all bg-gray-50 focus:bg-white font-mono text-lg"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5A4633]/10 focus:border-[#5A4633] transition-all bg-gray-50 focus:bg-white font-mono text-lg"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  URL de Imagen *
                </label>
                <input
                  type="url"
                  value={formData.imagenUrl}
                  onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5A4633]/10 focus:border-[#5A4633] transition-all bg-gray-50 focus:bg-white text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Categoría *
                </label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5A4633]/10 focus:border-[#5A4633] transition-all bg-gray-50 focus:bg-white text-lg appearance-none cursor-pointer"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6 space-y-5">
                <button
                  type="submit"
                  className="w-full bg-[#5A4633] text-white py-5 rounded-xl hover:bg-[#3D2F24] transition-all font-black text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                >
                  {editingId ? (
                    <>
                      <Edit2 className="w-6 h-6" />
                      Actualizar Producto
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Crear Producto
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        nombre: '',
                        descripcion: '',
                        precio: 0,
                        stock: 0,
                        imagenUrl: '',
                        categoriaId: ''
                      });
                    }}
                    className="w-full bg-gray-100 text-gray-600 py-4 rounded-xl hover:bg-gray-200 transition-all font-bold text-lg border-2 border-transparent hover:border-gray-300"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Tabla */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Filter className="w-5 h-5 text-[#5A4633]" />
                Filtrar por categoría
              </label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A4633] focus:border-[#5A4633] transition-all bg-white font-medium"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
              <table className="w-full">
                <thead className="bg-[#5A4633] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Imagen</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Precio</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Categoría</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {productosFiltrados.map((producto, index) => (
                    <tr key={producto.idProducto} className={`border-b-2 border-gray-100 hover:bg-[#F5EFE7] transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-6 py-4">
                        <img 
                          src={producto.imagenUrl} 
                          alt={producto.nombre}
                          className="w-16 h-16 object-cover rounded-lg shadow-md border-2 border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{producto.nombre}</td>
                      <td className="px-6 py-4 font-bold text-[#5A4633]">S/ {producto.precio}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${producto.stock > 10 ? 'bg-green-100 text-green-700' : producto.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          {producto.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {categorias.find(c => c.idCategoria === producto.categoriaId)?.nombre}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(producto.idProducto)}
                            className="px-4 py-2 bg-[#5A4633] text-white rounded-lg hover:bg-[#3D2F24] transition-all font-bold shadow-md text-sm flex items-center gap-1.5"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.idProducto)}
                            className="px-4 py-2 bg-white text-red-600 border-2 border-red-100 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 font-bold shadow-sm hover:shadow-md text-sm flex items-center gap-1.5 group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
