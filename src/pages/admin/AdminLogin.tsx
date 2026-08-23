import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Lock, Mail } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/xpzunayed/dashboard');
    } catch (error: any) {
      console.error('Login failed', error);
      alert(`Login Failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-8 text-center text-green-900 tracking-tight">ADMIN PORTAL</h1>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none" onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none" onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="w-full mt-8 py-3 bg-green-900 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors">SIGN IN</button>
      </form>
    </div>
  );
}
