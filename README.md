# GIS & Remote Sensing: From Orbit to Map (Group B)

An interactive, responsive presentation web application built to demonstrate the core workflows of **Geospatial Information Systems (GIS) and Remote Sensing**. This presentation guides users step-by-step from raw satellite sensor data down to publishing structured layout maps inside QGIS.

## 🛰️ Presentation Topics Covered
- **Remote Sensing Foundations:** Core principles behind active (radar/SAR) vs. passive (solar optical) sensors.
- **The Seven Components:** Tracing radiation paths from energy source to application targets.
- **Earth Observation Missions:** Specifications and revisit capabilities for Landsat 8/9, Sentinel-1/2, and MODIS.
- **Image Characteristics:** Understanding spatial, spectral, radiometric, and temporal resolutions.
- **Limitations & Constraints:** Clouds, resolution trade-offs, revisit time, cost, mixed pixels and the need for ground truth.
- **Digital Image Processing:** Preprocessing, enhancement, classification, field data collection and accuracy assessment.
- **QGIS Raster Workflow:** Band stacking (Virtual Rasters), data clipping, cumulative cuts stretch, and symbology layout creation.

## ⚡ Interactive Web Simulations Included
- **Live Pixel Zoom:** Real-time extraction of digital numbers (DN values) across blue, green, red, and NIR bands.
- **Reflectance Chart:** Interactive spectral signatures graph tracking vegetation, urban, soil, and water.
- **Raster Renderer Selector:** Live toggles between Singleband Gray, Singleband Pseudocolor (NDVI), Multiband Color, and Paletted classifications.
- **Image Processing Pipeline:** Auto-playing 5-stage walkthrough ending in a live confusion matrix with overall accuracy and Kappa.
- **Print Layout Previewer:** Simulated A4 landscape production mapping panel complete with north arrows and scale bars.

## 🛠️ Tech Stack & Architecture
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7 (optimized with `vite-plugin-singlefile` for self-contained bundling)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (reduced-motion accessible configuration)
- **Icons:** Lucide React

## 🚀 Local Development

1. Clone the repository:
```bash
git clone https://github.com
```

2. Install dependencies:
```bash
npm install
```

3. Spin up the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```
