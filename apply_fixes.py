#!/usr/bin/env python3
"""
NAC OS nac-os-app.html patcher
Run: python3 apply_fixes.py nac-os-app.html
Outputs: nac-os-app-fixed.html
"""

import sys, re

def patch(html):
    changes = []

    # FIX 1: Remove duplicate QRCode script tags (keep only first)
    old = '''\
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>'''
    new = '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>'
    if old in html:
        html = html.replace(old, new, 1)
        changes.append("✓ Fix 1: Removed 2 duplicate QRCode.js script tags")
    else:
        changes.append("⚠ Fix 1: Duplicate QRCode tags not found (may already be fixed)")

    # FIX 2: Add CSP meta tag after <meta charset line
    csp_tag = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://nacosapp.craig3113.workers.dev https://static.cloudflareinsights.com data: blob:">'
    if csp_tag not in html:
        html = html.replace(
            '<meta name="viewport"',
            csp_tag + '\n<meta name="viewport"',
            1
        )
        changes.append("✓ Fix 2: Added permissive CSP meta tag")
    else:
        changes.append("⚠ Fix 2: CSP meta tag already present")

    # FIX 3: Remove orphaned top-level JS block that causes ReferenceError
    # Find the block from "// Pre-fill billing rate input" to end of the if(revenueTableEl) block
    orphan_pattern = re.compile(
        r'\n// Pre-fill billing rate input\s*\n.*?const rateInput.*?'
        r'const revenueTableEl.*?revenueTableEl\.innerHTML.*?\n  \}\n\}',
        re.DOTALL
    )
    if orphan_pattern.search(html):
        html = orphan_pattern.sub('', html)
        changes.append("✓ Fix 3: Removed orphaned top-level JS block (ReferenceError)")
    else:
        # Try simpler pattern
        orphan_simple = re.compile(
            r'\n// Pre-fill billing rate input\n.*?if \(revenueTableEl\) \{.*?\n  \}\n',
            re.DOTALL
        )
        if orphan_simple.search(html):
            html = orphan_simple.sub('\n', html)
            changes.append("✓ Fix 3: Removed orphaned JS block (ReferenceError) [alt pattern]")
        else:
            changes.append("⚠ Fix 3: Orphaned JS block not found — check manually")

    # FIX 4: Fix renderReports() monthly-report-tbody → report-revenue-table
    old_tbody = "document.getElementById('monthly-report-tbody').innerHTML"
    if old_tbody in html:
        new_tbody_code = """const _rrt = document.getElementById('report-revenue-table');
  if (_rrt) _rrt.innerHTML"""
        html = html.replace(old_tbody, new_tbody_code, 1)
        # Wrap the assignment properly
        changes.append("✓ Fix 4: Fixed monthly-report-tbody → report-revenue-table")
    else:
        changes.append("⚠ Fix 4: monthly-report-tbody reference not found (may already be fixed)")

    return html, changes


if __name__ == '__main__':
    infile = sys.argv[1] if len(sys.argv) > 1 else 'nac-os-app.html'
    outfile = infile.replace('.html', '-fixed.html')

    try:
        with open(infile, 'r', encoding='utf-8') as f:
            html = f.read()
    except FileNotFoundError:
        print(f"ERROR: {infile} not found. Run this script in the same folder as nac-os-app.html")
        sys.exit(1)

    fixed, changes = patch(html)

    with open(outfile, 'w', encoding='utf-8') as f:
        f.write(fixed)

    print(f"\nNAC OS Patcher — {len(changes)} fixes applied:")
    for c in changes:
        print(f"  {c}")
    print(f"\nOutput: {outfile}")
    print("Upload nac-os-app-fixed.html to GitHub as nac-os-app.html")
