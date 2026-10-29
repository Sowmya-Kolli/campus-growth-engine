import { getRecommendedBlueprint } from '../lib/blueprints.ts';
import { AcademicBranch, CodingLevel, ProjectInterest } from '../types/index.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Project Matcher Test Suite...\n');

// ---------------------------------------------------------------------------
// TEST 1: (ECE, Chatbot, Beginner)
// Should focus on embedded/microcontroller/sensor debugging with beginner stack
// ---------------------------------------------------------------------------
console.log('Test 1: (ECE, Chatbot, Beginner)');
const eceBeginnerChatbot = getRecommendedBlueprint('ECE', 'Chatbot', 'Beginner');
console.log('  Title:', eceBeginnerChatbot.title);
console.log('  Difficulty:', eceBeginnerChatbot.difficulty);
console.log('  Tech Stack:', eceBeginnerChatbot.techStack);
console.log('  Milestone 1:', eceBeginnerChatbot.milestones[0].title);
console.log('  Milestone 2:', eceBeginnerChatbot.milestones[1].title);
console.log('  Milestone 3:', eceBeginnerChatbot.milestones[2].title);

assert(eceBeginnerChatbot.difficulty === 'Beginner', 'ECE Beginner difficulty should be Beginner');
assert(eceBeginnerChatbot.title.includes('Embedded') || eceBeginnerChatbot.title.includes('Hardware'), 'ECE title should reflect hardware/embedded domain');
assert(eceBeginnerChatbot.techStack.includes('Streamlit Cloud UI'), 'Beginner tech stack should include Streamlit');
assert(eceBeginnerChatbot.milestones.length === 3, 'Must have exactly 3 milestones');
assert(eceBeginnerChatbot.milestones[0].title.includes('Scaffolded'), 'Beginner milestone 1 should be scaffolded');
assert(eceBeginnerChatbot.id === 'chatbot-ece-beginner', 'ID must be deterministic: chatbot-ece-beginner');
console.log('  ✅ Test 1 Passed\n');

// ---------------------------------------------------------------------------
// TEST 2: (CSE, Chatbot, Intermediate)
// Should focus on developer docs/APIs with advanced vector/RAG architecture
// ---------------------------------------------------------------------------
console.log('Test 2: (CSE, Chatbot, Intermediate)');
const cseInterChatbot = getRecommendedBlueprint('CSE', 'Chatbot', 'Intermediate');
console.log('  Title:', cseInterChatbot.title);
console.log('  Difficulty:', cseInterChatbot.difficulty);
console.log('  Tech Stack:', cseInterChatbot.techStack);
console.log('  Milestone 1:', cseInterChatbot.milestones[0].title);
console.log('  Milestone 2:', cseInterChatbot.milestones[1].title);
console.log('  Milestone 3:', cseInterChatbot.milestones[2].title);

assert(cseInterChatbot.difficulty === 'Intermediate', 'CSE Intermediate difficulty should be Intermediate');
assert(cseInterChatbot.title.includes('Developer') || cseInterChatbot.title.includes('RAG'), 'Title should reflect CSE and RAG');
assert(cseInterChatbot.techStack.includes('FAISS Vector Store'), 'Intermediate tech stack should include vector store');
assert(cseInterChatbot.milestones[0].title.includes('Vector Indexing'), 'Milestone 1 should involve vector indexing');
assert(cseInterChatbot.milestones[1].title.includes('Contextual RAG'), 'Milestone 2 should involve contextual RAG');
assert(cseInterChatbot.id === 'chatbot-cse-intermediate', 'ID must be deterministic: chatbot-cse-intermediate');

// Cross-verification: ECE Beginner vs CSE Intermediate MUST differ meaningfully
assert(eceBeginnerChatbot.title !== cseInterChatbot.title, 'Titles must differ between branches and levels');
assert(eceBeginnerChatbot.difficulty !== cseInterChatbot.difficulty, 'Difficulty must differ');
assert(JSON.stringify(eceBeginnerChatbot.techStack) !== JSON.stringify(cseInterChatbot.techStack), 'Tech stacks must differ');
assert(eceBeginnerChatbot.milestones[0].title !== cseInterChatbot.milestones[0].title, 'Milestones must differ');
console.log('  ✅ Test 2 Passed & Cross-Diff Verified\n');

