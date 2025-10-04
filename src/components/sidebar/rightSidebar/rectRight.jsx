import GraphViewer from "./GraphViewer";
import StarBorder from '../../UI/StarBorder'; 
import { Expand } from 'lucide-react'; // Importar el icono

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
            color="orange"
            speed="4s"
            backgroundColor="from-orange-500 to-black"
            height="py-2" 
            fontSize="text-sm"
            borderRadius="rounded-lg"
            onClick={handleViewLarge}
            style={{fontFamily: 'var(--font-space-mono)'}}
          >
            <div className="flex items-center justify-center gap-2">
              <Expand size={16} className="text-white" />
              <span>View Full Size</span>
            </div>
          </StarBorder>
        </div>
      </div>
    </div>
  )
}