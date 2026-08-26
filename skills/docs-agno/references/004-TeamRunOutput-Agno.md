# TeamRunOutput - Agno

Source: https://docs.agno.com/reference/teams/team-response

The `TeamRunOutput` class represents the response from a team run, containing both the team’s overall response and individual member responses. It supports streaming and provides real-time events throughout the execution of a team.

## [​](#teamrunoutput-attributes) TeamRunOutput Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `Any` | `None` | Content of the response |
| `content_type` | `str` | `"str"` | Specifies the data type of the content |
| `messages` | `Optional[List[Message]]` | `None` | A list of messages included in the response |
| `metrics` | `Optional[RunMetrics]` | `None` | Usage metrics of the run |
| `model` | `Optional[str]` | `None` | The model used in the run |
| `model_provider` | `Optional[str]` | `None` | The model provider used in the run |
| `member_responses` | `List[Union[TeamRunOutput, RunOutput]]` | `[]` | Responses from individual team members |
| `run_id` | `Optional[str]` | `None` | Run ID |
| `team_id` | `Optional[str]` | `None` | Team ID for the run |
| `team_name` | `Optional[str]` | `None` | Name of the team |
| `session_id` | `Optional[str]` | `None` | Session ID for the run |
| `parent_run_id` | `Optional[str]` | `None` | Parent run ID if this is a nested run |
| `user_id` | `Optional[str]` | `None` | User ID for the run |
| `tools` | `Optional[List[ToolExecution]]` | `None` | List of tool executions from the run |
| `images` | `Optional[List[Image]]` | `None` | List of images from member runs |
| `videos` | `Optional[List[Video]]` | `None` | List of videos from member runs |
| `audio` | `Optional[List[Audio]]` | `None` | List of audio snippets from member runs |
| `files` | `Optional[List[File]]` | `None` | List of files from member runs |
| `response_audio` | `Optional[Audio]` | `None` | The model’s raw response in audio |
| `input` | `Optional[TeamRunInput]` | `None` | Input media and messages from user |
| `reasoning_content` | `Optional[str]` | `None` | Any reasoning content the model produced |
| `citations` | `Optional[Citations]` | `None` | Any citations used in the response |
| `followups` | `Optional[List[str]]` | `None` | Suggested followup prompts generated after the run, when followups are enabled |
| `model_provider_data` | `Optional[Dict[str, Any]]` | `None` | Model provider specific metadata |
| `metadata` | `Optional[Dict[str, Any]]` | `None` | Additional metadata for the run |
| `session_state` | `Optional[Dict[str, Any]]` | `None` | Session state for the run |
| `references` | `Optional[List[MessageReferences]]` | `None` | Message references |
| `additional_input` | `Optional[List[Message]]` | `None` | Additional input messages |
| `reasoning_steps` | `Optional[List[ReasoningStep]]` | `None` | Reasoning steps taken during execution |
| `reasoning_messages` | `Optional[List[Message]]` | `None` | Messages related to reasoning |
| `created_at` | `int` | Current timestamp | Unix timestamp of the response creation |
| `events` | `Optional[List[Union[RunOutputEvent, TeamRunOutputEvent]]]` | `None` | List of events that occurred during the run |
| `status` | `RunStatus` | `RunStatus.running` | Current status of the run |
| `requirements` | `Optional[List[RunRequirement]]` | `None` | HITL requirements to continue a paused run |
| `last_checkpoint_at_message_index` | `Optional[int]` | `None` | Index into `messages` at the most recent checkpoint write. Set when `checkpoint="tool-batch"` persists mid-run state |
| `forked_from_run_id` | `Optional[str]` | `None` | Run ID this run was forked from |
| `forked_from_message_index` | `Optional[int]` | `None` | Message index in the source run where the fork was created |
| `forked_from_session_id` | `Optional[str]` | `None` | Session ID this run was originally created in. Set when a session is forked and preserved across nested forks |
| `regenerated_from` | `Optional[str]` | `None` | Run ID of the immediate predecessor this run was regenerated from |
| `workflow_step_id` | `Optional[str]` | `None` | FK: Points to StepOutput.step\_id |

## [​](#teamrunoutputevent-types) TeamRunOutputEvent Types

The following events are sent by the `Team.run()` function depending on the team’s configuration:

### [​](#core-events) Core Events

