import { List, SignOut } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  drawerId: string;
  userName: string;
  avatarUrl: string;
}

export function Header({ drawerId, userName, avatarUrl }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="flex-none lg:hidden">
          <label
            htmlFor={drawerId}
            className="btn btn-square btn-ghost drawer-button"
            aria-label="Abrir menu"
          >
            <List size={24} />
          </label>
        </div>

        <div className="avatar shrink-0">
          <div className="w-10 lg:w-16 rounded-full border border-base-300">
            <img src={avatarUrl} alt={`Avatar de ${userName}`} />
          </div>
        </div>

        <h1 className="text-base lg:text-4xl font-bold tracking-tight">
          Bem vindo, {userName}!
        </h1>
      </div>

      <button
        onClick={signOut}
        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
      >
        <SignOut size={20} weight="bold" />
        Sair
      </button>
    </header>
  );
}