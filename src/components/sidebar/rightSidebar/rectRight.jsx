import GraphViewer from "./GraphViewer";
import StarBorder from '../../UI/StarBorder.jsx'; 

export default function RectRight() {
  const handleViewLarge = () => {
    // Aquí puedes agregar la lógica para abrir el grafo en grande
    console.log("Opening graph in large view...");
    // Por ejemplo, abrir un modal o navegar a otra página
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
        <div className="flex-1 p-2">
          <GraphViewer />
        </div>
        <div className="text-center p-2">
          <h3 className="text-sm font-bold text-white mb-3" style={{fontFamily: 'var(--font-zen-dots)'}}>
            Research Network
          </h3>
          <StarBorder
            as="button"
            className="px-4 py-2 text-xs font-semibold text-white hover:text-cyan-300 transition-colors"
            color="cyan"
            speed="3s"
            onClick={handleViewLarge}
          >
            View Full Size
          </StarBorder>
        </div>
      </div>
    </div>
  )
}