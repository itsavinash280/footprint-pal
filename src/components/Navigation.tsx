import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Leaf, Trophy, MessageSquare, Mail, Briefcase, LogOut, User, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-card shadow-soft border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Leaf className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-xl font-bold">EcoTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <Link to="/challenges">
                  <Button variant="ghost" className="gap-2">
                    <Trophy className="w-4 h-4" />
                    Challenges
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="ghost" className="gap-2">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button variant="ghost" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </Button>
                </Link>
              </>
            )}
            <Link to="/contact">
              <Button variant="ghost" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact
              </Button>
            </Link>
            <Link to="/business">
              <Button variant="ghost" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Business
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
