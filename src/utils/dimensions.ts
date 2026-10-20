import {
  GeometryParameters,
  SurfaceDimensions,
  BoxParameters,
  CylinderBottleParameters,
  OvalBottleParameters,
  TubeParameters,
  PouchParameters,
  CustomLatheParameters,
  Unit,
} from '../types';

/**
 * Calculates dependent 2D dimensions for all surfaces of an object based on its 3D parameters.
 * Dimensions are returned in the object's active display unit.
 */
export function calculateSurfaceDimensions(
  geometry: GeometryParameters,
  _unit: Unit = 'mm'
): SurfaceDimensions[] {
  switch (geometry.type) {
    case 'box': {
      const p = geometry.params as BoxParameters;
      const w = Math.max(1, p.width);
      const h = Math.max(1, p.height);
      const d = Math.max(1, p.depth);

      return [
        {
          key: 'front',
          labelAr: 'الواجهة الأمامية',
          labelEn: 'Front Face',
          width: w,
          height: h,
          aspectRatio: w / h,
        },
        {
          key: 'back',
          labelAr: 'الواجهة الخلفية',
          labelEn: 'Back Face',
          width: w,
          height: h,
          aspectRatio: w / h,
        },
        {
          key: 'left',
          labelAr: 'الجانب الأيسر',
          labelEn: 'Left Side',
          width: d,
          height: h,
          aspectRatio: d / h,
        },
        {
          key: 'right',
          labelAr: 'الجانب الأيمن',
          labelEn: 'Right Side',
          width: d,
          height: h,
          aspectRatio: d / h,
        },
        {
          key: 'top',
          labelAr: 'الغطاء العلوي',
          labelEn: 'Top Cap / Flap',
          width: w,
          height: d,
          aspectRatio: w / d,
        },
        {
          key: 'bottom',
          labelAr: 'القاعدة السفلية',
          labelEn: 'Bottom Base',
          width: w,
          height: d,
          aspectRatio: w / d,
        },
      ];
    }

    case 'cylinder_bottle': {
      const p = geometry.params as CylinderBottleParameters;
      const bodyH = Math.max(1, p.totalHeight - p.neckHeight - p.shoulderHeight);
      const bodyCircumference = Math.PI * p.bodyDiameter;
      const capCircumference = Math.PI * p.capDiameter;

      return [
        {
          key: 'body',
          labelAr: 'ملصق العبوة الأسطواني الكامل',
          labelEn: 'Full Body Cylindrical Wrap',
          width: Number(bodyCircumference.toFixed(1)),
          height: Number(bodyH.toFixed(1)),
          aspectRatio: bodyCircumference / bodyH,
        },
        {
          key: 'front_label',
          labelAr: 'الملصق الأمامي',
          labelEn: 'Front Body Label',
          width: Number((bodyCircumference * 0.45).toFixed(1)),
          height: Number((bodyH * 0.8).toFixed(1)),
          aspectRatio: (bodyCircumference * 0.45) / (bodyH * 0.8),
        },
        {
          key: 'back_label',
          labelAr: 'الملصق الخلفي (المعلومات)',
          labelEn: 'Back Nutrition / Info Label',
          width: Number((bodyCircumference * 0.45).toFixed(1)),
          height: Number((bodyH * 0.8).toFixed(1)),
          aspectRatio: (bodyCircumference * 0.45) / (bodyH * 0.8),
        },
        {
          key: 'cap_top',
          labelAr: 'قمة الغطاء',
          labelEn: 'Cap Top',
          width: p.capDiameter,
          height: p.capDiameter,
          aspectRatio: 1.0,
        },
        {
          key: 'cap_side',
          labelAr: 'محيط الغطاء',
          labelEn: 'Cap Circumference',
          width: Number(capCircumference.toFixed(1)),
          height: p.capHeight,
          aspectRatio: capCircumference / Math.max(1, p.capHeight),
        },
      ];
    }

    case 'oval_bottle': {
      const p = geometry.params as OvalBottleParameters;
      const perimeter = Math.PI * (3 * (p.bodyWidth + p.bodyDepth) / 2 - Math.sqrt(p.bodyWidth * p.bodyDepth));
      const frontW = p.bodyWidth * 0.85;
      const frontH = p.height * 0.7;

      return [
        {
          key: 'front',
          labelAr: 'الملصق الأمامي البيضاوي',
          labelEn: 'Front Oval Label',
          width: Number(frontW.toFixed(1)),
          height: Number(frontH.toFixed(1)),
          aspectRatio: frontW / frontH,
        },
        {
          key: 'back',
          labelAr: 'الملصق الخلفي البيضاوي',
          labelEn: 'Back Oval Label',
          width: Number(frontW.toFixed(1)),
          height: Number(frontH.toFixed(1)),
          aspectRatio: frontW / frontH,
        },
        {
          key: 'cap',
          labelAr: 'غطاء العبوة',
          labelEn: 'Bottle Cap',
          width: p.capDiameter,
          height: p.capHeight,
          aspectRatio: p.capDiameter / Math.max(1, p.capHeight),
        },
        {
          key: 'body_wrap',
          labelAr: 'تغليف الجسم الكامل',
          labelEn: 'Full Body Perimeter Wrap',
          width: Number(perimeter.toFixed(1)),
          height: p.height,
          aspectRatio: perimeter / Math.max(1, p.height),
        },
      ];
    }

    case 'squeeze_tube': {
      const p = geometry.params as TubeParameters;
      const flatTopW = (Math.PI * p.bodyDiameter) / 2;
      const printableH = p.totalLength - p.capHeight - p.crimpHeight;

      return [
        {
          key: 'front',
          labelAr: 'الواجهة الأمامية للأنبوب',
          labelEn: 'Front Tube Artwork',
          width: Number(flatTopW.toFixed(1)),
          height: Number(printableH.toFixed(1)),
          aspectRatio: flatTopW / printableH,
        },
        {
          key: 'back',
          labelAr: 'الواجهة الخلفية للأنبوب',
          labelEn: 'Back Tube Artwork',
          width: Number(flatTopW.toFixed(1)),
          height: Number(printableH.toFixed(1)),
          aspectRatio: flatTopW / printableH,
        },
        {
          key: 'crimp',
          labelAr: 'شريط اللحام العلوي',
          labelEn: 'Top Crimp Seal',
          width: Number(flatTopW.toFixed(1)),
          height: p.crimpHeight,
          aspectRatio: flatTopW / Math.max(1, p.crimpHeight),
        },
        {
          key: 'cap',
          labelAr: 'غطاء الأنبوب',
          labelEn: 'Tube Screw/Flip Cap',
          width: p.capDiameter,
          height: p.capHeight,
          aspectRatio: p.capDiameter / Math.max(1, p.capHeight),
        },
      ];
    }

    case 'flexible_pouch': {
      const p = geometry.params as PouchParameters;
      const printableH = p.height - p.sealWidth * 2;
      const printableW = p.width - p.sealWidth * 2;

      return [
        {
          key: 'front',
          labelAr: 'الواجهة الأمامية للكيس المرن',
          labelEn: 'Front Pouch Panel',
          width: Number(printableW.toFixed(1)),
          height: Number(printableH.toFixed(1)),
          aspectRatio: printableW / printableH,
        },
        {
          key: 'back',
          labelAr: 'الواجهة الخلفية للكيس المرن',
          labelEn: 'Back Pouch Panel',
          width: Number(printableW.toFixed(1)),
          height: Number(printableH.toFixed(1)),
          aspectRatio: printableW / printableH,
        },
        {
          key: 'gusset',
          labelAr: 'قاعدة الكيس القائم (Gusset)',
          labelEn: 'Bottom Stand-up Gusset',
          width: Number(printableW.toFixed(1)),
          height: Number(p.gussetDepth.toFixed(1)),
          aspectRatio: printableW / Math.max(1, p.gussetDepth),
        },
      ];
    }

    case 'custom_lathe': {
      const p = geometry.params as CustomLatheParameters;
      const maxRadius = Math.max(...p.profilePoints.map((pt) => pt.r), 10);
      const circumference = Math.PI * maxRadius * 2;

      return [
        {
          key: 'body',
          labelAr: 'الملصق المحيطي للشكل المخصص',
          labelEn: 'Custom Profile Wrap',
          width: Number(circumference.toFixed(1)),
          height: p.height,
          aspectRatio: circumference / Math.max(1, p.height),
        },
      ];
    }

    default:
      return [];
  }
}
