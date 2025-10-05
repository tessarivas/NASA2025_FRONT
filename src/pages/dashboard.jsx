import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/UI/resizable.jsx";
import RecLeft from "../components/sidebar/leftSidebar/recLeft.jsx";
import RecChat from "../components/chatbot/recChat.jsx";
import RectRight from "../components/sidebar/rightSidebar/rectRight.jsx";
import LiquidEther from "../components/UI/liquidEther.jsx";
import Particles from "../components/Particles.jsx";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [isLeftSidebarMinimized, setIsLeftSidebarMinimized] = useState(false);
  const [graphData, setGraphData] = useState(null); // Estado para datos del grafo
  const location = useLocation();

  const handleMinimizeChange = (isMinimized) => {
    setIsLeftSidebarMinimized(isMinimized);
  };

  // Función para recibir datos del chat
  const handleChatResponse = (responseData) => {
    console.log('🔥 Dashboard - Datos recibidos del chat:', responseData);
    
    if (responseData?.relationship_graph) {
      console.log('📊 Dashboard - Actualizando graphData:', responseData.relationship_graph);
      setGraphData(responseData.relationship_graph);
    } else {
      console.log('❌ Dashboard - No hay relationship_graph en la respuesta');
    }
  };

  // Console log cuando graphData cambia
  console.log('🌟 Dashboard - Estado actual de graphData:', graphData);

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
          iterationsViscous={8}
          iterationsPoisson={8}
          resolution={0.25}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.05}
          autoIntensity={2.5}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Particles - Capa intermedia (z-5) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={100}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      
      {/* Dashboard content - Capa superior (z-10) */}
      <div className="flex flex-1 gap-2 relative z-10 p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 rounded-lg border border-white/0 gap-2"
        >
          {/* Menu Izquierdo */}
          <ResizablePanel 
            defaultSize={isLeftSidebarMinimized ? 6 : 25}
            minSize={isLeftSidebarMinimized ? 6 : 20} 
            maxSize={isLeftSidebarMinimized ? 6 : 40}
          >
            <div className="h-full">
              <RecLeft onMinimizeChange={handleMinimizeChange} />
            </div>
          </ResizablePanel>

          {!isLeftSidebarMinimized && (
            <ResizableHandle className="bg-transparent hover:bg-white/10 transition-colors w-2" />
          )}

          {/* Chat Central */}
          <ResizablePanel 
            defaultSize={isLeftSidebarMinimized ? 70 : 50}
            minSize={30}
          >
            <div className="h-full">
              {/* <RecChat onResponse={handleChatResponse} /> */}
              <RecChat initialMessage={location.state?.newMessage} />
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-transparent hover:bg-white/10 transition-colors w-2" />

          {/* Menu Derecho */}
          <ResizablePanel 
            defaultSize={isLeftSidebarMinimized ? 22 : 25}
            minSize={20}
            maxSize={35}
          >
            <div className="h-full">
              <RectRight graphData={graphData} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
