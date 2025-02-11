// src/app/categories/page.jsx
import CategoryUI from '@/components/UI/categoryUI';

export const metadata = {
  title: 'Categories | Bandhit',
  description: 'Discover events by category on Bandhit'
};

export default function CategoriesPage() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white`}>
      <CategoryUI />
    </main>
  );
}