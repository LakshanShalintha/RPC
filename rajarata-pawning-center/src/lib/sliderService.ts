import { supabase, Slider } from './supabase'

export class SliderService {
  // Get all sliders ordered by order_index
  static async getAllSliders(): Promise<Slider[]> {
    const { data, error } = await supabase
      .from('sliders')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching sliders:', error)
      throw error
    }

    return data || []
  }

  // Add a new slider
  static async addSlider(imageFile: File): Promise<Slider | null> {
    try {
      console.log('Starting upload for file:', imageFile.name)
      
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `sliders/${fileName}`

      console.log('Uploading to path:', filePath)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('slider-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('slider-images')
        .getPublicUrl(filePath)

      console.log('Public URL:', urlData.publicUrl)

      // Get the current max order_index
      const { data: maxOrderData } = await supabase
        .from('sliders')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].order_index + 1 
        : 0

      console.log('Next order index:', nextOrderIndex)

      // Insert slider record
      const { data, error } = await supabase
        .from('sliders')
        .insert([
          {
            image_url: urlData.publicUrl,
            order_index: nextOrderIndex,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Database insert error:', error)
        throw new Error(`Database insert failed: ${error.message}`)
      }

      console.log('Slider created successfully:', data)
      return data
    } catch (error) {
      console.error('Error in addSlider:', error)
      throw error
    }
  }

  // Delete a slider
  static async deleteSlider(id: number, imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/slider-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('slider-images')
          .remove([`sliders/${filePath.split('/').pop()}`])

        if (storageError) {
          console.error('Storage delete error:', storageError)
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('sliders')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Database delete error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting slider:', error)
      throw error
    }
  }

  // Update slider order
  static async updateSliderOrder(sliderId: number, newOrderIndex: number): Promise<void> {
    const { error } = await supabase
      .from('sliders')
      .update({ order_index: newOrderIndex })
      .eq('id', sliderId)

    if (error) {
      console.error('Error updating slider order:', error)
      throw error
    }
  }

  // Reorder sliders
  static async reorderSliders(sliders: Array<{ id: number; order_index: number }>): Promise<void> {
    const updates = sliders.map((slider, index) =>
      supabase
        .from('sliders')
        .update({ order_index: index })
        .eq('id', slider.id)
    )

    await Promise.all(updates)
  }
}
