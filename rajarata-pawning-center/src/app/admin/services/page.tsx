'use client'

import { useState, useEffect } from 'react'
import { ServiceService } from '@/lib/serviceService'
import type { Service } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/useAdminAuth'

export default function ServicesManagementPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [titleSi, setTitleSi] = useState('')
  const [descriptionSi, setDescriptionSi] = useState('')
  
  // Popup messages
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupType, setPopupType] = useState<'success' | 'error' | 'loading'>('success')

  useEffect(() => {
    if (isAuthenticated) {
      loadServices()
    }
  }, [isAuthenticated])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await ServiceService.getAllServices()
      setServices(data)
    } catch (error) {
      console.error('Failed to load services:', error)
      showMessage('Failed to load services', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (message: string, type: 'success' | 'error' | 'loading') => {
    setPopupMessage(message)
    setPopupType(type)
    setShowPopup(true)
    if (type !== 'loading') {
      setTimeout(() => setShowPopup(false), 3000)
    }
  }

  const handleAddService = async () => {
    if (!title.trim()) {
      showMessage('Please enter a service title', 'error')
      return
    }

    try {
      showMessage('Adding service...', 'loading')
      await ServiceService.addService(title, description, titleSi, descriptionSi)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Service added successfully!', 'success')
      }, 100)
      await loadServices()
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to add service:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to add service', 'error')
      }, 100)
    }
  }

  const handleEditService = async () => {
    if (!editingService || !title.trim()) {
      showMessage('Please enter a service title', 'error')
      return
    }

    try {
      showMessage('Updating service...', 'loading')
      await ServiceService.updateService(editingService.id, title, description, titleSi, descriptionSi)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Service updated successfully!', 'success')
      }, 100)
      await loadServices()
      setShowEditModal(false)
      setEditingService(null)
      resetForm()
    } catch (error) {
      console.error('Failed to update service:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to update service', 'error')
      }, 100)
    }
  }

  const handleDeleteService = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      showMessage('Deleting service...', 'loading')
      await ServiceService.deleteService(id)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Service deleted successfully!', 'success')
      }, 100)
      await loadServices()
    } catch (error) {
      console.error('Failed to delete service:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to delete service', 'error')
      }, 100)
    }
  }

  const moveService = async (index: number, direction: 'up' | 'down') => {
    const newServices = [...services]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newServices.length) {
      return
    }

    // Swap
    const temp = newServices[index]
    newServices[index] = newServices[targetIndex]
    newServices[targetIndex] = temp

    setServices(newServices)

    try {
      await ServiceService.reorderServices(newServices)
      showMessage('Order updated!', 'success')
    } catch (error) {
      console.error('Failed to reorder:', error)
      showMessage('Failed to update order', 'error')
      await loadServices()
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setTitle(service.title)
    setDescription(service.description)
    setTitleSi(service.title_si || '')
    setDescriptionSi(service.description_si || '')
    setShowEditModal(true)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTitleSi('')
    setDescriptionSi('')
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingService(null)
    resetForm()
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Popup Message */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${
              popupType === 'success' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500' :
              popupType === 'error' ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500' :
              'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500'
            } rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in`}>
              <div className="flex flex-col items-center text-center">
                {popupType === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
                    <h3 className="text-2xl font-bold text-blue-200 mb-2">Processing...</h3>
                    <p className="text-blue-100">{popupMessage}</p>
                  </>
                ) : (
                  <>
                    <div className={`${
                      popupType === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                    } p-4 rounded-full mb-4`}>
                      <svg className={`w-16 h-16 ${
                        popupType === 'success' ? 'text-green-400' : 'text-red-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {popupType === 'success' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      popupType === 'success' ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {popupType === 'success' ? 'Success!' : 'Error!'}
                    </h3>
                    <p className={`mb-6 ${
                      popupType === 'success' ? 'text-green-100' : 'text-red-100'
                    }`}>{popupMessage}</p>
                    <button 
                      onClick={() => setShowPopup(false)} 
                      className={`${
                        popupType === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                      } text-white px-8 py-3 rounded-xl font-semibold transition-all`}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="bg-white/10 hover:bg-white/20 border border-yellow-300/30 rounded-xl p-3 transition-all group"
            title="Back to Admin Panel"
          >
            <svg className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Services Management</h1>
            <p className="text-amber-200">Manage your service offerings</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg"
          >
            + Add Service
          </button>
        </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {showEditModal ? 'Edit Service' : 'Add New Service'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title (English) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="e.g., Gold Loans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title (සිංහල) *
                  </label>
                  <input
                    type="text"
                    value={titleSi}
                    onChange={(e) => setTitleSi(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="උදා: රන් ණය"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="Service description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (සිංහල)
                  </label>
                  <textarea
                    value={descriptionSi}
                    onChange={(e) => setDescriptionSi(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="සේවාවේ විස්තරය..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={showEditModal ? handleEditService : handleAddService}
                className="flex-1 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              >
                {showEditModal ? 'Update' : 'Add'}
              </button>
              <button
                onClick={closeModals}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Total Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Active Services</p>
                <p className="text-2xl font-bold text-green-400">{services.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100 text-lg">No services yet. Add your first service!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white/5 border border-yellow-300/20 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-yellow-300 mb-1">{service.title}</h3>
                    <p className="text-amber-100 mt-1">{service.description || 'No description'}</p>
                    <p className="text-amber-200/50 text-xs mt-2">
                      Order: {service.order_index} • Created: {new Date(service.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => moveService(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveService(index, 'down')}
                      disabled={index === services.length - 1}
                      className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => openEditModal(service)}
                      className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id, service.title)}
                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
