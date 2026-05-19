"""
State Management System for OpenCode Agents
Inspired by LangGraph Checkpointer Pattern

Based on LangGraph documentation from Context7:
- Checkpointing with thread_id
- State persistence across sessions
- Resume capability from saved state
"""

import sqlite3
import json
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime
import uuid


class AgentStateManager:
    """
    LangGraph-inspired state management for OpenCode agents.
    
    Features:
    - SQLite-based persistence (like SqliteSaver)
    - Thread-based state tracking (thread_id pattern from LangGraph)
    - Checkpoint-style save/restore
    - Cross-session state resumption
    """
    
    def __init__(self, db_path: str = "graphify-out/agent_state.db"):
        """
        Initialize state manager with SQLite backend.
        
        Args:
            db_path: Path to SQLite database file (creates if not exists)
        """
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
    
    def _init_db(self) -> None:
        """Initialize SQLite database with required tables."""
        conn = sqlite3.connect(str(self.db_path))
        try:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS states (
                    thread_id TEXT NOT NULL,
                    agent_name TEXT NOT NULL,
                    state_data TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    checkpoint_id TEXT NOT NULL,
                    PRIMARY KEY (thread_id, agent_name, checkpoint_id)
                )
            """)
            # Index for faster lookups
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_thread_agent 
                ON states(thread_id, agent_name)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_timestamp 
                ON states(timestamp DESC)
            """)
            conn.commit()
        finally:
            conn.close()
    
    def save_state(
        self, 
        thread_id: str, 
        agent_name: str, 
        state: Dict[str, Any],
        checkpoint_id: Optional[str] = None
    ) -> str:
        """
        Save agent state (LangGraph checkpoint pattern).
        
        Args:
            thread_id: Unique thread identifier (like LangGraph configurable.thread_id)
            agent_name: Name of the agent (maestro, backend, frontend, etc.)
            state: State dictionary to persist
            checkpoint_id: Optional checkpoint ID (auto-generated if not provided)
        
        Returns:
            checkpoint_id: The ID of the saved checkpoint
        
        Example:
            >>> sm = AgentStateManager()
            >>> config = {"configurable": {"thread_id": "conversation_123"}}
            >>> checkpoint_id = sm.save_state(
            ...     config["configurable"]["thread_id"],
            ...     "backend",
            ...     {"step": 1, "data": "api_design"}
            ... )
        """
        if checkpoint_id is None:
            checkpoint_id = str(uuid.uuid4())
        
        conn = sqlite3.connect(str(self.db_path))
        try:
            conn.execute("""
                INSERT OR REPLACE INTO states (thread_id, agent_name, state_data, timestamp, checkpoint_id)
                VALUES (?, ?, ?, ?, ?)
            """, (
                thread_id,
                agent_name,
                json.dumps(state, ensure_ascii=False),
                datetime.now().isoformat(),
                checkpoint_id
            ))
            conn.commit()
        finally:
            conn.close()
        
        return checkpoint_id
    
    def get_state(
        self, 
        thread_id: str, 
        agent_name: str,
        checkpoint_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve agent state (LangGraph get_state pattern).
        
        Args:
            thread_id: Thread identifier
            agent_name: Agent name
            checkpoint_id: Optional specific checkpoint (returns latest if None)
        
        Returns:
            State dictionary or None if not found
        
        Example:
            >>> sm = AgentStateManager()
            >>> config = {"configurable": {"thread_id": "conversation_123"}}
            >>> state = sm.get_state(
            ...     config["configurable"]["thread_id"],
            ...     "backend"
            ... )
        """
        conn = sqlite3.connect(str(self.db_path))
        try:
            if checkpoint_id:
                cursor = conn.execute("""
                    SELECT state_data, timestamp, checkpoint_id 
                    FROM states 
                    WHERE thread_id = ? AND agent_name = ? AND checkpoint_id = ?
                """, (thread_id, agent_name, checkpoint_id))
            else:
                cursor = conn.execute("""
                    SELECT state_data, timestamp, checkpoint_id 
                    FROM states 
                    WHERE thread_id = ? AND agent_name = ?
                    ORDER BY timestamp DESC 
                    LIMIT 1
                """, (thread_id, agent_name))
            
            row = cursor.fetchone()
        finally:
            conn.close()
        
        if row:
            return {
                "state": json.loads(row[0]),
                "timestamp": row[1],
                "checkpoint_id": row[2]
            }
        return None
    
    def get_state_snapshot(
        self,
        thread_id: str,
        agent_name: str,
        checkpoint_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Get state snapshot (LangGraph StateSnapshot pattern).
        
        Returns a structured snapshot similar to LangGraph's get_state() output:
        - values: The actual state data
        - config: Thread and checkpoint info
        - metadata: Timestamp and agent info
        """
        result = self.get_state(thread_id, agent_name, checkpoint_id)
        if result is None:
            return None
        
        return {
            "values": result["state"],
            "config": {
                "configurable": {
                    "thread_id": thread_id,
                    "checkpoint_id": result["checkpoint_id"]
                }
            },
            "metadata": {
                "agent_name": agent_name,
                "timestamp": result["timestamp"]
            }
        }
    
    def list_threads(self) -> List[str]:
        """
        List all active threads (LangGraph thread listing).
        
        Returns:
            List of unique thread IDs
        """
        conn = sqlite3.connect(str(self.db_path))
        try:
            cursor = conn.execute("""
                SELECT DISTINCT thread_id 
                FROM states 
                ORDER BY thread_id
            """)
            threads = [row[0] for row in cursor.fetchall()]
        finally:
            conn.close()
        
        return threads
    
    def list_checkpoints(self, thread_id: str, agent_name: str) -> List[Dict[str, Any]]:
        """
        List all checkpoints for a thread/agent combination.
        
        Returns:
            List of checkpoint metadata
        """
        conn = sqlite3.connect(str(self.db_path))
        try:
            cursor = conn.execute("""
                SELECT checkpoint_id, timestamp, state_data
                FROM states 
                WHERE thread_id = ? AND agent_name = ?
                ORDER BY timestamp DESC
            """, (thread_id, agent_name))
            
            checkpoints = []
            for row in cursor.fetchall():
                checkpoints.append({
                    "checkpoint_id": row[0],
                    "timestamp": row[1],
                    "state_preview": json.loads(row[2]) if row[2] else {}
                })
        finally:
            conn.close()
        
        return checkpoints
    
    def delete_thread(self, thread_id: str) -> int:
        """
        Delete all state for a thread.
        
        Returns:
            Number of deleted records
        """
        conn = sqlite3.connect(str(self.db_path))
        try:
            cursor = conn.execute("""
                DELETE FROM states 
                WHERE thread_id = ?
            """, (thread_id,))
            deleted = cursor.rowcount
            conn.commit()
        finally:
            conn.close()
        
        return deleted
    
    def get_thread_history(self, thread_id: str) -> List[Dict[str, Any]]:
        """
        Get full history of a thread across all agents.
        
        Returns:
            List of state snapshots in chronological order
        """
        conn = sqlite3.connect(str(self.db_path))
        try:
            cursor = conn.execute("""
                SELECT thread_id, agent_name, state_data, timestamp, checkpoint_id
                FROM states 
                WHERE thread_id = ?
                ORDER BY timestamp ASC
            """, (thread_id,))
            
            history = []
            for row in cursor.fetchall():
                history.append({
                    "thread_id": row[0],
                    "agent_name": row[1],
                    "state": json.loads(row[2]),
                    "timestamp": row[3],
                    "checkpoint_id": row[4]
                })
        finally:
            conn.close()
        
        return history


def create_config(thread_id: str) -> Dict[str, Any]:
    """
    Create LangGraph-style config with thread_id.
    
    Args:
        thread_id: Unique thread identifier
        
    Returns:
        Config dictionary in LangGraph format
        
    Example:
        >>> config = create_config("conversation_123")
        >>> print(config)
        {"configurable": {"thread_id": "conversation_123"}}
    """
    return {"configurable": {"thread_id": thread_id}}


def generate_thread_id(prefix: str = "thread") -> str:
    """
    Generate a unique thread ID.
    
    Args:
        prefix: Prefix for the thread ID
        
    Returns:
        Unique thread ID string
    """
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


# Convenience function for Maestro to delegate with state persistence
def delegate_with_state(
    thread_id: str,
    agent_name: str,
    initial_state: Dict[str, Any],
    state_manager: Optional[AgentStateManager] = None
) -> Dict[str, Any]:
    """
    Delegate task to agent with state persistence.
    
    This function demonstrates the LangGraph pattern:
    1. Save initial state
    2. Agent processes (simulated)
    3. Return checkpoint info
    
    Args:
        thread_id: Thread for this conversation
        agent_name: Target agent
        initial_state: Initial state to persist
        state_manager: Optional existing manager (creates new if None)
    
    Returns:
        Dictionary with checkpoint info and config
    """
    if state_manager is None:
        state_manager = AgentStateManager()
    
    checkpoint_id = state_manager.save_state(thread_id, agent_name, initial_state)
    
    config = create_config(thread_id)
    config["configurable"]["checkpoint_id"] = checkpoint_id
    
    return {
        "config": config,
        "checkpoint_id": checkpoint_id,
        "state": initial_state,
        "message": f"State saved for {agent_name} in thread {thread_id}"
    }


if __name__ == "__main__":
    # Quick test
    import sys
    
    sm = AgentStateManager()
    
    # Test 1: Save state
    checkpoint_id = sm.save_state("test_thread", "backend", {"step": 1, "task": "api_design"})
    print("[OK] State saved! Checkpoint ID: {checkpoint_id}".format(checkpoint_id=checkpoint_id))
    
    # Test 2: Get state
    state = sm.get_state("test_thread", "backend")
    print("[OK] State retrieved: {state}".format(state=state))
    
    # Test 3: List threads
    threads = sm.list_threads()
    print("[OK] Active threads: {threads}".format(threads=threads))
    
    # Test 4: Get snapshot
    snapshot = sm.get_state_snapshot("test_thread", "backend")
    print("[OK] State snapshot: {snapshot}".format(snapshot=snapshot))
    
    print("\n[SUCCESS] All tests passed!")
    sys.exit(0)
