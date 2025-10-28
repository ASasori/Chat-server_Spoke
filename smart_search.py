# smart_search.py

import json
import re
from typing import Dict, Any
from llm_client import BaseLLMClient

class SmartSearch:
    """
    Handles loading the SPOKE schema and generating an execution
    plan from a natural language question (NLQ).
    """

    def __init__(
        self,
        llm_client: BaseLLMClient,
        schema_path: str = "spoke_types.json",
        planner_template_path: str = "planner_prompt_template.txt"
    ):
        """
        Initializes the SmartSearch planner.
        """
        print("Initializing SmartSearch module...")
        self.llm_client = llm_client
        
        # Load and process schema
        self.schema = self._load_json_file(schema_path)
        self.injected_strings = self._process_schema()
        print(f"✓ Loaded and processed schema from '{schema_path}'")
        
        # Load prompt templates
        self.planner_template = self._load_text_file(planner_template_path)
        print(f"✓ Loaded planner prompt template")
        print("--- SmartSearch ready ---")

    def _load_json_file(self, file_path: str) -> Dict[str, Any]:
        """Loads a JSON file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Schema file not found at {file_path}")
            raise
        except json.JSONDecodeError:
            print(f"Error: Could not decode JSON from {file_path}")
            raise

    def _load_text_file(self, file_path: str) -> str:
        """Loads a text file (template)."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Error: Template file not found at {file_path}")
            raise

    def _process_schema(self) -> Dict[str, str]:
        """
        Processes the schema into strings for prompt injection.
        """
        node_types = list(self.schema["nodes"].keys())
        node_types_str = ", ".join(node_types)

        edge_types = list(self.schema["edges"].keys())
        edge_types_str = ", ".join(edge_types)

        node_cutoffs = [f"{key} ({data['label']})" for key, data in self.schema["node_cutoffs"].items()]
        edge_cutoffs = [f"{key} ({data['label']})" for key, data in self.schema["edge_cutoffs"].items()]
        cutoffs_str = "Node Cutoffs:\n- " + "\n- ".join(node_cutoffs) + "\n\nEdge Cutoffs:\n- " + "\n- ".join(edge_cutoffs)

        query_fields = [f"{q[1]} (query by '{q[2]}')" for q in self.schema["queries"]]
        query_fields_str = "\n- ".join(sorted(list(set(query_fields))))
        
        return {
            "INJECT_NODE_TYPES": node_types_str,
            "INJECT_QUERY_FIELDS": query_fields_str,
            "INJECT_EDGE_TYPES": edge_types_str,
            "INJECT_CUTOFFS": cutoffs_str
        }

    def _call_llm_and_parse(self, final_prompt: str) -> Dict[str, Any]:
        """
        Internal method to call the LLM, clean, and parse the JSON response.
        """
        try:
            # Use the LLM client (which now has retry logic)
            raw_output = self.llm_client.generate(final_prompt)
            
            # Clean up potential markdown code fences
            match = re.search(r'\{.*\}', raw_output, re.DOTALL)
            if match:
                json_string = match.group(0)
            else:
                json_string = raw_output
            
            return json.loads(json_string)
            
        except json.JSONDecodeError as e:
            print(f"Error: Failed to parse JSON from LLM output. {e}")
            print("Raw Output:", raw_output)
            return {"error": "Failed to parse LLM output", "raw_output": raw_output}
        except Exception as e:
            print(f"Error: Unknown error during LLM call: {e}")
            return {"error": str(e)}

    def get_execution_plan(self, nlq: str) -> Dict[str, Any]:
        """
        Uses the planner_prompt_template to create a complete
        execution plan from the NLQ.
        """
        print(f"\n--- [Task 1] Calling Planner for: '{nlq}' ---")
        
        # Format schema into the template
        final_prompt = self.planner_template.format(**self.injected_strings)
        
        # Add the user's NLQ
        final_prompt += f"\nNLQ:\n{nlq}\n→"
        
        return self._call_llm_and_parse(final_prompt)