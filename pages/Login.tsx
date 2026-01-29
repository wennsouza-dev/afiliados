import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'wennsouza@gmail.com' && password === '220624') {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            setError('Credenciais inválidas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Acesso Administrativo</h2>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold h-11 rounded-lg hover:bg-blue-600 transition-colors mt-2"
                    >
                        Entrar
                    </button>
                </form>

                <button
                    onClick={() => navigate('/')}
                    className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-2"
                >
                    Voltar para Loja
                </button>
            </div>
        </div>
    );
};

export default Login;
