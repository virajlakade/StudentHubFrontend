import { NavigationProvider } from "./context/NavigationContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <NavigationProvider>
      <AppRoutes />
    </NavigationProvider>
  );


    console.log(import.meta.env.VITE_API_URL);}

export default App;