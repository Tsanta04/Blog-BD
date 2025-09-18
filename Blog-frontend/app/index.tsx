import { useAuth } from "@/contexts/AuthContext"
import { router } from "expo-router"

export default function App() {
    const {isAuthenticated} = useAuth()
    if(isAuthenticated)
        router.replace('/(tabs)')
    else
        router.replace('/login')
    return <></>
}