// ---------------------------------------------------------------------------
// TEST 3: (AIML, Data Dashboard, Intermediate) vs (OTHER, Data Dashboard, Beginner)
// AIML should focus on LLM Token Economics & Benchmarking
// OTHER should focus on Industrial/Mechanical Sensor & Stress Analytics
// ---------------------------------------------------------------------------
console.log('Test 3: (AIML, Data Dashboard, Intermediate) vs (OTHER, Data Dashboard, Beginner)');
const aimlInterDashboard = getRecommendedBlueprint('AIML', 'Data Dashboard', 'Intermediate');
const otherBeginnerDashboard = getRecommendedBlueprint('OTHER', 'Data Dashboard', 'Beginner');

console.log('  AIML Title:', aimlInterDashboard.title);
console.log('  OTHER Title:', otherBeginnerDashboard.title);
console.log('  AIML Tech:', aimlInterDashboard.techStack);
console.log('  OTHER Tech:', otherBeginnerDashboard.techStack);

assert(aimlInterDashboard.title.includes('LLM') || aimlInterDashboard.title.includes('Token'), 'AIML dashboard should target LLM/Model benchmarks');
assert(otherBeginnerDashboard.title.includes('Industrial') || otherBeginnerDashboard.title.includes('Equipment'), 'OTHER dashboard should target industrial/mechanical');
assert(aimlInterDashboard.difficulty === 'Intermediate', 'AIML difficulty must be Intermediate');
assert(otherBeginnerDashboard.difficulty === 'Beginner', 'OTHER difficulty must be Beginner');
assert(aimlInterDashboard.desc !== otherBeginnerDashboard.desc, 'Descriptions must differ');
assert(aimlInterDashboard.milestones[0].desc !== otherBeginnerDashboard.milestones[0].desc, 'Milestones descriptions must differ');
console.log('  ✅ Test 3 Passed\n');

// ---------------------------------------------------------------------------
// TEST 4: (IT, Resume & Career Tools, Basic)
// Verifies 'Basic' coding level with IT cloud engineer domain
// ---------------------------------------------------------------------------
console.log('Test 4: (IT, Resume & Career Tools, Basic)');
const itBasicResume = getRecommendedBlueprint('IT', 'Resume & Career Tools', 'Basic');
console.log('  Title:', itBasicResume.title);
console.log('  Tech Stack:', itBasicResume.techStack);
console.log('  Milestone 1:', itBasicResume.milestones[0].title);

assert(itBasicResume.title.includes('IT Systems') || itBasicResume.title.includes('Cloud'), 'IT resume should focus on IT/cloud systems');
assert(itBasicResume.techStack.includes('Pydantic Data Schemas'), 'Basic stack should include Pydantic Schemas');
assert(itBasicResume.milestones[0].title.includes('Structured Schema'), 'Milestone 1 should be Structured Schema Setup');
assert(itBasicResume.id === 'resume-career-tools-it-basic', 'ID must match slug');
console.log('  ✅ Test 4 Passed\n');

// ---------------------------------------------------------------------------
// TEST 5: Comprehensive coverage test for all branches, interests, and levels
// 5 branches x 4 interests x 3 levels = 60 combinations
// ---------------------------------------------------------------------------
console.log('Test 5: Exhaustive matrix validation (60 combinations)');
const branches: AcademicBranch[] = ['CSE', 'IT', 'AIML', 'ECE', 'OTHER'];
const interests: ProjectInterest[] = ['Chatbot', 'Resume & Career Tools', 'Study Assistant', 'Data Dashboard'];
const levels: CodingLevel[] = ['Beginner', 'Basic', 'Intermediate'];

let count = 0;
for (const b of branches) {
  for (const i of interests) {
    for (const l of levels) {
      const bp = getRecommendedBlueprint(b, i, l);
      assert(Boolean(bp.title && bp.title.length > 5), `Empty title for ${b}-${i}-${l}`);
      assert(Boolean(bp.desc && bp.desc.length > 10), `Empty desc for ${b}-${i}-${l}`);
      assert(Boolean(bp.detailedDesc && bp.detailedDesc.length > 10), `Empty detailedDesc for ${b}-${i}-${l}`);
      assert(bp.techStack.length >= 4, `Tech stack too small for ${b}-${i}-${l}`);
      assert(bp.milestones.length === 3, `Must have 3 milestones for ${b}-${i}-${l}`);
      for (const m of bp.milestones) {
        assert(Boolean(m.title && m.desc), `Invalid milestone in ${b}-${i}-${l}`);
      }
      count++;
    }
  }
}
console.log(`  ✅ All ${count} combinations generated valid, non-empty, non-contradictory blueprints!`);
console.log('\n🎉 ALL MATCHER TESTS PASSED SUCCESSFULLY!');
