import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../provider/AuthProvider.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { googleSignIn, loginWithEmailPassword, setUser } = useContext(AuthContext);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {user}=useContext(AuthContext)
    const emailRef = useRef();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!/(?=.*[A-Z])/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/(?=.*[a-z])/.test(password)) {
            setPasswordError('Password must contain at least one lowercase letter.');
            return;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }
        setPasswordError('');

        loginWithEmailPassword(email, password)
            .then((res) => {
                const loggedInUser = res.user;
                setUser(loggedInUser);
                saveUserToDatabase(loggedInUser); // Database-এ পাঠানো
                toast.success('Login successful!');
                e.target.reset();
                navigate('/');
            })
            .catch((error) => {
                toast.error(`Login failed: ${error.message}`);
            });
    };

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then((res) => {
                const googleUser = res.user;
                setUser(googleUser);
                saveUserToDatabase(googleUser); // Google user-ও database-এ পাঠানো
                toast.success('Google Sign-In successful!');
                navigate('/');
            })
            .catch((error) => {
                toast.error(`Google Sign-In failed: ${error.message}`);
            });
    };

    // User Data Save Function
    const saveUserToDatabase = () => {
        const userData = {
            name: user.displayName || 'Unnamed User',
            email: user.email,
            photoURL: user.photoURL || '',
            lastLogin: new Date().toISOString(),
        };
    
        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })
        .then(res => res.json())
        .then(data => {
            console.log('User save response:', data);
        })
        .catch(err => {
            console.error('Failed to save user:', err);
        });
    };
    

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
                    <form onSubmit={handleLogin} className="card-body">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <div className="form-control">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                ref={emailRef}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control relative">
                            <label className="label">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                name="password"
                                className="input input-bordered"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-10"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary w-full">Login</button>
                        </div>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="btn btn-outline mt-4 flex items-center gap-2"
                        >
                            <FcGoogle /> Sign in with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
