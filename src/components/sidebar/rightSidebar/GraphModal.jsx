import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { X } from "lucide-react";

const GraphModal = ({ isOpen, onClose }) => {
  const containerRef = useRef(null);
  const [modalState, setModalState] = useState({
    show: false,
    backdrop: false,
    panel: false
  });

  useEffect(() => {
    if (isOpen) {
      setModalState({ show: true, backdrop: false, panel: false });
      requestAnimationFrame(() => {
        setModalState({ show: true, backdrop: true, panel: false });
        setTimeout(() => {
          setModalState({ show: true, backdrop: true, panel: true });
        }, 50);
      });
    } else if (modalState.show) {
      setModalState({ show: true, backdrop: true, panel: false });
      setTimeout(() => {
        setModalState({ show: true, backdrop: false, panel: false });
        setTimeout(() => {
          setModalState({ show: false, backdrop: false, panel: false });
        }, 200);
      }, 100);
    }
  }, [isOpen]);

  // Datos del grafo
  const graphData = {
    nodes: [
      // Microgravity Research
      { id: "microgravity-plants", name: "Microgravity Effects on Plants", group: "Microgravity" },
      { id: "zero-gravity-growth", name: "Plant Growth under Zero Gravity", group: "Microgravity" },
      { id: "bone-density-loss", name: "Bone Density Loss in Space", group: "Microgravity" },
      { id: "muscle-atrophy", name: "Muscle Atrophy Prevention", group: "Microgravity" },
      
      // Radiation Studies
      { id: "radiation-dna", name: "Radiation Damage in DNA", group: "Radiation" },
      { id: "dna-repair", name: "DNA Repair Mechanisms", group: "Radiation" },
      { id: "cosmic-shielding", name: "Cosmic Ray Shielding", group: "Radiation" },
      { id: "solar-particles", name: "Solar Particle Events", group: "Radiation" },
      
      // Space Agriculture
      { id: "space-photosynthesis", name: "Photosynthesis in Space Crops", group: "Agriculture" },
      { id: "led-systems", name: "LED Light Systems", group: "Agriculture" },
      { id: "oxygen-production", name: "Oxygen Production Systems", group: "Agriculture" },
      { id: "co2-utilization", name: "CO2 Utilization Systems", group: "Agriculture" },
      
      // Life Support
      { id: "water-recycling", name: "Water Recycling Systems", group: "LifeSupport" },
      { id: "air-purification", name: "Air Purification Technology", group: "LifeSupport" },
      { id: "waste-management", name: "Waste Management in Space", group: "LifeSupport" },
      { id: "closed-ecosystems", name: "Closed-Loop Ecosystems", group: "LifeSupport" },
    ],
    links: [
      // Conexiones dentro de cada grupo
      { source: "microgravity-plants", target: "zero-gravity-growth", value: 3 },
      { source: "zero-gravity-growth", target: "bone-density-loss", value: 2 },
      { source: "bone-density-loss", target: "muscle-atrophy", value: 2 },
      { source: "microgravity-plants", target: "muscle-atrophy", value: 1 },
      
      { source: "radiation-dna", target: "dna-repair", value: 4 },
      { source: "dna-repair", target: "cosmic-shielding", value: 3 },
      { source: "cosmic-shielding", target: "solar-particles", value: 2 },
      { source: "radiation-dna", target: "solar-particles", value: 2 },
      
      { source: "space-photosynthesis", target: "led-systems", value: 4 },
      { source: "led-systems", target: "oxygen-production", value: 3 },
      { source: "oxygen-production", target: "co2-utilization", value: 3 },
      { source: "space-photosynthesis", target: "co2-utilization", value: 2 },
      
      { source: "water-recycling", target: "air-purification", value: 3 },
      { source: "air-purification", target: "waste-management", value: 2 },
      { source: "waste-management", target: "closed-ecosystems", value: 4 },
      { source: "water-recycling", target: "closed-ecosystems", value: 3 },
      
      // Conexiones entre grupos
      { source: "microgravity-plants", target: "space-photosynthesis", value: 3 },
      { source: "radiation-dna", target: "water-recycling", value: 2 },
      { source: "oxygen-production", target: "air-purification", value: 3 },
      { source: "bone-density-loss", target: "waste-management", value: 1 },
      { source: "dna-repair", target: "led-systems", value: 2 },
      { source: "zero-gravity-growth", target: "cosmic-shielding", value: 1 },
    ]
  };

  // Crear el grafo con D3
  useEffect(() => {
    if (!containerRef.current || !modalState.panel) return;

    // Limpiar contenedor
    d3.select(containerRef.current).selectAll("*").remove();

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Colores personalizados por categoría
    const colorScale = d3.scaleOrdinal()
      .domain(["Microgravity", "Radiation", "Agriculture", "LifeSupport"])
      .range(["#00B8EB", "#FF6B35", "#00D4AA", "#F63564"]);

    // Copiar datos para no mutar los originales
    const links = graphData.links.map(d => ({...d}));
    const nodes = graphData.nodes.map(d => ({...d}));

    // Crear simulación de fuerzas
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    // Crear SVG
    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // Crear gradientes para los nodos
    const defs = svg.append("defs");
    
    ["Microgravity", "Radiation", "Agriculture", "LifeSupport"].forEach(group => {
      const gradient = defs.append("radialGradient")
        .attr("id", `gradient-${group}`)
        .attr("cx", "30%")
        .attr("cy", "30%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(colorScale(group)).brighter(0.5));
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(group));
    });

    // Crear enlaces
    const link = svg.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.4)")
      .attr("stroke-opacity", 0.8)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    // Crear nodos
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .attr("fill", d => `url(#gradient-${d.group})`)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Crear etiquetas de nodos
    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.name)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-family", "var(--font-space-mono)")
      .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Crear etiquetas de grupos
    const groupLabels = svg.append("g")
      .selectAll("text")
      .data(d3.groups(nodes, d => d.group))
      .join("text")
      .text(d => d[0])
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", d => colorScale(d[0]))
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-zen-dots)")
      .style("text-shadow", "2px 2px 6px rgba(0,0,0,0.8)")
      .style("pointer-events", "none");

    // Interacciones
    node
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 16)
          .attr("stroke-width", 3);
        
        labels.filter(label => label.id === d.id)
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseleave", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 12)
          .attr("stroke-width", 2);
        
        labels.filter(label => label.id === d.id)
          .transition()
          .duration(200)
          .style("opacity", 0);
      });

    // Drag behavior
    const drag = d3.drag()
      .on("start", function(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", function(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Función tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y - 20);

      // Actualizar posiciones de etiquetas de grupo
      groupLabels
        .attr("x", d => {
          const groupNodes = d[1];
          return d3.mean(groupNodes, node => node.x);
        })
        .attr("y", d => {
          const groupNodes = d[1];
          return d3.mean(groupNodes, node => node.y) - 40;
        });
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
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
          className={`relative transform overflow-hidden rounded-2xl bg-gradient-to-b from-[#091437] to-[#1A3A9D] text-left shadow-xl transition-all duration-300 ease-out w-[85vw] h-[80vh] ${
            modalState.panel 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          {/* Header del modal */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="p-2 text-2xl font-bold text-white" style={{fontFamily: 'var(--font-zen-dots)'}}>
                  Research Network - Interactive View
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

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-white/70 text-sm" style={{fontFamily: 'var(--font-space-mono)'}}>
            <p>• Hover over nodes to see article titles</p>
            <p>• Drag nodes to rearrange the network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;