import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  onClose: () => void;
  position?: { top: number; left: number };
}

const AuthModal = ({ onClose, position }: AuthModalProps) => {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(signupData.email, signupData.password);
      toast({
        title: "Success",
        description: "Account created successfully!"
      });
      onClose();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(signinData.email, signinData.password);
      toast({
        title: "Success",
        description: "Signed in successfully!"
      });
      onClose();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = position
    ? {
        position: 'absolute' as const,
        top: position.top,
        left: position.left,
        zIndex: 1000,
        transform: 'translate(-50%, 0)',
      }
    : {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
        style={modalStyle}
      >
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 text-lg font-medium ${tab === 'signup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 text-lg font-medium ${tab === 'signin' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('signin')}
          >
            Sign In
          </button>
        </div>
        {tab === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
              value={signupData.email}
              onChange={e => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
              value={signupData.password}
              onChange={e => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded px-3 py-2"
              value={signupData.confirmPassword}
              onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
              value={signinData.email}
              onChange={e => setSigninData({ ...signinData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
              value={signinData.password}
              onChange={e => setSigninData({ ...signinData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;