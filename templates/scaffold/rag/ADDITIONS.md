<!-- /qa-agents:init applies this only if the human opted into the RAG layer.

     IMPORTANT — this deliberately does NOT vendor a local embedder/vector-store
     implementation into the target project. This plugin's own design (see
     agents/knowledge-retriever.md and the README's "Status / known gaps"
     section) already standardizes on the STANDALONE global `rag-cli` tool
     (https://github.com/simonpham268/rag-cli, `npm install -g
     @simonpham268/rag-cli`) — not a per-project npm script. Copying ~700
     lines of embedder/reranker/vector-store/Jira-fetch code into every new
     project would duplicate that tool, drag in heavy deps
     (@huggingface/transformers, a vector DB client) that most projects don't
     need, and drift out of sync with the real rag-cli over time. Keep this
     layer thin. -->

## 1. Check the tool is installed

```
rag-cli --version
```

If not found, tell the human: `npm install -g @simonpham268/rag-cli`, or skip
this layer entirely (RAG stays optional — `knowledge-retriever` degrades
gracefully when `ragCollection` is null in the config).

## 2. Create a docs-drop folder

Create `plan/` (or whatever folder name the human prefers) in the target
project — this is where requirement docs (.md/.txt/.docx) get dropped for
indexing, not framework code.

```
plan/README.md   — one line: "Drop requirement docs here, then run:
                    rag-cli index --folder=plan --collection=<name>"
```

## 3. .gitignore — lines to add

```
# plan/ — local requirement docs dropped in for RAG indexing, not framework code
/plan/*.md
/plan/*.txt
/plan/*.docx
!/plan/README.md
```

## 4. .claude/qa-agents.config.json

Set `ragCollection` to the collection name the human chooses once they've
actually run `rag-cli index` — leave it `null` until indexing has really
happened (this is Step 1.6 / Step 3 of the main init flow, not a new step;
this scaffold layer just makes sure `plan/` exists for docs to land in).
