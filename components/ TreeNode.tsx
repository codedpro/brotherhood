import { useState, useEffect, useRef } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import gsap from "gsap";

type AnchorPosition = "top" | "bottom" | "left" | "right";

type NodeData = {
  id: number;
  rightMember?: NodeData;
  leftMember?: NodeData;
  subset?: number;
};

const TreeComponent = () => {
  const [data] = useState<NodeData>({
    id: 111122,
    rightMember: {
      id: 222233,
      rightMember: {
        id: 555612,
        subset: 20,
      },
      leftMember: {
        id: 666333,
        subset: 30,
      },
    },
    leftMember: {
      id: 333344,
      rightMember: {
        id: 777788,
        subset: 25,
      },
      leftMember: {
        id: 888899,
        subset: 35,
      },
    },
  });

  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const timeline = gsap.timeline();
    const nodesByLayer = [
      [nodeRefs.current[`node-${data.id}`]],
      [
        nodeRefs.current[`node-${data.leftMember?.id}`],
        nodeRefs.current[`node-${data.rightMember?.id}`],
      ],
      [
        nodeRefs.current[`node-${data.leftMember?.leftMember?.id}`],
        nodeRefs.current[`node-${data.leftMember?.rightMember?.id}`],
        nodeRefs.current[`node-${data.rightMember?.leftMember?.id}`],
        nodeRefs.current[`node-${data.rightMember?.rightMember?.id}`],
      ],
    ];

    nodesByLayer.forEach((layer, i) => {
      timeline.fromTo(
        layer,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 },
        i * 1.2
      );
    });

    // Animate arrows after nodes
    timeline.fromTo(
      ".archer-arrow",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 },
      (nodesByLayer.length - 1) * 1.2 + 1 // start after the last node layer animation
    );
  }, [data]);

  const setNodeRef = (id: string, element: HTMLDivElement | null) => {
    nodeRefs.current[id] = element;
  };

  const renderNode = (id: number, subset?: number) => (
    <>
      <div
        ref={(el) => setNodeRef(`node-${id}`, el)}
        className={`opacity-0 p-4 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg text-dark border-2 border-yellow-600 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-300 transition-all duration-300 layer-${id}`}
      >
        {id}
      </div>
      {subset !== undefined && (
        <div className="flex flex-col items-center mt-2 text-sm text-[#d0d0d0]">
          <div className="h-12 w-px bg-[#fdd835]"></div>
          <div className="mt-1">{subset}</div>
        </div>
      )}
    </>
  );

  const renderPlaceholderNode = (id: string) => (
    <div
      ref={(el) => setNodeRef(id, el)}
      className="p-4 bg-gray-200 rounded-full shadow-lg text-dark border-2 border-gray-400"
    >
      Invite
    </div>
  );

  const renderTree = (node: NodeData, idPrefix: string) => {
    const leftId = node.leftMember
      ? `node-${node.leftMember.id}`
      : `placeholder-${idPrefix}-left`;
    const rightId = node.rightMember
      ? `node-${node.rightMember.id}`
      : `placeholder-${idPrefix}-right`;

    const relations = [
      {
        targetId: leftId,
        targetAnchor: "top" as AnchorPosition,
        sourceAnchor: "bottom" as AnchorPosition,
        style: { strokeColor: "#fdd835", strokeWidth: 1 },
      },
      {
        targetId: rightId,
        targetAnchor: "top" as AnchorPosition,
        sourceAnchor: "bottom" as AnchorPosition,
        style: { strokeColor: "#fdd835", strokeWidth: 1 },
      },
    ];

    return (
      <ArcherElement id={`node-${node.id}`} relations={relations}>
        <div className="flex flex-col items-center node">
          {renderNode(node.id, node.subset)}
        </div>
      </ArcherElement>
    );
  };

  const renderLayer = (nodes: (NodeData | null)[], layerIndex: number) => {
    return (
      <div className="relative flex justify-center space-x-4">
        {nodes.map((node, index) => {
          const key = `layer-${layerIndex}-${index}`;
          if (node) {
            return (
              <ArcherElement id={`node-${node.id}`} key={key}>
                <div className="flex flex-col items-center node">
                  {renderNode(node.id, node.subset)}
                </div>
              </ArcherElement>
            );
          } else {
            return (
              <ArcherElement
                id={`placeholder-${layerIndex}-${index}`}
                key={key}
              >
                <div className="flex flex-col items-center node">
                  {renderPlaceholderNode(`placeholder-${layerIndex}-${index}`)}
                </div>
              </ArcherElement>
            );
          }
        })}
      </div>
    );
  };

  return (
    <ArcherContainer strokeColor="#fdd835">
      <div className="relative flex flex-col items-center mt-10 space-y-12">
        {renderTree(data, "root")}
        {renderLayer([data.leftMember || null, data.rightMember || null], 1)}
        {renderLayer(
          [
            data.leftMember?.leftMember || null,
            data.leftMember?.rightMember || null,
            data.rightMember?.leftMember || null,
            data.rightMember?.rightMember || null,
          ],
          2
        )}
      </div>

      <style jsx>{`
        .node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px; /* Reduced width for closer spacing */
        }
        .node .p-4 {
          width: 100%;
          text-align: center;
        }
        .node > .flex {
          width: 100%;
          justify-content: space-between;
        }
        .relative > .flex {
          justify-content: center;
        }
        .layer-333344,
        .layer-222233,
        .layer-888899,
        .layer-666333,
        .layer-777788,
        .layer-555612 {
          opacity: 0; /* Initial opacity 0 for layers 2 and 3 */
        }
      `}</style>
    </ArcherContainer>
  );
};

export default TreeComponent;
