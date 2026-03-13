import { BlurFade } from "@/components/magicui/blur-fade";
import { Lens } from "@/components/magicui/lens";

export interface PhotoScrollProps {
    /** Title prefix (shown in highlight) */
    titleHighlight: string;
    /** Optional custom color for highlight text */
    titleHighlightColor?: string;
    /** Title suffix (shown in regular weight) */
    titleRest: string;
    /** Array of image objects */
    images: { src: string; alt: string }[];
}

const PhotoScroll = ({ titleHighlight, titleHighlightColor, titleRest, images }: PhotoScrollProps) => {
    return (
        <section className="py-16">
            {/* Title */}
            <h2 className="font-jakarta font-bold text-[28px] sm:text-[36px] tracking-[-1.5px] text-center mb-10 px-6">
                <span style={{ fontFamily: "'Figma Hand', cursive", color: titleHighlightColor || undefined }} className={titleHighlightColor ? "" : "text-gold-100"}>{titleHighlight}</span>
                <br />
                <span className="text-black-100">{titleRest}</span>
            </h2>

            {/* Infinite marquee */}
            <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-photo-marquee">
                    {/* First set */}
                    <div className="flex gap-4 shrink-0 px-2">
                        {images.map((img, i) => (
                            <BlurFade
                                key={i}
                                inView
                                delay={0.3 + i * 0.06}
                                duration={1.3}
                                blur={14}
                                yOffset={24}
                                className="flex-shrink-0 w-[240px] h-[300px] rounded-2xl overflow-hidden"
                            >
                                <Lens
                                    zoomFactor={1.8}
                                    lensSize={140}
                                    ariaLabel={`Zoom ${img.alt}`}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                    />
                                </Lens>
                            </BlurFade>
                        ))}
                    </div>
                    {/* Duplicate for seamless loop */}
                    <div className="flex gap-4 shrink-0 px-2">
                        {images.map((img, i) => (
                            <BlurFade
                                key={`dup-${i}`}
                                inView
                                delay={0.3 + i * 0.06}
                                duration={1.3}
                                blur={14}
                                yOffset={24}
                                className="flex-shrink-0 w-[240px] h-[300px] rounded-2xl overflow-hidden"
                            >
                                <Lens
                                    zoomFactor={1.8}
                                    lensSize={140}
                                    ariaLabel={`Zoom ${img.alt}`}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                    />
                                </Lens>
                            </BlurFade>
                        ))}
                    </div>
                </div>

                <style>{`
          @keyframes photo-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-photo-marquee {
            animation: photo-marquee 20s linear infinite;
          }
          .animate-photo-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
            </div>
        </section>
    );
};

export default PhotoScroll;
