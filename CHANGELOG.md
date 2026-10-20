# Changelog

All notable changes to **FORMORA 3D** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-20

### Added
- **Parametric Geometry Engine**:
  - Carton Box builder with configurable corner fillets, dimensions in mm/cm/in, and dynamic face breakdown.
  - Cylindrical Bottle builder with rounded, sloped, and flat shoulder curves, neck dimensions, and threaded cap.
  - Squeeze Tube builder with crimped top heat seal and screw dispenser.
  - Stand-up Flexible Pouch (Doypack) builder with bottom gusset simulation and side heat seams.
  - Ergonomic Oval Bottle builder.
- **UV Artwork Mapping Pipeline**:
  - Offscreen Canvas compositor for 6 box faces and 360° cylindrical labels.
  - Transform controls: fit, fill, stretch, scale, rotation, offset X/Y, flip horizontal/vertical.
  - Real-time procedural label generator for instant pharmaceutical and cosmetics mockups.
- **Physical Materials (PBR)**:
  - 11 physical presets (Matte/Glossy Cardboard, Clear/Amber/Frosted Glass, Opaque/Glossy Plastic, Brushed Aluminum, Gold Foil, Barrier Foil Pouch).
  - Procedural tactile substrate bump relief (cardboard fiber, paper grain, plastic stipple, brushed metal).
- **Studio Environment & Cameras**:
  - 4 Studio lighting setups (Soft Commercial, Medical Bright Lab, Cosmetic Luxury, Clean E-Commerce) with Key, Fill, Rim controls.
  - Studio ground floor with soft contact shadows, reflection opacity, and pedestal stand.
  - Perspective and Orthographic projection modes.
  - Commercial Lens Presets: 35mm Wide, 50mm Standard, 85mm Product Portrait, 105mm Macro.
  - 6 camera angle presets (Hero View, Front, Side, Flatlay, Low Angle, Catalog).
- **Multi-Product Staging**:
  - Scene Outliner supporting multi-object management (add, duplicate, lock, hide, delete, rename).
  - 1-Click Studio Staging Layouts (Hero & Companion Box, Duo Side-by-Side, Triangle Trio, Even Lineup).
- **Export & Render Engine**:
  - Offscreen 4K Ultra HD still renderer with transparent alpha isolation (PNG, JPEG, WebP).
  - Binary 3D `.glb` container export for Blender, Unreal Engine, and Web AR.
  - 2D Unfolded Dieline layout viewer with cut and crease markings and printable PNG export.
- **AI Packaging Advisor**:
  - Regulatory compliance checklist (FDA/MOH) for barcode placement, expiry date, batch number, and contrast.
- **Developer & Contact Interface**:
  - Dedicated **About Developer & Contact** modal showcasing Eng. Dhiaa Al-Hmiri, GitHub links, and open-source acknowledgments.
- **Permanent GitHub Publishing Workflow (`project-publisher`)**:
  - Global automation CLI and IDE skill managing GitHub initialization, private repo creation, and checkpoint pushes under `En-Dhiaa`.
- **Windows Standalone Distribution**:
  - Portable bundle and 1-click desktop shortcut installer.
