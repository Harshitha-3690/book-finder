import React, { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null); // 🔹 NEW

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Hide greeting after 20s
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() && !author.trim() && !subject.trim()) {
      setError("⚠️ Please enter at least one field before searching!");
      return;
    }

    setLoading(true);
    setBooks([]);
    setShowGreeting(false);

    try {
      let queryParts = [];
      if (title) queryParts.push(`${title}`);
      if (author) queryParts.push(`inauthor:${author}`);
      if (subject) queryParts.push(`subject:${subject}`);

      const query = queryParts.join("+");
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch {
      setError("❌ Something went wrong. Please try again!");
    }

    setLoading(false);
  };

  const handleClear = () => {
    setTitle("");
    setAuthor("");
    setSubject("");
    setBooks([]);
    setError("");
    setShowGreeting(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 flex flex-col transition-all duration-500">
      {/* Header */}
      <header className="py-3 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md flex justify-between items-center fixed w-full top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Book Finder Logo"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
          />
          <h1 className="text-xl md:text-2xl font-extrabold text-white drop-shadow-md">
            Book Finder
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-white text-2xl hover:scale-110 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow mt-24 px-6 pb-10 overflow-y-auto">
        {showGreeting && (
          <div className="flex justify-center mb-4 animate-fade-in">
            <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-md text-base font-semibold text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              👋 Welcome,{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Alex!
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center mb-3">
            <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded-md shadow-sm border border-red-300 dark:border-red-600 text-sm font-medium animate-pulse">
              {error}
            </div>
          </div>
        )}

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-3 transition-all"
        >
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="🔖 Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 p-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />
            <input
              type="text"
              placeholder="✍️ Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 p-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />
            <input
              type="text"
              placeholder="📂 Subject (e.g. Science, Romance)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 p-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />
          </div>

          <div className="flex gap-3 justify-center mt-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-md text-sm hover:from-indigo-600 hover:to-purple-700 transition transform hover:scale-105"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition transform hover:scale-105"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Book Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 max-w-5xl mx-auto">
          {books.map((book, i) => {
            const info = book.volumeInfo;
            return (
              <div
                key={i}
                onClick={() => setSelectedBook(info)} // 🔹 show modal
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-3 border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={
                    info.imageLinks?.thumbnail ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={info.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {info.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {info.authors?.join(", ") || "Unknown Author"}
                </p>
              </div>
            );
          })}
        </div>

        {!loading && books.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center mt-12 text-gray-500 dark:text-gray-400">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="no books"
              className="w-24 mb-4 opacity-80"
            />
            <p className="text-base font-medium">
              Start searching to discover amazing books! 🔍
            </p>
          </div>
        )}
      </main>

      {/* Modal for Book Details */}
      {selectedBook && (
        <div
          onClick={() => setSelectedBook(null)}
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-20 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full border border-gray-300 dark:border-gray-700"
          >
            <img
              src={
                selectedBook.imageLinks?.thumbnail ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={selectedBook.title}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {selectedBook.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {selectedBook.authors?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {selectedBook.description
                ? selectedBook.description.slice(0, 200) + "..."
                : "No description available."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedBook(null)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
              <a
                href={selectedBook.previewLink || selectedBook.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
