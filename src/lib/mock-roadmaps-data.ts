export type NodeStatus = 'locked' | 'unlocked' | 'completed';
export type NodeType = 'group' | 'item';

export interface RoadmapNode {
  id: string;
  problem_id: string;
  title: string;
  position_x: number;
  position_y: number;
  parent_node_id: string | null;
  type: NodeType;
  width?: number;
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
  // Column 1: Language Choices
  { id: 'dsa-csharp', problem_id: 'csharp', title: 'C#', position_x: 5, position_y: 10, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-cpp', problem_id: 'cpp', title: 'C++', position_x: 5, position_y: 20, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-python', problem_id: 'python', title: 'Python', position_x: 5, position_y: 30, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-rust', problem_id: 'rust', title: 'Rust', position_x: 5, position_y: 40, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-js', problem_id: 'js', title: 'JavaScript', position_x: 17, position_y: 10, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-java', problem_id: 'java', title: 'Java', position_x: 17, position_y: 20, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-go', problem_id: 'go', title: 'Go', position_x: 17, position_y: 30, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  { id: 'dsa-ruby', problem_id: 'ruby', title: 'Ruby', position_x: 17, position_y: 40, parent_node_id: 'dsa-pick-lang', type: 'item', width: 10 },
  
  // Column 2: Core Concepts
  { id: 'dsa-pick-lang', problem_id: 'pick-lang', title: 'Pick a Language', position_x: 35, position_y: 25, parent_node_id: null, type: 'group', width: 15 },
  { id: 'dsa-fundamentals', problem_id: 'fundamentals', title: 'Programming Fundamentals', position_x: 35, position_y: 40, parent_node_id: 'dsa-pick-lang', type: 'group', width: 20 },
  { id: 'dsa-what-are', problem_id: 'what-are-ds', title: 'What are Data Structures?', position_x: 35, position_y: 60, parent_node_id: 'dsa-fundamentals', type: 'group', width: 20 },
  { id: 'dsa-why-important', problem_id: 'why-ds-important', title: 'Why are DS Important?', position_x: 35, position_y: 75, parent_node_id: 'dsa-what-are', type: 'group', width: 20 },
  { id: 'dsa-basic-ds', problem_id: 'basic-ds', title: 'Basic Data Structures', position_x: 35, position_y: 90, parent_node_id: 'dsa-why-important', type: 'group', width: 20 },

  // Column 3: Language Fundamentals
  { id: 'dsa-lang-syntax', problem_id: 'lang-syntax', title: 'Language Syntax', position_x: 65, position_y: 20, parent_node_id: 'dsa-fundamentals', type: 'item', width: 15 },
  { id: 'dsa-control-structures', problem_id: 'control-structures', title: 'Control Structures', position_x: 65, position_y: 30, parent_node_id: 'dsa-fundamentals', type: 'item', width: 15 },
  { id: 'dsa-pseudo-code', problem_id: 'pseudo-code', title: 'Pseudo Code', position_x: 65, position_y: 40, parent_node_id: 'dsa-fundamentals', type: 'item', width: 15 },
  { id: 'dsa-functions', problem_id: 'functions', title: 'Functions', position_x: 65, position_y: 50, parent_node_id: 'dsa-fundamentals', type: 'item', width: 15 },
  { id: 'dsa-oop-basics', problem_id: 'oop-basics', title: 'OOP Basics', position_x: 65, position_y: 60, parent_node_id: 'dsa-fundamentals', type: 'item', width: 15 },

  // Column 4: Data Structures
  { id: 'dsa-array', problem_id: 'array', title: 'Array', position_x: 15, position_y: 80, parent_node_id: 'dsa-basic-ds', type: 'item', width: 12 },
  { id: 'dsa-linked-lists', problem_id: 'linked-lists', title: 'Linked Lists', position_x: 15, position_y: 90, parent_node_id: 'dsa-basic-ds', type: 'item', width: 12 },
  { id: 'dsa-queues', problem_id: 'queues', title: 'Queues', position_x: 55, position_y: 80, parent_node_id: 'dsa-basic-ds', type: 'item', width: 12 },
  { id: 'dsa-stacks', problem_id: 'stacks', title: 'Stacks', position_x: 55, position_y: 90, parent_node_id: 'dsa-basic-ds', type: 'item', width: 12 },
  { id: 'dsa-hash-tables', problem_id: 'hash-tables', title: 'Hash Tables', position_x: 80, position_y: 85, parent_node_id: 'dsa-queues, dsa-stacks', type: 'item', width: 15 },
];


const webDevRoadmapNodes: RoadmapNode[] = [
  { id: 'web-1', problem_id: 'html-css', title: 'HTML & CSS', position_x: 5, position_y: 50, parent_node_id: null, type: 'group' },
  { id: 'web-2', problem_id: 'js-dom', title: 'JavaScript DOM', position_x: 20, position_y: 50, parent_node_id: 'web-1', type: 'group' },
  { id: 'web-3', problem_id: 'react-intro', title: 'Intro to React', position_x: 35, position_y: 50, parent_node_id: 'web-2', type: 'group' },
];

const aiMlRoadmapNodes: RoadmapNode[] = [
    { id: 'ai-1', problem_id: 'python-datasci', title: 'Python for Data Science', position_x: 5, position_y: 50, parent_node_id: null, type: 'group' },
    { id: 'ai-2', problem_id: 'ml-concepts', title: 'Core ML Concepts', position_x: 20, position_y: 50, parent_node_id: 'ai-1', type: 'group' },
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
  'dsa-pick-lang': { status: 'completed' },
};

// Function to get roadmap by ID
export const getRoadmapById = (id: string): Roadmap | undefined => {
    return roadmaps.find(r => r.id === id);
}
