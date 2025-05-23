// src/app/data-delete/page.jsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DataDeletionPage from '@/components/UI/dataDeletion/data_deletion_page'
import ConfirmationModal from '@/components/modal/confirmation_modal'

export default function DataDeletePage() {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const handleDeleteAccount = async () => {
        try {
            if (!user) return false

            // 1. Delete user data from all tables
            const { error: profileError } = await supabase
                .from('all_profiles')
                .delete()
                .eq('user_id', user.id)

            if (profileError) throw profileError

            // 2. Delete auth user (requires service role key)
            const response = await fetch('/api/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            })

            if (!response.ok) {
                throw new Error('Failed to delete user account')
            }

            // 3. Sign out
            await supabase.auth.signOut()
            return true
        } catch (error) {
            console.error('Account deletion error:', error)
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
        return null // Redirect will happen automatically
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <DataDeletionPage
                    onDeleteInitiated={() => setIsModalOpen(true)}
                    user={user}
                />

                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleDeleteAccount}
                    title="Confirm Account Deletion"
                    message="This will permanently delete all your data. This action cannot be undone."
                    confirmButtonText="Delete Forever"
                    cancelButtonText="Cancel"
                    isConfirmButtonDanger
                />
            </div>
        </div>
    )
}