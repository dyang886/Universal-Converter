import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';

import FileSelection from './pages/FileSelection';
import AdvancedOptions from './pages/AdvancedOptions';
import TerminalOutput from './pages/TerminalOutput';
import SettingsPage from './pages/Settings';

import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Sidebar, SidebarBody, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon, InformationCircleIcon, WrenchIcon, CommandLineIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const AboutPageContent = () => (
    <div className="text-center">
        <p className="text-gray-500">Information about the application.</p>
    </div>
);


// --- Layout for Full-Screen Modal Pages ---
const FullScreenPageLayout = ({ title, children }) => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-8 dark:bg-zinc-900">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button
                    onClick={() => navigate('/')}
                    className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800"
                    aria-label="Close page"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </header>
            <main className="flex flex-1 items-center justify-center">
                {children}
            </main>
        </div>
    );
};


export default function App() {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isFullScreenPage = ['/settings', '/about'].includes(location.pathname);

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <AppProvider>
            <div className="bg-white dark:bg-zinc-900 dark:text-gray-100 min-h-screen relative flex flex-col items-center p-8 pt-3">

                <Navbar className="flex justify-between self-stretch">
                    <NavbarSection>
                        <NavbarItem as={Link} to="/"><DocumentTextIcon className="h-6 w-6" />{t('main.file_selection')}</NavbarItem>
                        <NavbarItem as={Link} to="/advanced"><WrenchIcon className="h-6 w-6" />{t('main.advanced_options')}</NavbarItem>
                        <NavbarItem as={Link} to="/terminal"><CommandLineIcon className="h-6 w-6" />{t('main.terminal_output')}</NavbarItem>
                    </NavbarSection>

                    {!isFullScreenPage && (
                        <NavbarSection>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <EllipsisHorizontalCircleIcon className="h-6 w-6" />
                            </button>
                        </NavbarSection>
                    )}
                </Navbar>

                <Routes>
                    <Route path="/" element={<FileSelection />} />
                    <Route path="/advanced" element={<AdvancedOptions />} />
                    <Route path="/terminal" element={<TerminalOutput />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/about" element={<FullScreenPageLayout title={t('main.about')}><AboutPageContent /></FullScreenPageLayout>} />
                </Routes>

                <div
                    className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />

                <div className={`fixed top-0 right-0 z-40 h-full w-48 bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <Sidebar>
                        <SidebarBody>
                            <SidebarSection>
                                <SidebarItem as={Link} to="/settings">
                                    <Cog6ToothIcon className="h-6 w-6" />
                                    <SidebarLabel>{t('main.settings')}</SidebarLabel>
                                </SidebarItem>
                                <SidebarItem as={Link} to="/about">
                                    <InformationCircleIcon className="h-6 w-6" />
                                    <SidebarLabel>{t('main.about')}</SidebarLabel>
                                </SidebarItem>
                            </SidebarSection>
                        </SidebarBody>
                    </Sidebar>
                </div>

            </div>
        </AppProvider>
    );
}
