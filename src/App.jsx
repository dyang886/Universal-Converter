import { useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon, CommandLineIcon, DocumentTextIcon, InformationCircleIcon, WrenchIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import { AppProvider } from '@/contexts/AppContext';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Sidebar, SidebarBody, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar';
import AboutPage from '@/pages/About';
import AdvancedOptions from '@/pages/AdvancedOptions';
import FileSelection from '@/pages/FileSelection';
import SettingsPage from '@/pages/Settings';
import TerminalOutput from '@/pages/TerminalOutput';


export default function App() {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isFullScreenPage = ['/settings', '/about'].includes(location.pathname);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <AppProvider>
            <div className="bg-white dark:bg-zinc-900 dark:text-gray-100 h-screen relative flex flex-col items-center p-8 pt-3">

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
                                className="p-2 rounded-full hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-colors"
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
                    <Route path="/about" element={<AboutPage />} />
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