| Event Type | Description |
| --- | --- |
| `TeamRunStarted` | Indicates the start of a team run |
| `TeamRunContent` | Contains the model’s response text as individual chunks |
| `TeamRunContentCompleted` | Signals completion of content streaming |
| `TeamRunIntermediateContent` | Contains intermediate content during the run |
| `TeamRunCompleted` | Signals successful completion of the team run |
| `TeamRunError` | Indicates an error occurred during the team run |
| `TeamRunCancelled` | Signals that the team run was cancelled |
| `TeamRunPaused` | Indicates that the team run is paused for HITL requirements |
| `TeamRunContinued` | Indicates that a paused team run has continued |

### [​](#pre-hook-events) Pre-Hook Events

| Event Type | Description |
| --- | --- |
| `TeamPreHookStarted` | Indicates the start of a pre-run hook |
| `TeamPreHookCompleted` | Signals completion of a pre-run hook execution |

### [​](#post-hook-events) Post-Hook Events

| Event Type | Description |
| --- | --- |
| `TeamPostHookStarted` | Indicates the start of a post-run hook |
| `TeamPostHookCompleted` | Signals completion of a post-run hook execution |

### [​](#tool-events) Tool Events

| Event Type | Description |
| --- | --- |
| `TeamToolCallStarted` | Indicates the start of a tool call |
| `TeamToolCallCompleted` | Signals completion of a tool call, including tool call results |
| `TeamToolCallError` | Indicates a tool call error |

### [​](#reasoning-events) Reasoning Events

| Event Type | Description |
| --- | --- |
| `TeamReasoningStarted` | Indicates the start of the team’s reasoning process |
| `TeamReasoningStep` | Contains a single step in the reasoning process |
| `TeamReasoningContentDelta` | Streams reasoning content chunks |
| `TeamReasoningCompleted` | Signals completion of the reasoning process |

### [​](#memory-events) Memory Events

| Event Type | Description |
| --- | --- |
| `TeamMemoryUpdateStarted` | Indicates that the team is updating its memory |
| `TeamMemoryUpdateCompleted` | Signals completion of a memory update |

### [​](#session-summary-events) Session Summary Events

| Event Type | Description |
| --- | --- |
| `TeamSessionSummaryStarted` | Indicates the start of session summary generation |
| `TeamSessionSummaryCompleted` | Signals completion of session summary generation |

### [​](#parser-model-events) Parser Model Events

| Event Type | Description |
| --- | --- |
| `TeamParserModelResponseStarted` | Indicates the start of parser model response |
| `TeamParserModelResponseCompleted` | Signals completion of parser model response |

### [​](#output-model-events) Output Model Events

| Event Type | Description |
| --- | --- |
| `TeamOutputModelResponseStarted` | Indicates the start of output model response |
| `TeamOutputModelResponseCompleted` | Signals completion of output model response |

### [​](#model-request-events) Model Request Events

| Event Type | Description |
| --- | --- |
| `TeamModelRequestStarted` | Indicates the start of a model request |
| `TeamModelRequestCompleted` | Signals completion of a model request |

### [​](#compression-events) Compression Events

| Event Type | Description |
| --- | --- |
| `TeamCompressionStarted` | Indicates the start of tool result compression |
| `TeamCompressionCompleted` | Signals completion of tool result compression |

### [​](#followups-events) Followups Events

| Event Type | Description |
| --- | --- |
| `TeamFollowupsStarted` | Indicates the start of followup generation |
| `TeamFollowupsCompleted` | Signals completion of followup generation, including the suggested prompts |

### [​](#task-mode-events) Task Mode Events

| Event Type | Description |
| --- | --- |
| `TeamTaskIterationStarted` | Indicates the start of a task iteration in tasks mode |
| `TeamTaskIterationCompleted` | Signals completion of a task iteration in tasks mode |
| `TeamTaskStateUpdated` | Contains the full structured task list after a state change |
| `TeamTaskCreated` | Sent immediately when a task is created |
| `TeamTaskUpdated` | Sent immediately when a task status changes |

### [​](#custom-events) Custom Events

| Event Type | Description |
| --- | --- |
| `CustomEvent` | Custom event emitted by the team |

## [​](#event-attributes) Event Attributes

### [​](#base-teamrunoutputevent) Base TeamRunOutputEvent

