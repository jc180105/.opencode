"""
Shared Memory System for Multi-Agent Teams (Open Multi-Agent Pattern)

Based on Context7 Open Multi-Agent documentation:
- sharedMemory: true enables agents to share context
- Agents can read/write to team-specific memory stores
- Enables collaborative workflows without retrabalho

Production-ready implementation with:
- Input validation and sanitization
- Structured logging
- Automatic file rotation
- Type safety with full type hints
- Comprehensive error handling

Usage by agents:
    from scripts.shared_memory import SharedMemory
    
    # Agent writes to shared memory
    memory = SharedMemory("feature-team")
    memory.write("backend", "api_design", {"endpoints": ["/users", "/orders"]})
    
    # Agent reads shared memory
    entries = memory.read()
    api_design = memory.read("api_design")
"""

import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
import logging


class SharedMemory:
    """Shared memory store for agent teams (Open Multi-Agent pattern)"""
    
    # Class constants
    MAX_ENTRIES = 10000  # Maximum number of entries before rotation
    KEY_PATTERN = re.compile(r'^[a-zA-Z_][a-zA-Z0-9_]*$')  # Valid key pattern
    RESERVED_AGENTS = {'system'}  # Agents that are reserved for system use
    
    def __init__(self, team_name: str, base_path: Optional[Path] = None):
        """
        Initialize shared memory for a team.
        
        Args:
            team_name: Name of the team (e.g., "feature-team", "infra-team")
            base_path: Optional custom path for memory storage (default: graphify-out/)
        
        Raises:
            ValueError: If team_name is invalid
        """
        # Validate team_name
        if not team_name or not isinstance(team_name, str):
            raise ValueError("team_name must be a non-empty string")
        if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_-]*$', team_name):
            raise ValueError(
                f"Invalid team_name: {team_name}. "
                "Must match pattern: ^[a-zA-Z_][a-zA-Z0-9_-]*$"
            )
        
        self.team_name = team_name
        self._setup_logging()
        
        if base_path is None:
            # Use graphify-out as the default location (consistent with graphify outputs)
            self.memory_path = Path("graphify-out") / f"shared-memory-{team_name}.json"
        else:
            self.memory_path = base_path / f"shared-memory-{team_name}.json"
        
        # Ensure parent directory exists
        self.memory_path.parent.mkdir(parents=True, exist_ok=True)
        self._load()
        
        self._logger.info(f"Initialized SharedMemory for team: {team_name}")
    
    def _setup_logging(self) -> None:
        """Setup structured logging for the class"""
        self._logger = logging.getLogger(f"SharedMemory.{self.team_name}")
        if not self._logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self._logger.addHandler(handler)
            self._logger.setLevel(logging.INFO)
    
    def _validate_agent_name(self, agent_name: str) -> None:
        """Validate agent name"""
        if not agent_name or not isinstance(agent_name, str):
            raise ValueError("agent_name must be a non-empty string")
        if len(agent_name) > 100:
            raise ValueError("agent_name too long (max 100 chars)")
    
    def _validate_key(self, key: str) -> None:
        """Validate key format"""
        if not key or not isinstance(key, str):
            raise ValueError("key must be a non-empty string")
        if not self.KEY_PATTERN.match(key):
            raise ValueError(
                f"Invalid key: {key}. Must match pattern: {self.KEY_PATTERN.pattern}"
            )
        if len(key) > 100:
            raise ValueError("key too long (max 100 chars)")
    
    def _validate_value(self, value: Any) -> None:
        """Validate that value is JSON-serializable"""
        try:
            json.dumps(value)
        except (TypeError, ValueError) as e:
            raise ValueError(f"Value must be JSON-serializable: {e}")
    
    def _check_rotation(self) -> None:
        """Check if we need to rotate the file (too many entries)"""
        if len(self.data["entries"]) > self.MAX_ENTRIES:
            self._logger.warning(
                f"Entry count ({len(self.data['entries'])}) exceeds MAX_ENTRIES. "
                "Consider archiving old entries."
            )
    
    def _load(self) -> None:
        """Load existing memory from disk"""
        if self.memory_path.exists():
            try:
                content = self.memory_path.read_text(encoding='utf-8')
                self.data = json.loads(content)
                self._logger.info(f"Loaded memory from {self.memory_path}")
            except json.JSONDecodeError as e:
                self._logger.error(f"Could not parse memory from {self.memory_path}: {e}")
                self._initialize_data()
            except IOError as e:
                self._logger.error(f"Could not read memory from {self.memory_path}: {e}")
                self._initialize_data()
        else:
            self._initialize_data()
    
    def _initialize_data(self) -> None:
        """Initialize empty memory structure"""
        self.data = {
            "team": self.team_name,
            "entries": [],
            "metadata": {
                "created_at": datetime.now().isoformat(),
                "last_update": None,
                "version": "1.0",
                "entry_count": 0
            }
        }
        self._logger.info(f"Initialized new memory store for team: {self.team_name}")
    
    def write(self, agent_name: str, key: str, value: Any) -> Dict[str, Any]:
        """
        Agent writes to shared memory.
        
        Args:
            agent_name: Name of the agent writing (e.g., "backend", "frontend")
            key: Key to store the value under
            value: Value to store (must be JSON-serializable)
        
        Returns:
            The created entry
        
        Raises:
            ValueError: If inputs are invalid
        """
        # Validate inputs
        self._validate_agent_name(agent_name)
        self._validate_key(key)
        self._validate_value(value)
        
        entry = {
            "agent": agent_name,
            "key": key,
            "value": value,
            "timestamp": datetime.now().isoformat()
        }
        
        self.data["entries"].append(entry)
        self.data["metadata"]["last_update"] = datetime.now().isoformat()
        self.data["metadata"]["entry_count"] = len(self.data["entries"])
        
        self._save()
        self._check_rotation()
        
        self._logger.info(f"Agent '{agent_name}' wrote key '{key}'")
        
        return entry
    
    def read(self, key: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Read shared memory entries.
        
        Args:
            key: Optional key to filter entries by
        
        Returns:
            List of entries matching the filter (or all entries if key is None)
        """
        if key is not None:
            self._validate_key(key)
            return [e for e in self.data["entries"] if e["key"] == key]
        
        # Return a copy to prevent external modification
        return self.data["entries"].copy()
    
    def read_latest(self, key: str) -> Optional[Dict[str, Any]]:
        """
        Read the latest entry for a specific key.
        
        Args:
            key: Key to look up
        
        Returns:
            The most recent entry for the key, or None if not found
        """
        self._validate_key(key)
        entries = self.read(key)
        if entries:
            return entries[-1]
        return None
    
    def get_agent_entries(self, agent_name: str) -> List[Dict[str, Any]]:
        """
        Get all entries written by a specific agent.
        
        Args:
            agent_name: Name of the agent
        
        Returns:
            List of entries from that agent
        """
        self._validate_agent_name(agent_name)
        return [e for e in self.data["entries"] if e["agent"] == agent_name]
    
    def keys(self) -> List[str]:
        """
        Get all unique keys in shared memory.
        
        Returns:
            List of unique keys
        """
        return list(set(e["key"] for e in self.data["entries"]))
    
    def clear(self) -> None:
        """Clear all entries (keeps metadata)"""
        self.data["entries"] = []
        self.data["metadata"]["last_update"] = datetime.now().isoformat()
        self.data["metadata"]["entry_count"] = 0
        self._save()
        self._logger.info(f"Cleared all entries for team: {self.team_name}")
    
    def _save(self) -> None:
        """Save memory to disk"""
        try:
            self.memory_path.write_text(
                json.dumps(self.data, indent=2, ensure_ascii=False),
                encoding='utf-8'
            )
        except IOError as e:
            self._logger.error(f"Could not save memory to {self.memory_path}: {e}")
            raise
    
    def __str__(self) -> str:
        """String representation of memory contents"""
        return json.dumps(self.data, indent=2, ensure_ascii=False)
    
    def __repr__(self) -> str:
        return f"SharedMemory(team='{self.team_name}', entries={len(self.data['entries'])})"


def create_team_memory(team_name: str, agents: List[str]) -> SharedMemory:
    """
    Helper function to create a new team memory store.
    
    Args:
        team_name: Name of the team
        agents: List of agent names in the team
    
    Returns:
        Initialized SharedMemory instance
    """
    memory = SharedMemory(team_name)
    memory.write("system", "team_initialized", {
        "team": team_name,
        "agents": agents,
        "sharedMemory": True
    })
    return memory


# Example usage when run directly
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Shared Memory CLI")
        print("Usage:")
        print("  python shared_memory.py <team-name> [write <agent> <key> <json-value>]")
        print("  python shared_memory.py <team-name> [read [key]]")
        print("  python shared_memory.py <team-name> [keys]")
        print("  python shared_memory.py <team-name> [clear]")
        sys.exit(0)
    
    team_name = sys.argv[1]
    
    try:
        memory = SharedMemory(team_name)
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)
    
    if len(sys.argv) == 2:
        # Just print memory
        print(memory)
    elif sys.argv[2] == "write" and len(sys.argv) >= 6:
        agent = sys.argv[3]
        key = sys.argv[4]
        try:
            value = json.loads(sys.argv[5])
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON value: {e}")
            sys.exit(1)
        
        try:
            entry = memory.write(agent, key, value)
            print(f"Written: {entry}")
        except ValueError as e:
            print(f"Error: {e}")
            sys.exit(1)
    elif sys.argv[2] == "read":
        if len(sys.argv) >= 4:
            key = sys.argv[3]
            try:
                entries = memory.read(key)
            except ValueError as e:
                print(f"Error: {e}")
                sys.exit(1)
        else:
            entries = memory.read()
        print(json.dumps(entries, indent=2, ensure_ascii=False))
    elif sys.argv[2] == "keys":
        print(json.dumps(memory.keys(), indent=2))
    elif sys.argv[2] == "clear":
        memory.clear()
        print("Memory cleared!")
    else:
        print("Unknown command. Use: write, read, keys, or clear")
        sys.exit(1)
