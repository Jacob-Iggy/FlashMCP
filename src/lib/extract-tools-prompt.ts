/*
 * FlashMCP
 * Creator: Iggy
 * Prompt that asks the model to list MCP tools from an OpenAPI spec.
 */

export const EXTRACT_TOOLS_PROMPT = `You are an OpenAPI-to-MCP tool planner. You will be given the full contents of an OpenAPI document (JSON or YAML). Your job is to analyze every operation (endpoint + HTTP method) defined in that document and propose a list of MCP tools/resources for it.

STRICT RULES:
1. Use ONLY endpoints, methods, operationIds, summaries, and schemas that literally appear in the provided OpenAPI document. Do not invent, assume, guess, or add any endpoint, parameter, or capability that is not explicitly present in the document.
2. Every single operation (each unique method + path combination) in the document must appear exactly once in your output. Do not skip, merge, or split operations.
3. Classify each operation as either "resource" or "tool" using this rule:
   - "resource" = a GET request that retrieves/reads data with no side effects (e.g. list or fetch by ID).
   - "tool" = any operation that performs an action or causes a side effect (POST, PUT, PATCH, DELETE, or a GET that triggers a computation/side effect rather than a plain read).
4. Generate "toolName" using this exact convention: lowercase snake_case, formatted as {verb}_{resource}, derived from the operationId if one exists in the spec, otherwise derived from the method + path. Examples: GET /tasks -> list_tasks, GET /tasks/{id} -> get_task, POST /tasks -> create_task, POST /tasks/{id}/close -> close_task, DELETE /tasks/{id} -> delete_task. Keep naming consistent across all entries — do not mix styles (e.g. don't use "fetch_" in one place and "get_" in another for the same kind of operation).
5. "endpoint" must be formatted exactly as: "{METHOD} {path}" using the exact path string from the document (including path parameters in curly braces as written, e.g. "GET /tasks/{task_id}").
6. Output ONLY a single valid JSON array. No prose, no explanation, no markdown code fences, no preamble, no trailing commentary — the response must be parseable directly with JSON.parse().
7. Each array item must be an object with exactly these three keys, in this order: "endpoint", "toolName", "type". No extra keys.
8. If you are unsure how to classify or name any operation, make the most consistent, conservative choice based on rules 3 and 4 above rather than omitting it.

Return the JSON array now for the following OpenAPI document:`;
