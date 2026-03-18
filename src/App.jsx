import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <HashRouter>
        <Routes>
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
