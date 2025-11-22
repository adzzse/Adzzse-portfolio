import React from 'react'
import type { Algorithm, MazeType, VisualizationSpeed } from '../types'

interface ControlPanelProps {
  algorithm: Algorithm
  speed: VisualizationSpeed
  isVisualizing: boolean
  isGeneratingMaze: boolean
  onAlgorithmChange: (algorithm: Algorithm) => void
  onSpeedChange: (speed: VisualizationSpeed) => void
  onVisualize: () => void
  onClearPath: () => void
  onClearBoard: () => void
  onGenerateMaze: (type: MazeType) => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  speed,
  isVisualizing,
  isGeneratingMaze,
  onAlgorithmChange,
  onSpeedChange,
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateMaze,
}) => {
  const isDisabled = isVisualizing || isGeneratingMaze

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Pathfinding Visualizer
      </h2>

      {/* Algorithm Selection */}
      <div className="flex flex-wrap gap-4 items-center">
        <label htmlFor="algorithm-select" className="font-semibold text-gray-700 dark:text-gray-300">
          Algorithm:
        </label>
        <select
          id="algorithm-select"
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
          disabled={isDisabled}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="astar">A* Search</option>
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
        </select>

        {/* Speed Control */}
        <label htmlFor="speed-select" className="font-semibold text-gray-700 dark:text-gray-300 ml-4">
          Speed:
        </label>
        <select
          id="speed-select"
          value={speed}
          onChange={(e) => onSpeedChange(e.target.value as VisualizationSpeed)}
          disabled={isDisabled}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="slow">Slow</option>
          <option value="medium">Medium</option>
          <option value="fast">Fast</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onVisualize}
          disabled={isDisabled}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isVisualizing ? 'Visualizing...' : 'Visualize!'}
        </button>

        <button
          onClick={() => onGenerateMaze('recursive-division')}
          disabled={isDisabled}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Recursive Division
        </button>

        <button
          onClick={() => onGenerateMaze('random')}
          disabled={isDisabled}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Random Maze
        </button>

        <button
          onClick={onClearPath}
          disabled={isDisabled}
          className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Clear Path
        </button>

        <button
          onClick={onClearBoard}
          disabled={isDisabled}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Clear Board
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Click and drag to create <strong>walls</strong></li>
          <li>• Hold <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Shift</kbd> and click to add <strong>weighted nodes</strong></li>
          <li>• Drag the <span className="text-green-600 font-semibold">green (start)</span> and <span className="text-red-600 font-semibold">red (finish)</span> nodes to reposition</li>
          <li>• <strong>Dijkstra</strong> and <strong>A*</strong> support weighted nodes</li>
        </ul>
      </div>
    </div>
  )
}

export default ControlPanel
