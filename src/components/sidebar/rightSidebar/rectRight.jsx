import GraphViewer from "./GraphViewer";
import StarBorder from '../../UI/starBorder.jsx'; 
import GraphModal from '../rightSidebar/GraphModal.jsx';
import ChartSelector from './charts.jsx';
import { Expand } from 'lucide-react';
import { useState, useEffect, memo } from 'react';

const RectRight = memo(function RectRight({ graphData = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localGraphData, setLocalGraphData] = useState(null);

  // Solo logear cuando realmente hay cambios en graphData
  useEffect(() => {
    if (graphData && graphData !== localGraphData) {
      console.log('🔄 RectRight - Actualizando localGraphData:', graphData);
      setLocalGraphData(graphData);
    }
  }, [graphData, localGraphData]);

  const handleViewLarge = () => {
    console.log('🔍 RectRight - Abriendo modal con datos:', localGraphData || graphData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        {/* Panel superior con selector de charts */}
        <div className="flex-1 p-2 rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl">
          <ChartSelector />
        </div>
        
        {/* Panel inferior con grafo */}
        <div className="flex-1 flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-sm shadow-xl">
          <div className="flex-1 px-2 pt-2">
            <GraphViewer graphData={localGraphData} />
          </div>
          <div className="p-2">
            <StarBorder
              as="button"
              className="w-full hover:scale-102 transition-transform cursor-pointer"
              color="#FF6B35"
              backgroundColor="from-orange-500 to-orange-900"
              textColor="text-white"
              height="py-2"
              fontSize="text-sm"
              borderRadius="rounded-lg"
              borderColor="border-orange-500/50"
              speed="3s"
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

      <GraphModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        graphData={localGraphData || graphData} // ← Asegurar que se pasen los datos más recientes
      />
    </>
  );
});

export default RectRight;