import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, MousePointer, Square } from 'lucide-react';
import './Toolbar.css';

function Toolbar({
    selectedTool,
    zoomLevel,
    onToolSelect,
    onZoomIn,
    onZoomOut,
    onToggleFullScreen,
    onSaveDiagram,
    exportDiagram
}) {
    return (
        <div className="lld-toolbar">
            <div className="lld-toolbar-section">
                <button
                    className={`lld-toolbar-button ${selectedTool === 'pointer' ? 'selected' : ''}`}
                    onClick={() => onToolSelect('pointer')}
                    title="Select Tool"
                >
                    <MousePointer size={20} />
                </button>
                <button
                    className={`lld-toolbar-button ${selectedTool === 'class' ? 'selected' : ''}`}
                    onClick={() => onToolSelect('class')}
                    title="Add Class"
                >
                    <Square size={20} />
                </button>
                <button
                    className={`lld-toolbar-button ${selectedTool === 'isA' ? 'selected' : ''}`}
                    onClick={() => onToolSelect('isA')}
                    title="Is-A Relationship (Inheritance)"
                >
                    {/* Triangle-headed arrow for inheritance */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="12" x2="18" y2="12" />
                        <polygon points="17,7 23,12 17,17" fill="white" stroke="currentColor" />
                    </svg>
                    <span className="lld-toolbar-label">Is-A</span>
                </button>
                <button
                    className={`lld-toolbar-button ${selectedTool === 'hasA' ? 'selected' : ''}`}
                    onClick={() => onToolSelect('hasA')}
                    title="Has-A Relationship (Composition)"
                >
                    {/* Diamond-headed arrow for composition */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="12" x2="16" y2="12" />
                        <polygon points="17,12 20,9 23,12 20,15" fill="black" stroke="currentColor" />
                    </svg>
                    <span className="lld-toolbar-label">Has-A</span>
                </button>
            </div>
            <div className="lld-toolbar-section">
                <button
                    className="lld-toolbar-button save-button"
                    onClick={onSaveDiagram}
                    title="Save Diagram"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span className="lld-toolbar-label">Save</span>
                </button>
                <button
                    className="lld-toolbar-button export-button"
                    onClick={exportDiagram}
                    title="Export Diagram"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="lld-toolbar-label">Export zip</span>
                </button>
                <button
                    className="lld-toolbar-button"
                    onClick={onZoomOut}
                    title="Zoom Out"
                >
                    <ZoomOut size={20} />
                </button>
                <span className="lld-zoom-level">
                    {Math.round(zoomLevel * 100)}%
                </span>
                <button
                    className="lld-toolbar-button"
                    onClick={onZoomIn}
                    title="Zoom In"
                >
                    <ZoomIn size={20} />
                </button>
                {/* <button
                    className="lld-toolbar-button"
                    onClick={onToggleFullScreen}
                    title="Toggle Full Screen"
                >
                    <Maximize2 size={20} />
                </button> */}
            </div>
        </div>
    );
}

export default Toolbar;