All events inherit from `BaseTeamRunEvent` which provides these common attributes:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `created_at` | `int` | Current timestamp | Unix timestamp of the event creation |
| `event` | `str` | `""` | The type of event |
| `team_id` | `str` | `""` | ID of the team generating the event |
| `team_name` | `str` | `""` | Name of the team generating the event |
| `run_id` | `Optional[str]` | `None` | ID of the current run |
| `parent_run_id` | `Optional[str]` | `None` | Parent run ID if this is a nested run |
| `session_id` | `Optional[str]` | `None` | ID of the current session |
| `workflow_id` | `Optional[str]` | `None` | ID of the workflow |
| `workflow_run_id` | `Optional[str]` | `None` | ID of the workflow’s run |
| `step_id` | `Optional[str]` | `None` | ID of the workflow step |
| `step_name` | `Optional[str]` | `None` | Name of the workflow step |
| `step_index` | `Optional[int]` | `None` | Index of the workflow step |
| `nested_depth` | `int` | `0` | Nesting depth of the execution. `0` for top-level, incremented for each level of nesting |
| `content` | `Optional[Any]` | `None` | For backwards compatibility |

### [​](#runstartedevent) RunStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunStarted"` | Event type |
| `model` | `str` | `""` | The model being used |
| `model_provider` | `str` | `""` | The provider of the model |

### [​](#intermediateruncontentevent) IntermediateRunContentEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunIntermediateContent"` | Event type |
| `content` | `Optional[Any]` | `None` | Intermediate content of the response |
| `content_type` | `str` | `"str"` | Type of the content |

### [​](#runcontentcompletedevent) RunContentCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunContentCompleted"` | Event type |

### [​](#runcontentevent) RunContentEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunContent"` | Event type |
| `content` | `Optional[Any]` | `None` | The content of the response |
| `content_type` | `str` | `"str"` | Type of the content |
| `reasoning_content` | `Optional[str]` | `None` | Reasoning content produced |
| `citations` | `Optional[Citations]` | `None` | Citations used in the response |
| `model_provider_data` | `Optional[Dict[str, Any]]` | `None` | Model provider specific metadata |
| `response_audio` | `Optional[Audio]` | `None` | Model’s audio response |
| `image` | `Optional[Image]` | `None` | Image attached to the response |
| `references` | `Optional[List[MessageReferences]]` | `None` | Message references |
| `additional_input` | `Optional[List[Message]]` | `None` | Additional input messages |
| `reasoning_steps` | `Optional[List[ReasoningStep]]` | `None` | Reasoning steps |
| `reasoning_messages` | `Optional[List[Message]]` | `None` | Reasoning messages |

### [​](#runcompletedevent) RunCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunCompleted"` | Event type |
| `content` | `Optional[Any]` | `None` | Final content of the response |
| `content_type` | `str` | `"str"` | Type of the content |
| `reasoning_content` | `Optional[str]` | `None` | Reasoning content produced |
| `citations` | `Optional[Citations]` | `None` | Citations used in the response |
| `model_provider_data` | `Optional[Dict[str, Any]]` | `None` | Model provider specific metadata |
| `images` | `Optional[List[Image]]` | `None` | Images attached to the response |
| `videos` | `Optional[List[Video]]` | `None` | Videos attached to the response |
| `audio` | `Optional[List[Audio]]` | `None` | Audio snippets attached to the response |
| `files` | `Optional[List[File]]` | `None` | Files attached to the response |
| `response_audio` | `Optional[Audio]` | `None` | Model’s audio response |
| `references` | `Optional[List[MessageReferences]]` | `None` | Message references |
| `additional_input` | `Optional[List[Message]]` | `None` | Additional input messages |
| `reasoning_steps` | `Optional[List[ReasoningStep]]` | `None` | Reasoning steps |
| `reasoning_messages` | `Optional[List[Message]]` | `None` | Reasoning messages |
| `member_responses` | `List[Union[TeamRunOutput, RunOutput]]` | `[]` | Responses from individual team members |
| `metadata` | `Optional[Dict[str, Any]]` | `None` | Additional metadata |
| `metrics` | `Optional[RunMetrics]` | `None` | Usage metrics |
| `session_state` | `Optional[Dict[str, Any]]` | `None` | Session state after the run |

