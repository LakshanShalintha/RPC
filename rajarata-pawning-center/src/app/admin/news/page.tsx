'use client'

import { useState, useEffect } from 'react'
import { NewsService } from '@/lib/newsService'
import type { News } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/useAdminAuth'

export default function NewsManagementPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [titleSi, setTitleSi] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionSi, setDescriptionSi] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Popup messages
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupType, setPopupType] = useState<'success' | 'error' | 'loading' | 'confirm'>('success')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadNews()
    }
  }, [isAuthenticated])

  const loadNews = async () => {
    try {
      setLoading(true)
      const data = await NewsService.getAllNews()
      setNewsList(data)
    } catch (error) {
      console.error('Failed to load news:', error)
      showMessage('Failed to load news', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (message: string, type: 'success' | 'error' | 'loading' | 'confirm') => {
    setPopupMessage(message)
    setPopupType(type)
    setShowPopup(true)
    if (type !== 'loading' && type !== 'confirm') {
      setTimeout(() => setShowPopup(false), 3000)
    }
  }

  const handleDeleteNews = (id: number) => {
    setDeleteConfirmId(id)
    showMessage('Are you sure you want to delete this news?', 'confirm')
  }

  const confirmDelete = async () => {
    if (deleteConfirmId === null) return

    try {
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Deleting news...', 'loading')
      }, 100)
      await NewsService.deleteNews(deleteConfirmId)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('News deleted successfully!', 'success')
      }, 100)
      await loadNews()
      setDeleteConfirmId(null)
    } catch (error) {
      console.error('Failed to delete news:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to delete news', 'error')
      }, 100)
    }
  }

  const cancelDelete = () => {
    setShowPopup(false)
    setDeleteConfirmId(null)
  }

  const handleAddNews = async () => {
    if (!title.trim() || !titleSi.trim()) {
      showMessage('Please enter news title in both languages', 'error')
      return
    }

    if (!description.trim() || !descriptionSi.trim()) {
      showMessage('Please enter news description in both languages', 'error')
      return
    }

    try {
      // Close modal first, then show loading
      setShowAddModal(false)
      setTimeout(() => {
        showMessage('Adding news...', 'loading')
      }, 100)
      
      let imageUrl = ''
      if (imageFile) {
        setUploadingImage(true)
        imageUrl = await NewsService.uploadImage(imageFile)
        setUploadingImage(false)
      }
      
      await NewsService.addNews(title, titleSi, description, descriptionSi, date, imageUrl)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('News added successfully!', 'success')
      }, 100)
      await loadNews()
      resetForm()
    } catch (error) {
      console.error('Failed to add news:', error)
      setUploadingImage(false)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to add news', 'error')
      }, 100)
    }
  }

  const handleEditNews = async () => {
    if (!editingNews || !title.trim() || !titleSi.trim()) {
      showMessage('Please enter news title in both languages', 'error')
      return
    }

    if (!description.trim() || !descriptionSi.trim()) {
      showMessage('Please enter news description in both languages', 'error')
      return
    }

    try {
      // Close modal first, then show loading
      setShowEditModal(false)
      setEditingNews(null)
      setTimeout(() => {
        showMessage('Updating news...', 'loading')
      }, 100)
      
      let imageUrl = editingNews.image_url || ''
      
      // If new image is uploaded
      if (imageFile) {
        setUploadingImage(true)
        // Delete old image if exists
        if (editingNews.image_url) {
          await NewsService.deleteImage(editingNews.image_url)
        }
        imageUrl = await NewsService.uploadImage(imageFile)
        setUploadingImage(false)
      }
      
      await NewsService.updateNews(editingNews.id, title, titleSi, description, descriptionSi, date, imageUrl)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('News updated successfully!', 'success')
      }, 100)
      await loadNews()
      resetForm()
    } catch (error) {
      console.error('Failed to update news:', error)
      setUploadingImage(false)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to update news', 'error')
      }, 100)
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (news: News) => {
    setEditingNews(news)
    setTitle(news.title)
    setTitleSi(news.title_si)
    setDescription(news.description)
    setDescriptionSi(news.description_si)
    setDate(news.date)
    setImagePreview(news.image_url || '')
    setImageFile(null)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setTitle('')
    setTitleSi('')
    setDescription('')
    setDescriptionSi('')
    setDate(new Date().toISOString().split('T')[0])
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Image size should be less than 5MB', 'error')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const handleMoveUp = async (news: News) => {
    if (!news.order_index && news.order_index !== 0) {
      showMessage('Order management not available. Please run the SQL to add order_index column.', 'error')
      return
    }
    try {
      showMessage('Moving news up...', 'loading')
      await NewsService.moveNewsUp(news.id, news.order_index)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('News moved up successfully!', 'success')
      }, 100)
      await loadNews()
    } catch (error) {
      console.error('Failed to move news up:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to move news up', 'error')
      }, 100)
    }
  }

  const handleMoveDown = async (news: News) => {
    if (!news.order_index && news.order_index !== 0) {
      showMessage('Order management not available. Please run the SQL to add order_index column.', 'error')
      return
    }
    try {
      showMessage('Moving news down...', 'loading')
      await NewsService.moveNewsDown(news.id, news.order_index)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('News moved down successfully!', 'success')
      }, 100)
      await loadNews()
    } catch (error) {
      console.error('Failed to move news down:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to move news down', 'error')
      }, 100)
    }
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingNews(null)
    resetForm()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-300"></div>
      </div>
    )
  }

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
              popupType === 'confirm' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500' :
              'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500'
            } rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in`}>
              <div className="flex flex-col items-center text-center">
                {popupType === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
                    <h3 className="text-2xl font-bold text-blue-200 mb-2">Processing...</h3>
                    <p className="text-blue-100">{popupMessage}</p>
                  </>
                ) : popupType === 'confirm' ? (
                  <>
                    <div className="bg-yellow-500/20 p-4 rounded-full mb-4">
                      <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-200 mb-2">Confirm Delete</h3>
                    <p className="text-yellow-100 mb-6">{popupMessage}</p>
                    <div className="flex gap-3 w-full">
                      <button 
                        onClick={cancelDelete}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                      >
                        Delete
                      </button>
                    </div>
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
            <h1 className="text-4xl font-bold mb-2">News Management</h1>
            <p className="text-amber-200">Manage news and announcements</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg"
          >
            + Add News
          </button>
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {showEditModal ? 'Edit News' : 'Add New News'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                      placeholder="News title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (සිංහල) *
                    </label>
                    <input
                      type="text"
                      value={titleSi}
                      onChange={(e) => setTitleSi(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                      placeholder="පුවත් ශීර්ෂය..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    News Image (Optional)
                  </label>
                  <div className="space-y-3">
                    {!imagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English) *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                      placeholder="News description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (සිංහල) *
                    </label>
                    <textarea
                      value={descriptionSi}
                      onChange={(e) => setDescriptionSi(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                      placeholder="පුවත් විස්තරය..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={showEditModal ? handleEditNews : handleAddNews}
                  disabled={uploadingImage}
                  className="flex-1 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : showEditModal ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={closeModals}
                  disabled={uploadingImage}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Total News</p>
                <p className="text-2xl font-bold">{newsList.length}</p>
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
                <p className="text-sm text-amber-200">Published</p>
                <p className="text-2xl font-bold text-green-400">{newsList.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-amber-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-amber-200 text-lg">No news yet. Add your first news!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsList.map((news, index) => (
                <div
                  key={news.id}
                  className="bg-white/5 border border-yellow-300/20 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      {news.image_url && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Image
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-yellow-300 mb-1">{news.title}</h3>
                    <p className="text-amber-100 mt-1">{news.description}</p>
                    <div className="mt-2 pt-2 border-t border-yellow-300/10">
                      <p className="text-amber-100 text-sm">{news.title_si}</p>
                    </div>
                    <p className="text-amber-200/50 text-xs mt-2">
                      Order: {news.order_index ?? 'N/A'} • Created: {new Date(news.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleMoveUp(news)}
                      disabled={index === 0}
                      className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveDown(news)}
                      disabled={index === newsList.length - 1}
                      className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => openEditModal(news)}
                      className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNews(news.id)}
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
