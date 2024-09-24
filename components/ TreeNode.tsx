import { useState, useEffect, useRef } from "react";

const getRandomName = () => {
  const names = [
    "Alexander",
    "Elizabeth",
    "Catherine",
    "Maximilian",
    "Cleopatra",
    "Napoleon",
    "Joan",
    "Marcus",
    "Isabella",
    "Sophia",
    "William",
    "Victoria",
    "Henry",
    "James",
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

type NodeData = {
  firstname: string;
  rightMember?: NodeData;
  leftMember?: NodeData;
};

const generateRandomTree = (layers: number): NodeData | null => {
  if (layers <= 0) return null;

  const generateNode = (level: number): NodeData => {
    if (level >= layers) return { firstname: getRandomName() };

    return {
      firstname: getRandomName(),
      leftMember: generateNode(level + 1),
      rightMember: generateNode(level + 1),
    };
  };

  return generateNode(0);
};

const TreeComponent = () => {
  const [data, setData] = useState<NodeData | null>(null);

  useEffect(() => {
    const treeData = generateRandomTree(3);
    setData(treeData);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const baseNodeRadius = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const truncateName = (name: string, maxLength: number) => {
      if (name.length > maxLength) {
        return name.slice(0, maxLength) + "...";
      }
      return name;
    };

    const drawNode = (x: number, y: number, node: NodeData) => {
      const nodeRadius = baseNodeRadius;
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#FFA500";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      const truncatedName = truncateName(node.firstname, 8);
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.font = "bold 12px Arial";
      ctx.fillText(truncatedName, x, y + 4);
    };

    const drawCurvedLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.save();
      ctx.beginPath();
      const cpX = (x1 + x2) / 2;
      const cpY = y1 + 80;
      ctx.moveTo(x1, y1 + baseNodeRadius);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2 - baseNodeRadius);
      ctx.strokeStyle = "rgba(253, 216, 53, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    const calculateSpacing = (totalLayers: number, level: number) => {
      const baseHorizontalSpacing = 80;
      const adjustedHorizontalSpacing =
        baseHorizontalSpacing * scale * (Math.pow(2, totalLayers - level) / 2);
      const baseVerticalSpacing = 250;

      const verticalSpacing = baseVerticalSpacing * scale;

      return { horizontalSpacing: adjustedHorizontalSpacing, verticalSpacing };
    };

    const drawTree = (
      node: NodeData,
      x: number,
      y: number,
      level: number,
      totalLayers: number
    ) => {
      const { horizontalSpacing, verticalSpacing } = calculateSpacing(
        totalLayers,
        level
      );

      if (node.leftMember) {
        const leftX = x - horizontalSpacing;
        const leftY = y + verticalSpacing;
        drawCurvedLine(x, y, leftX, leftY);
        drawTree(node.leftMember, leftX, leftY, level + 1, totalLayers);
      }

      if (node.rightMember) {
        const rightX = x + horizontalSpacing;
        const rightY = y + verticalSpacing;
        drawCurvedLine(x, y, rightX, rightY);
        drawTree(node.rightMember, rightX, rightY, level + 1, totalLayers);
      }

      drawNode(x, y, node);
    };

    const getTotalLayers = (
      node: NodeData | undefined,
      level: number = 0
    ): number => {
      if (!node) return level;
      return Math.max(
        getTotalLayers(node.leftMember, level + 1),
        getTotalLayers(node.rightMember, level + 1)
      );
    };

    const renderTree = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      if (data) {
        const totalLayers = getTotalLayers(data);
        const rootX = canvasWidth / 2 / scale;
        const rootY = baseNodeRadius + 50;

        drawTree(data, rootX, rootY, 0, totalLayers);
      }

      ctx.restore();
    };

    renderTree();
  }, [data, offset, scale]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      (e as React.MouseEvent).clientX ??
      (e as React.TouchEvent).touches[0].clientX;
    const clientY =
      (e as React.MouseEvent).clientY ??
      (e as React.TouchEvent).touches[0].clientY;
    setIsPanning(true);
    setLastMousePosition({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning) return;
    const clientX =
      (e as React.MouseEvent).clientX ??
      (e as React.TouchEvent).touches[0].clientX;
    const clientY =
      (e as React.MouseEvent).clientY ??
      (e as React.TouchEvent).touches[0].clientY;
    const dx = clientX - lastMousePosition.x;
    const dy = clientY - lastMousePosition.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMousePosition({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomIntensity = 0.1;
    const newScale =
      e.deltaY > 0 ? scale * (1 - zoomIntensity) : scale * (1 + zoomIntensity);
    setScale(newScale);
  };

  return (
    <div
      className="tree-container "
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          cursor: isPanning ? "grabbing" : "grab",
        }}
      />
      <style jsx>{`
        .tree-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          user-select: none;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TreeComponent;
