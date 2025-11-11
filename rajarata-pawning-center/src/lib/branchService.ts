import { supabase } from './supabase'
import type { Branch } from './supabase'

export const BranchService = {
  async getAllBranches(): Promise<Branch[]> {
    console.log('Fetching all branches...')
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching branches:', error)
      throw error
    }

    console.log('Branches fetched successfully:', data?.length || 0)
    return data || []
  },

  async addBranch(
    title: string, 
    description: string, 
    titleSi: string, 
    descriptionSi: string, 
    isComingSoon: boolean
  ): Promise<Branch> {
    console.log('Starting branch creation...')
    console.log('Title EN:', title)
    console.log('Description EN:', description)
    console.log('Title SI:', titleSi)
    console.log('Description SI:', descriptionSi)
    console.log('Is Coming Soon:', isComingSoon)

    // Get current max order_index
    const { data: existingBranches } = await supabase
      .from('branches')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex = existingBranches && existingBranches.length > 0 
      ? existingBranches[0].order_index + 1 
      : 0

    console.log('Next order index:', nextOrderIndex)

    // Insert into database
    const { data, error } = await supabase
      .from('branches')
      .insert({
        title,
        description,
        title_si: titleSi,
        description_si: descriptionSi,
        is_coming_soon: isComingSoon,
        order_index: nextOrderIndex
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating branch:', error)
      throw error
    }

    console.log('Branch created successfully:', data)
    return data
  },

  async updateBranch(
    id: number, 
    title: string, 
    description: string, 
    titleSi: string, 
    descriptionSi: string, 
    isComingSoon: boolean
  ): Promise<Branch> {
    console.log('Updating branch:', id)
    
    const { data, error } = await supabase
      .from('branches')
      .update({
        title,
        description,
        title_si: titleSi,
        description_si: descriptionSi,
        is_coming_soon: isComingSoon
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating branch:', error)
      throw error
    }

    console.log('Branch updated successfully:', data)
    return data
  },

  async deleteBranch(id: number): Promise<void> {
    console.log('Deleting branch:', id)

    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting branch:', error)
      throw error
    }

    console.log('Branch deleted successfully')
  },

  async reorderBranches(branches: Branch[]): Promise<void> {
    console.log('Reordering branches...')

    const updates = branches.map((branch, index) => ({
      id: branch.id,
      order_index: index
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('branches')
        .update({ order_index: update.order_index })
        .eq('id', update.id)

      if (error) {
        console.error('Error updating order:', error)
        throw error
      }
    }

    console.log('Branches reordered successfully')
  }
}
