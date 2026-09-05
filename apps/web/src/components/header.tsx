"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PortfolioBanner } from "@/components/portfolio-banner";
import { LogOut, ShieldCheck, LayoutDashboard, Menu, X, Briefcase, Settings2 } from "lucide-react";

export function Header() {
    const { data: session, isPending } = authClient.useSession();
    const tNav = useTranslations("nav");
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    credentials: "include",
                    onSuccess: () => { window.location.href = "/"; },
                },
            });
        } catch {
            window.location.href = "/";
        }
    };

    const avatarLetter = session?.user?.email?.[0]?.toUpperCase() ?? "?";

    return (
        <>
            <PortfolioBanner />
            <header
                className={`sticky top-8 z-50 w-full transition-all duration-300 ${scrolled
                        ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
                        : "border-b border-transparent bg-background/60 backdrop-blur-md"
                    }`}
            >
            <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-2 group select-none">
                    <span className="font-heading font-bold text-xl tracking-tight">
                        Fifo Städfirma
                    </span>
                </Link>

                {/* ── Desktop nav ── */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { label: tNav("home"),     href: "/" },
                        { label: tNav("about"),    href: "/about" },
                        { label: tNav("services"), href: "/services" },
                        { label: tNav("contact"),  href: "/contact" },
                    ].map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* ── Right side ── */}
                <div className="flex items-center gap-3">
                    {!mounted || isPending ? (
                        <div className="size-8 animate-pulse rounded-full bg-muted" />
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            {/* Admin badge */}
                            {(session.user as any).role === "admin" && (
                                <Button asChild variant="outline" size="sm" className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/30 hidden sm:inline-flex">
                                    <Link href="/admin">
                                        <ShieldCheck className="size-4" />
                                        Admin
                                    </Link>
                                </Button>
                            )}

                            {/* Avatar with hover dropdown */}
                            <div className="relative group">
                                <button
                                    className="size-9 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-bold ring-2 ring-transparent group-hover:ring-border transition-all duration-200 cursor-pointer select-none"
                                    aria-label="User menu"
                                >
                                    {avatarLetter}
                                </button>

                                {/* Dropdown panel */}
                                <div className="absolute right-0 top-full mt-2.5 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out translate-y-1 group-hover:translate-y-0 z-50">
                                    {/* Arrow tip */}
                                    <div className="absolute -top-1.5 right-3 size-3 rotate-45 bg-popover border-l border-t border-border rounded-sm" />

                                    <div className="rounded-xl border border-border bg-popover shadow-xl overflow-hidden py-1">
                                        {/* Email */}
                                        <div className="px-3 py-2.5 border-b border-border">
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Signed in as</p>
                                            <p className="text-xs text-muted-foreground truncate font-medium">{session.user.email}</p>
                                        </div>

                                        {/* My Account */}
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                                        >
                                            <LayoutDashboard className="size-4 text-violet-500" />
                                            My Account
                                        </Link>

                                        {/* Settings */}
                                        <Link
                                            href="/dashboard/settings"
                                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                                        >
                                            <Settings2 className="size-4 text-blue-500" />
                                            Settings
                                        </Link>

                                        {/* Sign Out */}
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                        >
                                            <LogOut className="size-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm" className="text-sm font-medium">
                                <Link href="/signin">{tNav("signIn")}</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="text-sm font-medium bg-[color:var(--brand)] hover:opacity-90 border-0 text-white"
                            >
                                <Link href="/contact">{tNav("getQuote")}</Link>
                            </Button>
                        </div>
                    )}

                    {/* Language switcher */}
                    <LanguageSwitcher />

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden ml-1 p-2 rounded-lg hover:bg-accent transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>
            </div>

            {/* ── Mobile nav ── */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
                    {[
                        { label: tNav("home"),     href: "/" },
                        { label: tNav("about"),    href: "/about" },
                        { label: tNav("services"), href: "/services" },
                        { label: tNav("contact"),  href: "/contact" },
                    ].map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                        >
                            {label}
                        </Link>
                    ))}
                    {/* Mobile language switcher */}
                    <div className="px-3 py-2">
                        <LanguageSwitcher />
                    </div>
                </div>
            )}
        </header>
        </>
    );
}