### [​](#runerrorevent) RunErrorEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunError"` | Event type |
| `content` | `Optional[str]` | `None` | Error message |
| `error_type` | `Optional[str]` | `None` | Error type |
| `error_id` | `Optional[str]` | `None` | Error identifier |
| `additional_data` | `Optional[Dict[str, Any]]` | `None` | Additional error data |

### [​](#runcancelledevent) RunCancelledEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunCancelled"` | Event type |
| `reason` | `Optional[str]` | `None` | Reason for cancellation |

### [​](#runpausedevent) RunPausedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunPaused"` | Event type |
| `tools` | `Optional[List[ToolExecution]]` | `None` | Tool executions for pending requirements |
| `requirements` | `Optional[List[RunRequirement]]` | `None` | HITL requirements for the run |

### [​](#runcontinuedevent) RunContinuedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamRunContinued"` | Event type |

### [​](#prehookstartedevent) PreHookStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamPreHookStarted"` | Event type |
| `pre_hook_name` | `Optional[str]` | `None` | Name of the pre-hook being executed |
| `run_input` | `Optional[TeamRunInput]` | `None` | The run input passed to the hook |

### [​](#prehookcompletedevent) PreHookCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamPreHookCompleted"` | Event type |
| `pre_hook_name` | `Optional[str]` | `None` | Name of the pre-hook that completed |
| `run_input` | `Optional[TeamRunInput]` | `None` | The run input passed to the hook |

### [​](#posthookstartedevent) PostHookStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamPostHookStarted"` | Event type |
| `post_hook_name` | `Optional[str]` | `None` | Name of the post-hook being executed |

### [​](#posthookcompletedevent) PostHookCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamPostHookCompleted"` | Event type |
| `post_hook_name` | `Optional[str]` | `None` | Name of the post-hook that completed |

### [​](#toolcallstartedevent) ToolCallStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamToolCallStarted"` | Event type |
| `tool` | `Optional[ToolExecution]` | `None` | The tool being called |

### [​](#toolcallcompletedevent) ToolCallCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamToolCallCompleted"` | Event type |
| `tool` | `Optional[ToolExecution]` | `None` | The tool that was called |
| `content` | `Optional[Any]` | `None` | Result of the tool call |
| `images` | `Optional[List[Image]]` | `None` | Images produced by the tool |
| `videos` | `Optional[List[Video]]` | `None` | Videos produced by the tool |
| `audio` | `Optional[List[Audio]]` | `None` | Audio produced by the tool |
| `files` | `Optional[List[File]]` | `None` | Files produced by the tool |

### [​](#toolcallerrorevent) ToolCallErrorEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamToolCallError"` | Event type |
| `tool` | `Optional[ToolExecution]` | `None` | The tool that failed |
| `error` | `Optional[str]` | `None` | Error message |

### [​](#reasoningstartedevent) ReasoningStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamReasoningStarted"` | Event type |

### [​](#reasoningstepevent) ReasoningStepEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamReasoningStep"` | Event type |
| `content` | `Optional[Any]` | `None` | Content of the reasoning step |
| `content_type` | `str` | `"str"` | Type of the content |
| `reasoning_content` | `str` | `""` | Detailed reasoning content |

### [​](#reasoningcontentdeltaevent) ReasoningContentDeltaEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamReasoningContentDelta"` | Event type |
| `reasoning_content` | `str` | `""` | Reasoning content chunk |

### [​](#reasoningcompletedevent) ReasoningCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamReasoningCompleted"` | Event type |
| `content` | `Optional[Any]` | `None` | Content of the reasoning step |
| `content_type` | `str` | `"str"` | Type of the content |

### [​](#memoryupdatestartedevent) MemoryUpdateStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamMemoryUpdateStarted"` | Event type |

### [​](#memoryupdatecompletedevent) MemoryUpdateCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamMemoryUpdateCompleted"` | Event type |
| `memories` | `Optional[List[Any]]` | `None` | Memories updated by the run |

### [​](#sessionsummarystartedevent) SessionSummaryStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamSessionSummaryStarted"` | Event type |

### [​](#sessionsummarycompletedevent) SessionSummaryCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamSessionSummaryCompleted"` | Event type |
| `session_summary` | `Optional[Any]` | `None` | The generated session summary |

### [​](#parsermodelresponsestartedevent) ParserModelResponseStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamParserModelResponseStarted"` | Event type |

