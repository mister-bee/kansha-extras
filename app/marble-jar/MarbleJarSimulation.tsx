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

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 }
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

    // Create jar walls (tapered jar shape)
    const jarHeight = 500;
    const jarTopWidth = 300;
    const jarBottomWidth = 200;
    const jarY = 150;
    const jarX = 400;

    // Bottom of jar
    const bottom = Matter.Bodies.rectangle(jarX, jarY + jarHeight / 2, jarBottomWidth, 20, {
      isStatic: true,
      render: {
        fillStyle: '#8B4513',
        strokeStyle: '#654321',
        lineWidth: 3
      }
    });

    // Left wall (angled)
    const leftWall = Matter.Bodies.trapezoid(
      jarX - jarBottomWidth / 2 + 15,
      jarY + jarHeight / 4,
      20,
      jarHeight / 2,
      0.3,
      {
        isStatic: true,
        angle: Math.PI * 0.08,
        render: {
          fillStyle: 'rgba(139, 69, 19, 0.3)',
          strokeStyle: '#8B4513',
          lineWidth: 3
        }
      }
    );

    // Right wall (angled)
    const rightWall = Matter.Bodies.trapezoid(
      jarX + jarBottomWidth / 2 - 15,
      jarY + jarHeight / 4,
      20,
      jarHeight / 2,
      0.3,
      {
        isStatic: true,
        angle: -Math.PI * 0.08,
        render: {
          fillStyle: 'rgba(139, 69, 19, 0.3)',
          strokeStyle: '#8B4513',
          lineWidth: 3
        }
      }
    );

    // Top left wall (wider part)
    const topLeftWall = Matter.Bodies.rectangle(
      jarX - jarTopWidth / 2 + 10,
      jarY - jarHeight / 4,
      20,
      jarHeight / 2,
      {
        isStatic: true,
        angle: Math.PI * 0.05,
        render: {
          fillStyle: 'rgba(139, 69, 19, 0.3)',
          strokeStyle: '#8B4513',
          lineWidth: 3
        }
      }
    );

    // Top right wall (wider part)
    const topRightWall = Matter.Bodies.rectangle(
      jarX + jarTopWidth / 2 - 10,
      jarY - jarHeight / 4,
      20,
      jarHeight / 2,
      {
        isStatic: true,
        angle: -Math.PI * 0.05,
        render: {
          fillStyle: 'rgba(139, 69, 19, 0.3)',
          strokeStyle: '#8B4513',
          lineWidth: 3
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

    // Function to create a marble
    const createMarble = () => {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const marble = Matter.Bodies.circle(
        jarX + (Math.random() - 0.5) * 100,
        -50,
        15,
        {
          restitution: 0.6,
          friction: 0.1,
          density: 0.04,
          render: {
            fillStyle: color,
            strokeStyle: '#ffffff',
            lineWidth: 2
          }
        }
      );

      Matter.Composite.add(engine.world, marble);
      setMarbleCount(prev => prev + 1);
    };

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
        <canvas 
          ref={canvasRef}
          className="rounded-2xl shadow-2xl"
          style={{ border: '4px solid rgba(255, 255, 255, 0.3)' }}
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

