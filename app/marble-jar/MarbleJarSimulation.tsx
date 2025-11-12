'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function MarbleJarSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [marbleCount, setMarbleCount] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine with realistic gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.98 } // More realistic gravity
    });
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 700,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    // Jar dimensions
    const jarHeight = 500;
    const jarTopWidth = 280;
    const jarBottomWidth = 200;
    const jarY = 150;
    const jarX = 400;
    const wallThickness = 8;

    // Bottom of jar (glass)
    const bottom = Matter.Bodies.rectangle(
      jarX,
      jarY + jarHeight / 2,
      jarBottomWidth,
      wallThickness * 2,
      {
        isStatic: true,
        friction: 0.3,
        render: {
          fillStyle: 'rgba(200, 230, 255, 0.15)',
          strokeStyle: 'rgba(150, 200, 255, 0.6)',
          lineWidth: 3
        }
      }
    );

    // Left wall (angled for tapered jar shape)
    const leftWall = Matter.Bodies.trapezoid(
      jarX - jarBottomWidth / 2 + 12,
      jarY + jarHeight / 4,
      wallThickness,
      jarHeight / 2,
      0.3,
      {
        isStatic: true,
        friction: 0.3,
        angle: Math.PI * 0.08,
        render: {
          fillStyle: 'rgba(200, 230, 255, 0.12)',
          strokeStyle: 'rgba(150, 200, 255, 0.5)',
          lineWidth: 2.5
        }
      }
    );

    // Right wall (angled)
    const rightWall = Matter.Bodies.trapezoid(
      jarX + jarBottomWidth / 2 - 12,
      jarY + jarHeight / 4,
      wallThickness,
      jarHeight / 2,
      0.3,
      {
        isStatic: true,
        friction: 0.3,
        angle: -Math.PI * 0.08,
        render: {
          fillStyle: 'rgba(200, 230, 255, 0.12)',
          strokeStyle: 'rgba(150, 200, 255, 0.5)',
          lineWidth: 2.5
        }
      }
    );

    // Top left wall (wider part)
    const topLeftWall = Matter.Bodies.rectangle(
      jarX - jarTopWidth / 2 + 8,
      jarY - jarHeight / 4,
      wallThickness,
      jarHeight / 2,
      {
        isStatic: true,
        friction: 0.3,
        angle: Math.PI * 0.05,
        render: {
          fillStyle: 'rgba(200, 230, 255, 0.12)',
          strokeStyle: 'rgba(150, 200, 255, 0.5)',
          lineWidth: 2.5
        }
      }
    );

    // Top right wall (wider part)
    const topRightWall = Matter.Bodies.rectangle(
      jarX + jarTopWidth / 2 - 8,
      jarY - jarHeight / 4,
      wallThickness,
      jarHeight / 2,
      {
        isStatic: true,
        friction: 0.3,
        angle: -Math.PI * 0.05,
        render: {
          fillStyle: 'rgba(200, 230, 255, 0.12)',
          strokeStyle: 'rgba(150, 200, 255, 0.5)',
          lineWidth: 2.5
        }
      }
    );

    // Add all jar parts to world
    Matter.Composite.add(engine.world, [
      bottom,
      leftWall,
      rightWall,
      topLeftWall,
      topRightWall
    ]);

    // Store marble colors for custom rendering
    const marbleColors = new Map<Matter.Body, string>();

    // Function to create a realistic marble with custom rendering
    const createMarble = () => {
      const baseColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#FF8B94', '#7FDBFF', '#2ECC71', '#E74C3C'
      ];
      const color = baseColors[Math.floor(Math.random() * baseColors.length)];

      const marble = Matter.Bodies.circle(
        jarX + (Math.random() - 0.5) * 120,
        -50,
        16, // Slightly larger
        {
          restitution: 0.5, // Realistic bounce
          friction: 0.15,
          frictionAir: 0.001,
          density: 0.008, // Heavier, more realistic
          slop: 0.05,
          render: {
            fillStyle: color,
            strokeStyle: 'rgba(255, 255, 255, 0.3)',
            lineWidth: 0
          }
        }
      );

      marbleColors.set(marble, color);
      Matter.Composite.add(engine.world, marble);
      setMarbleCount(prev => prev + 1);
    };

    // Custom rendering for 3D marble effect
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      bodies.forEach((body) => {
        if (body.isStatic) return; // Skip jar walls

        const baseColor = marbleColors.get(body);
        if (!baseColor) return;

        const { x, y } = body.position;
        const radius = body.circleRadius || 16;

        // Create radial gradient for 3D sphere effect
        const gradient = context.createRadialGradient(
          x - radius * 0.3, // Offset highlight position
          y - radius * 0.3,
          radius * 0.1,
          x,
          y,
          radius
        );

        // Parse base color and create lighter/darker versions
        const lighterColor = lightenColor(baseColor, 60);
        const darkerColor = darkenColor(baseColor, 30);

        gradient.addColorStop(0, lighterColor); // Bright highlight
        gradient.addColorStop(0.3, baseColor); // Base color
        gradient.addColorStop(0.8, darkerColor); // Shadow
        gradient.addColorStop(1, darkenColor(baseColor, 50)); // Deep shadow

        // Draw marble with gradient
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = gradient;
        context.fill();

        // Add specular highlight for glossy effect
        const highlightGradient = context.createRadialGradient(
          x - radius * 0.35,
          y - radius * 0.35,
          0,
          x - radius * 0.35,
          y - radius * 0.35,
          radius * 0.5
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.beginPath();
        context.arc(x - radius * 0.35, y - radius * 0.35, radius * 0.45, 0, 2 * Math.PI);
        context.fillStyle = highlightGradient;
        context.fill();

        // Add subtle rim light
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        context.lineWidth = 1.5;
        context.stroke();
      });
    });

    // Helper function to lighten color
    function lightenColor(color: string, percent: number): string {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, (num >> 16) + amt);
      const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
      const B = Math.min(255, (num & 0x0000FF) + amt);
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    // Helper function to darken color
    function darkenColor(color: string, percent: number): string {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
      const B = Math.max(0, (num & 0x0000FF) - amt);
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    // Spacebar event listener
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        createMarble();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Run the engine and renderer
    Matter.Runner.run(engine);
    Matter.Render.run(render);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Glass jar overlay effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            mixBlendMode: 'overlay'
          }}
        />
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-2xl"
          style={{
            border: '2px solid rgba(200, 230, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.1)'
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-2 text-white">
        <p className="text-2xl font-semibold">
          Marbles: {marbleCount}
        </p>
        <p className="text-lg opacity-90">
          Press <kbd className="px-3 py-1 bg-white/20 rounded-lg font-mono">SPACE</kbd> to add a marble
        </p>
      </div>
    </div>
  );
}