### [​](#parsermodelresponsecompletedevent) ParserModelResponseCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamParserModelResponseCompleted"` | Event type |

### [​](#outputmodelresponsestartedevent) OutputModelResponseStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamOutputModelResponseStarted"` | Event type |

### [​](#outputmodelresponsecompletedevent) OutputModelResponseCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamOutputModelResponseCompleted"` | Event type |

### [​](#modelrequeststartedevent) ModelRequestStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamModelRequestStarted"` | Event type |
| `model` | `Optional[str]` | `None` | Model identifier |
| `model_provider` | `Optional[str]` | `None` | Model provider |

### [​](#modelrequestcompletedevent) ModelRequestCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamModelRequestCompleted"` | Event type |
| `model` | `Optional[str]` | `None` | Model identifier |
| `model_provider` | `Optional[str]` | `None` | Model provider |
| `input_tokens` | `Optional[int]` | `None` | Input token count |
| `output_tokens` | `Optional[int]` | `None` | Output token count |
| `total_tokens` | `Optional[int]` | `None` | Total token count |
| `time_to_first_token` | `Optional[float]` | `None` | Time to first token in seconds |
| `reasoning_tokens` | `Optional[int]` | `None` | Reasoning token count |
| `cache_read_tokens` | `Optional[int]` | `None` | Cache read token count |
| `cache_write_tokens` | `Optional[int]` | `None` | Cache write token count |

### [​](#compressionstartedevent) CompressionStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamCompressionStarted"` | Event type |

### [​](#compressioncompletedevent) CompressionCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamCompressionCompleted"` | Event type |
| `tool_results_compressed` | `Optional[int]` | `None` | Number of compressed tool results |
| `original_size` | `Optional[int]` | `None` | Original size in bytes |
| `compressed_size` | `Optional[int]` | `None` | Compressed size in bytes |

### [​](#followupsstartedevent) FollowupsStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamFollowupsStarted"` | Event type |

### [​](#followupscompletedevent) FollowupsCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamFollowupsCompleted"` | Event type |
| `followups` | `Optional[List[str]]` | `None` | Suggested followup prompts generated for the run |

### [​](#taskiterationstartedevent) TaskIterationStartedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamTaskIterationStarted"` | Event type |
| `iteration` | `int` | `0` | Current task iteration number |
| `max_iterations` | `int` | `0` | Maximum number of task iterations |

### [​](#taskiterationcompletedevent) TaskIterationCompletedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamTaskIterationCompleted"` | Event type |
| `iteration` | `int` | `0` | Task iteration number that completed |
| `max_iterations` | `int` | `0` | Maximum number of task iterations |
| `task_summary` | `Optional[str]` | `None` | Summary of the task state after the iteration |

### [​](#taskstateupdatedevent) TaskStateUpdatedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamTaskStateUpdated"` | Event type |
| `task_summary` | `Optional[str]` | `None` | Summary of the current task state |
| `goal_complete` | `bool` | `False` | Whether the overall goal is complete |
| `tasks` | `List[TaskData]` | `[]` | Full structured task list for frontend rendering |
| `completion_summary` | `Optional[str]` | `None` | Summary of the work done, set when the goal is marked complete |

### [​](#taskcreatedevent) TaskCreatedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamTaskCreated"` | Event type |
| `task_id` | `str` | `""` | ID of the created task |
| `title` | `str` | `""` | Title of the task |
| `description` | `str` | `""` | Description of the task |
| `assignee` | `Optional[str]` | `None` | Member assigned to the task |
| `status` | `str` | `"pending"` | Status of the task |
| `dependencies` | `List[str]` | `[]` | IDs of tasks that must complete before this task |

### [​](#taskupdatedevent) TaskUpdatedEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"TeamTaskUpdated"` | Event type |
| `task_id` | `str` | `""` | ID of the updated task |
| `title` | `str` | `""` | Title of the task |
| `status` | `str` | `""` | New status: pending, in\_progress, completed, failed, or blocked |
| `previous_status` | `Optional[str]` | `None` | Status before the update |
| `result` | `Optional[str]` | `None` | Result of the task, if completed |
| `assignee` | `Optional[str]` | `None` | Member assigned to the task |

### [​](#customevent) CustomEvent

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `event` | `str` | `"CustomEvent"` | Event type |

⌘I
