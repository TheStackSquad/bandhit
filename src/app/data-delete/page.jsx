// src/app/data-delete/page.jsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DataDeletionPage from '@/components/UI/dataDeletion/data_deletion_page'

export default function DataDeletePage() {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
                if (!user) {
                    router.push('/login?redirect=/data-delete')
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                router.push('/login?redirect=/data-delete')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [supabase.auth, router])

    const handleDataDeletion = async () => {
        try {
            if (!user) return

            // Add any additional pre-deletion logic here
            console.log('Initiating data deletion for user:', user.id)

            // The actual deletion will be handled by the subcomponent
            return true
        } catch (error) {
            console.error('Data deletion preparation failed:', error)
            return false
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
                <p className="text-gray-600 mb-6">
                    You must be logged in to delete your data. Redirecting to login page...
                </p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <DataDeletionPage
                    onDeleteInitiated={handleDataDeletion}
                    user={user}
                />
            </div>
        </div>
    )
}