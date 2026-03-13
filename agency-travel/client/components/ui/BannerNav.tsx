import { ReactNode } from "react";

export interface NavLink {
    label: string;
    href: string;
}

export interface BannerNavProps {
    /** Background image URL */
    bgImage: string;
    /** Navigation links displayed at the top */
    navLinks: NavLink[];
    /** Content rendered inside the banner (title, subtitle, etc.) */
    children: ReactNode;
}

const BannerNav = ({ bgImage, navLinks, children }: BannerNavProps) => {
    return (
        <div
            className="relative w-full rounded-[28px] overflow-hidden"
            style={{ minHeight: 340 }}
        >
            {/* Background image with gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.73)), url('${bgImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-6 sm:px-10 lg:px-16 py-8">
                {/* Top bar: logo left, nav center */}
                <div className="w-full relative flex items-center justify-center mb-14">
                    {/* Logo */}
                    <a href="/" className="absolute left-0">
                        <img
                            src="/assets/figma/logo.png"
                            alt="AZ Voyage"
                            className="h-8 object-contain opacity-80"
                        />
                    </a>

                    {/* Nav links */}
                    <nav className="hidden sm:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-white/80 text-sm font-medium tracking-tight hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Body content (children) */}
                <div className="flex flex-col items-center text-center max-w-[700px] pb-14">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BannerNav;
