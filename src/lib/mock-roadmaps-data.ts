export type NodeStatus = 'locked' | 'unlocked' | 'completed';

export interface RoadmapNode {
  id: string;
  problem_id: string;
  title: string;
  position_x: number;
  position_y: number;
  parent_node_id: string | null;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  nodes: RoadmapNode[];
}

export interface UserProgress {
  [nodeId: string]: {
    status: NodeStatus;
  };
}

const dsaRoadmapNodes: RoadmapNode[] = [
  // Foundations
  { id: 'dsa-1', problem_id: 'big-o', title: 'Big O Notation', position_x: 5, position_y: 50, parent_node_id: null },
  { id: 'dsa-2', problem_id: 'arrays', title: 'Arrays & Strings', position_x: 20, position_y: 50, parent_node_id: 'dsa-1' },
  // Linear
  { id: 'dsa-3', problem_id: 'linked-lists', title: 'Linked Lists', position_x: 35, position_y: 35, parent_node_id: 'dsa-2' },
  { id: 'dsa-4', problem_id: 'stacks-queues', title: 'Stacks & Queues', position_x: 35, position_y: 65, parent_node_id: 'dsa-2' },
  // Non-Linear
  { id: 'dsa-5', problem_id: 'trees', title: 'Trees & Tries', position_x: 50, position_y: 35, parent_node_id: 'dsa-3' },
  { id: 'dsa-6', problem_id: 'heaps', title: 'Heaps', position_x: 50, position_y: 65, parent_node_id: 'dsa-4' },
   // Advanced Structures
  { id: 'dsa-7', problem_id: 'hash-tables', title: 'Hash Tables', position_x: 65, position_y: 50, parent_node_id: 'dsa-5' },
  { id: 'dsa-8', problem_id: 'graphs', title: 'Graphs', position_x: 65, position_y: 50, parent_node_id: 'dsa-6' },
  // Algorithms
  { id: 'dsa-9', problem_id: 'sorting-searching', title: 'Sorting & Searching', position_x: 80, position_y: 35, parent_node_id: 'dsa-7' },
  { id: 'dsa-10', problem_id: 'recursion', title: 'Recursion', position_x: 80, position_y: 65, parent_node_id: 'dsa-8' },
    // Final
  { id: 'dsa-11', problem_id: 'final-project', title: 'Capstone Challenge', position_x: 95, position_y: 50, parent_node_id: 'dsa-9' },
  { id: 'dsa-12', problem_id: 'final-project', title: 'Capstone Challenge', position_x: 95, position_y: 50, parent_node_id: 'dsa-10' },

];

const webDevRoadmapNodes: RoadmapNode[] = [
  { id: 'web-1', problem_id: 'html-css', title: 'HTML & CSS', position_x: 5, position_y: 50, parent_node_id: null },
  { id: 'web-2', problem_id: 'js-dom', title: 'JavaScript DOM', position_x: 20, position_y: 50, parent_node_id: 'web-1' },
  { id: 'web-3', problem_id: 'react-intro', title: 'Intro to React', position_x: 35, position_y: 50, parent_node_id: 'web-2' },
  { id: 'web-4', problem_id: 'nodejs-intro', title: 'Intro to Node.js', position_x: 50, position_y: 35, parent_node_id: 'web-3' },
  { id: 'web-5', problem_id: 'express-api', title: 'Express API', position_x: 65, position_y: 35, parent_node_id: 'web-4' },
  { id: 'web-6', problem_id: 'sql-intro', title: 'SQL Fundamentals', position_x: 50, position_y: 65, parent_node_id: 'web-3' },
  { id: 'web-7', problem_id: 'db-connection', title: 'Connecting a DB', position_x: 65, position_y: 65, parent_node_id: 'web-6' },
  { id: 'web-8', problem_id: 'auth', title: 'Authentication', position_x: 80, position_y: 50, parent_node_id: 'web-5' },
  { id: 'web-9', problem_id: 'auth', title: 'Authentication', position_x: 80, position_y: 50, parent_node_id: 'web-7' },
  { id: 'web-10', problem_id: 'final-project-fullstack', title: 'Full-Stack Project', position_x: 95, position_y: 50, parent_node_id: 'web-8' },
];

const aiMlRoadmapNodes: RoadmapNode[] = [
    { id: 'ai-1', problem_id: 'python-datasci', title: 'Python for Data Science', position_x: 5, position_y: 50, parent_node_id: null },
    { id: 'ai-2', problem_id: 'ml-concepts', title: 'Core ML Concepts', position_x: 20, position_y: 50, parent_node_id: 'ai-1' },
    { id: 'ai-3', problem_id: 'regression', title: 'Linear Regression', position_x: 35, position_y: 35, parent_node_id: 'ai-2' },
    { id: 'ai-4', problem_id: 'knn', title: 'K-Nearest Neighbors', position_x: 35, position_y: 65, parent_node_id: 'ai-2' },
    { id: 'ai-5', problem_id: 'decision-trees', title: 'Decision Trees', position_x: 50, position_y: 35, parent_node_id: 'ai-3' },
    { id: 'ai-6', problem_id: 'svm', title: 'Support Vector Machines', position_x: 50, position_y: 65, parent_node_id: 'ai-4' },
    { id: 'ai-7', problem_id: 'neural-networks', title: 'Intro to Deep Learning', position_x: 65, position_y: 50, parent_node_id: 'ai-5' },
    { id: 'ai-8', problem_id: 'neural-networks', title: 'Intro to Deep Learning', position_x: 65, position_y: 50, parent_node_id: 'ai-6' },
    { id: 'ai-9', problem_id: 'final-project-ai', title: 'Final Project', position_x: 80, position_y: 50, parent_node_id: 'ai-7' },
];

export const roadmaps: Roadmap[] = [
  {
    id: 'dsa-fundamentals',
    title: 'Data Structures & Algorithms',
    description: 'Master the core concepts of computer science from Big O to Dynamic Programming.',
    difficulty: 'Intermediate',
    nodes: dsaRoadmapNodes,
  },
  {
    id: 'full-stack-web-dev',
    title: 'Full-Stack Web Development',
    description: 'Learn to build complete web applications from frontend with React to backend with Node.js.',
    difficulty: 'Beginner',
    nodes: webDevRoadmapNodes,
  },
  {
    id: 'ai-ml-foundations',
    title: 'AI & Machine Learning Foundations',
    description: 'Step into the world of AI. Learn foundational models from Regression to Neural Networks.',
    difficulty: 'Advanced',
    nodes: aiMlRoadmapNodes,
  },
];

// Mock user progress. In a real app, this would come from a database.
export const userProgress: UserProgress = {
  'dsa-1': { status: 'completed' },
  'dsa-2': { status: 'completed' },
  'dsa-3': { status: 'unlocked' },
  'dsa-4': { status: 'unlocked' },

  'web-1': { status: 'completed' },
  'web-2': { status: 'unlocked' },
  
  'ai-1': { status: 'unlocked' },
};

// Function to get roadmap by ID
export const getRoadmapById = (id: string): Roadmap | undefined => {
    return roadmaps.find(r => r.id === id);
}
