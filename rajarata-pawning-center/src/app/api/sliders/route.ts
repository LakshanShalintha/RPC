import { NextRequest, NextResponse } from 'next/server'
import { SliderService } from '@/lib/sliderService'

// GET - Fetch all sliders
export async function GET() {
  try {
    const sliders = await SliderService.getAllSliders()
    return NextResponse.json({ success: true, data: sliders })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sliders' },
      { status: 500 }
    )
  }
}

// POST - Add new slider (if you want to use API instead of direct client calls)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const slider = await SliderService.addSlider(file)
    return NextResponse.json({ success: true, data: slider })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add slider' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a slider
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const imageUrl = searchParams.get('imageUrl')

    if (!id || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    await SliderService.deleteSlider(parseInt(id), imageUrl)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete slider' },
      { status: 500 }
    )
  }
}
