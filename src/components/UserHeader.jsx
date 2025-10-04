import { useCurrentUser } from '../hooks/useCurrentUser';

export default function UserHeader() {
  const { user, logout } = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="text-white/60">Loading user...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-white/60 text-sm">{user.email}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors border border-red-500/30"
      >
        Sign Out
      </button>
    </div>
  );
}
