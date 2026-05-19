import { useState, useEffect } from "react"
import { Moon, Sun, Menu, Activity, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRtkMetrics } from "@/lib/api"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isLoading, error } = useRtkMetrics()

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setTheme(isDarkMode ? "dark" : "light")
  }, [])

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RTK</span>
              </div>
              <h1 className="text-lg font-semibold tracking-tight">RTK Economy Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* API Status Indicator */}
            <div className={cn(
              "hidden md:flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
              isLoading ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
              error ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            )}>
              {isLoading ? (
                <>
                  <Activity className="h-3 w-3 animate-pulse" />
                  <span>Connecting...</span>
                </>
              ) : error ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>API Error</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>API Connected</span>
                </>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          OpenCode Multi-Agent System • RTK Economy Dashboard • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
