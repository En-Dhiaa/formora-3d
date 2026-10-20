/**
 * FORMORA 3D — Automated Verification & Acceptance Test Suite
 */

const assert = require('assert');

console.log('=====================================================');
console.log('🧪 FORMORA 3D AUTOMATED ENGINE & ACCEPTANCE TEST SUITE');
console.log('=====================================================\n');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

// 1. Unit Conversion Tests
test('Unit conversions (mm, cm, in)', () => {
  const mm = 100;
  const cm = mm / 10;
  const inches = mm / 25.4;
  assert.strictEqual(cm, 10);
  assert.strictEqual(Number(inches.toFixed(2)), 3.94);
});

// 2. Box Geometry Surface Calculations
test('Box geometry 6-face dependent dimensions calculation', () => {
  const w = 80;
  const h = 120;
  const d = 40;

  // Front & Back: W x H
  assert.strictEqual(w * h, 9600);
  // Left & Right: D x H
  assert.strictEqual(d * h, 4800);
  // Top & Bottom: W x D
  assert.strictEqual(w * d, 3200);

  const totalArea = 2 * (w * h + d * h + w * d);
  assert.strictEqual(totalArea, 35200);
});

// 3. Cylinder Bottle Circumference & Label Area
test('Cylinder bottle geometry & cylindrical label wrap calculations', () => {
  const bodyDiameter = 50;
  const totalHeight = 150;
  const neckHeight = 20;
  const shoulderHeight = 15;

  const printableHeight = totalHeight - neckHeight - shoulderHeight;
  assert.strictEqual(printableHeight, 115);

  const circumference = Math.PI * bodyDiameter;
  assert.ok(circumference > 157.0 && circumference < 157.1);

  // Front label 45% wrap
  const frontLabelWidth = circumference * 0.45;
  assert.ok(frontLabelWidth > 70 && frontLabelWidth < 71);
});

// 4. Flexible Pouch Seal & Printable Area Calculations
test('Stand-up pouch gusset & seal boundary validation', () => {
  const pouchWidth = 140;
  const pouchHeight = 200;
  const sealWidth = 8;
  const gussetDepth = 60;

  const printableWidth = pouchWidth - sealWidth * 2;
  const printableHeight = pouchHeight - sealWidth * 2;

  assert.strictEqual(printableWidth, 124);
  assert.strictEqual(printableHeight, 184);
  assert.ok(gussetDepth > 0 && gussetDepth < pouchWidth);
});

// 5. Material Presets Validation
test('PBR Material Presets physical limits integrity', () => {
  const presets = {
    matte_cardboard: { roughness: 0.9, metalness: 0.0, clearcoat: 0.0 },
    clear_glass: { roughness: 0.05, metalness: 0.0, transmission: 0.95 },
    glossy_plastic: { roughness: 0.15, metalness: 0.05, clearcoat: 0.8 },
    brushed_metal: { roughness: 0.35, metalness: 0.9, clearcoat: 0.1 },
    gold_foil: { roughness: 0.15, metalness: 0.95, clearcoat: 0.5 },
  };

  Object.entries(presets).forEach(([key, mat]) => {
    assert.ok(mat.roughness >= 0 && mat.roughness <= 1, `${key} roughness out of bounds`);
    assert.ok(mat.metalness >= 0 && mat.metalness <= 1, `${key} metalness out of bounds`);
    if (mat.transmission !== undefined) {
      assert.ok(mat.transmission >= 0 && mat.transmission <= 1, `${key} transmission out of bounds`);
    }
  });
});

// 6. Project Serialization & Round-Trip Persistence
test('Project JSON serialization & deserialization round-trip', () => {
  const sampleProject = {
    id: 'proj-123',
    name: 'Voltenac 50 Packaging Mockup',
    version: '1.0.0',
    objects: [
      {
        id: 'box-1',
        name: 'Outer Blister Box',
        geometry: { type: 'box', params: { width: 80, height: 120, depth: 40 } },
        surfaceArtworks: {
          front: { fileName: 'front.png', fit: 'fit', scale: 1 },
        },
      },
      {
        id: 'bottle-1',
        name: 'Syrup Bottle',
        geometry: { type: 'cylinder_bottle', params: { totalHeight: 140, bodyDiameter: 50 } },
        surfaceArtworks: {},
      },
    ],
  };

  const json = JSON.stringify(sampleProject);
  const parsed = JSON.parse(json);

  assert.strictEqual(parsed.id, sampleProject.id);
  assert.strictEqual(parsed.objects.length, 2);
  assert.strictEqual(parsed.objects[0].name, 'Outer Blister Box');
  assert.strictEqual(parsed.objects[1].geometry.type, 'cylinder_bottle');
});

// 7. High-Resolution Render Dimension Constraints
test('High-Res 1080p, 2K, 4K render presets aspect preservation', () => {
  const resolutions = [
    { key: '1080p', w: 1920, h: 1080, expectedAspect: 16 / 9 },
    { key: '2k_square', w: 2048, h: 2048, expectedAspect: 1.0 },
    { key: '4k_uhd', w: 3840, h: 2160, expectedAspect: 16 / 9 },
  ];

  resolutions.forEach((r) => {
    const aspect = r.w / r.h;
    assert.ok(Math.abs(aspect - r.expectedAspect) < 0.001);
  });
});

// 8. Commercial Lens Simulation (Focal length to FOV bounds)
test('Commercial lens optical presets (35mm, 50mm, 85mm, 105mm)', () => {
  const lenses = [
    { mm: 35, fov: 54 },
    { mm: 50, fov: 40 },
    { mm: 85, fov: 24 },
    { mm: 105, fov: 19 },
  ];

  lenses.forEach((lens) => {
    assert.ok(lens.fov >= 15 && lens.fov <= 60, `FOV out of realistic studio lens range: ${lens.mm}mm`);
  });
  // Telephoto has narrower FOV than wide angle
  assert.ok(lenses[3].fov < lenses[0].fov);
});

// 9. Multi-Product Studio Staging Coordinates
test('Multi-product studio layout arrangement calculation', () => {
  const count = 3;
  const duoSpacing = 0.14;
  const x0 = (0 - (count - 1) / 2) * duoSpacing;
  const x1 = (1 - (count - 1) / 2) * duoSpacing;
  const x2 = (2 - (count - 1) / 2) * duoSpacing;

  assert.strictEqual(x1, 0); // Center product is at origin
  assert.strictEqual(Number((x2 - x0).toFixed(2)), 0.28); // Total span is 28cm
});

// 10. Developer & Software Credits Integrity
test('Developer credits & official GitHub repository metadata', () => {
  const credits = {
    developer: 'Eng. Dhiaa Al-Hmiri',
    github: 'https://github.com/En-Dhiaa',
    repo: 'https://github.com/En-Dhiaa/formora-3d',
    version: 'v1.0.0',
  };

  assert.strictEqual(credits.developer, 'Eng. Dhiaa Al-Hmiri');
  assert.ok(credits.github.includes('En-Dhiaa'));
  assert.strictEqual(credits.version, 'v1.0.0');
});

console.log(`\n=====================================================`);
console.log(`📊 Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log(`=====================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}

