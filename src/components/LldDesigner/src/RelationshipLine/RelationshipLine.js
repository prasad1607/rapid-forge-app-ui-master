import React from 'react';
import './RelationshipLine.css';

function RelationshipLine({ 
  relationship, 
  classes, 
  isSelected, 
  onSelect 
}) {
  // Find the source and target classes
  const fromClass = classes.find(c => c.id === relationship.from);
  const toClass = classes.find(c => c.id === relationship.to);
  
  if (!fromClass || !toClass) return null;
  
  // Calculate center points of classes
  const fromCenter = {
    x: fromClass.x + (fromClass.width / 2),
    y: fromClass.y + (fromClass.height / 2)
  };
  
  const toCenter = {
    x: toClass.x + (toClass.width / 2),
    y: toClass.y + (toClass.height / 2)
  };
  
  // Find intersection points with class boundaries
  const fromPoint = findIntersectionPoint(fromCenter, toCenter, fromClass);
  const toPoint = findIntersectionPoint(toCenter, fromCenter, toClass);
  
  if (!fromPoint || !toPoint) return null;
  
  // Calculate the direction vector and normalize it
  const dx = toPoint.x - fromPoint.x;
  const dy = toPoint.y - fromPoint.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const normalizedDx = dx / length;
  const normalizedDy = dy / length;
  
  // Shorten the line a bit for arrow head space
  const shortenBy = relationship.type === 'isA' ? 15 : 10;
  const arrowEndX = toPoint.x - normalizedDx * shortenBy;
  const arrowEndY = toPoint.y - normalizedDy * shortenBy;
  
  // Create the SVG path for the relationship line
  let path = `M ${fromPoint.x} ${fromPoint.y} L ${arrowEndX} ${arrowEndY}`;
  
  // Generate arrowhead SVG path based on relationship type
  let arrowHead;
  if (relationship.type === 'isA') {
    // Triangular arrowhead for inheritance (Is-A)
    const arrowSize = 15;
    const angle = Math.atan2(normalizedDy, normalizedDx);
    
    const point1 = {
      x: toPoint.x,
      y: toPoint.y
    };
    
    const point2 = {
      x: toPoint.x - arrowSize * Math.cos(angle - Math.PI/6),
      y: toPoint.y - arrowSize * Math.sin(angle - Math.PI/6)
    };
    
    const point3 = {
      x: toPoint.x - arrowSize * Math.cos(angle + Math.PI/6),
      y: toPoint.y - arrowSize * Math.sin(angle + Math.PI/6)
    };
    
    arrowHead = (
      <polygon 
        points={`${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`}
        className="arrowhead inheritance"
        fill="white"
        stroke="black"
      />
    );
  } else if (relationship.type === 'hasA') {
    // Diamond arrowhead for composition (Has-A)
    const arrowSize = 12;
    const angle = Math.atan2(normalizedDy, normalizedDx);
    
    const point1 = {
      x: toPoint.x,
      y: toPoint.y
    };
    
    const point2 = {
      x: toPoint.x - arrowSize * Math.cos(angle - Math.PI/4),
      y: toPoint.y - arrowSize * Math.sin(angle - Math.PI/4)
    };
    
    const point3 = {
      x: toPoint.x - arrowSize * 1.5 * Math.cos(angle),
      y: toPoint.y - arrowSize * 1.5 * Math.sin(angle)
    };
    
    const point4 = {
      x: toPoint.x - arrowSize * Math.cos(angle + Math.PI/4),
      y: toPoint.y - arrowSize * Math.sin(angle + Math.PI/4)
    };
    
    arrowHead = (
      <polygon 
        points={`${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} ${point4.x},${point4.y}`}
        className="arrowhead composition"
        fill="black"
        stroke="black"
      />
    );
  }
  
  return (
    <g 
      className={`relationship-line ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(relationship.id);
      }}
    >
      <path 
        d={path} 
        stroke="black" 
        strokeWidth={isSelected ? 2 : 1} 
        fill="none"
      />
      {arrowHead}
    </g>
  );
}

// Helper function to find intersection point between line and class box
function findIntersectionPoint(from, to, classObj) {
  const halfWidth = classObj.width / 2;
  const halfHeight = classObj.height / 2;
  const center = {
    x: classObj.x + halfWidth,
    y: classObj.y + halfHeight
  };
  
  // Vector from center to target
  const dx = to.x - center.x;
  const dy = to.y - center.y;
  
  // Normalize the vector
  const length = Math.sqrt(dx * dx + dy * dy);
  const ndx = dx / length;
  const ndy = dy / length;
  
  // Calculate the intersection with each edge
  const intersections = [
    // Top edge
    {
      t: (center.y - halfHeight - center.y) / ndy,
      edge: 'top'
    },
    // Right edge
    {
      t: (center.x + halfWidth - center.x) / ndx,
      edge: 'right'
    },
    // Bottom edge
    {
      t: (center.y + halfHeight - center.y) / ndy,
      edge: 'bottom'
    },
    // Left edge
    {
      t: (center.x - halfWidth - center.x) / ndx,
      edge: 'left'
    }
  ];
  
  // Filter valid intersections
  const validIntersections = intersections.filter(i => {
    // Ensure t is positive (in the direction of the vector)
    if (i.t <= 0) return false;
    
    // Calculate the intersection point
    const x = center.x + ndx * i.t;
    const y = center.y + ndy * i.t;
    
    // Check if the point is on the edge
    if (i.edge === 'top' || i.edge === 'bottom') {
      return x >= center.x - halfWidth && x <= center.x + halfWidth;
    } else {
      return y >= center.y - halfHeight && y <= center.y + halfHeight;
    }
  });
  
  // Sort by distance and get the closest intersection
  validIntersections.sort((a, b) => a.t - b.t);
  if (validIntersections.length > 0) {
    const closest = validIntersections[0];
    return {
      x: center.x + ndx * closest.t,
      y: center.y + ndy * closest.t
    };
  }
  
  return null;
}

export default RelationshipLine;