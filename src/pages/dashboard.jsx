import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/UI/resizable.jsx";
import RecLeft from "../components/sidebar/leftSidebar/recLeft.jsx";
import RecChat from "../components/chatbot/recChat.jsx";
import RectRight from "../components/sidebar/rightSidebar/rectRight.jsx";
import Galaxy from "../components/UI/galaxy.jsx";

export default function Dashboard() {
  return (
    <div className="h-screen bg-gradient-to-b from-[#030409] via-[#091437] to-[#1A3A9D] p-4 relative">
      <div className="absolute inset-0 z-0 mix-blend-lighten pointer-events-none">
        <Galaxy
          mouseInteraction={false}
          mouseRepulsion={false}
          density={3}
          glowIntensity={0.3}
          saturation={0}
          hueShift={0}
          twinkleIntensity={0.3}
          rotationSpeed={0.05}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.1}
          speed={1}
        />
      </div>
      
      <div className="flex h-full gap-2 relative z-10">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 rounded-lg border border-white/0"
        >
          <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
            <div className="h-full pr-2">
              <RecLeft />
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-transparent hover:bg-white/10 transition-colors" />

          <ResizablePanel defaultSize={65} minSize={40}>
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
