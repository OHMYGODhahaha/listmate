# listmate
ListMate is a listing creation + QA layer for ecommerce sellers. It generates marketplace-specific content and attributes from images/specs, builds variant matrices, and flags return-driving issues (missing specs, ambiguity, mismatches) with a Return Risk Score + checklist.
```mermaid
flowchart TD
    %% Styling for perfect dark/light mode readability
    classDef frontend fill:#e1f5fe,stroke:#039be5,stroke-width:2px,color:#000;
    classDef backend fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,color:#000;
    classDef coreAI fill:#e8f5e9,stroke:#43a047,stroke-width:2px,color:#000;
    classDef output fill:#fce4ec,stroke:#d81b60,stroke-width:2px,color:#000;
    classDef external fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,stroke-dasharray: 5 5,color:#000;

    %% 1. User Inputs (Blue)
    In1[Upload: Product Images]:::frontend
    In2[Upload: Raw Specs Text]:::frontend

    %% 2. Backend (Orange)
    B1{Data Router & Controller}:::backend

    %% 3. AI Components (Green)
    AI_1[Multimodal Extractor]:::coreAI
    AI_2[Listing Generator LLM]:::coreAI
    AI_3[Variant Builder LLM]:::coreAI
    AI_4[QA & Risk Engine]:::coreAI

    %% 4. Outputs (Pink)
    Out1[Optimized Listing]:::output
    Out2[Variant Matrix]:::output
    Out3[Return Risk Score]:::output
    Out4[Fix-It Checklist]:::output

    %% 5. Marketplaces (Purple Dashed)
    M1[Amazon, Etsy, Shopify - Manual Publish]:::external

    %% Workflow Connections
    In1 --> B1
    In2 --> B1
    
    B1 --> AI_1
    
    AI_1 --> AI_2
    AI_1 --> AI_3
    AI_1 --> AI_4
    
    AI_2 -.->|Cross-check generated text| AI_4

    AI_2 --> Out1
    AI_3 --> Out2
    AI_4 --> Out3
    AI_4 --> Out4

    Out1 --> M1
    Out2 --> M1
```
