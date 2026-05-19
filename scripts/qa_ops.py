from scripts.shared_memory import SharedMemory
from scripts.state_manager import AgentStateManager, generate_thread_id

# Shared Memory operations (Regra #5)
memory = SharedMemory("feature-team")

# Read what frontend and backend have done
try:
    frontend_work = memory.read("frontend")
    backend_work = memory.read("backend")
    print(f"Frontend work: {frontend_work}")
    print(f"Backend work: {backend_work}")
except Exception as e:
    print(f"Error reading shared memory: {e}")
    frontend_work = None
    backend_work = None

# Write test plan to shared memory
test_plan = {
    "unit_tests": [
        {"file": "rtk-metrics.test.ts", "coverage": "API endpoint validation"},
        {"file": "agent-status.test.ts", "coverage": "Agent health data"},
        {"file": "graph-paths.test.ts", "coverage": "Graph data structure"}
    ],
    "e2e_tests": [
        {"scenario": "Dashboard loads within 200ms"},
        {"scenario": "Real-time updates via Supabase subscriptions"},
        {"scenario": "Mobile responsive behavior"},
        {"scenario": "Keyboard navigation (accessibility)"}
    ],
    "accessibility_checks": [
        "WCAG 2.1 AA color contrast",
        "Screen reader compatibility",
        "Keyboard-only navigation",
        "Focus management"
    ],
    "performance_budgets": {
        "first_contentful_paint": "200ms",
        "time_to_interactive": "500ms",
        "bundle_size": "200KB gzipped"
    }
}

try:
    memory.write("qa", "test_plan", test_plan)
    print("Successfully wrote test plan to shared memory")
except Exception as e:
    print(f"Error writing test plan to shared memory: {e}")

# State Management operations (Regra #6)
thread_id = "ope-6-rtk-dashboard"  # Same as other agents
sm = AgentStateManager()

try:
    checkpoint_id = sm.save_state(
        thread_id=thread_id,
        agent_name="qa",
        state={
            "step": 3,
            "task": "Testing and accessibility audit",
            "unit_tests_written": 0,
            "e2e_tests_written": 0,
            "accessibility_score": None,
            "performance_score": None,
            "progress": "60%"
        }
    )
    print(f"Successfully saved state. Checkpoint ID: {checkpoint_id}")
except Exception as e:
    print(f"Error saving state: {e}")
    checkpoint_id = None

print(f"Shared Memory test plan written: {'Success' if test_plan else 'Failed'}")
print(f"State Manager checkpoint ID: {checkpoint_id}")