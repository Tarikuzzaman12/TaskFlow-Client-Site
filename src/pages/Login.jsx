import  { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../provider/AuthProvider.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { sendPasswordResetEmail } from 'firebase/auth';
// import { auth } from '../Firebase/firebaseConfig';

const Login = () => {
    const { googleSignIn, loginWithEmailPassword, setUser } = useContext(AuthContext);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef();
    const navigate = useNavigate();

    // Handle Forgot Password
    // const handleForgetPassword = () => {
    //     const email = emailRef.current.value; 
    //     if (!email) {
    //         toast.warning('Please provide a valid email address!');
    //     } else {
    //         sendPasswordResetEmail(auth, email)
    //             .then(() => {
    //                 toast.success('Password reset email sent! Check your inbox.');
    //             })
    //             .catch((error) => {
    //                 toast.error(`Error: ${error.message}`);
    //             });
    //     }
    // };

    // Handle Login
    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Email and password validation
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
                setUser(res.user);
                toast.success('Login successful!');
                e.target.reset();
                navigate('/');
            })
            .catch((error) => {
                const errorMessage = error.message;
                toast.error(`Login failed: ${errorMessage}`);
            });
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left"></div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form onSubmit={handleLogin} className="card-body">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
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
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
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
                            onClick={googleSignIn}
                            className="btn btn-outline mt-4 text-green-500 items-center"
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