import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/UI/resizable.jsx";
import RecLeft from "../components/sidebar/leftSidebar/recLeft.jsx";
import RecChat from "../components/chatbot/recChat.jsx";
import RectRight from "../components/sidebar/rightSidebar/rectRight.jsx";
import LiquidEther from "../components/UI/liquidEther.jsx";
import Particles from "../components/UI/particles.jsx";
import { useState } from "react";

export default function Dashboard() {
  const [isLeftSidebarMinimized, setIsLeftSidebarMinimized] = useState(false);

  const handleMinimizeChange = (isMinimized) => {
    setIsLeftSidebarMinimized(isMinimized);
  };

  // Calcular tamaños dinámicamente basado en el estado del sidebar
  const leftPanelSize = isLeftSidebarMinimized ? 8 : 35;
  const rightPanelSize = isLeftSidebarMinimized ? 92 : 65;

  return (
    <div className="h-screen bg-gradient-to-b from-[#030409] via-[#091437] to-[#1A3A9D] relative flex flex-col">
      {/* LiquidEther - Capa más baja (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay">
        <LiquidEther
          colors={['#00B8EB', '#00B8EB', '#00B8EB']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.2}
          autoIntensity={2.5}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Particles - Capa intermedia (z-5) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <Particles/>
      </div>
      
      {/* Dashboard content - Capa superior (z-10) */}
      <div className="flex flex-1 gap-2 relative z-10 p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 rounded-lg border border-white/0"
        >
          <ResizablePanel 
            defaultSize={leftPanelSize} 
            size={leftPanelSize}
            minSize={isLeftSidebarMinimized ? 8 : 30} 
            maxSize={isLeftSidebarMinimized ? 8 : 60}
          >
            <div className="h-full pr-2">
              <RecLeft onMinimizeChange={handleMinimizeChange} />
            </div>
          </ResizablePanel>

          {!isLeftSidebarMinimized && (
            <ResizableHandle className="bg-transparent hover:bg-white/10 transition-colors" />
          )}

          <ResizablePanel 
            defaultSize={rightPanelSize}
            size={rightPanelSize} 
            minSize={40}
          >
            <div className="h-full">
              <RecChat />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="h-full w-80">
          <RectRight />
        </div>
      </div>
    </div>
  );
}
