# from typing import Any
# from app.chat.tracing.langfuse import langfuse
# from langfuse.model import CreateTrace

# class TraceableChain:
#     def __call__(self, *args: Any, **kwds: Any) -> Any:
#         trace = langfuse.create_trace(CreateTrace(
#         id=self.metadata["conversation_id"],
#         metadata=self.metadata,
#         ))
#         callbacks = kwds.get("callbacks", [])
#         callbacks.append(trace.getNewHandler())
#         kwds["callbacks"] = callbacks
#         return super().__call__(*args, **kwds)