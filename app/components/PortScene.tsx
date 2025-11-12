"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  Text,
} from "@react-three/drei";
import { BackSide, Color, Group, Shape, Vector3, type ShaderMaterial } from "three";

type ShapePoints = readonly [number, number][];

type LandmassDefinition = {
  name: string;
  points: ShapePoints;
  height: number;
  color: string;
  elevation?: number;
  labelPosition?: [number, number, number];
  roughness?: number;
  metalness?: number;
};

const harborLandmasses: LandmassDefinition[] = [
  {
    name: "San Pedro",
    points: [
      [-27, 12],
      [-32, 6],
      [-33, 1],
      [-32, -5],
      [-29, -10],
      [-22, -12],
      [-15, -11],
      [-11, -6],
      [-13, 0],
      [-18, 6],
      [-22, 11],
    ],
    height: 3.6,
    color: "#354b32",
    elevation: 1,
    labelPosition: [-23, 5.4, -2],
  },
  {
    name: "Terminal Island",
    points: [
      [-12, 6],
      [-17, 3],
      [-19, -2],
      [-17, -6],
      [-10, -9],
      [-3, -9.4],
      [4, -7.5],
      [9, -4],
      [11, 1],
      [9, 5.6],
      [3, 7.4],
    ],
    height: 2.6,
    color: "#3f5934",
    elevation: 0.6,
    labelPosition: [-4, 3.8, -1],
  },
  {
    name: "Port of Long Beach",
    points: [
      [11, 10],
      [6, 5],
      [9, 1],
      [16, -3],
      [22, -5],
      [29, -4],
      [34, 1],
      [34, 6],
      [29, 11],
      [21, 13],
    ],
    height: 3.1,
    color: "#365236",
    elevation: 1,
    labelPosition: [20, 6.2, 2],
  },
];

const berthShapes: LandmassDefinition[] = [
  {
    name: "Outer Harbor",
    points: [
      [-18, -4],
      [-8, -1],
      [2, -1.4],
      [8, -3.4],
      [10, -5.4],
      [2, -9.2],
      [-10, -10.2],
      [-16, -7.8],
    ],
    height: 1.1,
    color: "#425a47",
    elevation: 0.3,
  },
  {
    name: "Pier 400",
    points: [
      [4, -6.5],
      [10, -6.6],
      [16, -7.5],
      [19, -9],
      [15, -12.4],
      [8, -12],
      [2, -10],
    ],
    height: 1.4,
    color: "#3a4f3d",
    elevation: 0.3,
  },
  {
    name: "Gerald Desmond",
    points: [
      [12, 4],
      [16, 3],
      [21, 4],
      [24, 6.4],
      [21, 8.6],
      [15, 7.6],
    ],
    height: 1.2,
    color: "#3a4f3d",
    elevation: 0.4,
  },
];

const breakwaterPoints: ShapePoints = [
  [-35, -14],
  [30, -14],
  [32, -12.6],
  [-37, -12.6],
];

const toShape = (points: ShapePoints) => {
  const shape = new Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  });
  shape.closePath();
  return shape;
};

const LandMass = ({ definition }: { definition: LandmassDefinition }) => {
  const shape = useMemo(() => toShape(definition.points), [definition.points]);
  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        position={[0, definition.elevation ?? 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <extrudeGeometry args={[shape, { depth: definition.height, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={definition.color}
          roughness={definition.roughness ?? 0.85}
          metalness={definition.metalness ?? 0.15}
        />
      </mesh>
      {definition.labelPosition ? (
        <Text
          position={definition.labelPosition}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.6}
          color="#d8e7ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.12}
          outlineColor="rgba(3,17,30,0.65)"
        >
          {definition.name}
        </Text>
      ) : null}
    </group>
  );
};

const Breakwater = () => {
  const shape = useMemo(() => toShape(breakwaterPoints), []);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.2, -2]}
      receiveShadow
      castShadow
    >
      <extrudeGeometry args={[shape, { depth: 1.1, bevelEnabled: false }]} />
      <meshStandardMaterial color="#5d686f" roughness={0.9} metalness={0.05} />
    </mesh>
  );
};

