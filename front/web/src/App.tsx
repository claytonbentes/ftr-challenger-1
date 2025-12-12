import { Route, Switch } from "wouter";
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SlugRedirect from './pages/Redirect'
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./queries/client"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/:slug" component={SlugRedirect} />
      </Switch>
    </QueryClientProvider>
  )
}

export default App