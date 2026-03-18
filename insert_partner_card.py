#!/usr/bin/env python3

with open('contractor-os.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the closing </div> after the Fleet License form and before the closing </div> of pricing-grid
# We need to insert the partner card between these two closing divs

partner_card = '''
      <div class="price-card">
        <div class="price-wm">P</div>
        <div class="price-tier">OCOS Partner · Annual</div>
        <div class="price-name">OCOS Partner License</div>
        <div class="price-badge">Starter: 3 clients · Growth: 7 · Pro: 15 · Agency: 30</div>
        <div class="price-divider"></div>
        <ul class="price-features">
          <li>Deploy for client fleets — white-label delivery</li>
          <li>Custom machine configurations per client</li>
          <li>All new sheet releases included during term</li>
          <li>Priority support and onboarding assistance</li>
          <li>Tier-based client capacity (3, 7, 15, or 30 clients)</li>
          <li>Annual license — pricing based on tier selection</li>
        </ul>
        <form action="https://formspree.io/f/mzdjkneq" method="POST" style="margin-top:1.5rem">
          <input type="hidden" name="license_type" value="OCOS Partner License">
          <input type="email" name="email" placeholder="Enter your email" required style="width:100%;padding:0.75rem;margin-bottom:0.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:var(--white);font-family:'DM Sans',sans-serif;font-size:0.85rem">
          <button type="submit" class="price-cta" style="width:100%;cursor:pointer;border:none">Apply for Partner Access ↗</button>
        </form>
      </div>
'''

# Find the exact location: after Fleet License card closing </div> and before pricing-grid closing </div>
# Look for the pattern: </form>\n      </div>\n    </div>\n\n    <div class="coming-soon-notice"

search_pattern = '        </form>\n      </div>\n    </div>\n\n    <div class="coming-soon-notice reveal rd2">'
replacement = '        </form>\n      </div>\n' + partner_card + '    </div>\n\n    <div class="coming-soon-notice reveal rd2">'

if search_pattern in content:
    content = content.replace(search_pattern, replacement)
    print("✓ Partner card inserted successfully!")
else:
    print("✗ Pattern not found, trying alternative...")
    # Try a more flexible pattern
    import re
    pattern = r'(</form>\s*</div>\s*)(</div>\s*<div class="coming-soon-notice")'
    replacement_regex = r'\1' + partner_card + r'\2'
    content = re.sub(pattern, replacement_regex, content, count=1)
    print("✓ Partner card inserted with regex!")

with open('contractor-os.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
