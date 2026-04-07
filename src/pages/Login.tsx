import { useState, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const { user, signIn, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer login.'
      if (msg.includes('Invalid login')) {
        setError('Email ou senha incorretos.')
      } else {
        setError(msg)
      }
    }
  }

  return (
    <div className="h-screen w-screen bg-[#F5F4F1] flex items-center justify-center">
      {/* Background sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#E8E5E0]/50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-8">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#1C1B1A] rounded-sm flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tighter">L</span>
            </div>
            <span className="text-[#1C1B1A] font-light text-sm tracking-[0.3em] uppercase">
              Lovelo
            </span>
          </div>
          <h1 className="text-[#1C1B1A] text-2xl font-light tracking-[0.15em] uppercase mb-2">
            Design Studio
          </h1>
          <p className="text-[#A8A49E] text-xs tracking-widest uppercase">
            Plataforma de criação de peças esportivas
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white border border-[#E8E5E0] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#8A8580] text-xs tracking-widest uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#F5F4F1] border border-[#E8E5E0] rounded-xl px-4 py-3 text-[#1C1B1A] text-sm placeholder:text-[#C8C5BF] focus:outline-none focus:border-[#A8A49E] transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-[#8A8580] text-xs tracking-widest uppercase mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#F5F4F1] border border-[#E8E5E0] rounded-xl px-4 py-3 text-[#1C1B1A] text-sm placeholder:text-[#C8C5BF] focus:outline-none focus:border-[#A8A49E] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C1B1A] hover:bg-[#2D2C2B] disabled:bg-[#E8E5E0] disabled:text-[#A8A49E] text-white font-semibold text-sm tracking-widest uppercase py-3 rounded-xl transition-colors mt-2 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#C8C5BF] text-xs mt-8">
          © {new Date().getFullYear()} Lovelo Design Studio. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
