export default function MangaCard({ manga, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
        {manga.cover_image ? (
          <img src={manga.cover_image} alt={manga.title} className="w-full h-full object-cover rounded" />
        ) : (
          <span className="text-gray-500">No Cover</span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{manga.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{manga.description?.substring(0, 100)}...</p>
      <p className="text-xs text-gray-500 mb-3">By {manga.author || 'Unknown'}</p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          manga.status === 'ongoing'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {manga.status}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(manga.id)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
