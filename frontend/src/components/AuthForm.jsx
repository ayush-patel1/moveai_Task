import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * AuthForm Component
 * Split-screen login/register form
 */
function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (!formData.name.trim()) {
                    throw new Error('Name is required');
                }
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                await register(formData.name, formData.email, formData.password);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="auth-split-container">
            {/* Left Panel - Branding */}
            <div className="auth-left-panel">
                <div className="auth-brand">
                    <div className="auth-brand-icon">📋</div>
                    <h1>{isLogin ? 'WELCOME BACK!' : 'JOIN US TODAY!'}</h1>
                    <p>
                        {isLogin
                            ? 'Enter your credentials to continue managing your tasks'
                            : 'Create an account and start organizing your life'
                        }
                    </p>
                </div>
                <div className="auth-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
                {/* Wavy Separator */}
                <div className="auth-wave">
                    <svg viewBox="0 0 100 600" preserveAspectRatio="none">
                        <path d="M0,0 C30,100 70,200 40,300 C10,400 60,500 30,600 L100,600 L100,0 Z" fill="var(--color-bg)" />
                    </svg>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="auth-right-panel">
                <div className="auth-form-container">
                    <h2>{isLogin ? 'SIGN IN' : 'SIGN UP'}</h2>
                    <p className="auth-form-subtitle">
                        {isLogin ? 'to access the task portal' : 'to create your account'}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="auth-input-group">
                                <span className="auth-input-icon">👤</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter Your Name"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="auth-input-group">
                            <span className="auth-input-icon">✉️</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email Address"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-input-group">
                            <span className="auth-input-icon">🔒</span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                        <button type="button" onClick={toggleMode} className="auth-switch-btn">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
