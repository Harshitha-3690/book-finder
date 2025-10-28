import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${query}`);
      const data = await res.json();
      setBooks(data.docs.slice(0, 10));
    } catch (err) {
      setError("Failed to fetch books. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📚 Book Finder</h1>

      <form onSubmit={searchBooks} className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Search for a book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && books.length === 0 && query && !error && (
        <p className="mt-4 text-gray-500">No books found.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full max-w-5xl">
        {books.map((book) => (
          <div key={book.key} className="bg-white p-4 shadow rounded-lg">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
              className="rounded-md mx-auto mb-3"
            />
            <h2 className="font-semibold text-lg">{book.title}</h2>
            <p className="text-sm text-gray-700">
              {book.author_name?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-gray-500 text-sm">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>

      <footer className="mt-10 text-gray-400 text-sm">
        Built by <span className="text-blue-600 font-medium">Alex</span> 💻
      </footer>
    </div>
  );
}

export default App;
