import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {

    // ================= NAVIGATION =================

    const [activeTab, setActiveTabState] = useState("Dashboard");
    const [subView, setSubView] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // ================= AUTH =================

    const [user, setUser] = useState(authService.getCurrentUser());
    const [authView, setAuthView] = useState("login");
    const [emailToVerify, setEmailToVerify] = useState("");

    // Load user from backend if token exists
    useEffect(() => {

        const loadUser = async () => {

            if (!authService.isAuthenticated()) {
                return;
            }

            try {

                const profile = await authService.loadCurrentUser();

                if (profile) {
                    setUser(profile);
                }

            } catch (e) {
                console.error(e);
            }
        };

        loadUser();

    }, []);

    // ================= NAVIGATION =================

    const setActiveTab = (tab) => {
        setActiveTabState(tab);
        setSubView(null);
        setSelectedItemId(null);
        setSearchQuery("");
    };

    const navigateToDetails = (itemId) => {
        setSelectedItemId(itemId);
        setSubView("details");
    };

    const navigateToCreate = () => {
        setSubView("create");
    };

    const navigateToList = () => {
        setSubView(null);
        setSelectedItemId(null);
    };

    // ================= LOGIN =================

    const login = async (email, password) => {

        await authService.login(email, password);

        const profile = await authService.loadCurrentUser();

        setUser(profile);

        setAuthView("none");

        setActiveTab("Dashboard");

        return profile;
    };

    // ================= LOGOUT =================

    const logout = () => {

        authService.logout();

        setUser(null);

        setAuthView("login");

        setActiveTab("Dashboard");

        setSubView(null);

        setSelectedItemId(null);
    };

    return (
        <NavigationContext.Provider
            value={{
                activeTab,
                setActiveTab,

                subView,
                setSubView,

                selectedItemId,
                setSelectedItemId,

                navigateToDetails,
                navigateToCreate,
                navigateToList,

                searchQuery,
                setSearchQuery,

                user,
                setUser,

                authView,
                setAuthView,

                emailToVerify,
                setEmailToVerify,

                login,
                logout,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {

    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error(
            "useNavigation must be used within NavigationProvider"
        );
    }

    return context;
}