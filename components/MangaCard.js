import Link from 'next/link'

export default function MangaCard({ manga, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Cover Image */}
      <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
        {manga.cover_image ? (
          <>
            <img 
              src={manga.cover_image} 
              alt={manga.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="hidden group-hover:flex absolute inset-0 bg-black/40 items-center justify-center gap-2">
              <Link href={`/manga/${manga.id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  View
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📖</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">{manga.title}</h3>
        
        {/* Author */}
        {manga.author && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">by {manga.author}</p>
        )}

        {/* Description */}
        {manga.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {manga.description}
          </p>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            manga.status === 'ongoing'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : manga.status === 'completed'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
          }`}>
            {manga.status === 'ongoing' ? '▶️' : '✓'} {manga.status}
          </span>
          
          {/* Actions */}
          <div className="flex gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(manga.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                title="Delete manga"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
