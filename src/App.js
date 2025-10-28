import React, { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  // Persist theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Hide greeting after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBooks([]);

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
    } catch (error) {
      console.error("Error fetching books:", error);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setTitle("");
    setAuthor("");
    setSubject("");
    setBooks([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-500">
      {/* Header */}
      <header className="py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md text-center flex justify-between px-6 items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md flex items-center gap-2">
          📚 Book Finder
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-white text-2xl hover:scale-110 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* ✨ Greeting */}
      {showGreeting && (
        <div className="flex justify-center mt-8 animate-fade-in">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-md text-lg font-semibold text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
            👋 Welcome, <span className="text-indigo-600 dark:text-indigo-400">Alex!</span>
          </div>
        </div>
      )}

      {/* Search Box */}
      <form
        onSubmit={handleSearch}
        className="max-w-4xl w-11/12 mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 mt-8 rounded-2xl shadow-lg space-y-4 border border-gray-200 dark:border-gray-700 transition"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="🔖 Search by Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 p-3 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="✍️ Search by Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 p-3 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="📂 Search by Subject (e.g. Science, Romance)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 p-3 rounded-md focus:ring-2 focus:ring-indigo-400 md:col-span-2 focus:outline-none"
          />
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition transform hover:scale-105"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition transform hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="grid gap-8 mt-10 px-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto pb-12">
        {books.map((book, i) => {
          const info = book.volumeInfo;
          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <img
                src={
                  info.imageLinks?.thumbnail ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt={info.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {info.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {info.authors?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">
                  {info.description || "No description available."}
                </p>
                {info.publishedDate && (
                  <p className="text-xs text-gray-400 mt-2">
                    Published: {info.publishedDate}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && books.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500 dark:text-gray-400">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="no books"
            className="w-28 mb-4 opacity-80"
          />
          <p className="text-lg font-medium">
            Start searching to discover amazing books! 🔍
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 dark:text-gray-400 mt-auto">
        Built with ❤️ using <span className="font-semibold">React</span> &{" "}
        <span className="font-semibold">TailwindCSS</span>
      </footer>
    </div>
  );
}

export default App;
