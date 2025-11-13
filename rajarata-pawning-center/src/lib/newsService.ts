import { supabase } from './supabase'
import type { News } from './supabase'

export const NewsService = {
  async getAllNews(): Promise<News[]> {
    console.log('Fetching all news...')
    
    // Try to order by order_index first, fall back to date if column doesn't exist
    let { data, error } = await supabase
      .from('news')
      .select('*')
      .order('order_index', { ascending: true })

    // If error (likely column doesn't exist), try ordering by date
    if (error) {
      console.log('order_index column not found, falling back to date ordering')
      const result = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false })
      
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error fetching news:', error)
      throw error
    }

    console.log('News fetched successfully:', data?.length || 0)
    return data || []
  },

  async uploadImage(file: File): Promise<string> {
    console.log('Uploading image...')
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `news/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath)

    console.log('Image uploaded successfully:', publicUrl)
    return publicUrl
  },

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const urlParts = imageUrl.split('/storage/v1/object/public/news-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from('news-images').remove([filePath])
        console.log('Image deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      // Don't throw error, just log it
    }
  },

  async addNews(
    title: string,
    titleSi: string,
    description: string,
    descriptionSi: string,
    date: string,
    imageUrl?: string
  ): Promise<News> {
    console.log('Adding news...')

    // Try to get the max order_index and add 1
    let newOrderIndex = 0
    try {
      const { data: existingNews } = await supabase
        .from('news')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const maxOrderIndex = existingNews?.[0]?.order_index ?? -1
      newOrderIndex = maxOrderIndex + 1
    } catch (err) {
      console.log('order_index not available, using 0')
    }

    // Prepare insert data
    const insertData: any = {
      title,
      title_si: titleSi,
      description,
      description_si: descriptionSi,
      date,
      image_url: imageUrl || null
    }

    // Only add order_index if it's available in the table
    try {
      insertData.order_index = newOrderIndex
    } catch (err) {
      console.log('Skipping order_index')
    }

    const { data, error } = await supabase
      .from('news')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error adding news:', error)
      throw error
    }

    console.log('News added successfully:', data)
    return data
  },

  async updateNews(
    id: number,
    title: string,
    titleSi: string,
    description: string,
    descriptionSi: string,
    date: string,
    imageUrl?: string
  ): Promise<News> {
    console.log('Updating news:', id)

    const { data, error } = await supabase
      .from('news')
      .update({
        title,
        title_si: titleSi,
        description,
        description_si: descriptionSi,
        date,
        image_url: imageUrl || null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating news:', error)
      throw error
    }

    console.log('News updated successfully:', data)
    return data
  },

  async deleteNews(id: number): Promise<void> {
    console.log('Deleting news:', id)

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news:', error)
      throw error
    }

    console.log('News deleted successfully')
  },

  async updateOrderIndex(id: number, newOrderIndex: number): Promise<void> {
    console.log('Updating order index for news:', id, 'to:', newOrderIndex)

    const { error } = await supabase
      .from('news')
      .update({ order_index: newOrderIndex })
      .eq('id', id)

    if (error) {
      console.error('Error updating order index:', error)
      throw error
    }

    console.log('Order index updated successfully')
  },

  async moveNewsUp(id: number, currentOrderIndex: number): Promise<void> {
    console.log('Moving news up:', id)
    
    // Get all news ordered by order_index
    const { data: allNews, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .order('order_index', { ascending: true })

    if (fetchError) throw fetchError
    if (!allNews) return

    const currentIndex = allNews.findIndex(item => item.id === id)
    if (currentIndex <= 0) return // Already at top

    const previousItem = allNews[currentIndex - 1]
    
    // Swap order_index values
    await this.updateOrderIndex(id, previousItem.order_index)
    await this.updateOrderIndex(previousItem.id, currentOrderIndex)
  },

  async moveNewsDown(id: number, currentOrderIndex: number): Promise<void> {
    console.log('Moving news down:', id)
    
    // Get all news ordered by order_index
    const { data: allNews, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .order('order_index', { ascending: true })

    if (fetchError) throw fetchError
    if (!allNews) return

    const currentIndex = allNews.findIndex(item => item.id === id)
    if (currentIndex >= allNews.length - 1) return // Already at bottom

    const nextItem = allNews[currentIndex + 1]
    
    // Swap order_index values
    await this.updateOrderIndex(id, nextItem.order_index)
    await this.updateOrderIndex(nextItem.id, currentOrderIndex)
  }
}
