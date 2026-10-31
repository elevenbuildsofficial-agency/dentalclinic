import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clinic } from '../clinic.config';
import {
  naturalTooth,
  implantAssembly,
  dentalArch,
  molarCrown,
  pulpStructure,
} from './dental-geometry';

/** Broad softbox reflections and negative fill make the enamel's shape readable. */
function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color('#475650');
  const panel = (x: number, y: number, z: number, w: number, h: number, intensity: number) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#fff8e9').multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
  };
  panel(-3, 4, 4, 3, 5, 3.5);
  panel(4, 2, 1, 2, 4, 2);
  panel(0, 4, -4, 3, 3, 2.5);
  const generator = new THREE.PMREMGenerator(renderer),
    texture = generator.fromScene(studio, 0.035, 0.1, 30, { size: 128 });
  studio.traverse((item) => {
    if (item instanceof THREE.Mesh) {
      item.geometry.dispose();
      (item.material as THREE.Material).dispose();
    }
  });
  generator.dispose();
  return texture;
}

export function createScene(element: HTMLElement) {
  const mount = element.querySelector<HTMLElement>('.scene-canvas');
  if (!mount) return () => {};
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return () => {};
  }
  const variant = element.dataset.scene || 'hero';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 600 ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.91;
  mount.append(renderer.domElement);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(3.8, 2.65, 8.7);
  camera.lookAt(0, -0.2, 0);
  const environment = studioEnvironment(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.68;
  RectAreaLightUniformsLib.init();
  const softbox = new THREE.RectAreaLight('#fff9ee', 7, 4, 5);
  softbox.position.set(-3, 5, 5);
  softbox.lookAt(0, 0, 0);
  scene.add(softbox);
  const fill = new THREE.RectAreaLight('#d7eeea', 2.2, 2.5, 4);
  fill.position.set(4, 1.2, 3);
  fill.lookAt(0, 0, 0);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(clinic.colors.teal, 1.55);
  rim.position.set(2.5, 3, -4);
  scene.add(rim);
  const top = new THREE.DirectionalLight('#fffcf2', 1.1);
  top.position.set(-2, 5, 0);
  scene.add(top);
  const enamel = () =>
    new THREE.MeshPhysicalMaterial({
      color: '#fff6df',
      roughness: 0.25,
      metalness: 0,
      clearcoat: 0.75,
      clearcoatRoughness: 0.17,
      ior: 1.5,
      envMapIntensity: 1,
    });
  const titanium = () =>
    new THREE.MeshStandardMaterial({
      color: '#bdc9c6',
      metalness: 0.92,
      roughness: 0.28,
      envMapIntensity: 1.5,
    });
  const plastic = () =>
    new THREE.MeshPhysicalMaterial({
      color: '#e4fffa',
      metalness: 0,
      roughness: 0.07,
      transmission: 0.92,
      thickness: 0.075,
      ior: 1.46,
      clearcoat: 1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.4,
    });
  const gum = () => new THREE.MeshStandardMaterial({ color: '#d2a29a', roughness: 0.55 });
  const presentation = new THREE.Group();
  scene.add(presentation);
  presentation.rotation.set(0, -0.14, -0.07);
  const animations: gsap.core.Animation[] = [];
  let updateAssembly = () => {};
  let updateAnnotations = () => {};
  let annotationCleanup = () => {};
  let resetAssembly = () => {};
  const smoothPhase = (value: number, start = 0, end = 1) => {
    const t = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // A fresh page always starts at the seated pose. Sticky tracks begin only
  // once the whole model has arrived, rather than while it enters the viewport.
  const scrollAssembly = (trigger: Element, sticky?: HTMLElement) => {
    const phase = { value: 0, target: 0 };
    const top = () => trigger.getBoundingClientRect().top + window.scrollY;
    const inset = () =>
      sticky
        ? parseFloat(getComputedStyle(sticky).top) || 96
        : variant === 'hero'
          ? 0
          : Math.max(96, (window.innerHeight - element.clientHeight) / 2);
    const animation = gsap.fromTo(
      phase,
      { value: 0 },
      {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: () => Math.max(0, top() - inset()),
          end: () =>
            sticky
              ? Math.max(1, top() + trigger.clientHeight - element.clientHeight - inset())
              : `+=${Math.max(240, Math.min(window.innerHeight * 0.65, element.clientHeight * 0.85))}`,
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            phase.target = self.progress;
          },
        },
      },
    );
    animations.push(animation);
    return phase;
  };
  let activeGroup: THREE.Group | undefined,
    activeView = 'tooth';
  const views = new Map<string, THREE.Group>();
  const setBase = (group: THREE.Group, y: number) => {
    group.position.y = y;
    group.userData.baseY = y;
  };
  const addNatural = () => {
    const tooth = naturalTooth(enamel());
    setBase(tooth.group, 0.12);
    return tooth;
  };
  const addLayeredTooth = () => {
    const tooth = addNatural();
    const dentin = new THREE.Mesh(molarCrown(), new THREE.MeshPhysicalMaterial({
      color: '#e7cfa4', roughness: 0.35, clearcoat: 0.2, transparent: true, opacity: 0,
    }));
    dentin.scale.set(0.76, 0.78, 0.76);
    const pulpMaterial = new THREE.MeshStandardMaterial({
      color: '#b7776c', roughness: 0.45, transparent: true, opacity: 0,
    });
    const pulp = pulpStructure(pulpMaterial);
    dentin.visible = false;
    pulp.visible = false;
    tooth.group.add(dentin, pulp);
    return { ...tooth, dentin, pulp, pulpMaterial };
  };
  const addImplant = () => {
    const assembly = implantAssembly(enamel(), titanium());
    setBase(assembly.group, -0.12);
    return assembly;
  };
  const addArch = () => {
    const arch = dentalArch(enamel(), plastic(), gum());
    // Arrival pose: an aligned arch with the tray fully seated.
    arch.teeth.forEach((tooth, i) => {
      const target = arch.targets[i];
      tooth.position.set(target.x, target.y, target.z);
      tooth.rotation.set(0, target.ry, 0);
    });
    arch.tray.position.y = 0.02;
    setBase(arch.group, -0.15);
    arch.group.rotation.x = 0.15;
    arch.group.scale.setScalar(0.92);
    return arch;
  };
  const poseTooth = (tooth: ReturnType<typeof addNatural>, phase: number) => {
    tooth.crown.position.y = phase * 0.82;
    tooth.roots.position.y = -phase * 0.2;
  };
  const poseImplant = (implant: ReturnType<typeof addImplant>, phase: number) => {
    implant.crown.position.y = 1.04 + phase * 1.05;
    implant.abutment.position.y = phase * 0.34;
    implant.screw.position.y = -phase * 0.2;
  };
  const poseArch = (arch: ReturnType<typeof addArch>, phase: number) => {
    arch.tray.position.y = 0.02 + phase * 1.15;
  };
  interface PartCallout {
    key: string;
    object: THREE.Object3D;
    anchor: THREE.Vector3;
    left: boolean;
    shift: number;
    reveal: () => number;
    view?: string;
  }
  const calloutDefinitions: PartCallout[] = [];
  const labelTooth = (tooth: ReturnType<typeof addNatural>, view?: string) => {
    calloutDefinitions.push(
      {
        key: 'tooth-enamel',
        object: tooth.crown,
        anchor: new THREE.Vector3(-0.65, 0.5, 0.8),
        left: true,
        shift: -20,
        reveal: () => 1,
        view,
      },
      {
        key: 'tooth-roots',
        object: tooth.roots,
        anchor: new THREE.Vector3(0.6, -1.18, 0.28),
        left: false,
        shift: 16,
        reveal: () => 1,
        view,
      },
    );
  };
  const labelImplant = (implant: ReturnType<typeof addImplant>, view?: string) => {
    calloutDefinitions.push(
      {
        key: 'implant-crown',
        object: implant.crown,
        anchor: new THREE.Vector3(-0.65, 0.4, 0.8),
        left: true,
        shift: -16,
        reveal: () => 1,
        view,
      },
      {
        key: 'implant-abutment',
        object: implant.abutment,
        anchor: new THREE.Vector3(0.17, 0.35, 0.17),
        left: false,
        shift: -12,
        reveal: () => 1,
        view,
      },
      {
        key: 'implant-fixture',
        object: implant.screw,
        anchor: new THREE.Vector3(-0.26, -0.86, 0.2),
        left: true,
        shift: 18,
        reveal: () => 1,
        view,
      },
    );
  };
  const labelArch = (arch: ReturnType<typeof addArch>, view?: string) => {
    calloutDefinitions.push(
      {
        key: 'aligner-tray',
        object: arch.tray,
        anchor: new THREE.Vector3(-0.4, 0.53, 0.98),
        left: true,
        shift: -32,
        reveal: () => 1,
        view,
      },
      {
        key: 'aligner-arch',
        object: arch.teeth[5],
        anchor: new THREE.Vector3(0.1, 0.26, 0.26),
        left: false,
        shift: 28,
        reveal: () => 1,
        view,
      },
    );
  };
  if (variant === 'hero') {
    const tooth = addLayeredTooth(),
      implant = addImplant(),
      arch = addArch();
    views.set('tooth', tooth.group);
    views.set('implant', implant.group);
    views.set('aligner', arch.group);
    views.forEach((group, key) => {
      group.visible = key === 'tooth';
      presentation.add(group);
    });
    activeGroup = tooth.group;
    const toothPhase = { value: 0 };
    calloutDefinitions.push(
      {key:'tooth-enamel', object:tooth.crown, anchor:new THREE.Vector3(-0.65,0.5,0.8), left:true, shift:-18, reveal:()=>1, view:'tooth'},
      {key:'tooth-dentin', object:tooth.dentin, anchor:new THREE.Vector3(0.63,0.3,0.7), left:false, shift:-8, reveal:()=>smoothPhase(toothPhase.value,0.22,0.4), view:'tooth'},
      {key:'tooth-pulp', object:tooth.pulp, anchor:new THREE.Vector3(-0.12,0.22,0.15), left:true, shift:8, reveal:()=>smoothPhase(toothPhase.value,0.72,0.9), view:'tooth'},
      {key:'tooth-roots', object:tooth.roots, anchor:new THREE.Vector3(0.6,-1.18,0.28), left:false, shift:18, reveal:()=>1, view:'tooth'},
    );
    labelImplant(implant, 'implant');
    labelArch(arch, 'aligner');
    const heroTrack = element.closest('.hero-model-track');
    const phase = scrollAssembly(
      heroTrack || element,
      heroTrack ? element.parentElement! : undefined,
    );
    let baseline = 0;
    const pose = (value: number) => {
      toothPhase.value = value;
      tooth.crown.position.y = smoothPhase(value, 0, 0.85) * 1.35;
      tooth.roots.position.y = -value * 0.45;
      tooth.dentin.position.y = smoothPhase(value, 0.2, 0.9) * 0.5;
      tooth.dentin.material.opacity = smoothPhase(value, 0.1, 0.28);
      tooth.dentin.visible = tooth.dentin.material.opacity > 0.005;
      tooth.pulp.position.y = -value * 0.18;
      tooth.pulpMaterial.opacity = smoothPhase(value, 0.32, 0.54);
      tooth.pulp.visible = tooth.pulpMaterial.opacity > 0.005;
      poseImplant(implant, value);
      poseArch(arch, value);
      // Ease the framing back as the parts spread so the complete model stays visible.
      camera.position.set(3.8, 2.65, 8.7 + value * 3.8);
      camera.lookAt(0, -0.2 + value * (activeView === 'tooth' ? -0.25 : 0.35), 0);
    };
    resetAssembly = () => {
      // Selecting another model near the end gives it a fresh scroll sequence
      // while the hero remains stationary, rather than releasing it immediately.
      if (heroTrack instanceof HTMLElement && phase.target > 0.7) {
        heroTrack.style.minHeight = `${heroTrack.clientHeight + window.innerHeight * 0.85}px`;
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      }
      baseline = phase.target;
      phase.value = baseline;
      pose(0);
    };
    updateAssembly = () =>
      pose(smoothPhase((phase.value - baseline) / Math.max(0.05, 1 - baseline), 0.04, 0.86));
    const scroll = gsap.timeline({
      scrollTrigger: {
        trigger: element.closest('.hero-v2'),
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
    scroll
      .to(presentation.rotation, { y: 0.28, z: 0.06, duration: 1 }, 0)
      .to(presentation.position, { y: 0.25, x: 0.15, duration: 1 }, 0);
    animations.push(scroll);
  } else if (variant === 'anatomy') {
    camera.position.set(2.8, 1.8, 11.4);
    camera.lookAt(0, 0.12, 0);
    const tooth = addNatural(),
      dentin = new THREE.Mesh(
        molarCrown(),
        new THREE.MeshPhysicalMaterial({
          color: '#e7cfa4',
          roughness: 0.35,
          clearcoat: 0.2,
        }),
      );
    dentin.scale.set(0.76, 0.78, 0.76);
    const pulpMaterial = new THREE.MeshStandardMaterial({
      color: '#b7776c',
      roughness: 0.45,
      transparent: true,
      opacity: 0,
    });
    const pulp = pulpStructure(pulpMaterial);
    pulp.visible = false;
    dentin.visible = false;
    dentin.material.transparent = true;
    presentation.add(tooth.group, dentin, pulp);
    activeGroup = tooth.group;
    const track = element.closest('.anatomy-visual-track') || element;
    const phase = scrollAssembly(track, element.closest<HTMLElement>('.anatomy-art') || undefined);
    updateAssembly = () => {
      const crownPhase = smoothPhase(phase.value, 0.06, 0.72);
      const dentinPhase = smoothPhase(phase.value, 0.2, 0.88);
      tooth.crown.position.set(crownPhase * 0.12, crownPhase * 1.8, 0);
      tooth.roots.position.y = -smoothPhase(phase.value, 0.12, 0.8) * 0.65;
      dentin.position.set(-dentinPhase * 0.08, dentinPhase * 0.62, 0);
      dentin.material.opacity = smoothPhase(phase.value, 0.1, 0.28);
      dentin.visible = dentin.material.opacity > 0.005;
      pulp.position.y = -smoothPhase(phase.value, 0.3, 0.85) * 0.18;
      pulpMaterial.opacity = smoothPhase(phase.value, 0.32, 0.54);
      pulp.visible = pulpMaterial.opacity > 0.005;
      presentation.rotation.y = -0.14 + crownPhase * 0.38;
    };
    calloutDefinitions.push(
      ...[
        {
          key: 'enamel',
          object: tooth.crown,
          anchor: new THREE.Vector3(-0.65, 0.5, 0.8),
          left: true,
          shift: -18,
          reveal: () => 1,
        },
        {
          key: 'dentin',
          object: dentin,
          anchor: new THREE.Vector3(0.63, 0.3, 0.7),
          left: false,
          shift: -8,
          reveal: () => smoothPhase(phase.value, 0.24, 0.4),
        },
        {
          key: 'pulp',
          object: pulp,
          anchor: new THREE.Vector3(-0.12, 0.22, 0.15),
          left: true,
          shift: 8,
          reveal: () => smoothPhase(phase.value, 0.72, 0.9),
        },
        {
          key: 'roots',
          object: tooth.roots,
          anchor: new THREE.Vector3(0.6, -1.18, 0.28),
          left: false,
          shift: 18,
          reveal: () => 1,
        },
      ],
    );
  } else if (variant === 'aligner') {
    const fullSection = element.closest('[data-aligner-section]');
    camera.fov = fullSection ? 28 : 30;
    camera.position.set(0.2, 2.3, fullSection ? 5.6 : 6.8);
    camera.lookAt(0, fullSection ? 0.5 : 0.3, 0);
    const arch = addArch();
    labelArch(arch);
    presentation.add(arch.group);
    activeGroup = arch.group;
    const track = element.closest('.aligner-visual-track');
    const phase = scrollAssembly(track || element, track ? element : undefined);
    updateAssembly = () => poseArch(arch, smoothPhase(phase.value, 0.08, 0.95));
  } else if (variant === 'implant') {
    const implant = addImplant();
    labelImplant(implant);
    presentation.add(implant.group);
    activeGroup = implant.group;
    const phase = scrollAssembly(element);
    updateAssembly = () => poseImplant(implant, smoothPhase(phase.value, 0.08, 0.95));
  } else {
    const tooth = addNatural();
    labelTooth(tooth);
    presentation.add(tooth.group);
    activeGroup = tooth.group;
    presentation.scale.setScalar(0.88);
    const phase = scrollAssembly(element);
    updateAssembly = () => poseTooth(tooth, smoothPhase(phase.value, 0.08, 0.95));
  }

  // Project moving mesh anchors onto a shared, responsive SVG overlay.
  const svg = element.querySelector<SVGSVGElement>('.scene-leaders');
  const point = new THREE.Vector3();
  const callouts = calloutDefinitions.map((callout) => ({
    ...callout,
    label: element.querySelector<HTMLElement>(`[data-scene-label="${callout.key}"]`)!,
    group: element.querySelector<SVGGElement>(`[data-scene-leader="${callout.key}"]`)!,
    line: element.querySelector<SVGPathElement>(`[data-scene-leader="${callout.key}"] path`)!,
    dot: element.querySelector<SVGCircleElement>(`[data-scene-leader="${callout.key}"] circle`)!,
    width: 0,
    height: 0,
  }));
  let width = 0,
    height = 0;
  const sizeCallouts = () => {
    width = element.clientWidth;
    height = element.clientHeight;
    svg?.setAttribute('viewBox', `0 0 ${width} ${height}`);
    callouts.forEach((callout) => {
      callout.width = callout.label.offsetWidth;
      callout.height = callout.label.offsetHeight;
    });
    if (variant === 'anatomy') camera.zoom = width < 400 ? 0.82 : 1;
    camera.updateProjectionMatrix();
  };
  const calloutObserver = new ResizeObserver(sizeCallouts);
  calloutObserver.observe(element);
  sizeCallouts();
  updateAnnotations = () => {
    if (!width || !height) return;
    const previous = { left: -80, right: -80 };
    callouts.forEach((callout) => {
      const visible = !callout.view || callout.view === activeView;
      if (!visible) {
        callout.label.style.opacity = '0';
        callout.group.style.opacity = '0';
        return;
      }
      point.copy(callout.anchor);
      callout.object.localToWorld(point);
      point.project(camera);
      const x = (point.x * 0.5 + 0.5) * width;
      const y = (-point.y * 0.5 + 0.5) * height;
      const side = callout.left ? 'left' : 'right';
      const labelY = THREE.MathUtils.clamp(
        Math.max(y + callout.shift, previous[side] + 56),
        variant === 'hero' ? 90 : 24,
        height - (variant === 'hero' ? 140 : 28),
      );
      previous[side] = labelY;
      // Keep upper labels inside the hero's curved arch rather than clipping them.
      const archRadius = height * 0.48;
      const archInset =
        variant === 'hero' && labelY < archRadius
          ? width *
            0.48 *
            (1 - Math.sqrt(Math.max(0, 1 - ((archRadius - labelY) / archRadius) ** 2)))
          : 0;
      const margin = Math.max(8, archInset + (variant === 'hero' ? 12 : 0));
      const labelX = callout.left ? margin : width - callout.width - margin;
      callout.label.style.transform = `translate3d(${labelX}px,${labelY - callout.height / 2}px,0)`;
      const startX = callout.left ? labelX + callout.width + 5 : labelX - 5;
      const elbowX = startX + Math.sign(x - startX) * Math.min(18, Math.abs(x - startX) / 2);
      callout.line.setAttribute(
        'd',
        `M${startX.toFixed(1)},${labelY.toFixed(1)}H${elbowX.toFixed(1)}L${x.toFixed(1)},${y.toFixed(1)}`,
      );
      callout.dot.setAttribute('cx', x.toFixed(1));
      callout.dot.setAttribute('cy', y.toFixed(1));
      const opacity = String(callout.reveal());
      callout.label.style.opacity = opacity;
      callout.group.style.opacity = opacity;
    });
  };
  annotationCleanup = () => calloutObserver.disconnect();

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const context = shadowCanvas.getContext('2d');
  let shadowTexture: THREE.CanvasTexture | undefined;
  if (context) {
    const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 124);
    gradient.addColorStop(0, 'rgba(25,60,49,.25)');
    gradient.addColorStop(0.5, 'rgba(25,60,49,.11)');
    gradient.addColorStop(1, 'rgba(25,60,49,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = variant === 'aligner' ? -0.85 : -2.13;
    scene.add(shadow);
  }
  const controls = element.querySelectorAll<HTMLButtonElement>('[data-scene-view]');
  const captions: Record<string, [string, string]> = {
    tooth: ['01 / NATURAL TOOTH', 'Considered care. Every layer.'],
    implant: ['02 / DENTAL IMPLANT', 'A foundation for everyday life.'],
    aligner: ['03 / CLEAR ALIGNERS', 'Small movements. A considered plan.'],
  };
  let switchTimeline: gsap.core.Timeline | undefined;
  const setView = (view: string) => {
    if (view === activeView || !views.has(view)) return;
    switchTimeline?.progress(1).kill();
    const old = activeGroup!,
      next = views.get(view)!;
    activeView = view;
    resetAssembly();
    element.classList.add('is-model-switching');
    controls.forEach((control) =>
      control.setAttribute('aria-pressed', String(control.dataset.sceneView === view)),
    );
    const label = element.querySelector('[data-scene-title]'),
      sub = element.querySelector('[data-scene-subtitle]');
    if (label) label.textContent = captions[view][0];
    if (sub) sub.textContent = captions[view][1];
    switchTimeline = gsap.timeline({
      onComplete: () => {
        old.visible = false;
        activeGroup = next;
        element.classList.remove('is-model-switching');
      },
    });
    switchTimeline
      .to(old.scale, { x: 0.05, y: 0.05, z: 0.05, duration: 0.42, ease: 'power3.in' }, 0)
      .call(
        () => {
          old.visible = false;
          next.visible = true;
          next.scale.setScalar(0.05);
        },
        [],
        0.38,
      )
      .to(
        next.scale,
        {
          x: view === 'aligner' ? 0.92 : 1,
          y: view === 'aligner' ? 0.92 : 1,
          z: view === 'aligner' ? 0.92 : 1,
          duration: 0.65,
          ease: 'power3.out',
        },
        0.38,
      );
  };
  const controlEvents = new Map<HTMLButtonElement, () => void>();
  controls.forEach((control) => {
    const handler = () => setView(control.dataset.sceneView || 'tooth');
    controlEvents.set(control, handler);
    control.disabled = false;
    control.addEventListener('click', handler);
  });
  const pointer = new THREE.Vector2(),
    damped = new THREE.Vector2();
  let visible = false,
    ticking = false,
    destroyed = false;
  const onMove = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect();
    pointer.set(
      (event.clientX - bounds.left) / bounds.width - 0.5,
      (event.clientY - bounds.top) / bounds.height - 0.5,
    );
  };
  const onLeave = () => pointer.set(0, 0);
  element.addEventListener('pointermove', onMove);
  element.addEventListener('pointerleave', onLeave);
  const resize = () => {
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(element);
  resize();
  const draw = (time: number, delta: number) => {
    if (!visible || document.hidden || destroyed || document.body.classList.contains('menu-open'))
      return;
    damped.lerp(pointer, 1 - Math.exp(-Math.min(delta, 50) / 180));
    scene.rotation.y = damped.x * 0.13;
    scene.rotation.x = damped.y * 0.08;
    if (activeGroup && (variant === 'hero' || variant === 'accent' || variant === 'implant')) {
      activeGroup.position.y =
        Number(activeGroup.userData.baseY || 0) + Math.sin(time * 0.65) * 0.055;
      activeGroup.rotation.y = Math.sin(time * 0.18) * 0.055;
    }
    updateAssembly();
    renderer.render(scene, camera);
    updateAnnotations();
    element.classList.add('has-webgl');
  };
  const stop = () => {
    gsap.ticker.remove(draw);
    ticking = false;
  };
  const start = () => {
    if (visible && !document.hidden && !ticking && !destroyed) {
      gsap.ticker.add(draw);
      ticking = true;
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    },
    { threshold: 0.01 },
  );
  observer.observe(element);
  const visibility = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener('visibilitychange', visibility);
  const contextLost = (event: Event) => {
    event.preventDefault();
    visible = false;
    stop();
    element.classList.remove('has-webgl');
    controls.forEach((control) => (control.disabled = true));
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  return () => {
    destroyed = true;
    stop();
    observer.disconnect();
    resizeObserver.disconnect();
    annotationCleanup();
    document.removeEventListener('visibilitychange', visibility);
    element.removeEventListener('pointermove', onMove);
    element.removeEventListener('pointerleave', onLeave);
    controlEvents.forEach((handler, control) => {
      control.removeEventListener('click', handler);
      control.disabled = true;
    });
    animations.forEach((animation) => {
      animation.scrollTrigger?.kill();
      animation.kill();
    });
    switchTimeline?.kill();
    const geometries = new Set<THREE.BufferGeometry>(),
      materials = new Set<THREE.Material>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        geometries.add(object.geometry);
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) =>
          materials.add(material),
        );
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    shadowTexture?.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    element.classList.remove('has-webgl');
  };
}
