import { View, Image, ScrollView } from 'react-native'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '~/lib/supabase'
import { toast } from 'sonner-native'


const Test = () => {
    const [images, setImages] = React.useState<string[]>([]) // Local URIs
    const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]) // Public URLs
    const [isUploading, setIsUploading] = React.useState(false)

    async function uploadImageToSupabase(uri: string) {
        try {
            console.log('Starting upload for:', uri)

            // Fetch the image as blob
            const response = await fetch(uri)
            const blob = await response.blob()


            // Generate unique filename - get extension from blob type instead of URI
            const blobType = blob.type || 'image/jpeg'
            const extension = blobType.split('/')[1] || 'jpg'
            const fileName = `${Date.now()}.${extension}`
            const filePath = `${fileName}`

            console.log('Uploading to path:', filePath)
            console.log('extension', extension)
            console.log('fileName', fileName)
            console.log('blob type:', blobType)

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('images')
                .upload(filePath, blob, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (error) {
                console.error('Supabase upload error:', error)
                return null
            }

            console.log('Upload successful:', data)

            // Get public URL
            const { data: publicData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath)

            console.log('Public URL:', publicData.publicUrl)
            return publicData.publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            return null
        }
    }

    async function pickAndUploadImage() {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            toast.error('Permission denied', {
                description: 'We need camera roll permissions to upload images.',
            })
            return
        }

        // Pick image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.8,
        })

        if (result.canceled) {
            return
        }

        const imageUri = result.assets[0].uri
        console.log('Image selected:', imageUri)

        // Add to display
        setImages([...images, imageUri])

        // Upload
        setIsUploading(true)
        toast.loading('Uploading image...', {
            description: 'Please wait...',
        })

        const url = await uploadImageToSupabase(imageUri)

        setIsUploading(false)
        toast.dismiss()

        if (url) {
            setUploadedUrls([...uploadedUrls, url])
            toast.success('Image uploaded!', {
                description: 'Image successfully uploaded to Supabase.',
            })
        } else {
            toast.error('Upload failed', {
                description: 'Failed to upload image. Check console for details.',
            })
        }
    }

    return (
        <ScrollView className="flex-1 p-4">
            <View className="gap-4">
                <Text className="text-2xl font-bold">Image Upload Test</Text>

                <Button onPress={pickAndUploadImage} disabled={isUploading}>
                    <Text>{isUploading ? 'Uploading...' : 'Pick & Upload Image'}</Text>
                </Button>

                <View className="gap-2">
                    <Text className="font-semibold">Selected Images ({images.length}):</Text>
                    {images.map((uri, index) => (
                        <View key={index} className="gap-1">
                            <Image
                                source={{ uri }}
                                className="w-full h-48 rounded-lg"
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </View>

                <View className="gap-2 mt-4">
                    <Text className="font-semibold">Uploaded URLs ({uploadedUrls.length}):</Text>
                    {uploadedUrls.map((url, index) => (
                        <View key={index} className="gap-1">
                            <Image
                                source={{ uri: url }}
                                className="w-full h-48 rounded-lg"
                                resizeMode="cover"
                            />
                            <Text className="text-xs text-blue-500" selectable>
                                {url}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default Test