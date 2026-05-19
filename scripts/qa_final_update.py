from scripts.shared_memory import SharedMemory
from scripts.state_manager import AgentStateManager, generate_thread_id

# Shared Memory update (Regra #5)
memory = SharedMemory("feature-team")

test_results = {
    "unit_tests": {
        "pass": 21,
        "fail": 0,
        "status": "completed",
        "files": ["RTKEconomyGauge.test.tsx", "AgentStatusGrid.test.tsx", "GraphVisualization.test.tsx", "api.test.ts"]
    },
    "e2e_tests": {
        "pass": 0,
        "fail": 0,
        "status": "pending_execution",
        "note": "Requires frontend server running on port 5173"
    },
    "accessibility_score": None,
    "performance_score": None,
    "notes": "Unit tests all passing. E2E tests pending server setup. Accessibility and performance audits pending."
}

memory.write("qa", "test_results", test_results)
print("Shared Memory updated with test results")

# State Manager update (Regra #6)
thread_id = "ope-6-rtk-dashboard"
sm = AgentStateManager()

checkpoint_id = sm.save_state(
    thread_id=thread_id,
    agent_name="qa",
    state={
        "step": 5,
        "task": "Test execution completed (partial)",
        "unit_tests_pass": 21,
        "unit_tests_fail": 0,
        "e2e_tests_pass": 0,
        "e2e_tests_fail": 0,
        "accessibility_violations": None,
        "performance_score": None,
        "progress": "90%",
        "notes": "Unit tests 100% pass rate. E2E/accessibility/performance pending server execution."
    }
)
print(f"State Manager updated. Checkpoint ID: {checkpoint_id}")