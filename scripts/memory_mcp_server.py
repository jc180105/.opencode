import sys
from pathlib import Path
from typing import Dict, Any, Optional

# Adicionar raiz do projeto ao path para conseguir importar scripts
sys.path.insert(0, str(Path(__file__).parent.parent))

from mcp.server.fastmcp import FastMCP
from scripts.shared_memory import SharedMemory
from scripts.state_manager import AgentStateManager

# Initialize the FastMCP server
mcp = FastMCP("OpenCode Memory MCP")

@mcp.tool()
def memory_write(team_name: str, agent_name: str, key: str, value: Any) -> str:
    """
    Agent writes to shared memory for their team.
    
    Args:
        team_name: Name of the team (e.g., "feature-team", "infra-team")
        agent_name: Name of the agent writing (e.g., "backend", "frontend")
        key: Key to store the value under (e.g., "api_design", "schema")
        value: The data to store (must be a JSON-serializable object/string/list)
        
    Returns:
        A success message with the entry details.
    """
    try:
        memory = SharedMemory(team_name)
        entry = memory.write(agent_name, key, value)
        return f"Successfully wrote to memory. Key: '{key}', Agent: '{agent_name}', Team: '{team_name}'"
    except Exception as e:
        return f"Error writing to memory: {str(e)}"

@mcp.tool()
def memory_read(team_name: str, key: Optional[str] = None) -> list:
    """
    Read entries from a team's shared memory.
    
    Args:
        team_name: Name of the team (e.g., "feature-team")
        key: Optional specific key to filter by. If omitted, returns all entries for the team.
        
    Returns:
        A list of memory entries matching the request.
    """
    try:
        memory = SharedMemory(team_name)
        if key:
            entries = memory.read(key)
        else:
            entries = memory.read()
        return entries
    except Exception as e:
        return [{"error": f"Failed to read memory: {str(e)}"}]

@mcp.tool()
def state_save(thread_id: str, agent_name: str, state: Dict[str, Any], checkpoint_id: Optional[str] = None) -> str:
    """
    Save the agent's current progress/state in a specific conversation thread (LangGraph style).
    
    Args:
        thread_id: The unique thread ID for the current conversation/task.
        agent_name: Name of the agent saving state.
        state: A dictionary representing the current progress, data, or state.
        checkpoint_id: Optional specific checkpoint ID. Auto-generated if omitted.
        
    Returns:
        The checkpoint_id of the saved state.
    """
    try:
        sm = AgentStateManager()
        saved_checkpoint = sm.save_state(thread_id, agent_name, state, checkpoint_id)
        return f"State saved successfully. Checkpoint ID: {saved_checkpoint}"
    except Exception as e:
        return f"Error saving state: {str(e)}"

@mcp.tool()
def state_get(thread_id: str, agent_name: str) -> Dict[str, Any]:
    """
    Retrieve the latest saved state for an agent in a specific thread.
    
    Args:
        thread_id: The unique thread ID for the conversation/task.
        agent_name: Name of the agent whose state to retrieve.
        
    Returns:
        The state dictionary, including the checkpoint info and timestamp, or an error/empty object if none exists.
    """
    try:
        sm = AgentStateManager()
        state = sm.get_state(thread_id, agent_name)
        if state:
            return state
        return {"error": f"No state found for agent '{agent_name}' in thread '{thread_id}'"}
    except Exception as e:
        return {"error": f"Error retrieving state: {str(e)}"}

if __name__ == "__main__":
    # Inicia o servidor MCP via standard input/output
    mcp.run()
