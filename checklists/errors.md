# Error model

Request → Validation → Auth → Rate limit → Retrieval/tool → Model → Stream → UI

| Layer | Class | UI |
|---|---|---|
| Validation | 400 | Fix the input |
| Auth | 401 / 403 | Sign in / forbidden |
| Missing | 404 | Not found |
| Quota | 429 | Later |
| Provider / timeout | 503 / 504 | Retry |
| Schema / tool / DB | 422 / 500 | Safe sentence + requestId |
| Stream cut | abort | Freeze bubble |

Never return API keys or stack traces to the client.
