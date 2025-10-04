import GraphViewer from "./GraphViewer";
import StarBorder from '../../UI/starBorder.jsx'; 
import { Expand } from 'lucide-react';

export default function RectRight() {
  const handleViewLarge = () => {
    console.log("Opening graph in large view...");
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex-1 flex items-center justify-center rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl">
        <div className="text-center p-4">
          <h2 className="text-lg font-bold text-white mb-2" style={{fontFamily: 'var(--font-zen-dots)'}}>
            Statistics & Settings
          </h2>
          <p className="text-white/80 text-sm" style={{fontFamily: 'var(--font-space-mono)'}}>
            Panel superior para configuraciones
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-sm shadow-xl">
        <div className="flex-1 px-2 pt-2">
          <GraphViewer />
        </div>
        <div className="p-2">
          <StarBorder
            as="button"
            className="w-full hover:scale-102 transition-transform cursor-pointer"
            color="#FF6B35" // 🔥 Color de la luz (naranja)
            backgroundColor="from-orange-500 to-orange-900" // 🎨 Fondo degradado
            textColor="text-white" // ✏️ Color del texto
            height="py-2" // 📏 Altura (más delgado)
            fontSize="text-sm" // 🔤 Tamaño de letra
            borderRadius="rounded-lg" // 🔲 Border radius
            borderColor="border-orange-500/50" // 🖼️ Color del borde
            speed="3s" // ⚡ Velocidad de animación
            onClick={handleViewLarge}
          >
            <div className="flex items-center justify-center gap-2 font-bold" style={{fontFamily: 'var(--font-space-mono)'}}>
              <Expand size={16} className="text-white" />
              <span>View Full Size</span>
            </div>
          </StarBorder>
        </div>
      </div>
    </div>
  )
}