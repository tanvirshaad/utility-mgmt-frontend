import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <nav className="bg-white/95 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-indigo-600">
                            ⚡ Utility Management
                        </h2>
                        <ul className="flex gap-4">
                            <li>
                                <Link
                                    to="/"
                                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                >
                                    Calculate Bill
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                >
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="flex-1 p-4 sm:p-8">
                    <Routes>
                        <Route path="/" element={<UserPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </main>

                <footer className="bg-black/20 text-white text-center py-6">
                    <p>
                        &copy; 2025 Utility Management System. All rights
                        reserved.
                    </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
