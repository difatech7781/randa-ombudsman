// app/(auth)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  Globe, 
  RefreshCw 
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({ q: "", a: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 1. SIMPLE CAPTCHA LOGIC: Pencegahan Bot Otomatis
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ q: `${num1} + ${num2}`, a: num1 + num2 });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Captcha sebelum hit API
    if (parseInt(captchaInput) !== captchaQuestion.a) {
      alert("Captcha salah. Silakan coba lagi.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setIsLoading(false);
        alert("Kredensial Salah. Periksa email @ombudsman.go.id Anda.");
        generateCaptcha();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 selection:bg-indigo-100">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100">
        
        {/* HEADER: Brand Authority */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck className="w-9 h-9 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">RANDA AUTH</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Internal Access Control</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                placeholder="Email Resmi"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 2. SECURITY COMPONENT: Human Verification */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-900 uppercase italic tracking-tighter">Captcha: {captchaQuestion.q} =</span>
              <button type="button" onClick={generateCaptcha} className="text-indigo-400 hover:text-indigo-600">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <input 
              type="number" 
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-16 p-2 text-center bg-white border border-indigo-200 rounded-xl text-sm font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-400" 
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 uppercase text-xs tracking-widest disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Enter Dashboard"}
          </button>
        </form>

        {/* 3. SSO INTEGRATION: Government Standards */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-slate-400 bg-white px-4 italic tracking-widest">Atau SSO Login</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => signIn('google')} 
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-2xl text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-tighter group"
          >
            <Globe className="w-3 h-3 text-rose-500 group-hover:animate-pulse" /> Google SSO
          </button>
          <button 
            type="button"
            onClick={() => signIn('azure-ad')} 
            className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-2xl text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-tighter group"
          >
            <KeyRound className="w-3 h-3 text-blue-500 group-hover:animate-pulse" /> Office 365
          </button>
        </div>

        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed italic">
          Authorized Personnel Only.<br/>Every access is logged by DifaTech Security System.
        </p>
      </div>
    </div>
  );
}