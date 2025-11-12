import { supabase } from './supabase'
import type { Service } from './supabase'

export const ServiceService = {
  async getAllServices(): Promise<Service[]> {
    console.log('Fetching all services...')
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
      throw error
    }

    console.log('Services fetched successfully:', data?.length || 0)
    return data || []
  },

  async addService(
    title: string, 
    description: string, 
    titleSi: string, 
    descriptionSi: string
  ): Promise<Service> {
    console.log('Starting service creation...')
    console.log('Title EN:', title)
    console.log('Description EN:', description)
    console.log('Title SI:', titleSi)
    console.log('Description SI:', descriptionSi)

    // Get current max order_index
    const { data: existingServices } = await supabase
      .from('services')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex = existingServices && existingServices.length > 0 
      ? existingServices[0].order_index + 1 
      : 0

    console.log('Next order index:', nextOrderIndex)

    // Insert into database
    const { data, error } = await supabase
      .from('services')
      .insert({
        title,
        description,
        title_si: titleSi,
        description_si: descriptionSi,
        order_index: nextOrderIndex
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating service:', error)
      throw error
    }

    console.log('Service created successfully:', data)
    return data
  },

  async updateService(
    id: number, 
    title: string, 
    description: string, 
    titleSi: string, 
    descriptionSi: string
  ): Promise<Service> {
    console.log('Updating service:', id)
    
    const { data, error } = await supabase
      .from('services')
      .update({
        title,
        description,
        title_si: titleSi,
        description_si: descriptionSi
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating service:', error)
      throw error
    }

    console.log('Service updated successfully:', data)
    return data
  },

  async deleteService(id: number): Promise<void> {
    console.log('Deleting service:', id)

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting service:', error)
      throw error
    }

    console.log('Service deleted successfully')
  },

  async reorderServices(services: Service[]): Promise<void> {
    console.log('Reordering services...')

    const updates = services.map((service, index) => ({
      id: service.id,
      order_index: index
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('services')
        .update({ order_index: update.order_index })
        .eq('id', update.id)

      if (error) {
        console.error('Error updating order:', error)
        throw error
      }
    }

    console.log('Services reordered successfully')
  }
}
