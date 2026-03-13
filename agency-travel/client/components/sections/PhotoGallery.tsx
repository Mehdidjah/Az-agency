import { ReactNode } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Lens } from "@/components/magicui/lens";

export interface GridItem {
    col: string;
    row: string;
}

export interface SubGrid {
    columns: string;
    rows: string;
    items: GridItem[];
}

export interface PhotoGalleryProps {
    /** Grid layout definition — array of sub-grids */
    division: SubGrid[];
    /** Array of image objects (order maps to items across all sub-grids) */
    images: { src: string; alt: string }[];
    /** Optional header content (title, etc.) rendered centered above the grid */
    children?: ReactNode;
}

const PhotoGallery = ({ division, images, children }: PhotoGalleryProps) => {
    let imgIndex = 0;

    return (
        <section className="py-16 px-6 sm:px-10 lg:px-16">
            {/* Header content */}
            {children && (
                <div className="text-center mb-10">{children}</div>
            )}

            {/* Bento Grid */}
            <div className="w-full flex flex-col gap-3">
                {division.map((subGrid, gi) => (
                    <div
                        key={gi}
                        className="w-full grid gap-3"
                        style={{
                            gridTemplateColumns: subGrid.columns,
                            gridTemplateRows: subGrid.rows,
                        }}
                    >
                        {subGrid.items.map((item, ii) => {
                            const img = images[imgIndex] || images[imgIndex % images.length];
                            const currentIndex = imgIndex;
                            imgIndex++;
                            return (
                                <BlurFade
                                    key={`${gi}-${ii}`}
                                    inView
                                    delay={0.28 + currentIndex * 0.07}
                                    duration={1.35}
                                    blur={14}
                                    yOffset={26}
                                    className="rounded-2xl overflow-hidden"
                                    style={{ gridColumn: item.col, gridRow: item.row }}
                                >
                                    <Lens
                                        zoomFactor={1.85}
                                        lensSize={150}
                                        ariaLabel={`Zoom ${img.alt}`}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                        />
                                    </Lens>
                                </BlurFade>
                            );
                        })}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PhotoGallery;
