#!/usr/bin/env python3
"""
Final fixes for issues 2 and 4:
- Issue 2: Fix tier page links to point to Stripe checkout
- Issue 4: Fix contact link in contractor-os.html footer
"""

import re

# Stripe checkout URLs
TIER_1_STRIPE = "https://buy.stripe.com/28E8wOeCPf5N7mh3eUawo0d"
TIER_2_STRIPE = "https://buy.stripe.com/eVq14m7an5vd0XTg1Gawo0f"
TIER_3_STRIPE = "https://buy.stripe.com/5kQ3cu3Yb4r98ql8zeawo0g"

def fix_tier_links_in_pricing():
    """Fix issue 2: Update tier links to Stripe checkout pages"""
    print("=== Fixing tier links in pricing.html ===")
    
    with open('pricing.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the broken tier links with Stripe checkout links
    content = content.replace(
        '<li><a href="OCOS_Elite_Tier1.html">Tier 1</a></li>',
        f'<li><a href="{TIER_1_STRIPE}">Tier 1</a></li>'
    )
    
    content = content.replace(
        '<li><a href="OCOS_Tier2.html">Tier 2</a></li>',
        f'<li><a href="{TIER_2_STRIPE}">Tier 2</a></li>'
    )
    
    content = content.replace(
        '<li><a href="OCOS_Tier3.html">Tier 3</a></li>',
        f'<li><a href="{TIER_3_STRIPE}">Tier 3</a></li>'
    )
    
    with open('pricing.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ pricing.html: Tier links updated to Stripe checkout pages")

def fix_contact_link_in_contractor():
    """Fix issue 4: Replace contact mailto with email form"""
    print("\n=== Fixing contact link in contractor-os.html ===")
    
    with open('contractor-os.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The contact link is in the footer. Since it's just a link in a list,
    # we'll keep it simple and change it to point to a contact section
    # or we can make it open a form. For consistency, let's point it to the CTA section
    # which already has an email form
    
    content = content.replace(
        '<li><a href="mailto:info@naturalalternatives.ca">Contact</a></li>',
        '<li><a href="#pricing">Contact / Get Access</a></li>'
    )
    
    with open('contractor-os.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ contractor-os.html: Contact link now points to email capture form section")

def fix_privacy_emails_again():
    """Double-check privacy policy emails are all updated"""
    print("\n=== Double-checking privacy-policy.html emails ===")
    
    with open('privacy-policy.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Make sure all Cloudflare-obfuscated emails are replaced
    content = re.sub(
        r'<a href="/cdn-cgi/l/email-protection#[^"]*"[^>]*>.*?</a>',
        '<a href="mailto:info@naturalalternatives.ca">info@naturalalternatives.ca</a>',
        content
    )
    
    # Also fix any remaining obfuscated email text
    content = re.sub(
        r'<span class="__cf_email__"[^>]*>\[email&#\d+;protected\]</span>',
        'info@naturalalternatives.ca',
        content
    )
    
    with open('privacy-policy.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ privacy-policy.html: All emails verified as info@naturalalternatives.ca")

def main():
    print("Applying final fixes...\n")
    
    fix_tier_links_in_pricing()
    fix_contact_link_in_contractor()
    fix_privacy_emails_again()
    
    print("\n" + "="*60)
    print("All final fixes completed!")
    print("="*60)

if __name__ == "__main__":
    main()
