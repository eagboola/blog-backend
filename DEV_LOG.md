## Next

> writing at: 02/25/'26

- testing /w vitest and supertest
  - expand `PATCH` test to assert for each case:
    - (1) field
    - (2) fields
    - all (3) fields
    - no fields, non-existant field?
  - expand `POST` tests
  - expand utility testing

- possibly `reset` functionality to simplify dummy runs/testing (/api/reset)
- look into using a separate DB for frontend testing

- possibly more validation beyond TS types/mongoose schema (likely after shipping to frontend)
  - min./max. `title` length
  - min./max. `author` length
  - min `content` length
