import type { ReactNode } from 'react';
import { GithubLogo, GoogleLogo } from '@phosphor-icons/react';
import { API_URL } from '@/lib/api';

// Cores extraídas do SVG do protótipo
const GREEN = '#00C68F';
const BG = '#FBFBFB';
const TEXT_DARK = '#1F2937';
const TEXT_MUTED = '#727272';

function startGithubLogin() {
  window.location.href = `${API_URL}/auth/github`;
}

function startGoogleLogin() {
  window.location.href = `${API_URL}/auth/google`;
}

export function LoginPage() {
  return (
    <>
      {/* ============================= Desktop ============================= */}
      <div
        className="hidden md:block relative min-h-screen w-full overflow-hidden"
        style={{ backgroundColor: BG }}
      >
        {/* Painel verde (≈28% da largura, do protótipo) */}
        <div
          className="absolute inset-y-0 left-0 w-[28%]"
          style={{ backgroundColor: GREEN }}
        />

        {/* Marca SiNutre — topo da área branca, alinhada à esquerda (logo após o painel verde) */}
        <h1
          className="absolute top-10 left-[30%] lg:top-12 z-20 text-5xl lg:text-6xl font-extrabold tracking-tight"
          style={{ color: GREEN }}
        >
          SiNutre
        </h1>

        {/* Prato com pílulas — sobrepõe a borda verde/branca (vai de 0% a ≈44%) */}
        <div
          className="absolute z-10 left-0 -translate-y-1/2"
          style={{ top: '57%', width: '44%' }}
        >
          <div className="relative aspect-[596/419]">
            <img
              src="/plate.png"
              alt="Prato com vitaminas, proteínas, carboidratos e gorduras"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <Pill className="top-[19%] left-[22%] -translate-x-1/2 -translate-y-1/2">
              Vitaminas
            </Pill>
            <Pill className="top-[19%] left-[83%] -translate-x-1/2 -translate-y-1/2">
              Proteínas
            </Pill>
            <Pill className="top-[78%] left-[19%] -translate-x-1/2 -translate-y-1/2">
              Carboidratos
            </Pill>
            <Pill className="top-[82%] left-[81%] -translate-x-1/2 -translate-y-1/2">
              Gorduras
            </Pill>
          </div>
        </div>

        {/* Conteúdo direito */}
        <div className="absolute inset-y-0 left-[44%] right-0 z-20 flex items-center justify-center px-6">
          <WelcomeBlock />
        </div>
      </div>

      {/* ============================= Mobile ============================= */}
      <div
        className="md:hidden min-h-screen flex flex-col"
        style={{ backgroundColor: BG }}
      >
        <header
          className="text-white px-6 pt-10 pb-8 flex flex-col items-center"
          style={{ backgroundColor: GREEN }}
        >
          <div className="relative w-[85%] max-w-sm aspect-[596/419]">
            <img
              src="/plate.png"
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            <Pill className="top-[19%] left-[22%] -translate-x-1/2 -translate-y-1/2 text-xs px-3 py-1">
              Vitaminas
            </Pill>
            <Pill className="top-[19%] left-[83%] -translate-x-1/2 -translate-y-1/2 text-xs px-3 py-1">
              Proteínas
            </Pill>
            <Pill className="top-[78%] left-[19%] -translate-x-1/2 -translate-y-1/2 text-xs px-3 py-1">
              Carboidratos
            </Pill>
            <Pill className="top-[82%] left-[81%] -translate-x-1/2 -translate-y-1/2 text-xs px-3 py-1">
              Gorduras
            </Pill>
          </div>
        </header>

        <main className="flex-1 flex flex-col px-6 py-8">
          <h1
            className="text-4xl font-extrabold tracking-tight mb-8"
            style={{ color: GREEN }}
          >
            SiNutre
          </h1>
          <div className="flex-1 flex items-center justify-center">
            <WelcomeBlock />
          </div>
        </main>
      </div>
    </>
  );
}

function WelcomeBlock() {
  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-sm w-full">
      <h2
        className="text-4xl lg:text-5xl font-bold"
        style={{ color: GREEN }}
      >
        Bem-vindo(a)!
      </h2>
      <p className="text-base lg:text-lg" style={{ color: TEXT_MUTED }}>
        Escolha como deseja acessar
        <br />
        sua conta.
      </p>
      
      {/* Container flex para empilhar os botões e deixá-los com a mesma largura */}
      <div className="flex flex-col gap-3 w-full max-w-[260px]">
        <button
          type="button"
          onClick={startGithubLogin}
          className="inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-white font-medium shadow-md transition-colors cursor-pointer"
          style={{ backgroundColor: TEXT_DARK }}
        >
          <GithubLogo size={22} weight="fill" />
          Entrar com Github
        </button>

        <button
          type="button"
          onClick={startGoogleLogin}
          className="inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-white font-medium shadow-md transition-colors cursor-pointer"
          style={{ backgroundColor: TEXT_DARK }}
        >
          <GoogleLogo size={22} weight="fill" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

function Pill({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`absolute bg-white font-medium rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] px-5 py-2 text-sm whitespace-nowrap ${className}`}
      style={{ color: TEXT_DARK }}
    >
      {children}
    </span>
  );
}