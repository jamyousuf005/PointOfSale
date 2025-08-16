import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both fields");
      return;
    }

    // try {
    //   const res = await fetch(`http://localhost:8001/api/users/login`,{
    //     method:"POST",
    //     headers:{"Content-Type":"application/json"},
    //     body: JSON.stringify({email,password})
    //   })
    //    const data = await res.json()

    //    if(res.ok){
    //       alert('logoin sucessful')
    //       navigate('/dashboard')
    //    }else{
    //             alert(data.msg || "Login failed. Please check your credentials.");
    //    }
    // }catch(err){
    //   console.error('Network or other error during login:', err);

    // }

  

    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/Register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