const ContainerStack = ({
  position,
  columns = 4,
  rows = 2,
  levels = 3,
}: {
  position: [number, number, number];
  columns?: number;
  rows?: number;
  levels?: number;
}) => {
  const colors = [
    "#d24c32",
    "#376cc5",
    "#3ba86b",
    "#f7a11b",
    "#c0397b",
  ];
  const containerSize: [number, number, number] = [2.4, 1.05, 1.1];

  const boxes: JSX.Element[] = [];
  for (let y = 0; y < levels; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      for (let z = 0; z < rows; z += 1) {
        const color = colors[(x + z + y) % colors.length];
        boxes.push(
          <mesh
            key={`container-${position.join("-")}-${x}-${y}-${z}`}
            position={[
              position[0] + (x - (columns - 1) / 2) * (containerSize[0] * 0.92),
              position[1] + y * containerSize[1] + containerSize[1] / 2,
              position[2] + (z - (rows - 1) / 2) * (containerSize[2] * 1.02),
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={containerSize} />
            <meshStandardMaterial
              color={color}
              roughness={0.35}
              metalness={0.25}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      }
    }
  }

  return <group>{boxes}</group>;
};

const ContainerCrane = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
      <boxGeometry args={[0.6, 3.2, 0.6]} />
      <meshStandardMaterial color="#9fb6d9" metalness={0.5} roughness={0.3} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 3.1, -2]}>
      <boxGeometry args={[0.5, 0.5, 4]} />
      <meshStandardMaterial color="#b7c9e5" metalness={0.4} roughness={0.4} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 4.2, -3]}>
      <boxGeometry args={[0.3, 2.2, 0.3]} />
      <meshStandardMaterial color="#d7e3f7" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

const HarborLighting = () => (
  <group>
    <ambientLight intensity={0.4} color="#bcd5ff" />
    <directionalLight
      castShadow
      position={[60, 60, 30]}
      intensity={1.6}
      color="#f7f1df"
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
    <pointLight position={[-10, 10, 25]} intensity={0.5} color="#7bb0ff" />
    <pointLight position={[24, 6, -18]} intensity={0.4} color="#ffce8a" />
  </group>
);

const WaterSurface = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLowColor: { value: new Color("#07263a") },
      uHighColor: { value: new Color("#1a6c94") },
      uFoamColor: { value: new Color("#87c8ff") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.15, 0]} receiveShadow>
      <planeGeometry args={[160, 160, 256, 256]} />
      <shaderMaterial
        ref={shaderRef}
        transparent={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;

          float wave(vec2 samplePosition, float speed, float scale, float amp) {
            float t = uTime * speed;
            return sin((samplePosition.x + t) * scale) * amp + cos((samplePosition.y - t * 0.8) * scale * 0.8) * amp * 0.6;
          }

          void main() {
            vUv = uv;
            vec3 transformed = position;
            vec2 planarPosition = position.xy;
            float elevation = wave(planarPosition, 0.18, 0.45, 0.7);
            elevation += wave(planarPosition * 1.4, 0.26, 0.8, 0.35);
            elevation += wave(planarPosition * 2.2, 0.4, 1.4, 0.18);
            transformed.z += elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uLowColor;
          uniform vec3 uHighColor;
          uniform vec3 uFoamColor;
          varying vec2 vUv;

          void main() {
            float fresnel = pow(1.0 - vUv.y, 2.6);
            float foam = smoothstep(0.45, 0.9, fresnel);
            vec3 base = mix(uLowColor, uHighColor, vUv.y + fresnel * 0.2);
            vec3 color = mix(base, uFoamColor, foam * 0.35);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

const HarborDetails = () => (
  <group>
    {berthShapes.map((definition) => (
      <LandMass key={definition.name} definition={definition} />
    ))}
    <Breakwater />
    <group>
      {[-32, -24, -14, -4, 6, 16, 26].map((x, index) => (
        <group key={`breakwater-light-${index}`} position={[x, 0.4, -12.6]}>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.8, 10]} />
            <meshStandardMaterial color="#4d5459" roughness={0.7} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#ffde8d" emissive="#ffce63" emissiveIntensity={0.9} />
          </mesh>
          <pointLight position={[0, 1.1, 0]} intensity={0.6} distance={6} color={index % 2 === 0 ? "#ffcf70" : "#7ecbff"} />
        </group>
      ))}
    </group>
    <group position={[6, 0, -5]}>
      <ContainerStack position={[0, 0.4, 0]} columns={5} rows={3} levels={3} />
      <ContainerStack position={[8, 0.4, -3]} columns={5} rows={3} levels={2} />
      <ContainerStack position={[-7, 0.4, -2]} columns={4} rows={2} levels={2} />
      <ContainerCrane position={[0, 0, 5]} />
      <ContainerCrane position={[4, 0, 4]} />
      <ContainerCrane position={[-4, 0, 4.2]} />
    </group>
    <group position={[18, 0.1, 6]}>
      <ContainerStack position={[0, 0.4, 0]} columns={4} rows={2} levels={3} />
      <ContainerStack position={[6, 0.4, -2]} columns={4} rows={2} levels={2} />
      <ContainerCrane position={[0, 0, 4.6]} />
      <ContainerCrane position={[4, 0, 4.8]} />
    </group>
    <group position={[-16, 0, 3]}>
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.6}>
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 3.6, 12]} />
          <meshStandardMaterial color="#ffb347" emissive="#ff7b00" emissiveIntensity={0.4} />
        </mesh>
      </Float>
      <Text
        position={[0, 4.2, 0]}
        fontSize={0.9}
        color="#ffe5b4"
        anchorX="center"
        anchorY="middle"
      >
        Angels Gate
      </Text>
    </group>
  </group>
);

