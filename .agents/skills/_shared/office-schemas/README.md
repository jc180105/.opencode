# Shared Office Schemas

## Purpose
This directory contains Office Open XML schemas that are shared across multiple skills (docx, pptx, xlsx).

## Source
These schemas were originally duplicated in:
- `skills/docx/scripts/office/schemas/`
- `skills/pptx/scripts/office/schemas/`
- `skills/xlsx/scripts/office/schemas/`

## Verification
All schema files are **identical** across all three skills (verified via MD5 hash comparison on 2026-05-04).

## Directory Structure
```
office-schemas/
├── ecma/
│   └── fouth-edition/    # ECMA-376 4th Edition schemas
├── ISO-IEC29500-4_2016/ # ISO/IEC 29500-4:2016 schemas
├── mce/                  # Markup Compatibility and Extensibility
└── microsoft/            # Microsoft extensions
```

## Usage
Skills should reference schemas from this shared location to avoid duplication.

## Maintenance
When updating schemas:
1. Update the files in this shared directory
2. Recopy to individual skill directories if needed
3. Verify file hashes match across all locations

## Note
These schemas include the complete Office Open XML set (WordprocessingML, PresentationML, SpreadsheetML, DrawingML). Individual skills may only need a subset, but the complete set is provided for compatibility.
