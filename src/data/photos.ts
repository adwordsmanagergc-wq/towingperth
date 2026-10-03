// Real Quik Tow job photos (from the old site, upscaled 4x). Astro optimises
// them at build time, so keep the originals here at full size.
import type { ImageMetadata } from 'astro';
import hero from '~/assets/images/tow-truck-perth-hero.jpg';
import heroQuay from '~/assets/images/tow-truck-perth-hero-elizabeth-quay.jpg';
import accident from '~/assets/images/accident-towing-perth.jpg';
import breakdown from '~/assets/images/breakdown-tow-truck-perth.jpg';
import fourWd from '~/assets/images/4wd-tilt-tray-perth.jpg';
import container from '~/assets/images/container-transport-perth.jpg';
import machinery from '~/assets/images/machinery-transport-perth.jpg';
import boat from '~/assets/images/boat-car-towing-perth.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export const PHOTOS = {
  hero: { src: heroQuay, alt: 'Quik Tow & Transport tilt tray tow truck at Elizabeth Quay with the Perth city skyline at dusk' },
  accident: { src: accident, alt: 'Blue sedan with front end damage after a crash with another car' },
  breakdown: { src: breakdown, alt: 'Broken down silver sedan being winched onto a Quik Tow tilt tray' },
  fourWd: { src: fourWd, alt: 'White 4WD loaded on a Quik Tow tilt tray truck' },
  container: { src: container, alt: 'Truck carrying a shipping container at a container yard' },
  machinery: { src: machinery, alt: 'Quik Tow tilt tray carrying an orange boom lift' },
  boat: { src: boat, alt: 'Boat ready for transport next to a Quik Tow tilt tray truck' },
} satisfies Record<string, Photo>;

// Photo shown on each service page and its card, keyed by service id. The alt
// text is keyword-relevant but must still describe what is actually in the photo.
export const SERVICE_PHOTOS: Record<string, Photo> = {
  'accident-towing-perth': { src: accident, alt: 'Car with front-end crash damage waiting for accident towing in Perth' },
  'breakdown-towing-perth': { src: breakdown, alt: 'Tilt tray tow truck collecting a broken down car in Perth' },
  '4wd-recovery-perth': { src: fourWd, alt: '4WD loaded onto a Quik Tow tilt tray truck for recovery in Perth' },
  'container-transport-perth': { src: container, alt: 'Shipping container being transported on a truck in Perth' },
  'vehicle-transport-perth': { src: boat, alt: 'Boat on a trailer ready for vehicle transport next to a Quik Tow tilt tray truck in Perth' },
  'insurance-towing': { src: hero, alt: 'Tilt tray tow truck loading a sedan for an insurance tow in Perth' },
};

// Machinery transport (homepage feature band).
export const MACHINERY_PHOTO: Photo = {
  src: machinery,
  alt: 'Boom lift machinery being transported on a Quik Tow tilt tray truck in Perth',
};

// Fleet gallery on the About page.
export const FLEET_PHOTOS: Photo[] = [PHOTOS.machinery, PHOTOS.boat, PHOTOS.fourWd];
