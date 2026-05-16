
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        if (email === 'u1@gmail.com' || email === 'u2@gmail.com') {
            if (password === '1234') {
                localStorage.setItem('profile', JSON.stringify({ email }));
                navigate('/dashboard/home');
            } else {
                alert('Invalid password, use "1234"');
            }
        } else {
            alert('Invalid email, use u1@gmail.com or u2@gmail.com');
        }

    };

    return (
        <div className="w-full flex items-center justify-center lg:h-screen max-sm:py-16">
            <div className="w-sm">
                <h2 className="text-3xl font-bold mb-14 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <label className="input validator h-12 w-full rounded-lg">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input className='text-lg font-medium text-gray-600' type="email" name="email" placeholder="u1@gmail.com" required defaultValue={"u1@gmail.com"} />
                        </label>
                    </div>
                    <div className="mb-10">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <label className="input validator h-12 w-full rounded-lg relative">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Password"
                                name="password"
                                defaultValue={"1234"}
                                className="w-full pr-10 text-lg font-medium text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <FaEye />
                                ) : (
                                    <FaEyeSlash />
                                )}
                            </button>
                        </label>
                    </div>
                    <div>
                        <button
                            className="bg-primary hover:bg-secondary w-full h-12 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;