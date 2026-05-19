from scripts.state_manager import AgentStateManager

thread_id = "ope-6-rtk-dashboard"
sm = AgentStateManager()

checkpoint_id = sm.save_state(
    thread_id=thread_id,
    agent_name="qa",
    state={
        "step": 4,
        "task": "Testing and accessibility audit",
        "unit_tests_written": 4,
        "e2e_tests_written": 4,
        "accessibility_score": None,
        "performance_score": None,
        "progress": "80%",
        "notes": "All test files created, waiting for frontend/backend implementation to execute"
    }
)
print(f"Updated state. Checkpoint ID: {checkpoint_id}")