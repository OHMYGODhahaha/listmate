"""
Rule-based QA scorer focused on INPUT completeness:
flags details that were missing from the seller's original notes/images,
not subjective text quality.  Keeps scores high for AI-generated listings.
"""


def rule_based_qa(listing: dict, image_count: int = 0) -> tuple[list[dict], float]:
    """Returns (issues, deduction). Small deductions keep scores naturally high."""
    issues = []
    deduction = 0.0
    attrs = listing.get('attributes', {})

    def _blank(val):
        return not val or str(val).strip().lower() in ('', 'n/a', 'unknown', 'none', 'varies')

    # Images: fewer than 3 photos hurts buyer confidence
    if image_count < 3:
        needed = 3 - image_count
        issues.append({
            'field': 'images',
            'type': 'caution',
            'message': f'Add {needed} more photo{"s" if needed > 1 else ""} — buyers convert better with 3+ images',
        })
        deduction += 0.5

    # Dimensions — most common cause of returns
    if _blank(attrs.get('dimensions')):
        issues.append({
            'field': 'attributes.dimensions',
            'type': 'missing',
            'message': 'Dimensions not specified — add measurements to reduce size-related returns',
        })
        deduction += 0.5

    # Material — affects buyer expectations
    if _blank(attrs.get('material')):
        issues.append({
            'field': 'attributes.material',
            'type': 'caution',
            'message': 'Material not mentioned in seller notes — consider specifying fabric or composition',
        })
        deduction += 0.5

    # Brand — authenticity signal
    if _blank(attrs.get('brand')):
        issues.append({
            'field': 'attributes.brand',
            'type': 'caution',
            'message': 'Brand not provided — adding a brand name builds buyer trust',
        })
        deduction += 0.25

    return issues, deduction
