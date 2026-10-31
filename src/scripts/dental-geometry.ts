import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Original molar surface: rounded rectangular outline, four cusps and central fissures. */
export function molarCrown(detail = 96): THREE.BufferGeometry {
  const positions: number[] = [],
    indices: number[] = [];
  const ring = (radius: number, height: number, top = false) => {
    for (let i = 0; i <= detail; i++) {
      const a = (i / detail) * Math.PI * 2,
        c = Math.cos(a),
        s = Math.sin(a);
      const squircle = Math.pow(Math.pow(Math.abs(c), 3.5) + Math.pow(Math.abs(s), 3.5), -1 / 3.5);
      const x = c * squircle * radius * 1.035,
        z = s * squircle * radius * 0.9;
      const asymmetry = 1 + 0.025 * Math.sin(a + 0.5) - 0.018 * Math.cos(a * 3);
      let y = height;
      if (top) {
        const gauss = (cx: number, cz: number, width: number) =>
          Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / width);
        y =
          0.78 +
          0.19 * gauss(-0.52, -0.43, 0.2) +
          0.23 * gauss(0.5, -0.43, 0.2) +
          0.17 * gauss(-0.52, 0.42, 0.19) +
          0.2 * gauss(0.5, 0.42, 0.19);
        y -= 0.105 * Math.exp((-x * x) / 0.018) * Math.exp((-z * z) / 1.2);
        y -= 0.075 * Math.exp((-z * z) / 0.018) * Math.exp((-x * x) / 1.3);
        y -= 0.025 * gauss(0.1, 0.1, 0.07);
      } else y += Math.cos(a * 4 + 0.18) * 0.018 * radius;
      positions.push(x * asymmetry, y, z);
    }
  };
  [
    [0, -0.4],
    [0.64, -0.4],
    [0.73, -0.35],
    [0.84, -0.22],
    [0.96, 0.04],
    [1.015, 0.3],
    [1.02, 0.52],
    [1, 0.69],
  ].forEach(([r, y]) => ring(r, y));
  for (let r = 1; r >= 0; r -= 1 / 24) ring(Math.max(0, r), 0, true);
  const rows = positions.length / 3 / (detail + 1);
  for (let row = 0; row < rows - 1; row++)
    for (let col = 0; col < detail; col++) {
      const a = row * (detail + 1) + col,
        b = a + detail + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Broad shoulders and a variable-radius curve replace separated pointed spikes. */
function curvedRoot(side: number, length = 1.8) {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.37, -0.28, 0.02),
    new THREE.Vector3(side * 0.42, -0.8, 0.04),
    new THREE.Vector3(side * 0.59, -1.45, 0.1),
    new THREE.Vector3(side * 0.71, -length - 0.35, 0.2),
  ]);
  const frames = path.computeFrenetFrames(40, false),
    positions: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40,
      p = path.getPointAt(t),
      radius = i === 40 ? 0 : 0.35 * Math.pow(1 - t, 0.67) + 0.015;
    for (let j = 0; j <= 32; j++) {
      const a = (j / 32) * Math.PI * 2;
      const v = p
        .clone()
        .addScaledVector(frames.normals[i], Math.cos(a) * radius)
        .addScaledVector(frames.binormals[i], Math.sin(a) * radius * 0.83);
      positions.push(v.x, v.y, v.z);
      if (i < 40 && j < 32) {
        const n = i * 33 + j;
        indices.push(n, n + 33, n + 1, n + 33, n + 34, n + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function naturalTooth(material: THREE.Material, detail = 96) {
  const group = new THREE.Group(),
    crown = new THREE.Mesh(molarCrown(detail), material),
    roots = new THREE.Group();
  roots.add(
    new THREE.Mesh(curvedRoot(-1, 1.65), material),
    new THREE.Mesh(curvedRoot(1, 1.8), material),
  );
  const neck = new THREE.Mesh(
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, -0.63),
        new THREE.Vector2(0.44, -0.61),
        new THREE.Vector2(0.67, -0.47),
        new THREE.Vector2(0.735, -0.33),
        new THREE.Vector2(0.74, -0.2),
      ],
      64,
    ),
    material,
  );
  roots.add(neck);
  group.add(crown, roots);
  return { group, crown, roots };
}