const HarborVessel = ({ speed = 0.03, offset = 0 }: { speed?: number; offset?: number }) => {
  const group = useRef<Group>(null);
  const hullColor = useMemo(() => new Color("#24323f"), []);
  const superstructureColor = useMemo(() => new Color("#d9dede"), []);
  const center = useMemo(() => new Vector3(-6, 0, 2), []);
  const tempPosition = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = (clock.elapsedTime * speed + offset) % 1;
    const angle = 0.6 + t * Math.PI * 0.8;
    const radius = 14;
    tempPosition.set(
      center.x + Math.cos(angle) * radius,
      0.9,
      center.z + Math.sin(angle) * radius * 0.6
    );
    group.current.position.copy(tempPosition);
    group.current.rotation.y = -(angle + Math.PI / 2);
  });

  return (
    <group ref={group} castShadow>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[6.2, 1.2, 1.8]} />
        <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.8, 1.1, 0]}>
        <boxGeometry args={[2.6, 1.3, 1.4]} />
        <meshStandardMaterial color={superstructureColor} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh castShadow position={[-1.6, 1.2, 0]}>
        <boxGeometry args={[1.8, 0.9, 1.4]} />
        <meshStandardMaterial color={superstructureColor} roughness={0.35} metalness={0.22} />
      </mesh>
      <mesh position={[2.2, 1.5, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.9, 16]} />
        <meshStandardMaterial color="#f9d776" emissive="#f4c06b" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
};

const Atmosphere = () => (
  <group>
    <mesh scale={160} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#071525" side={BackSide} depthWrite={false} />
    </mesh>
  </group>
);

const SceneContent = () => (
  <group position={[0, 0, 0]}>
    <WaterSurface />
    {harborLandmasses.map((definition) => (
      <LandMass key={definition.name} definition={definition} />
    ))}
    <HarborDetails />
    <HarborVessel speed={0.027} offset={0} />
    <HarborVessel speed={0.032} offset={0.42} />
    <HarborLighting />
    <Atmosphere />
    <Environment resolution={256}>
      <group rotation={[0, Math.PI / 2.6, 0]}>
        <Lightformer
          form="ring"
          intensity={1.1}
          scale={[20, 20, 1]}
          position={[0, 20, -20]}
          color="#87a8ff"
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          scale={[10, 10, 1]}
          position={[-25, 15, 10]}
          color="#ffe1a6"
        />
      </group>
    </Environment>
  </group>
);

const CanvasContainer = () => (
  <div className="absolute inset-0">
    <Canvas
      shadows
      dpr={[1, 2.5]}
      camera={{ position: [28, 26, 44], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#03101e"]} />
      <fog attach="fog" args={["#03101e", 60, 150]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 5}
        minDistance={30}
        maxDistance={120}
        target={[0, 2.2, 0]}
      />
    </Canvas>
  </div>
);

export default function PortScene() {
  return <CanvasContainer />;
}

