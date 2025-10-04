import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import { X } from "lucide-react";

const GraphModal = ({ isOpen, onClose }) => {
  const containerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Manejar estados de animación
  const [modalState, setModalState] = useState({
    show: false,
    backdrop: false,
    panel: false
  });

  useEffect(() => {
    if (isOpen) {
      // Abrir modal con animación
      setModalState({ show: true, backdrop: false, panel: false });
      requestAnimationFrame(() => {
        setModalState({ show: true, backdrop: true, panel: false });
        setTimeout(() => {
          setModalState({ show: true, backdrop: true, panel: true });
        }, 50);
      });
    } else if (modalState.show) {
      // Cerrar modal con animación
      setModalState({ show: true, backdrop: true, panel: false });
      setTimeout(() => {
        setModalState({ show: true, backdrop: false, panel: false });
        setTimeout(() => {
          setModalState({ show: false, backdrop: false, panel: false });
        }, 200);
      }, 100);
    }
  }, [isOpen]);

  // Lógica del grafo (solo cuando el modal está completamente abierto)
  useEffect(() => {
    if (!containerRef.current || !modalState.panel) return;

    const graph = new Graph();

    const nodes = [
      { id: "A1", label: "Microgravity Effects on Plants", cluster: "Microgravity" },
      { id: "A2", label: "Plant Growth under Zero Gravity", cluster: "Microgravity" },
      { id: "A3", label: "Bone Density Loss in Space", cluster: "Microgravity" },
      { id: "A4", label: "Muscle Atrophy Prevention", cluster: "Microgravity" },
      { id: "B1", label: "Radiation Damage in DNA", cluster: "Radiation" },
      { id: "B2", label: "DNA Repair Mechanisms", cluster: "Radiation" },
      { id: "B3", label: "Cosmic Ray Shielding", cluster: "Radiation" },
      { id: "B4", label: "Solar Particle Events", cluster: "Radiation" },
      { id: "C1", label: "Photosynthesis in Space Crops", cluster: "Photosynthesis" },
      { id: "C2", label: "LED Light Systems", cluster: "Photosynthesis" },
      { id: "C3", label: "Oxygen Production Systems", cluster: "Photosynthesis" },
      { id: "C4", label: "CO2 Utilization Systems", cluster: "Photosynthesis" },
      { id: "D1", label: "Water Recycling Systems", cluster: "LifeSupport" },
      { id: "D2", label: "Air Purification Technology", cluster: "LifeSupport" },
      { id: "D3", label: "Waste Management in Space", cluster: "LifeSupport" },
      { id: "D4", label: "Closed-Loop Ecosystems", cluster: "LifeSupport" },
    ];

    const edges = [
      ["A1", "A2"], ["A2", "A3"], ["A3", "A4"], ["A1", "A4"],
      ["B1", "B2"], ["B2", "B3"], ["B3", "B4"], ["B1", "B4"],
      ["C1", "C2"], ["C2", "C3"], ["C3", "C4"], ["C1", "C4"],
      ["D1", "D2"], ["D2", "D3"], ["D3", "D4"], ["D1", "D4"],
      ["A1", "C1"], ["B1", "D1"], ["C3", "D2"], ["A3", "D3"],
      ["B2", "C2"], ["A2", "B3"],
    ];

    const clusterColors = {
      Microgravity: "#00B8EB",
      Radiation: "#FF6B35",
      Photosynthesis: "#00D4AA",
      LifeSupport: "#F63564",
    };

    const clusters = {};
    for (const clusterName in clusterColors) {
      clusters[clusterName] = {
        label: clusterName,
        color: clusterColors[clusterName],
        positions: [],
        x: 0,
        y: 0,
      };
    }

    nodes.forEach((n) => {
      const x = Math.random() * 0.8 + 0.1;
      const y = Math.random() * 0.8 + 0.1;

      graph.addNode(n.id, {
        label: n.label,
        x: x,
        y: y,
        size: 15,
        color: clusterColors[n.cluster],
        originalColor: clusterColors[n.cluster],
        hovered: false,
      });

      clusters[n.cluster].positions.push({ x, y });
    });

    for (const clusterName in clusters) {
      const cluster = clusters[clusterName];
      cluster.x = cluster.positions.reduce((acc, p) => acc + p.x, 0) / cluster.positions.length;
      cluster.y = cluster.positions.reduce((acc, p) => acc + p.y, 0) / cluster.positions.length;
    }

    edges.forEach(([src, tgt]) => {
      graph.addEdge(src, tgt, {
        color: "rgba(255, 255, 255, 0.4)",
        size: 2,
      });
    });

    try {
      const renderer = new Sigma(graph, containerRef.current, {
        renderLabels: true,
        renderEdgeLabels: false,
        defaultNodeColor: "#ffffff",
        defaultEdgeColor: "rgba(255, 255, 255, 0.4)",
        labelSize: 14,
        labelWeight: "bold",
      });

      // Cluster labels
      const clustersLayer = document.createElement("div");
      clustersLayer.id = "clustersLayerModal";
      clustersLayer.style.position = "absolute";
      clustersLayer.style.top = "0";
      clustersLayer.style.left = "0";
      clustersLayer.style.width = "100%";
      clustersLayer.style.height = "100%";
      clustersLayer.style.pointerEvents = "none";
      clustersLayer.style.zIndex = "1";

      const updateClusterLabels = () => {
        let clusterLabelsDoms = "";
        for (const clusterName in clusters) {
          const cluster = clusters[clusterName];
          const viewportPos = renderer.graphToViewport({ x: cluster.x, y: cluster.y });

          clusterLabelsDoms += `
            <div id='modal-cluster-${clusterName}' style="
              position: absolute;
              top: ${viewportPos.y}px;
              left: ${viewportPos.x}px;
              color: ${cluster.color};
              font-weight: bold;
              font-size: 18px;
              text-shadow: 2px 2px 6px rgba(0,0,0,0.8);
              pointer-events: none;
              transform: translate(-50%, -50%);
              font-family: var(--font-zen-dots);
              white-space: nowrap;
            ">${cluster.label}</div>
          `;
        }
        clustersLayer.innerHTML = clusterLabelsDoms;
      };

      containerRef.current.appendChild(clustersLayer);
      updateClusterLabels();
      renderer.on("afterRender", updateClusterLabels);

      renderer.on("enterNode", (event) => {
        const nodeId = event.node;
        graph.setNodeAttribute(nodeId, "size", 20);
        graph.setNodeAttribute(nodeId, "hovered", true);
        renderer.refresh();
      });

      renderer.on("leaveNode", (event) => {
        const nodeId = event.node;
        graph.setNodeAttribute(nodeId, "size", 15);
        graph.setNodeAttribute(nodeId, "hovered", false);
        renderer.refresh();
      });

      return () => {
        try {
          if (clustersLayer && clustersLayer.parentNode) {
            clustersLayer.parentNode.removeChild(clustersLayer);
          }
          renderer.kill();
        } catch (e) {
          console.log("Error al limpiar renderer:", e);
        }
      };
    } catch (error) {
      console.error("Error creando Sigma:", error);
    }
  }, [modalState.panel]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (modalState.show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalState.show, onClose]);

  if (!modalState.show) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
      {/* Backdrop animado */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
          modalState.backdrop ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Container centrado */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Panel del modal con animaciones */}
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-gradient-to-b from-[#091437] to-[#1A3A9D] text-left shadow-xl transition-all duration-300 ease-out w-[80vw] h-[75vh] ${
            modalState.panel 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          {/* Header del modal */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white" style={{fontFamily: 'var(--font-zen-dots)'}}>
                  Research Network
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20 hover:scale-105 transform duration-200 cursor-pointer"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* Graph container */}
          <div className="w-full h-full pt-16">
            <div ref={containerRef} className="w-full h-full relative" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;