export function implantAssembly(ceramic: THREE.Material, metal: THREE.Material) {
  const group = new THREE.Group(),
    screw = new THREE.Group(),
    abutment = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 1.72, 56), metal);
  body.position.y = -0.83;
  screw.add(body);
  class Thread extends THREE.Curve<THREE.Vector3> {
    constructor() {
      super();
    }
    getPoint(t: number) {
      const a = t * Math.PI * 2 * 9,
        r = 0.265 + t * 0.07;
      return new THREE.Vector3(Math.cos(a) * r, -1.66 + t * 1.67, Math.sin(a) * r);
    }
  }
  screw.add(new THREE.Mesh(new THREE.TubeGeometry(new Thread(), 320, 0.048, 8, false), metal));
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.365, 0.335, 0.14, 56), metal);
  collar.position.y = 0.03;
  screw.add(collar);
  abutment.add(
    new THREE.Mesh(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 0.04),
          new THREE.Vector2(0.3, 0.04),
          new THREE.Vector2(0.28, 0.18),
          new THREE.Vector2(0.19, 0.54),
          new THREE.Vector2(0.15, 0.62),
          new THREE.Vector2(0, 0.62),
        ],
        56,
      ),
      metal,
    ),
  );
  const crown = new THREE.Mesh(molarCrown(), ceramic);
  crown.position.y = 1.04;
  group.add(screw, abutment, crown);
  return { group, screw, abutment, crown };
}

export interface DentalArch {
  group: THREE.Group;
  teeth: THREE.Group[];
  tray: THREE.Group;
  targets: { x: number; y: number; z: number; ry: number }[];
}
export function dentalArch(
  ceramic: THREE.Material,
  plastic: THREE.Material,
  gumMaterial: THREE.Material,
): DentalArch {
  const group = new THREE.Group(),
    tray = new THREE.Group(),
    teeth: THREE.Group[] = [],
    targets: DentalArch['targets'] = [];
  for (let i = 0; i < 10; i++) {
    const angle = ((i - 4.5) / 4.5) * 1.24,
      x = Math.sin(angle) * 2.1,
      z = Math.cos(angle) * 1.05 - 0.25;
    const tooth = new THREE.Group();
    let geometry: THREE.BufferGeometry;
    if (i === 0 || i === 9) {
      geometry = molarCrown(48);
      geometry.scale(0.38, 0.53, 0.42);
      geometry.translate(0, 0.14, 0);
    } else {
      const canine = i === 2 || i === 7;
      const width = canine ? 0.5 : i === 4 || i === 5 ? 0.63 : 0.55,
        height = canine ? 0.91 : 0.83;
      geometry = new RoundedBoxGeometry(width, height, 0.5, 4, 0.14);
      geometry.translate(0, 0.25, 0);
    }
    tooth.add(new THREE.Mesh(geometry, ceramic));
    tooth.position.set(
      x + Math.sin(i * 2.7) * 0.12,
      Math.cos(i * 2.1) * 0.07,
      z + Math.sin(i) * 0.1,
    );
    tooth.rotation.set(0.02, angle * 0.85 + Math.sin(i * 2) * 0.19, Math.sin(i * 1.8) * 0.1);
    targets.push({ x, y: 0, z, ry: angle * 0.85 });
    teeth.push(tooth);
    group.add(tooth);
    const shell = new THREE.Mesh(geometry, plastic);
    shell.position.set(x, 0, z);
    shell.rotation.y = angle * 0.85;
    shell.scale.set(1.09, 1.09, 1.13);
    tray.add(shell);
  }
  const curve = new THREE.CatmullRomCurve3(targets.map((t) => new THREE.Vector3(t.x, -0.2, t.z)));
  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.29, 16, false), gumMaterial));
  tray.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.318, 16, false), plastic));
  tray.position.y = 1.3;
  group.add(tray);
  return { group, teeth, tray, targets };
}

export function pulpStructure(material: THREE.Material) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16), material);
  core.scale.set(1, 0.75, 0.75);
  core.position.y = 0.2;
  group.add(core);
  for (const side of [-1, 1]) {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(side * 0.23, -0.3, 0),
      new THREE.Vector3(side * 0.46, -1.25, 0.07),
      new THREE.Vector3(side * 0.61, -1.9, 0.16),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(path, 40, 0.035, 8, false), material));
    const horn = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(side * 0.3, 0.4, 0),
      new THREE.Vector3(side * 0.4, 0.57, -0.13),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(horn, 20, 0.05, 8, false), material));
  }
  return group;
}
