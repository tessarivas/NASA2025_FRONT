import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { X } from "lucide-react";

const GraphModal = ({ isOpen, onClose, graphData = null }) => {
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
  }, [isOpen, modalState.show]);

  // Datos de fallback MEJORADOS con más conexiones
  const defaultGraphData = {
    nodes: [
      { id: "microgravity-plants", name: "Microgravity Effects on Plants", group: "Microgravity", weight: 3 },
      { id: "zero-gravity-growth", name: "Plant Growth under Zero Gravity", group: "Microgravity", weight: 2 },
      { id: "bone-density-loss", name: "Bone Density Loss in Space", group: "Physiology", weight: 4 },
      { id: "radiation-dna", name: "Radiation Damage in DNA", group: "Radiation", weight: 5 },
      { id: "dna-repair", name: "DNA Repair Mechanisms", group: "Radiation", weight: 3 },
      { id: "space-photosynthesis", name: "Photosynthesis in Space Crops", group: "Agriculture", weight: 4 },
      { id: "led-systems", name: "LED Light Systems", group: "Agriculture", weight: 2 },
      { id: "water-recycling", name: "Water Recycling Systems", group: "LifeSupport", weight: 3 },
      { id: "oxygen-generation", name: "Oxygen Generation Systems", group: "LifeSupport", weight: 4 },
      { id: "muscle-atrophy", name: "Muscle Atrophy Prevention", group: "Physiology", weight: 3 },
    ],
    links: [
      // Conexiones dentro de grupos
      { source: "microgravity-plants", target: "zero-gravity-growth", value: 4, relationship: "same_field" },
      { source: "radiation-dna", target: "dna-repair", value: 5, relationship: "cause_effect" },
      { source: "space-photosynthesis", target: "led-systems", value: 4, relationship: "technology" },
      { source: "water-recycling", target: "oxygen-generation", value: 3, relationship: "life_support" },
      { source: "bone-density-loss", target: "muscle-atrophy", value: 3, relationship: "physiology" },
      
      // Conexiones entre grupos
      { source: "microgravity-plants", target: "space-photosynthesis", value: 3, relationship: "plant_research" },
      { source: "radiation-dna", target: "bone-density-loss", value: 2, relationship: "health_impact" },
      { source: "led-systems", target: "oxygen-generation", value: 2, relationship: "environment" },
      { source: "zero-gravity-growth", target: "muscle-atrophy", value: 2, relationship: "microgravity_effects" },
      { source: "dna-repair", target: "water-recycling", value: 1, relationship: "safety_systems" },
      
      // Conexiones adicionales para mejor cohesión
      { source: "space-photosynthesis", target: "oxygen-generation", value: 3, relationship: "oxygen_cycle" },
      { source: "microgravity-plants", target: "bone-density-loss", value: 2, relationship: "microgravity_research" },
    ]
  };

  // Función para convertir datos reales del backend - CORREGIDA
  function convertRealGraphData(realData) {
    console.log("🔍 Datos recibidos en GraphModal:", realData);
    
    // El graphData puede venir directamente como relationship_graph o estar anidado
    let graphStructure = null;
    
    if (realData?.nodes && realData?.links) {
      // Datos ya en formato correcto
      graphStructure = realData;
    } else if (realData?.relationship_graph?.nodes && realData?.relationship_graph?.links) {
      // Datos anidados en relationship_graph
      graphStructure = realData.relationship_graph;
    } else {
      console.warn("GraphModal - No se encontró estructura de grafo válida");
      return null;
    }

    console.log("🕸️ Estructura de grafo encontrada:", graphStructure);

    const nodes = graphStructure.nodes.map(node => ({
      id: node.id,
      name: node.label || node.name || `Research ${node.id}`,
      group: node.category || node.type || node.group || "General",
      weight: node.weight || Math.random() * 3 + 1,
      articleTitle: node.article_title || node.label || node.name
    }));

    const links = graphStructure.links.map(link => ({
      source: link.source,
      target: link.target,
      value: link.weight || link.value || Math.random() * 3 + 1,
      relationship: link.relationship || link.type || "related"
    }));

    console.log("✅ Datos procesados - Nodos:", nodes.length, "Enlaces:", links.length);

    return { nodes, links };
  }

  // Usar datos reales o fallback
  const processedData = graphData ? convertRealGraphData(graphData) : null;
  const currentGraphData = processedData || defaultGraphData;

  console.log("🕸️ Graph Modal - Datos originales:", graphData);
  console.log("🕸️ Graph Modal - Datos procesados:", processedData);
  console.log("🕸️ Graph Modal - Datos finales:", currentGraphData);

  // Validar y limpiar datos del grafo
  const validateGraphData = (data) => {
    if (!data || !data.nodes || !data.links) return defaultGraphData;
    
    const nodes = data.nodes || [];
    const nodeIds = new Set(nodes.map(node => node.id));
    
    console.log('Available node IDs:', Array.from(nodeIds));
    
    // Filtrar enlaces que solo referencien nodos existentes
    const validLinks = data.links.filter(link => {
      const sourceExists = nodeIds.has(link.source);
      const targetExists = nodeIds.has(link.target);
      
      if (!sourceExists) {
        console.warn(`Link source not found: ${link.source}`);
      }
      if (!targetExists) {
        console.warn(`Link target not found: ${link.target}`);
      }
      
      return sourceExists && targetExists;
    });
    
    // Verificar conectividad - encontrar nodos aislados
    const connectedNodeIds = new Set();
    validLinks.forEach(link => {
      connectedNodeIds.add(link.source);
      connectedNodeIds.add(link.target);
    });
    
    const isolatedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
    
    if (isolatedNodes.length > 0) {
      console.warn('Isolated nodes found:', isolatedNodes.map(n => n.id));
      
      // Conectar nodos aislados al nodo más relacionado (por grupo)
      isolatedNodes.forEach(isolatedNode => {
        const sameGroupNodes = nodes.filter(n => 
          n.group === isolatedNode.group && n.id !== isolatedNode.id && connectedNodeIds.has(n.id)
        );
        
        if (sameGroupNodes.length > 0) {
          // Conectar al primer nodo del mismo grupo
          validLinks.push({
            source: isolatedNode.id,
            target: sameGroupNodes[0].id,
            value: 1
          });
          console.log(`Connected isolated node ${isolatedNode.id} to ${sameGroupNodes[0].id}`);
        } else if (nodes.length > 1) {
          // Si no hay nodos del mismo grupo, conectar al primer nodo disponible
          const firstConnectedNode = Array.from(connectedNodeIds)[0];
          if (firstConnectedNode) {
            validLinks.push({
              source: isolatedNode.id,
              target: firstConnectedNode,
              value: 1
            });
            console.log(`Connected isolated node ${isolatedNode.id} to ${firstConnectedNode}`);
          }
        }
      });
    }
    
    console.log(`Filtered ${data.links.length - validLinks.length} invalid links`);
    console.log('Valid links:', validLinks);
    
    return {
      nodes: nodes,
      links: validLinks
    };
  };

  const validatedGraphData = validateGraphData(currentGraphData);

  // Crear el grafo con D3
  useEffect(() => {
    if (!containerRef.current || !modalState.panel || !validatedGraphData) return;

    // Limpiar contenedor
    d3.select(containerRef.current).selectAll("*").remove();

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Obtener grupos únicos dinámicamente
    const uniqueGroups = [...new Set(validatedGraphData.nodes.map(node => node.group))];
    
    // Colores personalizados por categoría
    const colorPalette = ["#00B8EB", "#FF6B35", "#00D4AA", "#F63564", "#9B59B6", "#E67E22", "#1ABC9C", "#E74C3C"];
    const colorScale = d3.scaleOrdinal()
      .domain(uniqueGroups)
      .range(colorPalette.slice(0, uniqueGroups.length));

    // Copiar datos para no mutar los originales
    const links = validatedGraphData.links.map(d => ({...d}));
    const nodes = validatedGraphData.nodes.map(d => ({...d}));

    // SIMULACIÓN MEJORADA para evitar dispersión
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    // Crear SVG
    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto")
      .on("click", function(event) {
        // Cerrar tooltip al hacer click en el fondo
        if (event.target === this) {
          d3.select(containerRef.current).select(".graph-tooltip").style("visibility", "hidden");
        }
      });

    // Crear gradientes para los nodos dinámicamente
    const defs = svg.append("defs");
    
    uniqueGroups.forEach(group => {
      const gradient = defs.append("radialGradient")
        .attr("id", `gradient-${group.replace(/\s+/g, '-')}`)
        .attr("cx", "30%")
        .attr("cy", "30%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(colorScale(group)).brighter(0.5));
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(group));
    });

    // Crear enlaces MEJORADOS
    const link = svg.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.3)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.max(1, Math.sqrt(d.value || 1) * 1.5))
      .style("cursor", "pointer");

    // Crear nodos MEJORADOS con tamaño dinámico
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => Math.max(8, Math.min(18, 10 + (d.weight || 1) * 2))) // Tamaño basado en peso
      .attr("fill", d => `url(#gradient-${d.group.replace(/\s+/g, '-')})`)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer");

    // Tooltip mejorado
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "graph-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("font-family", "var(--font-space-mono)")
      .style("border", "1px solid rgba(255,255,255,0.2)")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000);

    // Crear etiquetas de grupos MEJORADAS
    const groupLabels = svg.append("g")
      .data(d3.groups(nodes, d => d.group))
      .join("text")
      .text(d => d[0])
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", d => colorScale(d[0]))
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-zen-dots)")
      .style("text-shadow", "2px 2px 6px rgba(0,0,0,0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0.8);

    // Interacciones MEJORADAS
    node
      .on("mouseenter", function(event, d) {
        // Efecto visual en el nodo
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.max(12, Math.min(22, 14 + (d.weight || 1) * 2)))
          .attr("stroke-width", 3)
          .attr("stroke", "#FFD700");
        
        // Destacar conexiones
        link
          .style("opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1)
          .attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? "#FFD700" : "rgba(255, 255, 255, 0.3)");
        
        // Mostrar tooltip
        tooltip
          .style("opacity", 1)
          .html(`
            <div>
              <strong>${d.articleTitle || d.name}</strong><br/>
              <span style="color: ${colorScale(d.group)}">${d.group}</span><br/>
              ${d.weight ? `<small>Weight: ${d.weight.toFixed(1)}</small>` : ''}
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseleave", function(event, d) {
        // Restaurar nodo
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.max(8, Math.min(18, 10 + (d.weight || 1) * 2)))
          .attr("stroke-width", 1.5)
          .attr("stroke", "#ffffff");
        
        // Restaurar conexiones
        link
          .style("opacity", 0.6)
          .attr("stroke", "rgba(255, 255, 255, 0.3)");
        
        // Ocultar tooltip
        tooltip.style("opacity", 0);
      });

    // Hover en enlaces
    link
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .attr("stroke-width", Math.max(2, Math.sqrt(d.value || 1) * 2))
          .attr("stroke", "#FFD700");
        
        if (d.relationship) {
          tooltip
            .style("opacity", 1)
            .html(`<strong>Relationship:</strong> ${d.relationship}<br/><small>Strength: ${(d.value || 1).toFixed(1)}</small>`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
        }
      })
      .on("mouseleave", function(event, d) {
        d3.select(this)
          .attr("stroke-width", Math.max(1, Math.sqrt(d.value || 1) * 1.5))
          .attr("stroke", "rgba(255, 255, 255, 0.3)");
        
        tooltip.style("opacity", 0);
      });

    // Drag behavior MEJORADO
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

    // Función tick OPTIMIZADA
    simulation.on("tick", () => {
      // Constrain nodes to viewport con padding
      nodes.forEach(d => {
        d.x = Math.max(30, Math.min(width - 30, d.x));
        d.y = Math.max(30, Math.min(height - 30, d.y));
      });

      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      // Actualizar posiciones de etiquetas de grupo
      groupLabels
        .attr("x", d => {
          const groupNodes = d[1];
          return d3.mean(groupNodes, node => node.x);
        })
        .attr("y", d => {
          const groupNodes = d[1];
          return d3.mean(groupNodes, node => node.y) - 35;
        });
    });

    // RALENTIZAR la simulación gradualmente para estabilizar
    setTimeout(() => {
      simulation.alphaTarget(0.1);
    }, 1000);

    setTimeout(() => {
      simulation.alphaTarget(0);
    }, 3000);

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [modalState.panel, validatedGraphData]);

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
                <h2 className="text-2xl font-bold text-white" style={{fontFamily: 'var(--font-zen-dots)'}}>
                  Research Network Graph
                </h2>
                {graphData ? (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                    Live Data
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full border border-orange-500/30">
                    Sample Data
                  </span>
                )}
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
            <p>• <strong>Hover over nodes</strong> to see article details and connections</p>
            <p>• <strong>Hover over lines</strong> to see relationships</p>
            <p>• <strong>Drag nodes</strong> to rearrange the network</p>
            {!graphData && <p className="text-orange-400 mt-1">💡 Send a chat message to get real research data!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;