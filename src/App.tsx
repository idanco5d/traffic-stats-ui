import './App.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ApplicationRoutes} from "./routes/ApplicationRoutes.tsx";
import {AuthProvider} from "./auth/AuthProvider.tsx";

const queryClient = new QueryClient();

function App() {

    return <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <ApplicationRoutes/>
        </QueryClientProvider>
    </AuthProvider>
}

export default App
