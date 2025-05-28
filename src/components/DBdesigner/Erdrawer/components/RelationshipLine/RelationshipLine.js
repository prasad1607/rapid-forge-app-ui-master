// components/RelationshipLine/RelationshipLine.js
import React, { useState } from 'react';
import './RelationshipLine.css';

const RelationshipLine = ({
    relationship,
    sourceEntity,
    targetEntity,
    onDelete,
    onUpdate
}) => {
    const [showOptions, setShowOptions] = useState(false);

    // Calculate center points of entities
    const sourceX = sourceEntity.x + sourceEntity.width / 2;
    const sourceY = sourceEntity.y + sourceEntity.height / 2;
    const targetX = targetEntity.x + targetEntity.width / 2;
    const targetY = targetEntity.y + targetEntity.height / 2;

    // Directional vector
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalized direction
    const ndx = dx / distance;
    const ndy = dy / distance;

    // Find intersection points with entity borders
    const sourceBorder = findIntersectionWithEntityBorder(
        sourceX, sourceY, ndx, ndy, sourceEntity
    );

    const targetBorder = findIntersectionWithEntityBorder(
        targetX, targetY, -ndx, -ndy, targetEntity
    );

    // If intersections not found, use entity centers as fallback
    const x1 = sourceBorder ? sourceBorder.x : sourceX;
    const y1 = sourceBorder ? sourceBorder.y : sourceY;
    const x2 = targetBorder ? targetBorder.x : targetX;
    const y2 = targetBorder ? targetBorder.y : targetY;

    // Calculate mid-point for label and controls
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Draw relationship symbols
    const symSize = 10; // Size of symbols

    // Relationship type symbols
    let sourceSymbol = null;
    let targetSymbol = null;
    let path = null;

    switch (relationship.type) {
        case 'oneToOne':
            // One-to-One: | on both sides
            sourceSymbol = getOneSymbol(x1, y1, ndx, ndy, symSize);
            targetSymbol = getOneSymbol(x2, y2, -ndx, -ndy, symSize);
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
            break;

        case 'oneToMany':
            // One-to-Many: | on source, crow's foot on target
            sourceSymbol = getOneSymbol(x1, y1, ndx, ndy, symSize);
            targetSymbol = getManySymbol(x2, y2, -ndx, -ndy, symSize);
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
            break;

        case 'manyToOne':
            // Many-to-One: crow's foot on source, | on target
            sourceSymbol = getManySymbol(x1, y1, ndx, ndy, symSize);
            targetSymbol = getOneSymbol(x2, y2, -ndx, -ndy, symSize);
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
            break;

        case 'manyToMany':
            // Many-to-Many: crow's foot on both sides
            sourceSymbol = getManySymbol(x1, y1, ndx, ndy, symSize);
            targetSymbol = getManySymbol(x2, y2, -ndx, -ndy, symSize);
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
            break;

        default:
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    const handleRelationshipTypeChange = (newType) => {
        onUpdate({
            ...relationship,
            type: newType
        });
        setShowOptions(false);
    };

    return (
        <>
            <svg className="erd-relationship-line" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path
                    d={path}
                    stroke="black"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray={relationship.type === 'oneToOne' ? "none" : "none"}
                />

                {/* Render symbol components */}
                {sourceSymbol}
                {targetSymbol}
            </svg>

            {/* Controls at midpoint */}
            <div
                className="erd-relationship-controls"
                style={{
                    left: `${midX}px`,
                    top: `${midY}px`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div
                    className="erd-relationship-label"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    {getRelationshipLabel(relationship.type)}
                </div>

                {showOptions && (
                    <div className="erd-relationship-options">
                        <div className="erd-relationship-types">
                            <button
                                className={`erd-type-btn ${relationship.type === 'oneToOne' ? 'active' : ''}`}
                                onClick={() => handleRelationshipTypeChange('oneToOne')}
                            >
                                1:1
                            </button>
                            <button
                                className={`erd-type-btn ${relationship.type === 'oneToMany' ? 'active' : ''}`}
                                onClick={() => handleRelationshipTypeChange('oneToMany')}
                            >
                                1:N
                            </button>
                            <button
                                className={`erd-type-btn ${relationship.type === 'manyToOne' ? 'active' : ''}`}
                                onClick={() => handleRelationshipTypeChange('manyToOne')}
                            >
                                N:1
                            </button>
                            <button
                                className={`erd-type-btn ${relationship.type === 'manyToMany' ? 'active' : ''}`}
                                onClick={() => handleRelationshipTypeChange('manyToMany')}
                            >
                                M:N
                            </button>
                        </div>
                        <button className="erd-delete-relationship-btn" onClick={onDelete}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// Helper function to find intersection with entity border
function findIntersectionWithEntityBorder(centerX, centerY, dirX, dirY, entity) {
    // Entity boundaries
    const left = entity.x;
    const right = entity.x + entity.width;
    const top = entity.y;
    const bottom = entity.y + entity.height;

    // Compute intersection with each edge
    // Top edge
    let t = (top - centerY) / dirY;
    let x = centerX + t * dirX;
    if (t > 0 && x >= left && x <= right) {
        return { x, y: top };
    }

    // Bottom edge
    t = (bottom - centerY) / dirY;
    x = centerX + t * dirX;
    if (t > 0 && x >= left && x <= right) {
        return { x, y: bottom };
    }

    // Left edge
    t = (left - centerX) / dirX;
    let y = centerY + t * dirY;
    if (t > 0 && y >= top && y <= bottom) {
        return { x: left, y };
    }

    // Right edge
    t = (right - centerX) / dirX;
    y = centerY + t * dirY;
    if (t > 0 && y >= top && y <= bottom) {
        return { x: right, y };
    }

    // If no intersection found, return null
    return null;
}

// Helper to create SVG element for "one" symbol (vertical bar)
function getOneSymbol(x, y, dirX, dirY, size) {
    // Perpendicular direction
    const perpX = -dirY;
    const perpY = dirX;

    // Adjust position back along direction vector to leave space for the symbol
    const adjustedX = x - dirX * size;
    const adjustedY = y - dirY * size;

    // Endpoints of the vertical bar
    const x1 = adjustedX + perpX * size;
    const y1 = adjustedY + perpY * size;
    const x2 = adjustedX - perpX * size;
    const y2 = adjustedY - perpY * size;

    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="1.5"
        />
    );
}

// Helper to create SVG element for "many" symbol (crow's foot)
function getManySymbol(x, y, dirX, dirY, size) {
    // Perpendicular direction
    const perpX = -dirY;
    const perpY = dirX;

    // Adjust position back along direction vector to leave space for the symbol
    const adjustedX = x - dirX * size * 2;
    const adjustedY = y - dirY * size * 2;

    // Center point of the crow's foot
    const centerX = adjustedX + dirX * size;
    const centerY = adjustedY + dirY * size;

    // Endpoints of the crow's foot lines
    const x1 = centerX + perpX * size;
    const y1 = centerY + perpY * size;
    const x2 = centerX - perpX * size;
    const y2 = centerY - perpY * size;

    return (
        <g>
            <line
                x1={adjustedX}
                y1={adjustedY}
                x2={x1}
                y2={y1}
                stroke="black"
                strokeWidth="1.5"
            />
            <line
                x1={adjustedX}
                y1={adjustedY}
                x2={x2}
                y2={y2}
                stroke="black"
                strokeWidth="1.5"
            />
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="black"
                strokeWidth="1.5"
            />
        </g>
    );
}

// Helper to generate relationship label text
function getRelationshipLabel(type) {
    switch (type) {
        case 'oneToOne': return '1:1';
        case 'oneToMany': return '1:N';
        case 'manyToOne': return 'N:1';
        case 'manyToMany': return 'M:N';
        default: return '';
    }
}

export default RelationshipLine;