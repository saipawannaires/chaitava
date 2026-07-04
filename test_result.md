#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Chaitava — massive Vedic + science platform. Latest additions:
  1. Deep lore on Aghoris, Sadhus, Gods (Shiva/Vishnu/Brahma/Devi/Ganesha/Hanuman/Kartikeya/Kali/Durga/Lakshmi/Saraswati/Surya) with decorations, weapons, body-connections, formation stories.
  2. Avatars — Dashavatara of Vishnu (Matsya → Kalki) + Shiva avatars + Devi avatars, with reasons for incarnation.
  3. Phases of life (Ashramas): Brahmacharya, Grihastha, Vanaprastha, Sannyasa + related frameworks (Purusharthas, Varnas, Samskaras).

backend:
  - task: "New content endpoints (aghoris, sadhus, gods, avatars, ashramas, purusharthas, varnas, samskaras)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js + lib/content-gods.js + lib/content-life-stages.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "All 8 endpoints returning 200 with rich JSON. Verified via curl."

frontend:
  - task: "Explore pages for aghoris/sadhus/gods/avatars/ashramas/purusharthas/varnas/samskaras via /explore/[slug]"
    implemented: true
    working: true
    file: "app/explore/[slug]/page.js + app/page.js grid"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Confirmed via screenshot — Ashramas timeline with 4 clickable stage circles, Brahmacharya detail card renders with all duties, purushartha, practices, body-chakra connection, key texts. All 8 new sections wired into home grid (now 38 doorways)."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Added 8 new content sections: Aghoris, Sadhus, Gods (12 major deities), Avatars (Dashavatara + Shiva + Devi), Ashramas (4 life stages), Purusharthas (4 aims), Varnas (4 orders), Samskaras (16 sacraments). All wired via /explore/[slug] dynamic route. All API endpoints tested and returning 200. Home grid now shows 38 doorways.
  - agent: "main"
    message: |
      Added Rituals of Pooja (/explore/rituals) with 6-tab structure: 16 Upacharas (Shodashopachara), 12 Major Poojas (Ganesha, Lakshmi, Rudrabhisheka, Satyanarayana, Navagraha, Chandi Homa, Ayush Homa, Griha Pravesha, Sudarshana, Kaal Sarpa, Shraddha, Kalasha Sthapana — each with deity, when, purpose, essentials, mantras, steps, significance), 5 types of Aarti + famous aartis, 18 Pooja Implements (Kalasha, Panchapatra, Deepa, Shankha, Rudraksha, etc.), 9 Homas (Ganapati, Mrityunjaya, Sudarshana, Chandi, Ayush, Navagraha, Rudra, Ati-Rudra, Somayajna), and complete Daily Ritual schedule with the Five Debts framework. Home grid now 39 doorways. API /api/rituals returns 200, page verified via screenshots.
  - agent: "main"
    message: |
      CONTEST-STRATEGY PIVOT — Built the Knowledge Universe at /discover as the flagship hero feature. Interactive radial navigation: click any concept-planet, it becomes the new center, revealing its unique orbit of connected concepts. 29 nodes across 9 domains (Mind, Body, Practice, Cosmos, Spirit, Life, Method, Principle, Origin) with full 5-perspective content (Overview, Scientific, Spiritual, Philosophical, Historical) + One Practice to Try Today + Related pills for jumping.
      Also applied the new CHAITAVA AI system prompt to /api/guru with expanded response format (adds "related" concepts array and "action" daily-action field).
      Created /app/memory/PRD.md (master spec) and /app/memory/chaitava_ai_system_prompt.md (AI behavior spec) for long-term project management.
      Home hero now leads with "Enter the Knowledge Universe" (primary gradient button linking to /discover). Both /discover load and navigation between planets verified via screenshots.

  - agent: "main"
    message: |
      KNOWLEDGE UNIVERSE v2 — Now INFINITE.
      1) Expanded static nodes: 29 → 77 (added Religions: Hinduism/Buddhism/Christianity/Islam/Judaism/Sikhism/Taoism/Jainism/Sufism/Stoicism/Zen; Sciences: Evolution/DNA/Atom/Gravity/Blackholes/Neurons/Neuroplasticity/Microbiome; Anatomy: Heart/Vagus/Kundalini/Nadis; Practices: Mudras/Mantras/Sound Healing/Sacred Geometry; Emotions: Gratitude/Fear/Ego/Compassion/Purpose/Flow; Scriptures: Vedas/Upanishads/Gita/Dhammapada/Tao Te Ching; Relationships: Family/Community/Service/Krishna; Fringe: Reiki/Psychedelics/NDE; Bridges: Ayurveda/Nature/Ecology).
      2) AI-generated node expansion: new POST /api/expand-node — user types any concept (e.g. "forgiveness", "moon", "silence"), Claude generates a full 5-perspective node (id, name, dev, tagline, domain, color, scientific, spiritual, philosophical, historical, practice, related[]) added live to the universe. Verified working.
      3) UI/UX polish on /discover: search bar with ⌘K shortcut, smooth transitions between planets, breadcrumb trail showing full journey, back/home buttons, star field background, orbit-in animations, glow on center planet, hover scale on orbit planets, mobile-responsive.
      4) System prompt aligned throughout.
