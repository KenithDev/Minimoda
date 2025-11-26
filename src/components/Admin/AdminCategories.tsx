// ============================================
// ADMIN CATEGORIES COMPONENT
// ============================================

import { useState } from 'react';
import { FolderOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { useCategories } from '../../hooks';
import type { CategoriaFormData } from '../../types';

export const AdminCategories = () => {
  const { categorias, loading, agregarCategoria, actualizarCategoria, eliminarCategoria } = useCategories();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: '',
    descripcion: '',
    imagenUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.descripcion || !formData.imagenUrl) {
      alert('Completa todos los campos');
      return;
    }

    try {
      if (editingId) {
        await actualizarCategoria(editingId, formData);
        alert('Categoría actualizada exitosamente');
        setEditingId(null);
      } else {
        await agregarCategoria(formData);
        alert('Categoría creada exitosamente');
      }
      
      setFormData({
        nombre: '',
        descripcion: '',
        imagenUrl: ''
      });
    } catch (err) {
      alert('Error al guardar categoría');
    }
  };

  const handleEdit = (categoriaId: string) => {
    const categoria = categorias.find(c => c.idCategoria === categoriaId);
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        imagenUrl: categoria.imagenUrl
      });
      setEditingId(categoriaId);
    }
  };

  const handleDelete = async (categoriaId: string) => {
    if (confirm('¿Deseas eliminar esta categoría?')) {
      try {
        await eliminarCategoria(categoriaId);
        alert('Categoría eliminada exitosamente');
      } catch (err) {
        alert('Error al eliminar categoría');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 max-w-[1920px]">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
        <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
        <span className="hidden xs:inline">Administrar Categorías</span>
        <span className="xs:hidden">Categorías</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:sticky lg:top-24 border-2 border-gray-200">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 pb-3 sm:pb-4 border-b-2 border-blue-600 flex items-center gap-1.5 sm:gap-2">
              {editingId ? (
                <>
                  <Edit2 className="w-6 h-6 text-blue-600" />
                  Editar Categoría
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 text-blue-600" />
                  Nueva Categoría
                </>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ej: Ropa Deportiva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows={3}
                  placeholder="Describe la categoría..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  URL de Imagen *
                </label>
                <input
                  type="url"
                  value={formData.imagenUrl}
                  onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>

              {formData.imagenUrl && (
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img 
                    src={formData.imagenUrl} 
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                  />
                  <div className="bg-gray-50 px-3 py-2 text-center text-xs text-gray-600 font-medium">
                    Vista previa de la imagen
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md hover:shadow-lg transform active:scale-95"
              >
                {editingId ? ' Actualizar' : ' Crear'} Categoría
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      nombre: '',
                      descripcion: '',
                      imagenUrl: ''
                    });
                  }}
                  className="w-full bg-gray-500 text-white py-3.5 rounded-lg hover:bg-gray-600 transition-all font-bold shadow-md"
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Tabla */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-200">
              📋 Lista de Categorías ({categorias.length})
            </h3>
            
            <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Imagen</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Descripción</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {categorias.map((categoria, index) => (
                    <tr key={categoria.idCategoria} className={`border-b-2 border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono font-semibold">
                        {categoria.idCategoria.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <img 
                          src={categoria.imagenUrl} 
                          alt={categoria.nombre}
                          className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {categoria.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {categoria.descripcion}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(categoria.idCategoria)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md text-sm flex items-center gap-1.5"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(categoria.idCategoria)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold shadow-md text-sm flex items-center gap-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
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
